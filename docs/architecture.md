# Kibo-Press アーキテクチャ

## 1. 責務分離

| レイヤー | 責務 |
|----------|------|
| VS Code 拡張（`src/extension.ts`、commands、services） | エディタ連携、設定マージ入力、通知、最後の PDF パス保持 |
| パイプライン（`src/pipeline/*`） | Pandoc / Typst の引数組み立て、プロセス実行、ログ整形 |
| CLI（`scripts/export-cli.ts`） | 拡張なしでの結合テスト・手動検証用エントリ |
| テーマ（`themes/<id>/`） | `theme.yaml` 既定、`pandoc-template.typ`、補助 `.typ` |

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

優先順位: **front matter → workspace `kiboPress` → user `kiboPress` → `theme.yaml`**

拡張は VS Code API で workspace/user を読み、Markdown 本文から front matter をパースし、テーマファイルを読み込んでマージする。

## 5. 日本語フォント

既定のフォントファミリー名（Typst / OS にインストールされていること）:

- `Noto Serif CJK JP`
- `Noto Sans CJK JP`
- `Noto Sans Mono`

**未インストール時:** Typst は別フォントにフォールバックし版面が変わる。README に Google Noto / OS パッケージでの導入手順を記載する。

## 6. PDF の回帰検証（自動テスト）

バイト列一致は取らない。次を検証する:

- PDF が生成される
- ページ数・抽出テキスト・主要キーワードが閾値を満たす

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
