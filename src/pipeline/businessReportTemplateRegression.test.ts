/**
 * 責務: business-report テンプレートとサンプル文書の回帰を検証する
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT_ABSOLUTE_PATH = process.cwd();
const TEMPLATE_ABSOLUTE_PATH = path.join(
  REPO_ROOT_ABSOLUTE_PATH,
  "themes",
  "business-report",
  "pandoc-template.typ",
);
const SAMPLE_MARKDOWN_ABSOLUTE_PATH = path.join(
  REPO_ROOT_ABSOLUTE_PATH,
  "examples",
  "sample.md",
);

describe("business-report regression", () => {
  it("does not reference $body$ before the intended body slot", () => {
    const templateText = fs.readFileSync(TEMPLATE_ABSOLUTE_PATH, "utf8");
    const firstBodyPlaceholderIndex = templateText.indexOf("$body$");

    expect(firstBodyPlaceholderIndex).toBeGreaterThanOrEqual(0);
    expect(templateText.slice(0, firstBodyPlaceholderIndex)).not.toContain("$body$");
    expect(templateText.slice(0, firstBodyPlaceholderIndex)).not.toContain(
      "Pandoc が生成する本文",
    );
  });

  it("starts the sample document with a level-1 heading", () => {
    const sampleMarkdownText = fs.readFileSync(
      SAMPLE_MARKDOWN_ABSOLUTE_PATH,
      "utf8",
    );

    expect(sampleMarkdownText).toContain("# はじめに");
    expect(sampleMarkdownText).not.toContain("## はじめに");
  });
});
