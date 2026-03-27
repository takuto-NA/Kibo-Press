/**
 * 責務: テーマ既定・ユーザー・ワークスペース・front matter を優先順位どおりにマージする
 *
 * 優先順位: front matter > ワークスペース > ユーザー > テーマ既定
 */

export function mergeLayeredDocumentMetadata(
  themeDefaults: Record<string, unknown>,
  userLevelOverrides: Record<string, unknown>,
  workspaceLevelOverrides: Record<string, unknown>,
  frontMatter: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...themeDefaults,
    ...userLevelOverrides,
    ...workspaceLevelOverrides,
    ...frontMatter,
  };
}
