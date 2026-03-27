/**
 * 責務: 外部コマンドを実行し stdout / stderr を取得する
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { MAX_EXECUTABLE_OUTPUT_BYTES_20_MIB } from "../constants/executableOutputLimits";

const execFileAsync = promisify(execFile);

export type RunExecutableResult = {
  stdout: string;
  stderr: string;
};

export async function runExecutableWithArgs(
  executablePath: string,
  args: string[],
  options: { cwd?: string },
): Promise<RunExecutableResult> {
  const cwd = options.cwd;

  const result = await execFileAsync(executablePath, args, {
    cwd,
    maxBuffer: MAX_EXECUTABLE_OUTPUT_BYTES_20_MIB,
  });

  return {
    stdout: result.stdout.toString(),
    stderr: result.stderr.toString(),
  };
}
