/**
 * 責務: examples 配下の代表 Markdown を一括で PDF にし、media/examples に保存する
 */

"use strict";

const path = require("node:path");
const { execFileSync } = require("node:child_process");

const REPOSITORY_ROOT_ABSOLUTE_PATH = path.resolve(__dirname, "..");
const EXPORT_CLI_ABSOLUTE_PATH = path.join(
  REPOSITORY_ROOT_ABSOLUTE_PATH,
  "out",
  "cli",
  "exportCli.js",
);

const EXPORT_JOBS = [
  { inputRelativePath: "examples/sample.md", outputRelativePath: "media/examples/sample.pdf" },
  { inputRelativePath: "examples/cover-on-toc-on.md", outputRelativePath: "media/examples/cover-on-toc-on.pdf" },
  { inputRelativePath: "examples/cover-off-toc-off.md", outputRelativePath: "media/examples/cover-off-toc-off.pdf" },
  { inputRelativePath: "examples/toc-depth-1.md", outputRelativePath: "media/examples/toc-depth-1.pdf" },
  { inputRelativePath: "examples/margin-narrow.md", outputRelativePath: "media/examples/margin-narrow.pdf" },
  { inputRelativePath: "examples/margin-wide.md", outputRelativePath: "media/examples/margin-wide.pdf" },
  { inputRelativePath: "examples/leading-tight.md", outputRelativePath: "media/examples/leading-tight.pdf" },
  { inputRelativePath: "examples/leading-loose.md", outputRelativePath: "media/examples/leading-loose.pdf" },
  { inputRelativePath: "examples/fontsize-small.md", outputRelativePath: "media/examples/fontsize-small.pdf" },
  { inputRelativePath: "examples/fontsize-large.md", outputRelativePath: "media/examples/fontsize-large.pdf" },
  { inputRelativePath: "examples/papersize-alt.md", outputRelativePath: "media/examples/papersize-alt.pdf" },
  { inputRelativePath: "examples/font-family-compare.md", outputRelativePath: "media/examples/font-family-compare.pdf" },
  { inputRelativePath: "examples/theme-compare-compact.md", outputRelativePath: "media/examples/theme-compare-compact.pdf" },
  { inputRelativePath: "examples/template-large-headings.md", outputRelativePath: "media/examples/template-large-headings.pdf" },
  { inputRelativePath: "examples/template-header-footer-variant.md", outputRelativePath: "media/examples/template-header-footer-variant.pdf" },
];

function runExportJobs() {
  for (const job of EXPORT_JOBS) {
    const inputAbsolutePath = path.join(REPOSITORY_ROOT_ABSOLUTE_PATH, job.inputRelativePath);
    const outputAbsolutePath = path.join(REPOSITORY_ROOT_ABSOLUTE_PATH, job.outputRelativePath);

    execFileSync(
      process.execPath,
      [EXPORT_CLI_ABSOLUTE_PATH, "--input", inputAbsolutePath, "--output", outputAbsolutePath],
      {
        stdio: "inherit",
        cwd: REPOSITORY_ROOT_ABSOLUTE_PATH,
      },
    );
  }
}

runExportJobs();
