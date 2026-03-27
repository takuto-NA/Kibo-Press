/**
 * 責務: ドキュメントメタデータで使用するキー名の単一情報源
 */

export const DOCUMENT_THEME_ID_METADATA_KEY = "kibo_theme";

export const METADATA_KEYS_STRIPPED_BEFORE_PANDOC = new Set<string>([
  DOCUMENT_THEME_ID_METADATA_KEY,
]);
