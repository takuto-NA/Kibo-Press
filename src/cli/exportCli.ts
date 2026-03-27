/**
 * 責務: 拡張なしで Pandoc→Typst→PDF を検証する CLI エントリ
 */

import * as path from "node:path";
import process from "node:process";
import { resolvePreferredExecutablePath } from "../engine/resolvePreferredExecutable";
import { ExportPipelineError } from "../pipeline/ExportPipelineError";
import { runExportPipeline } from "../pipeline/runExportPipeline";

const DEFAULT_FALLBACK_THEME_ID = "business-report";
const PANDOC_EXECUTABLE_FALLBACK_NAME = "pandoc";
const TYPST_EXECUTABLE_FALLBACK_NAME = "typst";

type ParsedCliArgs = {
  inputMarkdownRelativeOrAbsolutePath: string;
  outputPdfRelativeOrAbsolutePath: string;
  repoRootRelativeOrAbsolutePath: string;
  fallbackThemeId: string;
  pandocExecutablePath: string;
  typstExecutablePath: string;
};

async function mainAsync(): Promise<void> {
  const argv = process.argv.slice(2);

  if (argv.includes("--help") || argv.includes("-h")) {
    // ガード: ヘルプ表示は正常終了とする
    // eslint-disable-next-line no-console
    console.log(buildHelpText());
    return;
  }

  const parseResult = parseCliArgs(argv);

  if (!parseResult.ok) {
    // ガード: CLI 引数が不正なときは起動方法を案内する
    // eslint-disable-next-line no-console
    writeLineToStandardError(parseResult.message);
    process.exitCode = 1;
    return;
  }

  const repoRootAbsolutePath = path.resolve(parseResult.value.repoRootRelativeOrAbsolutePath);
  const inputMarkdownAbsolutePath = path.resolve(
    parseResult.value.inputMarkdownRelativeOrAbsolutePath,
  );
  const outputPdfAbsolutePath = path.resolve(
    parseResult.value.outputPdfRelativeOrAbsolutePath,
  );

  await runExportPipeline({
    repoRootAbsolutePath,
    inputMarkdownAbsolutePath,
    outputPdfAbsolutePath,
    fallbackThemeId: parseResult.value.fallbackThemeId,
    pandocExecutablePath: parseResult.value.pandocExecutablePath,
    typstExecutablePath: parseResult.value.typstExecutablePath,
    userLevelDocumentMetadata: {},
    workspaceLevelDocumentMetadata: {},
  });
}

type ParseFailure = {
  ok: false;
  message: string;
};

type ParseSuccess = {
  ok: true;
  value: ParsedCliArgs;
};

function parseCliArgs(argv: string[]): ParseSuccess | ParseFailure {
  const rawArgs = readRawArgs(argv);

  if (rawArgs.inputPath.length === 0) {
    return {
      ok: false,
      message: "Missing --input <path-to-markdown>",
    };
  }

  if (rawArgs.outputPath.length === 0) {
    return {
      ok: false,
      message: "Missing --output <path-to-pdf>",
    };
  }

  const repoRootRelativeOrAbsolutePath =
    rawArgs.repoRoot.length > 0 ? rawArgs.repoRoot : process.cwd();

  const fallbackThemeId =
    rawArgs.themeId.length > 0 ? rawArgs.themeId : DEFAULT_FALLBACK_THEME_ID;

  const pandocExecutablePath = resolvePreferredExecutablePath(
    rawArgs.pandocPath.length > 0 ? rawArgs.pandocPath : undefined,
    PANDOC_EXECUTABLE_FALLBACK_NAME,
  );

  const typstExecutablePath = resolvePreferredExecutablePath(
    rawArgs.typstPath.length > 0 ? rawArgs.typstPath : undefined,
    TYPST_EXECUTABLE_FALLBACK_NAME,
  );

  return {
    ok: true,
    value: {
      inputMarkdownRelativeOrAbsolutePath: rawArgs.inputPath,
      outputPdfRelativeOrAbsolutePath: rawArgs.outputPath,
      repoRootRelativeOrAbsolutePath,
      fallbackThemeId,
      pandocExecutablePath,
      typstExecutablePath,
    },
  };
}

type RawCliArgs = {
  inputPath: string;
  outputPath: string;
  repoRoot: string;
  themeId: string;
  pandocPath: string;
  typstPath: string;
};

function readRawArgs(argv: string[]): RawCliArgs {
  const raw: RawCliArgs = {
    inputPath: "",
    outputPath: "",
    repoRoot: "",
    themeId: "",
    pandocPath: "",
    typstPath: "",
  };

  let index = 0;

  while (index < argv.length) {
    const token = argv[index] ?? "";

    if (token === "--input") {
      raw.inputPath = readNextValueOrEmpty(argv, index);
      index += 2;
      continue;
    }

    if (token === "--output") {
      raw.outputPath = readNextValueOrEmpty(argv, index);
      index += 2;
      continue;
    }

    if (token === "--root") {
      raw.repoRoot = readNextValueOrEmpty(argv, index);
      index += 2;
      continue;
    }

    if (token === "--theme") {
      raw.themeId = readNextValueOrEmpty(argv, index);
      index += 2;
      continue;
    }

    if (token === "--pandoc") {
      raw.pandocPath = readNextValueOrEmpty(argv, index);
      index += 2;
      continue;
    }

    if (token === "--typst") {
      raw.typstPath = readNextValueOrEmpty(argv, index);
      index += 2;
      continue;
    }

    index += 1;
  }

  return raw;
}

function readNextValueOrEmpty(argv: string[], currentIndex: number): string {
  const nextIndex = currentIndex + 1;
  const nextValue = argv[nextIndex];

  if (typeof nextValue !== "string") {
    return "";
  }

  return nextValue;
}

function buildHelpText(): string {
  return [
    "Usage:",
    "  node out/cli/exportCli.js --input <path-to-markdown> --output <path-to-pdf> [--root <repo-root>] [--theme <theme-id>] [--pandoc <path>] [--typst <path>]",
    "",
    "Examples:",
    "  npm run export:sample",
    "  npm run export:examples",
  ].join("\n");
}

void mainAsync().catch((error: unknown) => {
  if (error instanceof ExportPipelineError) {
    writeLineToStandardError(error.message);

    const stderrText = error.commandStderr.trim();

    if (stderrText.length > 0) {
      writeLineToStandardError(stderrText);
    }

    process.exitCode = 1;
    return;
  }

  // ガード: 想定外例外はメッセージを落として終了コードを付与する
  writeLineToStandardError(String(error));
  process.exitCode = 1;
});

function writeLineToStandardError(message: string): void {
  // eslint-disable-next-line no-console
  console.error(message);
}
