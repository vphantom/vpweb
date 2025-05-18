export PATH := ./node_modules/.bin/:$(PATH)
NODE_PATH := $(shell npm root --quiet):$(shell npm root --quiet -g)
export NODE_PATH

BROTLI  := brotli -f -k -n -Z
DOCBLOX2MD := docblox2md
FWAIT := inotifywait -qr -e close_write
GZIP    := gzip --rsyncable -f -k -n -9
POSTCSS := postcss
ROLLUP      := rollup

# NOTE: -p 'terser={compress:{passes:3}}' yielded <0.5% change
ROLLUP_OPTS := --format iife --sourcemap --plugin terser

DOCS := $(wildcard docs/*.md)

CSS_SRC := $(sort $(wildcard css/*.css))

#CSS_SIZABLE := $(addsuffix .css,vpweb $(filter-out vpweb,$(filter-out _lib,$(basename $(notdir $(CSS_SRC))))))
CSS_SIZABLE := vpweb.css

CSS_ASSETS := $(addprefix dist/,$(CSS_SIZABLE)) docs/css.css

JS_SRC := $(sort $(wildcard js/*.js))

#JS_SIZABLE := $(addsuffix .js,vpweb $(filter-out vpweb,$(filter-out _lib,$(basename $(notdir $(JS_SRC))))))
JS_SIZABLE := vpweb.js

JS_ASSETS := $(patsubst js/%.js,dist/%.js,$(wildcard js/*.js))

tmptest:
	@echo "JS ASSETS: $(JS_ASSETS)"

GZIP_ASSETS := $(addsuffix .gz,$(CSS_ASSETS) $(JS_ASSETS))

BROTLI_ASSETS := $(addsuffix .br,$(CSS_ASSETS) $(JS_ASSETS))

help:
	@echo "Targets:"
	@echo
	@echo "  dist   Create/update dist/ and docs/"
	@echo "  watch  Waits for changes in css/ and js/ to make 'dist'"
	@echo "  sizes  Compress assets and update CSS file sizes in dist/css.html"
	@echo "  clean  Empty dist/"
	@echo

dist:	$(CSS_ASSETS) $(JS_ASSETS)
	@$(DOCBLOX2MD) $(DOCS)

clean:
	rm -fv dist/* docs/dist.css docs/*.map docs/*.gz docs/*.br

watch:	dist
	@echo "Watching for changes..."
	+@while true; do sleep 1 ; $(FWAIT) $(CSS_SRC) $(JS_SRC) ; nice make --no-print-directory dist; echo "Up to date."; done

# Pessimistic by design: rebuilds all assets whenever any source changes.
dist/%.css:	css/%.css $(CSS_SRC)
	$(POSTCSS) $< -o $@

dist/%.js:	js/%.js $(JS_SRC)
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

docs/css.css:	docs/style.css $(CSS_SRC)
	$(POSTCSS) $< -o $@

sizes:	$(CSS_ASSETS) $(JS_ASSETS) $(GZIP_ASSETS) $(BROTLI_ASSETS)
	@if [ -e docs/css.html~ -o -e docs/css.html~~ ]; then echo "HTML backup files already exist."; exit 1; fi
	@echo -n >docs/tmp_sizes.html
	@for F in $(CSS_SIZABLE) $(JS_SIZABLE); do \
		echo "Sizing $$F..." ; \
		echo -n "<tr><th>$$F</th><td>" >>docs/tmp_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "dist/$$F"` / 1024))e-3 >>docs/tmp_sizes.html ; \
		echo -n "KB</td><td>" >>docs/tmp_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "dist/$$F.gz"` / 1024))e-3 >>docs/tmp_sizes.html ; \
		echo -n "KB</td><td>" >>docs/tmp_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "dist/$$F.br"` / 1024))e-3 >>docs/tmp_sizes.html ; \
		echo "KB</td></tr>" >>docs/tmp_sizes.html ; \
	done
	@mv -b docs/css.html docs/css.html~
	@cat docs/css.html~ \
		|tr "\n" '~' \
		|sed -re 's/<!-- BEGIN SIZES -->.*<!-- END SIZES -->/<!-- BEGIN SIZES -->~<!-- END SIZES -->/' \
		|tr '~' "\n" \
		|sed -e '/<!-- BEGIN SIZES -->/{0,//rdocs/tmp_sizes.html' -e '}' \
		>docs/css.html
	@rm -f docs/tmp_sizes.html

%.gz:	%
	$(GZIP) $<

%.br:	%
	$(BROTLI) $<

.PHONY: help dist clean sizes watch

.SILENT:	help
