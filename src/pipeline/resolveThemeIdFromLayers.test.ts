/**
 * 責務: テーマ ID 解決規則を検証する
 */

import { describe, expect, it } from "vitest";
import { DOCUMENT_THEME_ID_METADATA_KEY } from "../constants/metadataKeys";
import { resolveThemeIdFromLayers } from "./resolveThemeIdFromLayers";

describe("resolveThemeIdFromLayers", () => {
  it("front matter の kibo_theme を最優先する", () => {
    const resolved = resolveThemeIdFromLayers(
      {},
      { [DOCUMENT_THEME_ID_METADATA_KEY]: "from-workspace" },
      { [DOCUMENT_THEME_ID_METADATA_KEY]: "from-front-matter" },
      "business-report",
    );

    expect(resolved).toBe("from-front-matter");
  });

  it("front matter が無ければワークスペース由来を使う", () => {
    const resolved = resolveThemeIdFromLayers(
      {},
      { [DOCUMENT_THEME_ID_METADATA_KEY]: "from-workspace" },
      {},
      "business-report",
    );

    expect(resolved).toBe("from-workspace");
  });

  it("どこにも無ければ fallback を使う", () => {
    const resolved = resolveThemeIdFromLayers({}, {}, {}, "business-report");

    expect(resolved).toBe("business-report");
  });
});
