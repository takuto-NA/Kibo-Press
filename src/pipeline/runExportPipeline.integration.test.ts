/**
 * 責務: Pandoc + Typst が利用可能な環境での結合テスト（任意実行）
 *
 * 環境変数 KIBO_PRESS_RUN_INTEGRATION が "1" でない場合、本ファイルのテストは
 * 早期リターンし、外部ツールを呼び出さない。通常の npm test では Pandoc/Typst
 * 連携が検証されたことにはならない点に注意する。
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import pdfParse from "pdf-parse";
import { describe, expect, it } from "vitest";
import { runExportPipeline } from "./runExportPipeline";

const ENVIRONMENT_VARIABLE_ENABLE_INTEGRATION_TESTS = "KIBO_PRESS_RUN_INTEGRATION";

const MINIMUM_EXPECTED_PDF_BYTE_LENGTH = 500;

describe("runExportPipeline（結合）", () => {
  it("sample.md から PDF を生成し、主要テキストが含まれる", async () => {
    if (process.env[ENVIRONMENT_VARIABLE_ENABLE_INTEGRATION_TESTS] !== "1") {
      return;
    }

    const repoRootAbsolutePath = process.cwd();
    const inputMarkdownAbsolutePath = path.join(
      repoRootAbsolutePath,
      "examples",
      "sample.md",
    );
    const outputPdfAbsolutePath = path.join(
      os.tmpdir(),
      `kibo-press-integration-${Date.now()}.pdf`,
    );

    try {
      await runExportPipeline({
        repoRootAbsolutePath,
        inputMarkdownAbsolutePath,
        outputPdfAbsolutePath,
        fallbackThemeId: "business-report",
        pandocExecutablePath: "pandoc",
        typstExecutablePath: "typst",
        userLevelDocumentMetadata: {},
        workspaceLevelDocumentMetadata: {},
      });

      const pdfBuffer = fs.readFileSync(outputPdfAbsolutePath);

      expect(pdfBuffer.byteLength).toBeGreaterThan(MINIMUM_EXPECTED_PDF_BYTE_LENGTH);

      const parsedPdf = await pdfParse(pdfBuffer);

      expect(parsedPdf.text).toContain("Kibo-Press");
      expect(parsedPdf.text).toContain("表の例");
      expect(parsedPdf.numpages).toBeGreaterThan(0);
    } finally {
      if (fs.existsSync(outputPdfAbsolutePath)) {
        fs.rmSync(outputPdfAbsolutePath, { force: true });
      }
    }
  });
});
