/**
 * 責務: VS Code 拡張のエントリ（コマンド登録と Output Channel の生成）
 */

import * as vscode from "vscode";
import { registerCreateDocumentConfigCommand } from "./commands/createDocumentConfigCommand";
import { registerExportPdfCommand } from "./commands/exportPdfCommand";
import { registerExportPdfWithThemeCommand } from "./commands/exportPdfWithThemeCommand";
import { registerOpenPreviewCommand } from "./commands/openPreviewCommand";
import { createOutputChannelLogger } from "./ui/outputChannelLogger";

const OUTPUT_CHANNEL_NAME = "Kibo-Press";

export function activate(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
  const logger = createOutputChannelLogger(outputChannel);

  context.subscriptions.push(outputChannel);

  registerExportPdfCommand(vscode, context, logger);
  registerExportPdfWithThemeCommand(vscode, context, logger);
  registerOpenPreviewCommand(vscode, context);
  registerCreateDocumentConfigCommand(vscode, context);

  logger.appendInfoLine("Kibo-Press を初期化しました。");
}

export function deactivate(): void {
  // 責務: 現時点で保持するリソースは subscriptions で解放される
}
