/**
 * 責務: front matter 雛形を挿入する Create Document Config コマンドを登録する
 */

import type * as vscode from "vscode";
import { COMMAND_CREATE_DOCUMENT_CONFIG } from "../constants/commandIds";
import {
  buildMarkdownFileRequiredMessage,
  formatKiboPressNotificationMessage,
} from "../ui/notifications";

// ガード: examples/document-config-template.md の先頭ブロックと同期すること（挿入内容の単一情報源として参照）
const MARKDOWN_FRONT_MATTER_TEMPLATE = String.raw`---
title: "文書タイトル"
subtitle: "サブタイトル（任意）"
author: "著者名"
date: "YYYY-MM-DD"
company: "会社名（任意）"
kibo_theme: "business-report"
kibo_cover: false
toc: true
---
<!-- Kibo-Press: 体裁の調整は docs/customization.md を参照 -->

`;

export function registerCreateDocumentConfigCommand(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext,
): void {
  const disposable = vscodeApi.commands.registerCommand(
    COMMAND_CREATE_DOCUMENT_CONFIG,
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

      const firstLineIsEmpty =
        activeDocument.lineAt(0).text.trim().length === 0;

      if (!firstLineIsEmpty) {
        const CONFIRM_ACTION_CONTINUE = "続行";
        const CONFIRM_ACTION_CANCEL = "キャンセル";

        const selection = await vscodeApi.window.showWarningMessage(
          formatKiboPressNotificationMessage(
            "先頭行が空でないため挿入すると内容が壊れる可能性があります。続行しますか？",
          ),
          CONFIRM_ACTION_CONTINUE,
          CONFIRM_ACTION_CANCEL,
        );

        if (selection !== CONFIRM_ACTION_CONTINUE) {
          return;
        }
      }

      await activeTextEditor.edit((editBuilder) => {
        const documentStartPosition = new vscodeApi.Position(0, 0);
        editBuilder.insert(documentStartPosition, MARKDOWN_FRONT_MATTER_TEMPLATE);
      });
    },
  );

  context.subscriptions.push(disposable);
}
