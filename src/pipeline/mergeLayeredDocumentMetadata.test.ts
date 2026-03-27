/**
 * 責務: ドキュメントメタデータのマージ規則を検証する
 */

import { describe, expect, it } from "vitest";
import { mergeLayeredDocumentMetadata } from "./mergeLayeredDocumentMetadata";

describe("mergeLayeredDocumentMetadata", () => {
  it("front matter が最優先で上書きする", () => {
    const themeDefaults = { toc: true, fontsize: 10 };
    const userLevelOverrides = { fontsize: 11 };
    const workspaceLevelOverrides = { fontsize: 12 };
    const frontMatter = { fontsize: 13 };

    const merged = mergeLayeredDocumentMetadata(
      themeDefaults,
      userLevelOverrides,
      workspaceLevelOverrides,
      frontMatter,
    );

    expect(merged.toc).toBe(true);
    expect(merged.fontsize).toBe(13);
  });
});
