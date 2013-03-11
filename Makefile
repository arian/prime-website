JADE = $(shell find . -maxdepth 2 -wholename './pages/*.jade')
HTML = $(JADE:./pages/%.jade=./public/%.html)

STYL = $(shell find . -maxdepth 2 -wholename './styl/*.styl')
CSS = $(STYL:./styl/%.styl=./public/css/%.css)

all: pages/docs.jade $(HTML) $(CSS)

pages/docs.jade: docs/prime-* pages/tpl/docs.jade
	node build/docs

public/%.html: pages/%.jade pages/layouts
	node build/jade < $< --path $< --obj jade.config.json > $@

public/css/%.css: styl/%.styl styl/includes
	./node_modules/.bin/stylus < $< --include $(<D) > $@

clean:
	rm -f $(HTML) $(CSS) $(DOCS) docs/content* docs/toc* pages/docs*

.PHONY: clean
