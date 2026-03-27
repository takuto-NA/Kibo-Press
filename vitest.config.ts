/**
 * 責務: Vitest の設定（ユニットテストと任意の結合テスト）
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
