ZBAR_SOURCE = zbar-0.10
SRC_DIR = ./src
TS_SRC ::= $(shell find $(SRC_DIR) -name '*.ts')

EM_VERSION = 1.39.8-upstream
EM_DOCKER = docker run --rm -w /src -v $$PWD:/src trzeci/emscripten:$(EM_VERSION)
EMCC = $(EM_DOCKER) emcc
EMXX = $(EM_DOCKER) em++
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

ZBAR_DEPS = $(ZBAR_SOURCE)/zbar/zbar_libzbar_la-img_scanner.o
ZBAR_OBJS = $(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE)/zbar/*/*.o
ZBAR_INC = -I $(ZBAR_SOURCE)/include/ -I $(ZBAR_SOURCE)/
EMXX_FLAGS = -Os -s WASM=1 -Wall -Werror -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS="['_malloc', '_free']"

TSC = npx tsc
TSC_FLAGS = -p ./

all: dist/zbar.wasm .ts

debug: $(ZBAR_DEPS) src/module.cc
	$(EMXX) $(EMXX_FLAGS) -g2 -o dist/zbar-debug.js src/module.cc $(ZBAR_INC) \
		$(ZBAR_OBJS)

dist/symbol.test.o: $(ZBAR_DEPS) src/symbol.test.c
	$(EMCC) -Wall -Werror -g2 -c src/symbol.test.c -o $@ $(ZBAR_INC)

dist/zbar.wasm: $(ZBAR_DEPS) src/module.cc dist/symbol.test.o
	$(EMXX) $(EMXX_FLAGS) -o dist/zbar.wasm src/module.cc $(ZBAR_INC) \
		$(ZBAR_OBJS)

$(ZBAR_DEPS): $(ZBAR_SOURCE)/Makefile
	cd $(ZBAR_SOURCE) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os

$(ZBAR_SOURCE)/Makefile: $(ZBAR_SOURCE)/configure
	cd $(ZBAR_SOURCE) && $(EMCONFIG) ./configure --without-x --without-jpeg \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread

$(ZBAR_SOURCE)/configure: $(ZBAR_SOURCE).tar.gz
	tar zxvf $(ZBAR_SOURCE).tar.gz
	touch -m $(ZBAR_SOURCE)/configure

.ts: $(TS_SRC)
	$(TSC) $(TSC_FLAGS)

clean:
	rm -rf $(ZBAR_SOURCE)
	rm dist/*.wasm
	rm dist/*.js
	rm dist/*.d.ts
	rm dist/*.map
	rm dist/*.o
