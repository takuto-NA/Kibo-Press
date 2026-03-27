/**
 * 責務: エクスポートパイプラインの失敗理由を型で表現する
 */

export type ExportPipelineErrorReason =
  | "PANDOC_NOT_FOUND"
  | "TYPST_NOT_FOUND"
  | "PANDOC_FAILED"
  | "TYPST_FAILED"
  | "THEME_NOT_FOUND"
  | "INPUT_NOT_MARKDOWN"
  | "IO_ERROR";

export class ExportPipelineError extends Error {
  public readonly reason: ExportPipelineErrorReason;

  public readonly commandStderr: string;

  public constructor(
    reason: ExportPipelineErrorReason,
    message: string,
    commandStderr: string,
  ) {
    super(message);
    this.reason = reason;
    this.commandStderr = commandStderr;
  }
}
