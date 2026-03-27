/**
 * 責務: 実行ファイルが解決・起動できるかを軽く検証する（--version を叩く）
 */

import { ExportPipelineError } from "../pipeline/ExportPipelineError";
import { runExecutableWithArgs } from "./runExecutable";

export async function detectExecutableAvailabilityOrThrow(
  executablePath: string,
  notFoundReason: ExportPipelineError["reason"],
  executableDisplayNameForHumans: string,
): Promise<void> {
  try {
    await runExecutableWithArgs(executablePath, ["--version"], {});
  } catch (error: unknown) {
    const stderrText = extractStderrIfExecError(error);

    throw new ExportPipelineError(
      notFoundReason,
      `${executableDisplayNameForHumans} を実行できませんでした: ${executablePath}`,
      stderrText,
    );
  }
}

function extractStderrIfExecError(error: unknown): string {
  if (!isRecord(error)) {
    return "";
  }

  const stderr = error["stderr"];
  if (typeof stderr === "string") {
    return stderr;
  }

  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
