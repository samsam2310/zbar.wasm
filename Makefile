ZBAR_VERSION = 0.23.90
ZBAR_SOURCE = zbar-$(ZBAR_VERSION)
SRC_DIR = ./src

EM_VERSION = 3.0.0
EM_DOCKER = docker run --rm -u $(shell id -u):$(shell id -g) -w /src -v $$PWD:/src emscripten/emsdk:$(EM_VERSION)
EMCC = $(EM_DOCKER) emcc
# EMXX = $(EM_DOCKER) em++
WASM2WAT = $(EM_DOCKER) wasm2wat
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

ZBAR_DEPS = $(ZBAR_SOURCE)/make.done
ZBAR_OBJS = $(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE)/zbar/*/*.o
ZBAR_INC = -I $(ZBAR_SOURCE)/include/ -I $(ZBAR_SOURCE)/
EMCC_FLAGS = -Os -Wall -Werror -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS="['_malloc','_free']" \
	-s MODULARIZE=1 -s EXPORT_NAME=instantiate

ZBAR_WASM_DEPS = dist/zbar.wasm

TSC := npx tsc

COMMON_TS_SRC := \
	CppObject.ts \
	enum.ts \
	Image.ts \
	ImageScanner.ts \
	index.ts \
	instance.ts \
	module.ts \
	Symbol.ts \
	zbar.d.ts \
	zbar.wasm.d.ts \
	ZBarInstance.ts

TS_SRC := \
	$(COMMON_TS_SRC) \
	load.ts \
	load-browser.ts

DENO_TS_SRC := \
	$(COMMON_TS_SRC) \
	test/Image.test.ts \
	test/ImageScanner.test.ts \
	test/instance.test.ts \
	test/memorygrow.test.ts \
	test/memoryleak.test.ts \
	test/module.test.ts

DENO_DENO_SRC := \
	load.deno.ts \
	deps/asserts.deno.ts \
	deps/base64.deno.ts \
	deps/canvas.deno.ts \
	deps/expect.deno.ts \
	deps/path.deno.ts \
	test/utils.deno.ts

DENO_FIX_IMPORT_TARGET := \
	$(DENO_TS_SRC:%.ts=fiximport_%.deno.ts) \
	$(DENO_DENO_SRC:%=fiximport_%)

.PHONY: all debug clean ts deno $(DENO_FIX_IMPORT_TARGET)

all: $(ZBAR_WASM_DEPS) ts deno node-test deno-test

debug: $(ZBAR_DEPS) dist/zbar.wast src/module.c
	$(EMCC) $(EMCC_FLAGS) -g2 -o dist/zbar-debug.js src/module.c $(ZBAR_INC) \
		$(ZBAR_OBJS)

dist/symbol.test.o: $(ZBAR_DEPS) src/symbol.test.c
	$(EMCC) -Wall -Werror -g2 -c src/symbol.test.c -o $@ $(ZBAR_INC)

dist/zbar.wast: $(ZBAR_WASM_DEPS)
	$(WASM2WAT) dist/zbar.wasm -o dist/zbar.wast

$(ZBAR_WASM_DEPS): $(ZBAR_DEPS) src/module.c dist/symbol.test.o
	$(EMCC) $(EMCC_FLAGS) -o dist/zbar.js src/module.c $(ZBAR_INC) \
		$(ZBAR_OBJS)
	cp dist/zbar.wasm dist/zbar.wasm.bin

dist/zbar.js: $(ZBAR_WASM_DEPS)

$(ZBAR_DEPS): $(ZBAR_SOURCE)/Makefile
	cd $(ZBAR_SOURCE) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os \
		DEFS="-DZNO_MESSAGES -DHAVE_CONFIG_H"
	touch -m $(ZBAR_DEPS)

$(ZBAR_SOURCE)/Makefile: $(ZBAR_SOURCE)/configure
	cd $(ZBAR_SOURCE) && $(EMCONFIG) ./configure --without-x --without-xshm \
		--without-xv --without-jpeg --without-libiconv-prefix \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread --disable-assert
	cd $(ZBAR_SOURCE) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os \
		DEFS="-DZNO_MESSAGES -DHAVE_CONFIG_H"

$(ZBAR_SOURCE)/configure: $(ZBAR_SOURCE).tar.gz
	tar zxvf $(ZBAR_SOURCE).tar.gz
	touch -m $(ZBAR_SOURCE)/configure

$(ZBAR_SOURCE).tar.gz:
	curl -L -o $(ZBAR_SOURCE).tar.gz https://linuxtv.org/downloads/zbar/zbar-$(ZBAR_VERSION).tar.gz

ts: $(TS_SRC:%=src/%)
	$(TSC) -p ./

$(DENO_TS_SRC:%.ts=dist/%.deno.ts): $(DENO_TS_SRC:%=src/%)
	mkdir -p $(dir $@)
	cp $(@:dist/%.deno.ts=src/%.ts) $(@)

$(DENO_DENO_SRC:%=dist/%): $(DENO_DENO_SRC:%=src/%)
	mkdir -p $(dir $@)
	cp $(@:dist/%=src/%) $(@)

$(DENO_FIX_IMPORT_TARGET): $(DENO_FIX_IMPORT_TARGET:fiximport_%=dist/%)
	scripts/deno-import.deno.ts $(@:fiximport_%=dist/%)

dist/zbar.wasm.base64.deno.ts: dist/zbar.wasm
	scripts/build-wasm-ts.deno.ts dist/zbar.wasm dist/zbar.wasm.base64.deno.ts

dist/zbar.deno.js: dist/zbar.js
	cp dist/zbar.js dist/zbar.deno.js
	echo "export default instantiate;" >> dist/zbar.deno.js

deno: $(DENO_FIX_IMPORT_TARGET) dist/zbar.wasm.base64.deno.ts dist/zbar.deno.js

node-test: ts
	npx jest --coverage

deno-test: deno
	deno test --coverage=coverage --allow-read */*.test.deno.ts */*/*.test.deno.ts
	deno coverage ./coverage --lcov > coverage.lcov

clean:
	rm -f $(ZBAR_SOURCE).tar.gz
	rm -rf $(ZBAR_SOURCE)
	rm -rf dist/test
	rm -f dist/*.wasm
	rm -f dist/*.bin
	rm -f dist/*.js
	rm -f dist/*.d.ts
	rm -f dist/*.map
	rm -f dist/*.o
