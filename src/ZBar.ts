export default interface ZBar extends Record<string, WebAssembly.ExportValue> {
  memory: WebAssembly.Memory;
  malloc(size: number): number;
  free(ptr: number): void;
  // ___errno_location(): number;
  ImageScanner_create(): number;
  ImageScanner_destory(scanner: number): void;
  // ImageScanner_scan: any;
  ImageScanner_scan(ImageScanner_scannner: number, image: number): number;
  Image_create(
    width: number,
    height: number,
    format: number,
    data: number,
    dataLength: number,
    sequenceNum: number
  ): number;
  Image_destory(image: number): void;
  Image_get_symbols(image: number): number;
}
