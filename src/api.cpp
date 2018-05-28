#include <emscripten.h>
#include <zbar.h>
#include <iostream>

zbar::ImageScanner scanner;
zbar::Image* image = NULL;

extern "C" {

EMSCRIPTEN_KEEPALIVE
void* createBuffer(int length) {
    return malloc(length * sizeof(uint8_t));
}

EMSCRIPTEN_KEEPALIVE
void deleteBuffer(uint8_t* buf) {
    free(buf);
}

EMSCRIPTEN_KEEPALIVE
int scanQrcode(uint8_t* imgBuf, int width, int height) {
    uint8_t* grayImgBuf = (uint8_t*)malloc(width * height * sizeof(uint8_t));
    for (int i = 0; i < width; ++i) {
        for (int j = 0; j < height; ++j) {
            uint8_t* pixels = imgBuf + i * height * 4 + j * 4;
            int sum = (int)pixels[0] + (int)pixels[1] + (int)pixels[2];
            grayImgBuf[i * height + j] = sum / 3;
        }
    }
    if (image) {
        delete image;
    }
    image = new zbar::Image(width, height, "Y800", grayImgBuf, width * height);
    return scanner.scan(*image);
}

EMSCRIPTEN_KEEPALIVE
void getScanResults() {
    for (auto symb_p = image->symbol_begin(); symb_p != image->symbol_end();
         ++symb_p) {
        // do something useful with results
        std::cout << "decoded " << symb_p->get_type_name() << " symbol \""
                  << symb_p->get_data() << '"' << std::endl;
    }
}

}

int main(int argc, char** argv) {
    scanner.set_config(zbar::ZBAR_NONE, zbar::ZBAR_CFG_ENABLE, 1);
    std::cout << "Init scanner" << std::endl;
}