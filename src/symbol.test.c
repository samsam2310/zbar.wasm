#include <assert.h>
#include <zbar.h>
#include <zbar/symbol.h>
#define static_assert _Static_assert

static_assert(sizeof(int) == 4, "refcnt_t");
static_assert(sizeof(char*) == 4, "refcnt_t");
static_assert(sizeof(refcnt_t) == 4, "refcnt_t");
static_assert(sizeof(zbar_symbol_type_t) == 4, "zbar_symbol_type_t");
static_assert((zbar_symbol_type_t)(-1) > 0, "enum is unsigned");
static_assert(sizeof(zbar_symbol_set_t) == 4 * 4, "zbar_symbol_set_t");
static_assert(sizeof(zbar_symbol_t) == 13 * 4, "zbar_symbol_t");
