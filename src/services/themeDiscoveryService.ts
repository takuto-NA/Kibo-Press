/**
 * 責務: 拡張同梱の themes ディレクトリからテーマ ID 一覧を列挙する
 */

import * as fs from "node:fs";
import * as path from "node:path";

export function readInstalledThemeIdsOrEmpty(
  extensionsRootAbsolutePath: string,
): string[] {
  const themesRootAbsolutePath = path.join(extensionsRootAbsolutePath, "themes");

  if (!fs.existsSync(themesRootAbsolutePath)) {
    return [];
  }

  const directoryEntries = fs.readdirSync(themesRootAbsolutePath, {
    withFileTypes: true,
  });

  const themeIds: string[] = [];

  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    themeIds.push(entry.name);
  }

  return themeIds.sort((left, right) => left.localeCompare(right));
}
