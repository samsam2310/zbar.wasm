ZBAR_NAME = zbar-0.10

all: data/zbar.js

debug: .emmake src/api.cpp
	em++ -g2 -s WASM=1 -Wc++11-extensions -o data/zbar.js \
		src/api.cpp -I ${ZBAR_NAME}/include/ \
		${ZBAR_NAME}/zbar/*.o ${ZBAR_NAME}/zbar/*/*.o \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
		-s "BINARYEN_METHOD='native-wasm'" \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-s ASSERTIONS=1 -s SAFE_HEAP=1 -s STACK_OVERFLOW_CHECK=1

data/zbar.js: .emmake src/api.cpp
	em++ -Os -s WASM=1 -Wc++11-extensions -o data/zbar.js \
		src/api.cpp -I ${ZBAR_NAME}/include/ \
		${ZBAR_NAME}/zbar/*.o ${ZBAR_NAME}/zbar/*/*.o \
		-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
		-s "BINARYEN_METHOD='native-wasm'" \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1

.emmake: ${ZBAR_NAME}/Makefile
	cd ${ZBAR_NAME} && emmake make

${ZBAR_NAME}/Makefile: ${ZBAR_NAME}.tar.gz
	tar zxvf ${ZBAR_NAME}.tar.gz
	cd ${ZBAR_NAME} && emconfigure ./configure --without-x --without-jpeg \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread

clean:
	rm -rf ${ZBAR_NAME}
	rm data/zbar.*
