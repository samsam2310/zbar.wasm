#include <emscripten.h>
#include <zbar.h>
#include <stdio.h>
#include <stdlib.h>

#define EXPORT EMSCRIPTEN_KEEPALIVE
typedef int int32_t;
typedef unsigned int uint32_t;

EXPORT zbar_image_scanner_t* ImageScanner_create() {
  return zbar_image_scanner_create();
}

EXPORT void ImageScanner_destory(zbar_image_scanner_t* scanner) {
  zbar_image_scanner_destroy(scanner);
}

EXPORT int ImageScanner_set_config(zbar_image_scanner_t* scanner,
                                   int32_t symbology,
                                   int32_t config,
                                   int32_t value) {
  return zbar_image_scanner_set_config(scanner, (zbar_symbol_type_t)(symbology),
                                       (zbar_config_t)(config), value);
}

EXPORT void ImageScanner_enable_cache(zbar_image_scanner_t* scanner,
                                      int enable) {
  zbar_image_scanner_enable_cache(scanner, enable);
}

EXPORT void ImageScanner_recycle_image(zbar_image_scanner_t* scanner,
                                       zbar_image_t* image) {
  zbar_image_scanner_recycle_image(scanner, image);
}

EXPORT const zbar_symbol_set_t* ImageScanner_get_results(
    zbar_image_scanner_t* scanner) {
  return zbar_image_scanner_get_results(scanner);
}

EXPORT int ImageScanner_scan(zbar_image_scanner_t* scanner,
                             zbar_image_t* image) {
  return zbar_scan_image(scanner, image);
}

EXPORT zbar_image_t* Image_create(uint32_t width,
                                  uint32_t height,
                                  uint32_t format,
                                  void* data,
                                  uint32_t length,
                                  uint32_t sequence_num) {
  zbar_image_t* image = zbar_image_create();
  zbar_image_set_size(image, width, height);
  zbar_image_set_format(image, format);
  zbar_image_set_data(image, data, length, zbar_image_free_data);
  zbar_image_set_sequence(image, sequence_num);
  return image;
}

EXPORT void Image_destory(zbar_image_t* image) {
  zbar_image_destroy(image);
}

EXPORT const zbar_symbol_set_t* Image_get_symbols(zbar_image_t* image) {
  return zbar_image_get_symbols(image);
}
