/**
 * 責務: Export PDF コマンドを登録し、結果通知まで行う
 */

import type * as vscode from "vscode";
import { COMMAND_EXPORT_PDF } from "../constants/commandIds";
import { readKiboPressEffectiveConfiguration } from "../services/configService";
import { exportActiveMarkdownToPdfIfPossible } from "../services/exportService";
import { persistLastExportedPdfUriAndOfferOpen } from "../services/pdfOpenService";
import { buildMarkdownFileRequiredMessage } from "../ui/notifications";
import type { OutputChannelLogger } from "../ui/outputChannelLogger";
import { notifyExportFailureMessage } from "./notifyExportFailure";

export function registerExportPdfCommand(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext,
  logger: OutputChannelLogger,
): void {
  const disposable = vscodeApi.commands.registerCommand(COMMAND_EXPORT_PDF, async () => {
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

    const effectiveConfiguration = readKiboPressEffectiveConfiguration(vscodeApi);

    const result = await exportActiveMarkdownToPdfIfPossible({
      vscodeApi,
      extensionContext: context,
      markdownDocument: activeDocument,
      logger,
      effectiveConfiguration,
      themeOverrideId: undefined,
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
  });

  context.subscriptions.push(disposable);
}
