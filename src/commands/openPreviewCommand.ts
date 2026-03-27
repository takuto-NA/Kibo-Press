/**
 * 責務: Open Preview（最後に出力した PDF を既定アプリで開く）コマンドを登録する
 */

import type * as vscode from "vscode";
import { COMMAND_OPEN_PREVIEW } from "../constants/commandIds";
import { LAST_EXPORTED_PDF_URI_STATE_KEY } from "../constants/stateKeys";
import {
  buildOpenPdfMissingFileMessage,
  buildOpenPdfMissingMessage,
} from "../ui/notifications";
import { isFileMissingAtPath } from "../services/engineService";

export function registerOpenPreviewCommand(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext,
): void {
  const disposable = vscodeApi.commands.registerCommand(COMMAND_OPEN_PREVIEW, async () => {
    const lastExportedPdfUriString = context.workspaceState.get<string>(
      LAST_EXPORTED_PDF_URI_STATE_KEY,
      "",
    );

    if (lastExportedPdfUriString.trim().length === 0) {
      void vscodeApi.window.showWarningMessage(buildOpenPdfMissingMessage());
      return;
    }

    const lastExportedPdfUri = vscodeApi.Uri.parse(lastExportedPdfUriString);

    if (isFileMissingAtPath(lastExportedPdfUri.fsPath)) {
      void vscodeApi.window.showWarningMessage(
        buildOpenPdfMissingFileMessage(lastExportedPdfUri.fsPath),
      );
      return;
    }

    await vscodeApi.env.openExternal(lastExportedPdfUri);
  });

  context.subscriptions.push(disposable);
}
