export default interface ZBar extends Record<string, WebAssembly.ExportValue> {
  memory: WebAssembly.Memory;
  malloc(size: number): number;
  free(ptr: number): void;
  ImageScanner_create(): number;
  ImageScanner_destory(scanner: number): void;
  ImageScanner_set_config(
    scanner: number,
    symbology: number,
    config: number,
    value: number
  ): number;
  ImageScanner_enable_cache(scanner: number, enable: boolean): void;
  ImageScanner_recycle_image(scanner: number, image: number): void;
  ImageScanner_scan(ImageScanner_scannner: number, image: number): number;
  ImageScanner_get_results(scanner: number): number;
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
