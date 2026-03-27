/**
 * 責務: VS Code 設定からドキュメントメタデータ用の上書きを構築する
 *
 * MVP ではドキュメントへの上書きは空でもよいが、将来の拡張のため型と入口を固定する。
 */

import type * as vscode from "vscode";
import { KIBO_PRESS_CONFIGURATION_SECTION } from "../constants/configurationSections";

const CONFIG_DEFAULT_THEME_KEY = "defaultTheme";

export type KiboPressEffectiveConfiguration = {
  defaultThemeId: string;
  defaultOutputDirectory: string;
  openPdfAfterExport: boolean;
};

export function readKiboPressEffectiveConfiguration(
  vscodeModule: typeof vscode,
): KiboPressEffectiveConfiguration {
  const userConfiguration = vscodeModule.workspace.getConfiguration(
    KIBO_PRESS_CONFIGURATION_SECTION,
  );

  const defaultThemeId = userConfiguration.get<string>(CONFIG_DEFAULT_THEME_KEY, "business-report");
  const defaultOutputDirectory = userConfiguration.get<string>("defaultOutputDirectory", "");
  const openPdfAfterExport = userConfiguration.get<boolean>("openPdfAfterExport", false);

  return {
    defaultThemeId,
    defaultOutputDirectory,
    openPdfAfterExport,
  };
}

export function buildWorkspaceLevelDocumentMetadata(
  _vscodeModule: typeof vscode,
): Record<string, unknown> {
  // ガード: MVP ではドキュメントメタデータを設定から注入しない（将来: 既定の toc など）
  return {};
}

export function buildUserLevelDocumentMetadata(
  _vscodeModule: typeof vscode,
): Record<string, unknown> {
  // ガード: MVP ではドキュメントメタデータを設定から注入しない
  return {};
}
