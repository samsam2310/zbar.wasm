export enum ZBarSymbolType {
  ZBAR_NONE = 0 /**< no symbol decoded */,
  ZBAR_PARTIAL = 1 /**< intermediate status */,
  ZBAR_EAN8 = 8 /**< EAN-8 */,
  ZBAR_UPCE = 9 /**< UPC-E */,
  ZBAR_ISBN10 = 10 /**< ISBN-10 (from EAN-13). @since 0.4 */,
  ZBAR_UPCA = 12 /**< UPC-A */,
  ZBAR_EAN13 = 13 /**< EAN-13 */,
  ZBAR_ISBN13 = 14 /**< ISBN-13 (from EAN-13). @since 0.4 */,
  ZBAR_I25 = 25 /**< Interleaved 2 of 5. @since 0.4 */,
  ZBAR_CODE39 = 39 /**< Code 39. @since 0.4 */,
  ZBAR_PDF417 = 57 /**< PDF417. @since 0.6 */,
  ZBAR_QRCODE = 64 /**< QR Code. @since 0.10 */,
  ZBAR_CODE128 = 128 /**< Code 128 */,
  ZBAR_SYMBOL = 0x00ff /**< mask for base symbol type */,
  ZBAR_ADDON2 = 0x0200 /**< 2-digit add-on flag */,
  ZBAR_ADDON5 = 0x0500 /**< 5-digit add-on flag */,
  ZBAR_ADDON = 0x0700 /**< add-on flag mask */
}

export enum ZBarConfigType {
  ZBAR_CFG_ENABLE = 0 /**< enable symbology/feature */,
  ZBAR_CFG_ADD_CHECK /**< enable check digit when optional */,
  ZBAR_CFG_EMIT_CHECK /**< return check digit when present */,
  ZBAR_CFG_ASCII /**< enable full ASCII character set */,
  ZBAR_CFG_NUM /**< number of boolean decoder configs */,

  ZBAR_CFG_MIN_LEN = 0x20 /**< minimum data length for valid decode */,
  ZBAR_CFG_MAX_LEN /**< maximum data length for valid decode */,

  ZBAR_CFG_UNCERTAINTY = 0x40 /**< required video consistency frames */,

  ZBAR_CFG_POSITION = 0x80 /**< enable scanner to collect position data */,

  ZBAR_CFG_X_DENSITY = 0x100 /**< image scanner vertical scan density */,
  ZBAR_CFG_Y_DENSITY /**< image scanner horizontal scan density */
}
