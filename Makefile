ZBAR_SOURCE = zbar-0.10
SRC_DIR = ./src
TS_SRC ::= $(shell find $(SRC_DIR) -name '*.ts')

EM_VERSION = 1.39.8-upstream
EM_DOCKER = docker run --rm -w /src -v $$PWD:/src trzeci/emscripten:$(EM_VERSION)
EMXX = $(EM_DOCKER) em++
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

ZBAR_OBJS = $(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE)/zbar/*/*.o
ZBAR_INC = -I $(ZBAR_SOURCE)/include/
EMXX_FLAGS = -Os -s WASM=1 -Wall -Werror -s ALLOW_MEMORY_GROWTH=1 \
	-s EXPORTED_FUNCTIONS="['_malloc', '_free']"

TSC = npx tsc
TSC_FLAGS = -p ./

all: dist/zbar.wasm .ts

debug: .zbar src/module.cc
	$(EMXX) $(EMXX_FLAGS) -g2 -o dist/zbar-debug.js src/module.cc $(ZBAR_INC) \
		$(ZBAR_OBJS)

dist/zbar.wasm: .zbar src/module.cc
	$(EMXX) $(EMXX_FLAGS) -o dist/zbar.wasm src/module.cc $(ZBAR_INC) \
		$(ZBAR_OBJS)

.zbar: $(ZBAR_SOURCE)/Makefile
	cd $(ZBAR_SOURCE) && $(EMMAKE) make CFLAGS=-Os CXXFLAGS=-Os

$(ZBAR_SOURCE)/Makefile: $(ZBAR_SOURCE).tar.gz
	tar zxvf $(ZBAR_SOURCE).tar.gz
	cd $(ZBAR_SOURCE) && $(EMCONFIG) ./configure --without-x --without-jpeg \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread

.ts: $(TS_SRC)
	$(TSC) $(TSC_FLAGS)

clean:
	rm -rf $(ZBAR_SOURCE)
	rm dist/*.wasm
	rm dist/*.js
	rm dist/*.d.ts
	rm dist/*.map
