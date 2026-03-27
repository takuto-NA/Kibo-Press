/**
 * 責務: Output Channel へログを書くための薄いラッパー
 */

import type * as vscode from "vscode";

export type OutputChannelLogger = {
  appendInfoLine: (message: string) => void;
  appendErrorLine: (message: string) => void;
};

export function createOutputChannelLogger(
  outputChannel: vscode.OutputChannel,
): OutputChannelLogger {
  return {
    appendInfoLine: (message: string): void => {
      const stampedMessage = `[INFO] ${buildTimestampPrefix()} ${message}`;
      outputChannel.appendLine(stampedMessage);
    },
    appendErrorLine: (message: string): void => {
      const stampedMessage = `[ERROR] ${buildTimestampPrefix()} ${message}`;
      outputChannel.appendLine(stampedMessage);
    },
  };
}

function buildTimestampPrefix(): string {
  return new Date().toISOString();
}
