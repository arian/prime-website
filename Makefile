JADE = $(shell find . -maxdepth 2 -wholename './pages/*.jade')
HTML = $(JADE:./pages/%.jade=./public/%.html)

all: $(HTML)

public/%.html: pages/%.jade
	./node_modules/.bin/jade < $< --path $< > $@

clean:
	rm -f $(HTML)

.PHONY: clean
