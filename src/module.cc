#include <emscripten.h>
#include <zbar.h>

#define EXPORT EMSCRIPTEN_KEEPALIVE

extern "C" {

EXPORT zbar::ImageScanner* ImageScanner_create() {
  return new zbar::ImageScanner();
}

EXPORT void ImageScanner_destory(zbar::ImageScanner* scanner) {
  delete scanner;
}

EXPORT int ImageScanner_set_config(zbar::ImageScanner* scanner,
                                   int32_t symbology,
                                   int32_t config,
                                   int32_t value) {
  return scanner->set_config(static_cast<zbar::zbar_symbol_type_t>(symbology),
                             static_cast<zbar::zbar_config_t>(config), value);
}

EXPORT void ImageScanner_enable_cache(zbar::ImageScanner* scanner,
                                      bool enable) {
  scanner->enable_cache(enable);
}

EXPORT void ImageScanner_recycle_image(zbar::ImageScanner* scanner,
                                       zbar::Image* image) {
  scanner->recycle_image(*image);
}

EXPORT const zbar::zbar_symbol_set_t* ImageScanner_get_results(
    zbar::ImageScanner* scanner) {
  return static_cast<const zbar::zbar_symbol_set_t*>(scanner->get_results());
}

EXPORT int ImageScanner_scan(zbar::ImageScanner* scanner, zbar::Image* image) {
  return scanner->scan(*image);
}

EXPORT zbar::Image* Image_create(uint32_t width,
                                 uint32_t height,
                                 uint32_t format,
                                 const void* data,
                                 uint32_t length,
                                 uint32_t sequence_num) {
  zbar::Image* image = new zbar::Image(width, height);
  image->set_format(format);
  /* image will take ownership of data */
  image->set_data(data, length);
  image->set_sequence(sequence_num);
  return image;
}

EXPORT void Image_destory(zbar::Image* image) {
  delete image;
}

EXPORT const zbar::zbar_symbol_set_t* Image_get_symbols(zbar::Image* image) {
  return static_cast<const zbar::zbar_symbol_set_t*>(image->get_symbols());
}
}
