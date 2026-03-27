/**
 * 責務: Pandoc / Typst 実行ファイルの解決と存在確認
 */

import * as fs from "node:fs";
import type * as vscode from "vscode";
import { KIBO_PRESS_CONFIGURATION_SECTION } from "../constants/configurationSections";
import { detectExecutableAvailabilityOrThrow } from "../engine/detectExecutableAvailability";
import { resolvePreferredExecutablePath } from "../engine/resolvePreferredExecutable";
import { ExportPipelineError } from "../pipeline/ExportPipelineError";
import type { OutputChannelLogger } from "../ui/outputChannelLogger";

const PANDOC_EXECUTABLE_FALLBACK_NAME = "pandoc";
const TYPST_EXECUTABLE_FALLBACK_NAME = "typst";

const CONFIG_PANDOC_PATH_KEY = "pandocPath";
const CONFIG_TYPST_PATH_KEY = "typstPath";

export async function resolvePandocExecutablePathOrThrow(
  vscodeModule: typeof vscode,
  logger: OutputChannelLogger,
): Promise<string> {
  const configuration = vscodeModule.workspace.getConfiguration(
    KIBO_PRESS_CONFIGURATION_SECTION,
  );
  const preferredPathUnknown = configuration.get<string>(CONFIG_PANDOC_PATH_KEY, "");

  const executablePath = resolvePreferredExecutablePath(
    preferredPathUnknown.length > 0 ? preferredPathUnknown : undefined,
    PANDOC_EXECUTABLE_FALLBACK_NAME,
  );

  logger.appendInfoLine(`Pandoc を検証します: ${executablePath}`);

  await detectExecutableAvailabilityOrThrow(
    executablePath,
    "PANDOC_NOT_FOUND",
    "Pandoc",
  );

  return executablePath;
}

export async function resolveTypstExecutablePathOrThrow(
  vscodeModule: typeof vscode,
  logger: OutputChannelLogger,
): Promise<string> {
  const configuration = vscodeModule.workspace.getConfiguration(
    KIBO_PRESS_CONFIGURATION_SECTION,
  );
  const preferredPathUnknown = configuration.get<string>(CONFIG_TYPST_PATH_KEY, "");

  const executablePath = resolvePreferredExecutablePath(
    preferredPathUnknown.length > 0 ? preferredPathUnknown : undefined,
    TYPST_EXECUTABLE_FALLBACK_NAME,
  );

  logger.appendInfoLine(`Typst を検証します: ${executablePath}`);

  await detectExecutableAvailabilityOrThrow(
    executablePath,
    "TYPST_NOT_FOUND",
    "Typst",
  );

  return executablePath;
}

export function readExportPipelineStderrIfPresent(pipelineError: unknown): string {
  if (!(pipelineError instanceof ExportPipelineError)) {
    return "";
  }

  return pipelineError.commandStderr;
}

export function isFileMissingAtPath(absoluteFilePath: string): boolean {
  if (!fs.existsSync(absoluteFilePath)) {
    return true;
  }

  return false;
}
