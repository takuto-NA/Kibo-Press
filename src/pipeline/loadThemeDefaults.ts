/**
 * 責務: テーマディレクトリから theme.yaml の defaults を読み取る
 */

import * as fs from "node:fs";
import * as path from "node:path";
import YAML from "yaml";
import { ExportPipelineError } from "./ExportPipelineError";

export type ThemeYamlShape = {
  id: string;
  displayName?: string;
  defaults?: Record<string, unknown>;
};

export function loadThemeDefaults(
  repoRootAbsolutePath: string,
  themeId: string,
): Record<string, unknown> {
  const themeDirectoryAbsolutePath = path.join(
    repoRootAbsolutePath,
    "themes",
    themeId,
  );
  const themeYamlAbsolutePath = path.join(
    themeDirectoryAbsolutePath,
    "theme.yaml",
  );

  if (!fs.existsSync(themeYamlAbsolutePath)) {
    throw new ExportPipelineError(
      "THEME_NOT_FOUND",
      `theme.yaml が見つかりません: ${themeYamlAbsolutePath}`,
      "",
    );
  }

  const themeYamlText = fs.readFileSync(themeYamlAbsolutePath, "utf8");
  const parsedUnknown: unknown = YAML.parse(themeYamlText);

  if (!isRecord(parsedUnknown)) {
    throw new ExportPipelineError(
      "THEME_NOT_FOUND",
      `theme.yaml の形式が不正です: ${themeYamlAbsolutePath}`,
      "",
    );
  }

  const parsedTheme = parsedUnknown as ThemeYamlShape;

  if (!parsedTheme.defaults) {
    return {};
  }

  if (!isRecord(parsedTheme.defaults)) {
    throw new ExportPipelineError(
      "THEME_NOT_FOUND",
      `theme.yaml の defaults がオブジェクトではありません: ${themeYamlAbsolutePath}`,
      "",
    );
  }

  return parsedTheme.defaults;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
