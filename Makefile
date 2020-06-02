ZBAR_SOURCE = zbar-0.10
SRC_DIR = ./src
TS_SRC ::= $(shell find $(SRC_DIR) -name '*.ts')

EM_VERSION = 1.39.4
EM_DOCKER = docker run --rm -w /src -v $(PWD):/src trzeci/emscripten:sdk-tag-$(EM_VERSION)-64bit
EMXX = $(EM_DOCKER) em++
EMMAKE = $(EM_DOCKER) emmake
EMCONFIG = $(EM_DOCKER) emconfigure

TSC = npx tsc
TSC_FLAGS = -p ./

all: dist/zbar.wasm .ts

debug: .emmake src/api.cpp
	em++ -g2 -s WASM=1 -Wc++11-extensions -o data/zbar.js \
		src/api.cpp -I $(ZBAR_SOURCE)/include/ \
		$(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE)/zbar/*/*.o \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
		-s "BINARYEN_METHOD='native-wasm'" \
		-s ENVIRONMENT=web \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-s ASSERTIONS=1 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1

dist/zbar.wasm: .zbar src/module.cc
	$(EMXX) -Os -s WASM=1 -Wc++11-extensions -o dist/zbar.wasm \
		src/module.cc -I $(ZBAR_SOURCE)/include/ \
		$(ZBAR_SOURCE)/zbar/*.o $(ZBAR_SOURCE)/zbar/*/*.o
# 		-s ALLOW_MEMORY_GROWTH=1 \
# 		-s MODULARIZE=1

.zbar: $(ZBAR_SOURCE)/Makefile
	$(EMMAKE) make -C $(ZBAR_SOURCE)

$(ZBAR_SOURCE)/Makefile: $(ZBAR_SOURCE).tar.gz
	tar zxvf $(ZBAR_SOURCE).tar.gz
	$(EMCONFIG) $(ZBAR_SOURCE)/configure --without-x --without-jpeg \
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
