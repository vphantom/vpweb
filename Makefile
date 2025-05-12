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

CSS_SIZABLE := $(addsuffix .css,vpweb $(filter-out vpweb,$(filter-out _lib,$(basename $(notdir $(CSS_SRC))))))

CSS_ASSETS := $(addprefix dist/,$(CSS_SIZABLE)) docs/css.css

JS_SRC := $(sort $(wildcard js/*.js))

JS_ASSETS := dist/vpweb.min.js dist/editeur.min.js dist/fast.min.js dist/forms.min.js

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

docs/css.css:	docs/style.css $(CSS_SRC)
	$(POSTCSS) $< -o $@

dist/vpweb.min.js:	js/vpweb.js $(JS_SRC)
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

dist/editeur.min.js:	js/editeur.js js/browser.js js/stdlib.js
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

dist/fast.min.js:	js/fast.js js/browser.js js/stdlib.js
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

dist/forms.min.js:	js/forms.js js/browser.js js/stdlib.js
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

sizes:	$(CSS_ASSETS) $(JS_ASSETS) $(GZIP_ASSETS) $(BROTLI_ASSETS)
	@if [ -e docs/css.html~ -o -e docs/css.html~~ ]; then echo "HTML backup files already exist."; exit 1; fi
	@echo -n >docs/css_sizes.html
	@for F in $(CSS_SIZABLE); do \
		echo -n "<tr><th>$$F</th><td>" >>docs/css_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "dist/$$F"` / 1024))e-3 >>docs/css_sizes.html ; \
		echo -n "KB</td><td>" >>docs/css_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "dist/$$F.gz"` / 1024))e-3 >>docs/css_sizes.html ; \
		echo -n "KB</td><td>" >>docs/css_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "dist/$$F.br"` / 1024))e-3 >>docs/css_sizes.html ; \
		echo "KB</td></tr>" >>docs/css_sizes.html ; \
	done
	@mv -b docs/css.html docs/css.html~
	@cat docs/css.html~ \
		|tr "\n" '~' \
		|sed -re 's/<!-- BEGIN SIZES -->.*<!-- END SIZES -->/<!-- BEGIN SIZES -->~<!-- END SIZES -->/' \
		|tr '~' "\n" \
		|sed -e '/<!-- BEGIN SIZES -->/{0,//rdocs/css_sizes.html' -e '}' \
		>docs/css.html
	@rm -f docs/css_sizes.html
	@echo -n >docs/js_sizes.html
	@for F in $(JS_ASSETS); do \
		echo -n "<tr><th>$$F</th><td>" >>docs/js_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "$$F"` / 1024))e-3 >>docs/js_sizes.html ; \
		echo -n "KB</td><td>" >>docs/js_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "$$F.gz"` / 1024))e-3 >>docs/js_sizes.html ; \
		echo -n "KB</td><td>" >>docs/js_sizes.html ; \
		printf '%.1f' $$((1000 * `stat --printf='%s' "$$F.br"` / 1024))e-3 >>docs/js_sizes.html ; \
		echo "KB</td></tr>" >>docs/js_sizes.html ; \
	done
	@mv -b docs/css.html docs/css.html~~
	@cat docs/css.html~~ \
		|tr "\n" '~' \
		|sed -re 's/<!-- BEGIN JSIZES -->.*<!-- END JSIZES -->/<!-- BEGIN JSIZES -->~<!-- END JSIZES -->/' \
		|tr '~' "\n" \
		|sed -e '/<!-- BEGIN JSIZES -->/{0,//rdocs/js_sizes.html' -e '}' \
		>docs/css.html
	@rm -f docs/js_sizes.html

%.gz:	%
	$(GZIP) $<

%.br:	%
	$(BROTLI) $<

.PHONY: help dist clean sizes watch

.SILENT:	help
