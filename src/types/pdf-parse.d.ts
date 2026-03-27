/**
 * 責務: pdf-parse に型宣言が同梱されない環境向けの最小宣言
 */

declare module "pdf-parse" {
  type PdfParseResult = {
    numpages: number;
    text: string;
  };

  function pdfParse(dataBuffer: Buffer): Promise<PdfParseResult>;

  export default pdfParse;
}
