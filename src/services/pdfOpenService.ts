/**
 * 責務: エクスポート完了後の PDF オープン導線（自動 / 通知）をまとめる
 */

import type * as vscode from "vscode";
import { LAST_EXPORTED_PDF_URI_STATE_KEY } from "../constants/stateKeys";
import { buildExportSucceededMessage } from "../ui/notifications";

const NOTIFICATION_ACTION_OPEN_PDF_LABEL = "開く";

export async function persistLastExportedPdfUriAndOfferOpen(
  vscodeApi: typeof vscode,
  extensionContext: vscode.ExtensionContext,
  outputPdfAbsolutePath: string,
  shouldOpenPdfAutomatically: boolean,
): Promise<void> {
  const outputPdfUri = vscodeApi.Uri.file(outputPdfAbsolutePath);

  await extensionContext.workspaceState.update(
    LAST_EXPORTED_PDF_URI_STATE_KEY,
    outputPdfUri.toString(),
  );

  if (shouldOpenPdfAutomatically) {
    await vscodeApi.env.openExternal(outputPdfUri);
    void vscodeApi.window.showInformationMessage(
      buildExportSucceededMessage(outputPdfAbsolutePath),
    );
    return;
  }

  const selectedAction = await vscodeApi.window.showInformationMessage(
    buildExportSucceededMessage(outputPdfAbsolutePath),
    NOTIFICATION_ACTION_OPEN_PDF_LABEL,
  );

  if (selectedAction !== NOTIFICATION_ACTION_OPEN_PDF_LABEL) {
    return;
  }

  await vscodeApi.env.openExternal(outputPdfUri);
}
