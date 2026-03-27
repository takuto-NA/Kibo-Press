/**
 * 責務: 外部コマンド出力バッファ上限などの定数
 */

const BYTES_PER_MEBIBYTE = 1024 * 1024;

/** child_process へ指定する stderr/stdout の最大バッファ（バイト） */
export const MAX_EXECUTABLE_OUTPUT_BYTES_20_MIB = 20 * BYTES_PER_MEBIBYTE;
