# Kibo-Press アーキテクチャ

## 1. 責務分離

| レイヤー | 責務 |
|----------|------|
| VS Code 拡張（`src/extension.ts`、commands、services） | エディタ連携、出力先提案、通知、最後の PDF パス保持、`kiboPress.*` の読み取り |
| パイプライン（`src/pipeline/*`） | front matter とテーマ既定のマージ、Pandoc / Typst の引数組み立て、中間 `.typ` の生成、成果物パス制御 |
| エンジン（`src/engine/*`） | 外部プロセス実行の共通処理（`runExecutable`、実行ファイルの存在確認・パス解決の補助） |
| サービス（`src/services/engineService.ts` など） | VS Code 設定に基づく `pandoc` / `typst` 実行パスの解決 |
| CLI（`src/cli/exportCli.ts` → `npm run export:sample` 等） | 拡張なしでの結合テスト・手動検証用エントリ |
| テーマ（`themes/<id>/`） | `theme.yaml` 既定、`pandoc-template.typ`、補助 `.typ` |

**補足:** サブプロセスの起動そのものは `src/engine/runExecutable.ts` に集約し、パイプラインは「いつ・何を渡すか」を担当する。

## 2. データフロー

```mermaid
flowchart LR
  md[Markdown_file]
  pandoc[Pandoc_typst]
  typ[Typst_compile]
  pdf[PDF]
  md --> pandoc --> typ --> pdf
```

1. マージ済みドキュメント設定と `theme.yaml` から Pandoc 用メタデータを構築  
2. `pandoc -f markdown -t typst -s --template=... -o intermediate.typ`  
3. `typst compile intermediate.typ output.pdf`（`--root` はリポジトリルート推奨）

## 3. 外部ツール前提

| ツール | 推奨 | メモ |
|--------|------|------|
| Pandoc | 3.2 以降（`typst` writer 利用） | `pandoc --version` で確認 |
| Typst | 0.11 以降 | `typst --version` で確認 |

**未満の場合:** 拡張・CLI はエラーメッセージとインストール案内を表示する。

## 4. 設定マージ

`mergeLayeredDocumentMetadata`（[`src/pipeline/mergeLayeredDocumentMetadata.ts`](../src/pipeline/mergeLayeredDocumentMetadata.ts)）の**上書き優先順位**は次のとおりです。

**優先順位（高い順）:** front matter → workspace 由来のメタデータ → user 由来のメタデータ → `theme.yaml` の `defaults`

**MVP での実装状況:**

- **front matter** と **`theme.yaml`** はマージに反映される。
- **workspace / user からドキュメントメタデータ（余白・フォント等）を注入する処理**は未実装であり、[`src/services/configService.ts`](../src/services/configService.ts) の `buildWorkspaceLevelDocumentMetadata` / `buildUserLevelDocumentMetadata` は空オブジェクトを返す（将来拡張用の入口）。
- **Export PDF with Theme** 実行時は、テーマ ID の上書きのみ `workspaceLevelDocumentMetadata` 経由で渡される（[`src/services/exportService.ts`](../src/services/exportService.ts)）。

利用者向けの「どこを編集すればよいか」は [カスタマイズ](customization.md) を正とする。

## 5. 日本語フォント

既定のフォントファミリー名（Typst / OS にインストールされていること）:

- `Noto Serif CJK JP`
- `Noto Sans CJK JP`
- `Noto Sans Mono`

**未インストール時:** Typst は別フォントにフォールバックし版面が変わる。導入の考え方は [README の必要環境](../README.md) および [カスタマイズのフォント](customization.md#フォントを変えたい) を参照する。

## 6. PDF の回帰検証（自動テスト）

バイト列一致は取らない。次を検証する:

- PDF が生成される
- ページ数・抽出テキスト・主要キーワードが閾値を満たす

**通常の `npm test`:** Pandoc / Typst を使わない単体・回帰テストが主。結合テストは環境変数で有効化する（[README](../README.md#テスト)）。

## 7. 主要エラーコード（論理）

| 状況 | 利用者向けメッセージの方向性 |
|------|------------------------------|
| `pandoc` が PATH にない | インストールと PATH 設定 |
| `typst` が PATH にない | 同上 |
| Pandoc 終了コード非 0 | stderr 先頭行を Output に |
| Typst 終了コード非 0 | 同上 |
| front matter 不正 | 該当行付近を案内 |

## 8. 拡張状態

- **最後に生成した PDF の絶対パス**を `workspaceState` に保存（`Open Preview` 用）
