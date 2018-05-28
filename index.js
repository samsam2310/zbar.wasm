import Module as ApiModule from 'data/zbar'

// async function loadImage(src) {
//   // Load image
//   const imgBlob = await fetch(src).then(resp => resp.blob());
//   const img = await createImageBitmap(imgBlob);
//   // Make canvas same size as image
//   const canvas = document.createElement('canvas');
//   canvas.width = img.width;
//   canvas.height = img.height;
//   // Draw image onto canvas
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(img, 0, 0);
//   return ctx.getImageData(0, 0, img.width, img.height);
// }

export default Scanner = mixin => {
    const mod = ApiModule(mixin);
    const api = {
        createBuffer: mod.cwrap('createBuffer', 'number', ['number']),
        deleteBuffer: mod.cwrap('deleteBuffer', '', ['number']),
        scanQrcode: mod.cwrap('scanQrcode', 'number', ['number', 'number', 'number']),
        getScanResults: mod.cwrap('getScanResults', '', []),
    };
    const scanner = {
        scanQrcode: imgData => {
            const buf = api.createBuffer(image.width, image.height);
            mod.HEAP8.set(imgData.data, buf);
            api.scanQrcode(buf, image.width, image.height);
            api.deleteBuffer(buf);
            // TODO: return result
            api.getScanResults();
        }
    };
    return new Promise((resolv, reject) => {
        mod.then(resolv(scanner));
    });
};
