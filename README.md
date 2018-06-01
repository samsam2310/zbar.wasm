# zbar.wasm

[![Build Status](https://travis-ci.com/samsam2310/zbar.wasm.svg?branch=master)](https://travis-ci.com/samsam2310/zbar.wasm)

A webassembly build for C/C++ Zbar bar code scan library.

## Quick Start

Online Demo: https://zbar.chino.taipei

Install:
```
npm install zbar.wasm
```

Quick example:

```
import Scanner from 'zbar.wasm';

const loadImage = async src => {
  // Load image
  const imgBlob = await fetch(src).then(resp => resp.blob());
  const img = await createImageBitmap(imgBlob);
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return {
  	imageData: ctx.getImageData(0, 0, img.width, img.height),
  	width: img.width,
  	height: img.height
  }
}

const main = async () => {
  // Create a sannner object
  const scanner = await Scanner({locateFile: file => ('data/' + file)});
  const { imageData, width, height } = await loadImage('URL_TO_IMAGE');
  const scanRes = scanner.scanQrcode(imageData.data, width, height);
  if (scanRes.length > 0) {
  	console.log('Find Qrcode: ' + scanRes);
  }

main();
```
