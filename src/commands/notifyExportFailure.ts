/**
 * 責務: エクスポート失敗時の利用者向けメッセージ表示を共通化する
 */

import type * as vscode from "vscode";
import { ExportPipelineError } from "../pipeline/ExportPipelineError";
import {
  buildPandocMissingMessage,
  buildTypstMissingMessage,
  formatKiboPressNotificationMessage,
} from "../ui/notifications";

export async function notifyExportFailureMessage(
  vscodeApi: typeof vscode,
  messageForUser: string,
  pipelineError: ExportPipelineError | undefined,
): Promise<void> {
  if (pipelineError?.reason === "PANDOC_NOT_FOUND") {
    void vscodeApi.window.showErrorMessage(buildPandocMissingMessage());
    return;
  }

  if (pipelineError?.reason === "TYPST_NOT_FOUND") {
    void vscodeApi.window.showErrorMessage(buildTypstMissingMessage());
    return;
  }

  void vscodeApi.window.showErrorMessage(
    formatKiboPressNotificationMessage(messageForUser),
  );
}
