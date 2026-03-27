/**
 * 責務: テーマ既定を除くレイヤーから doc のテーマ ID を決定する
 *
 * ガード: theme.yaml の defaults 由来の既定テーマに依存しないよう、
 * user / workspace / front matter のみから解決する。
 */

import { DOCUMENT_THEME_ID_METADATA_KEY } from "../constants/metadataKeys";
import { mergeLayeredDocumentMetadata } from "./mergeLayeredDocumentMetadata";

export function resolveThemeIdFromLayers(
  userLevelOverrides: Record<string, unknown>,
  workspaceLevelOverrides: Record<string, unknown>,
  frontMatter: Record<string, unknown>,
  fallbackThemeId: string,
): string {
  const layeredWithoutThemeDefaults = mergeLayeredDocumentMetadata(
    {},
    userLevelOverrides,
    workspaceLevelOverrides,
    frontMatter,
  );

  const candidateUnknown = layeredWithoutThemeDefaults[DOCUMENT_THEME_ID_METADATA_KEY];

  if (typeof candidateUnknown === "string" && candidateUnknown.trim().length > 0) {
    return candidateUnknown.trim();
  }

  return fallbackThemeId;
}
