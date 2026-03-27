/**
 * 責務: PDF 出力先 URI の提案とエクスポート実行のオーケストレーション
 */

import * as path from "node:path";
import type * as vscode from "vscode";
import { DOCUMENT_THEME_ID_METADATA_KEY } from "../constants/metadataKeys";
import { runExportPipeline } from "../pipeline/runExportPipeline";
import { ExportPipelineError } from "../pipeline/ExportPipelineError";
import type { KiboPressEffectiveConfiguration } from "./configService";
import {
  buildUserLevelDocumentMetadata,
  buildWorkspaceLevelDocumentMetadata,
} from "./configService";
import {
  readExportPipelineStderrIfPresent,
  resolvePandocExecutablePathOrThrow,
  resolveTypstExecutablePathOrThrow,
} from "./engineService";
import type { OutputChannelLogger } from "../ui/outputChannelLogger";

export type ExportActiveMarkdownRequest = {
  vscodeApi: typeof vscode;
  extensionContext: vscode.ExtensionContext;
  markdownDocument: vscode.TextDocument;
  logger: OutputChannelLogger;
  effectiveConfiguration: KiboPressEffectiveConfiguration;
  themeOverrideId: string | undefined;
};

export type ExportActiveMarkdownSuccess = {
  kind: "success";
  outputPdfAbsolutePath: string;
};

export type ExportActiveMarkdownCancelled = {
  kind: "cancelled";
};

export type ExportActiveMarkdownFailure = {
  kind: "failure";
  messageForUser: string;
  pipelineError?: ExportPipelineError;
};

export type ExportActiveMarkdownResult =
  | ExportActiveMarkdownSuccess
  | ExportActiveMarkdownCancelled
  | ExportActiveMarkdownFailure;

export async function exportActiveMarkdownToPdfIfPossible(
  request: ExportActiveMarkdownRequest,
): Promise<ExportActiveMarkdownResult> {
  const saveDialogResult = await showPdfSaveDialogOrCancel(request);

  if (saveDialogResult.kind === "cancelled") {
    return { kind: "cancelled" };
  }

  const outputPdfAbsolutePath = saveDialogResult.outputPdfAbsolutePath;

  try {
    const pandocExecutablePath = await resolvePandocExecutablePathOrThrow(
      request.vscodeApi,
      request.logger,
    );
    const typstExecutablePath = await resolveTypstExecutablePathOrThrow(
      request.vscodeApi,
      request.logger,
    );

    const workspaceDocumentMetadata: Record<string, unknown> = {
      ...buildWorkspaceLevelDocumentMetadata(request.vscodeApi),
    };
    const userDocumentMetadata = buildUserLevelDocumentMetadata(request.vscodeApi);

    if (typeof request.themeOverrideId === "string") {
      workspaceDocumentMetadata[DOCUMENT_THEME_ID_METADATA_KEY] = request.themeOverrideId;
    }

    request.logger.appendInfoLine(
      `Export を開始します: ${request.markdownDocument.uri.fsPath}`,
    );

    await runExportPipeline({
      repoRootAbsolutePath: request.extensionContext.extensionPath,
      inputMarkdownAbsolutePath: request.markdownDocument.uri.fsPath,
      outputPdfAbsolutePath,
      fallbackThemeId: request.effectiveConfiguration.defaultThemeId,
      pandocExecutablePath,
      typstExecutablePath,
      userLevelDocumentMetadata: userDocumentMetadata,
      workspaceLevelDocumentMetadata: workspaceDocumentMetadata,
    });
  } catch (error: unknown) {
    const pipelineStderr = readExportPipelineStderrIfPresent(error);

    if (pipelineStderr.trim().length > 0) {
      request.logger.appendErrorLine(pipelineStderr.trim());
    }

    if (error instanceof ExportPipelineError) {
      return {
        kind: "failure",
        messageForUser: error.message,
        pipelineError: error,
      };
    }

    return {
      kind: "failure",
      messageForUser: `エクスポートに失敗しました: ${String(error)}`,
    };
  }

  return {
    kind: "success",
    outputPdfAbsolutePath,
  };
}

type PdfSaveDialogCancelled = {
  kind: "cancelled";
};

type PdfSaveDialogSelected = {
  kind: "selected";
  outputPdfAbsolutePath: string;
};

type PdfSaveDialogResult = PdfSaveDialogCancelled | PdfSaveDialogSelected;

async function showPdfSaveDialogOrCancel(
  request: ExportActiveMarkdownRequest,
): Promise<PdfSaveDialogResult> {
  const markdownUri = request.markdownDocument.uri;

  const suggestedUri = await buildSuggestedPdfSaveUri(request, markdownUri);

  const selectedUri = await request.vscodeApi.window.showSaveDialog({
    defaultUri: suggestedUri,
    saveLabel: "PDF に保存",
    filters: {
      PDF: ["pdf"],
    },
  });

  if (!selectedUri) {
    return { kind: "cancelled" };
  }

  return { kind: "selected", outputPdfAbsolutePath: selectedUri.fsPath };
}

async function buildSuggestedPdfSaveUri(
  request: ExportActiveMarkdownRequest,
  markdownUri: vscode.Uri,
): Promise<vscode.Uri> {
  const markdownBasename = path.basename(markdownUri.fsPath);
  const baseFileNameWithoutExtension = markdownBasename.replace(/\.md$/i, "");
  const suggestedFileName = `${baseFileNameWithoutExtension}.pdf`;

  const configuredOutputDirectory =
    request.effectiveConfiguration.defaultOutputDirectory.trim();

  if (configuredOutputDirectory.length === 0) {
    const directoryUri = request.vscodeApi.Uri.file(path.dirname(markdownUri.fsPath));
    return request.vscodeApi.Uri.joinPath(directoryUri, suggestedFileName);
  }

  if (path.isAbsolute(configuredOutputDirectory)) {
    const directoryUri = request.vscodeApi.Uri.file(configuredOutputDirectory);
    return request.vscodeApi.Uri.joinPath(directoryUri, suggestedFileName);
  }

  const workspaceRootUri = request.vscodeApi.workspace.workspaceFolders?.[0]?.uri;

  if (!workspaceRootUri) {
    const directoryUri = request.vscodeApi.Uri.file(path.dirname(markdownUri.fsPath));
    return request.vscodeApi.Uri.joinPath(directoryUri, suggestedFileName);
  }

  return request.vscodeApi.Uri.joinPath(
    workspaceRootUri,
    configuredOutputDirectory,
    suggestedFileName,
  );
}
