/**
 * 責務: Markdown から Pandoc→Typst→PDF を実行し、成果物を出力先へ保存する
 */

import { randomBytes } from "node:crypto";
import * as fs from "node:fs";
import matter from "gray-matter";
import * as path from "node:path";
import { runExecutableWithArgs } from "../engine/runExecutable";
import { buildPandocMetadataYamlString } from "./buildPandocMetadataPayload";
import { ExportPipelineError } from "./ExportPipelineError";
import { loadThemeDefaults } from "./loadThemeDefaults";
import { mergeLayeredDocumentMetadata } from "./mergeLayeredDocumentMetadata";
import { resolveThemeIdFromLayers } from "./resolveThemeIdFromLayers";

/** Typst の「source must be under --root」制約のため、中間ファイルはリポジトリルート配下に置く */
const EPHEMERAL_WORK_ROOT_DIRECTORY_NAME = ".kibo-press";

const EPHEMERAL_RUN_SCRATCH_DIRECTORY_NAME = "tmp";

export type RunExportPipelineInput = {
  repoRootAbsolutePath: string;
  inputMarkdownAbsolutePath: string;
  outputPdfAbsolutePath: string;
  fallbackThemeId: string;
  pandocExecutablePath: string;
  typstExecutablePath: string;
  userLevelDocumentMetadata: Record<string, unknown>;
  workspaceLevelDocumentMetadata: Record<string, unknown>;
};

export async function runExportPipeline(
  input: RunExportPipelineInput,
): Promise<void> {
  validateMarkdownInputPathOrThrow(input.inputMarkdownAbsolutePath);

  const markdownText = readFileUtf8OrThrow(input.inputMarkdownAbsolutePath);
  const parsedMatter = matter(markdownText);

  const themeId = resolveThemeIdFromLayers(
    input.userLevelDocumentMetadata,
    input.workspaceLevelDocumentMetadata,
    recordOrEmpty(parsedMatter.data),
    input.fallbackThemeId,
  );

  const themeDefaults = loadThemeDefaults(input.repoRootAbsolutePath, themeId);

  const mergedMetadata = mergeLayeredDocumentMetadata(
    themeDefaults,
    input.userLevelDocumentMetadata,
    input.workspaceLevelDocumentMetadata,
    recordOrEmpty(parsedMatter.data),
  );

  const outputDirectoryAbsolutePath = path.dirname(input.outputPdfAbsolutePath);
  ensureDirectoryExistsOrThrow(outputDirectoryAbsolutePath);

  const pandocTemplateAbsolutePath = path.join(
    input.repoRootAbsolutePath,
    "themes",
    themeId,
    "pandoc-template.typ",
  );

  if (!fs.existsSync(pandocTemplateAbsolutePath)) {
    throw new ExportPipelineError(
      "THEME_NOT_FOUND",
      `Pandoc テンプレートが見つかりません: ${pandocTemplateAbsolutePath}`,
      "",
    );
  }

  const resourcePathForMarkdownAssets = path.dirname(
    input.inputMarkdownAbsolutePath,
  );

  const randomToken = randomBytes(8).toString("hex");
  const temporaryWorkingDirectoryPath = path.join(
    input.repoRootAbsolutePath,
    EPHEMERAL_WORK_ROOT_DIRECTORY_NAME,
    EPHEMERAL_RUN_SCRATCH_DIRECTORY_NAME,
    `run-${randomToken}`,
  );

  fs.mkdirSync(temporaryWorkingDirectoryPath, { recursive: true });

  const temporaryBodyMarkdownPath = path.join(
    temporaryWorkingDirectoryPath,
    "body-from-kibo-press.md",
  );
  const temporaryMetadataYamlPath = path.join(
    temporaryWorkingDirectoryPath,
    "metadata-from-kibo-press.yaml",
  );
  const temporaryTypstPath = path.join(
    temporaryWorkingDirectoryPath,
    "intermediate-from-kibo-press.typ",
  );

  try {
    fs.writeFileSync(temporaryBodyMarkdownPath, parsedMatter.content, "utf8");
    fs.writeFileSync(
      temporaryMetadataYamlPath,
      buildPandocMetadataYamlString(mergedMetadata),
      "utf8",
    );

    const pandocArguments = [
      temporaryBodyMarkdownPath,
      "-f",
      "markdown",
      "-t",
      "typst",
      "-s",
      `--template=${pandocTemplateAbsolutePath}`,
      `--metadata-file=${temporaryMetadataYamlPath}`,
      `--resource-path=${resourcePathForMarkdownAssets}`,
      "-o",
      temporaryTypstPath,
    ];

    try {
      await runExecutableWithArgs(input.pandocExecutablePath, pandocArguments, {});
    } catch (error: unknown) {
      const stderrText = extractExecutableStderr(error);
      throw new ExportPipelineError(
        "PANDOC_FAILED",
        "Pandoc が失敗しました",
        stderrText,
      );
    }

    const typstArguments = [
      "compile",
      temporaryTypstPath,
      input.outputPdfAbsolutePath,
      "--root",
      input.repoRootAbsolutePath,
    ];

    try {
      await runExecutableWithArgs(input.typstExecutablePath, typstArguments, {});
    } catch (error: unknown) {
      const stderrText = extractExecutableStderr(error);
      throw new ExportPipelineError(
        "TYPST_FAILED",
        "Typst が失敗しました",
        stderrText,
      );
    }
  } finally {
    deleteTemporaryDirectoryQuietly(temporaryWorkingDirectoryPath);
  }
}

function validateMarkdownInputPathOrThrow(
  inputMarkdownAbsolutePath: string,
): void {
  if (!inputMarkdownAbsolutePath.toLowerCase().endsWith(".md")) {
    throw new ExportPipelineError(
      "INPUT_NOT_MARKDOWN",
      "入力ファイルは .md である必要があります",
      "",
    );
  }
}

function readFileUtf8OrThrow(absolutePath: string): string {
  try {
    return fs.readFileSync(absolutePath, "utf8");
  } catch {
    throw new ExportPipelineError(
      "IO_ERROR",
      `読み込みに失敗しました: ${absolutePath}`,
      "",
    );
  }
}

function ensureDirectoryExistsOrThrow(directoryAbsolutePath: string): void {
  try {
    fs.mkdirSync(directoryAbsolutePath, { recursive: true });
  } catch {
    throw new ExportPipelineError(
      "IO_ERROR",
      `ディレクトリ作成に失敗しました: ${directoryAbsolutePath}`,
      "",
    );
  }
}

function deleteTemporaryDirectoryQuietly(
  temporaryWorkingDirectoryPath: string,
): void {
  try {
    if (!fs.existsSync(temporaryWorkingDirectoryPath)) {
      return;
    }

    fs.rmSync(temporaryWorkingDirectoryPath, { recursive: true, force: true });
  } catch {
    // 一時ディレクトリ削除失敗は致命的ではない
  }
}

function recordOrEmpty(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) {
    return {};
  }

  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractExecutableStderr(error: unknown): string {
  if (error instanceof Error) {
    const errorWithOptionalStderr = error as Error & {
      stderr?: string | Buffer;
    };

    const stderrUnknown = errorWithOptionalStderr.stderr;

    if (Buffer.isBuffer(stderrUnknown)) {
      return `${error.message}\n${stderrUnknown.toString()}`;
    }

    if (typeof stderrUnknown === "string" && stderrUnknown.length > 0) {
      return `${error.message}\n${stderrUnknown}`;
    }

    return error.message;
  }

  if (!isRecord(error)) {
    return String(error);
  }

  const stderrUnknown = error["stderr"];

  if (Buffer.isBuffer(stderrUnknown)) {
    return stderrUnknown.toString();
  }

  if (typeof stderrUnknown === "string") {
    return stderrUnknown;
  }

  const messageUnknown = error["message"];

  if (typeof messageUnknown === "string") {
    return messageUnknown;
  }

  return "";
}
