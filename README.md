# ZBar.wasm

[![GitHub](https://img.shields.io/github/license/samsam2310/zbar.wasm)](https://github.com/samsam2310/zbar.wasm/blob/master/LICENSE)
![Build Status](https://github.com/samsam2310/zbar.wasm/actions/workflows/main.yml/badge.svg)
[![Codecov](https://img.shields.io/codecov/c/github/samsam2310/zbar.wasm)](https://codecov.io/github/samsam2310/zbar.wasm)
[![npm version](https://badge.fury.io/js/zbar.wasm.svg)](https://www.npmjs.com/package/zbar.wasm)

A webassembly build of C/C++ Zbar barcode scanning library.

* **Fast.** Webassembly is faster than many pure ECMAScript implementations.
* **Powerful** ZBar supports many kinds of barcode, includes QRCode, EAN13, CODE128...etc.
* **Portability** Most modern browsers and nodejs supports Webassembly.


## Quick Start

Online Demo: https://zbar-wasm.github.io/demo

Install:
``` bash
npm i zbar.wasm
```

Quick example (nodejs):

``` javascript
const { createCanvas, loadImage } = require('canvas');
const { scanImageData } = require('zbar.wasm');

const getImageData = async (src) => {
  const img = await loadImage(src);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};

const url = 'https://raw.githubusercontent.com/zbar-wasm/demo/master/node/test.png';
const main = async () => {
  const img = await getImageData(url);
  const res = await scanImageData(img);
  console.log(res[0].typeName); // ZBAR_QRCODE
  console.log(res[0].decode()); // Hello World
};

main();
```


## Documentation

The full documentation for ZBar.wasm can be found on the [wiki](https://github.com/samsam2310/zbar.wasm/wiki).

Note that for frontend developer who use webpack to bundle js codes, webpack [file-loader](https://webpack.js.org/loaders/file-loader/) is required to load the wasm binary.
Some project like create-react-app already handle this for you. But if you want to use your own webpack config, remember to use file-loader for file `zbar.wasm.bin`.
For the reason why not just use `*.wasm` extensions, see [this issue](https://github.com/webpack/webpack/issues/6725)


## How to Build ZBar.wasm

ZBar.wasm use [emscripten](https://emscripten.org/) to compile C++ code into webassembly.
The default Makefile use docker to provide emscripten environment.
Make sure `docker` is accessabled by the user that running Makefile, or override the variables in Makefile to change the toolchains for building.

To build:
``` bash
npm i
npm run build
npm run test
```
