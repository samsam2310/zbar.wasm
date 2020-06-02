export default interface ZBar extends Record<string, WebAssembly.ExportValue> {
  _malloc(size: number): number;
  _ImageScanner_create(): number;
  _ImageScanner_destory(scanner: number): void;
  _ImageScanner_scan(scanner: number, image: number): number;
  _Image_create(width: number, height: number, format: number, data: number, dataLength: number, sequenceNum: number): number;
  _Image_destory(image: number): void;
  _Image_convert(image: number, format: number): number;
  _Image_convert_resize(image: number, format: number, width: number, height: number): number;
  _Image_get_symbols(image: number): number;
}
