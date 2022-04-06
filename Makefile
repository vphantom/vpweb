export PATH := ./node_modules/.bin/:$(PATH)

FWAIT := inotifywait -qr -e close_write

POSTCSS := postcss
GZIP    := gzip --rsyncable -f -k -n -9
BROTLI  := brotli -f -k -n -Z

# NOTE: -p 'terser={compress:{passes:3}}' yielded <0.5% change
ROLLUP      := rollup
ROLLUP_OPTS := --format iife --sourcemap --plugin terser

CSS_SRC := $(sort $(wildcard scss/*.scss))

CSS_SIZABLE := $(addsuffix .css,vpweb $(filter-out vpweb,$(filter-out _lib,$(basename $(notdir $(CSS_SRC))))))

CSS_ASSETS := $(addprefix dist/,$(CSS_SIZABLE)) docs/css.css

JS_SRC := $(wildcard js/*.js)

JS_ASSETS := dist/library-size.min.js dist/vpweb.min.js dist/editeur.min.js dist/fast.min.js dist/forms.min.js

GZIP_ASSETS := $(addsuffix .gz,$(CSS_ASSETS))

BROTLI_ASSETS := $(addsuffix .br,$(CSS_ASSETS))

help:
	@echo "Targets:"
	@echo
	@echo "  dist   Create/update dist/ and docs/"
	@echo "  watch  Waits for changes in scss/ and js/ to make 'dist'"
	@echo "  sizes  Compress assets and update CSS file sizes in dist/css.html"
	@echo "  clean  Empty dist/"
	@echo

dist:	$(CSS_ASSETS) $(JS_ASSETS)
	@ls -la dist/library-size.min.js
	@rm -fr dist/library-size.*

clean:
	rm -fv dist/* docs/dist.css docs/*.map docs/*.gz docs/*.br

watch:	dist
	@echo "Watching for changes..."
	+@while true; do $(FWAIT) $(CSS_SRC) $(JS_SRC) ; nice make --no-print-directory dist; echo "Up to date."; done

# Pessimistic by design: rebuilds all assets whenever any source changes.
dist/%.css:	scss/%.scss $(CSS_SRC)
	$(POSTCSS) $< -o $@

docs/css.css:	docs/css.scss $(CSS_SRC)
	$(POSTCSS) $< -o $@

dist/library-size.min.js:	$(JS_SRC)
	$(ROLLUP) js/library-size.js --file $@ $(ROLLUP_OPTS)

dist/vpweb.min.js:	js/vpweb.js $(JS_SRC)
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

dist/editeur.min.js:	js/editeur.js js/browser.js js/stdlib.js
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

dist/fast.min.js:	js/fast.js js/browser.js js/stdlib.js
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

dist/forms.min.js:	js/forms.js js/browser.js js/stdlib.js
	$(ROLLUP) $< --file $@ $(ROLLUP_OPTS)

sizes:	$(CSS_ASSETS) $(GZIP_ASSETS) $(BROTLI_ASSETS)
	@if [ -e docs/css.html~ ]; then echo "HTML backup file already exists."; exit 1; fi
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

%.gz:	%
	$(GZIP) $<

%.br:	%
	$(BROTLI) $<

.PHONY: help dist clean sizes watch

.SILENT:	help
