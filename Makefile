ZBAR_SOURCE = zbar-0.10

# all: data/zbar.js

debug: .emmake src/api.cpp
	em++ -g2 -s WASM=1 -Wc++11-extensions -o data/zbar.js \
		src/api.cpp -I ${ZBAR_SOURCE}/include/ \
		${ZBAR_SOURCE}/zbar/*.o ${ZBAR_SOURCE}/zbar/*/*.o \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
		-s "BINARYEN_METHOD='native-wasm'" \
		-s ENVIRONMENT=web \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-s ASSERTIONS=1 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1

lib/zbar.wasm: .zbar src/module.cc
	em++ -Os -s WASM=1 -Wc++11-extensions -o lib/zbar.wasm \
		src/module.cc -I ${ZBAR_SOURCE}/include/ \
		${ZBAR_SOURCE}/zbar/*.o ${ZBAR_SOURCE}/zbar/*/*.o
# 		-s ALLOW_MEMORY_GROWTH=1 \
# 		-s MODULARIZE=1

.zbar: ${ZBAR_SOURCE}/Makefile
	cd ${ZBAR_SOURCE} && emmake make

${ZBAR_SOURCE}/Makefile: ${ZBAR_SOURCE}.tar.gz
	tar zxvf ${ZBAR_SOURCE}.tar.gz
	cd ${ZBAR_SOURCE} && emconfigure ./configure --without-x --without-jpeg \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread

clean:
	rm -rf ${ZBAR_SOURCE}
	rm data/zbar.*
