/**
 * 責務: 利用者向け通知メッセージ文面の単一情報源
 */

export const NOTIFY_TITLE_KIBO_PRESS = "Kibo-Press";

export function formatKiboPressNotificationMessage(messageBody: string): string {
  return `${NOTIFY_TITLE_KIBO_PRESS}: ${messageBody}`;
}

export function buildMarkdownFileRequiredMessage(): string {
  return formatKiboPressNotificationMessage(
    "Markdown ファイルを開いてから実行してください。",
  );
}

export function buildExportSucceededMessage(outputPdfAbsolutePath: string): string {
  return formatKiboPressNotificationMessage(
    `PDF を出力しました: ${outputPdfAbsolutePath}`,
  );
}

export function buildPandocMissingMessage(): string {
  return formatKiboPressNotificationMessage(
    "Pandoc が見つかりません。インストールして PATH に追加してください。",
  );
}

export function buildTypstMissingMessage(): string {
  return formatKiboPressNotificationMessage(
    "Typst が見つかりません。インストールして PATH に追加してください。",
  );
}

export function buildOpenPdfMissingMessage(): string {
  return formatKiboPressNotificationMessage(
    "まだ出力した PDF がありません。先に Export PDF を実行してください。",
  );
}

export function buildOpenPdfMissingFileMessage(
  lastExportedPdfAbsolutePath: string,
): string {
  return formatKiboPressNotificationMessage(
    `PDF が見つかりません: ${lastExportedPdfAbsolutePath}`,
  );
}
