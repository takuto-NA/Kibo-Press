/**
 * 責務: Export PDF with Theme（QuickPick）コマンドを登録する
 */

import type * as vscode from "vscode";
import { COMMAND_EXPORT_PDF_WITH_THEME } from "../constants/commandIds";
import { readKiboPressEffectiveConfiguration } from "../services/configService";
import { exportActiveMarkdownToPdfIfPossible } from "../services/exportService";
import { persistLastExportedPdfUriAndOfferOpen } from "../services/pdfOpenService";
import { readInstalledThemeIdsOrEmpty } from "../services/themeDiscoveryService";
import { buildMarkdownFileRequiredMessage, formatKiboPressNotificationMessage } from "../ui/notifications";
import type { OutputChannelLogger } from "../ui/outputChannelLogger";
import { notifyExportFailureMessage } from "./notifyExportFailure";

export function registerExportPdfWithThemeCommand(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext,
  logger: OutputChannelLogger,
): void {
  const disposable = vscodeApi.commands.registerCommand(
    COMMAND_EXPORT_PDF_WITH_THEME,
    async () => {
      const activeTextEditor = vscodeApi.window.activeTextEditor;

      if (!activeTextEditor) {
        void vscodeApi.window.showWarningMessage(buildMarkdownFileRequiredMessage());
        return;
      }

      const activeDocument = activeTextEditor.document;

      if (activeDocument.languageId !== "markdown") {
        void vscodeApi.window.showWarningMessage(buildMarkdownFileRequiredMessage());
        return;
      }

      const installedThemeIds = readInstalledThemeIdsOrEmpty(context.extensionPath);

      if (installedThemeIds.length === 0) {
        void vscodeApi.window.showErrorMessage(
          formatKiboPressNotificationMessage(
            "themes ディレクトリにテーマが見つかりません。拡張のインストール状態を確認してください。",
          ),
        );
        return;
      }

      const selectedThemeId = await vscodeApi.window.showQuickPick(installedThemeIds, {
        title: "Kibo-Press: テーマを選択",
        placeHolder: "出力に使うテーマ ID を選びます",
      });

      if (!selectedThemeId) {
        return;
      }

      const effectiveConfiguration = readKiboPressEffectiveConfiguration(vscodeApi);

      const result = await exportActiveMarkdownToPdfIfPossible({
        vscodeApi,
        extensionContext: context,
        markdownDocument: activeDocument,
        logger,
        effectiveConfiguration,
        themeOverrideId: selectedThemeId,
      });

      if (result.kind === "cancelled") {
        return;
      }

      if (result.kind === "failure") {
        await notifyExportFailureMessage(
          vscodeApi,
          result.messageForUser,
          result.pipelineError,
        );
        return;
      }

      await persistLastExportedPdfUriAndOfferOpen(
        vscodeApi,
        context,
        result.outputPdfAbsolutePath,
        effectiveConfiguration.openPdfAfterExport,
      );
    },
  );

  context.subscriptions.push(disposable);
}
