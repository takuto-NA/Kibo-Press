/**
 * 責務: 設定で指定された実行ファイルパスがあれば優先し、無ければ既定名を返す
 */

export function resolvePreferredExecutablePath(
  preferredExecutablePath: string | undefined,
  fallbackExecutableName: string,
): string {
  const trimmedPreferred = preferredExecutablePath?.trim() ?? "";

  if (trimmedPreferred.length > 0) {
    return trimmedPreferred;
  }

  return fallbackExecutableName;
}
