# Kibo-Press カスタマイズ

## 責務

利用者が **PDF の体裁をどこで変えるか** を一箇所にまとめたガイドです。実装の優先順位・未実装の範囲は [アーキテクチャの設定マージ](architecture.md#4-設定マージ) に合わせます。

編集の具体例と生成 PDF は [Examples の README](../examples/README.md) にまとめています。

## 設定の優先順位（上書きが強い順）

1. Markdown の **front matter**
2. **ワークスペース**由来のメタデータ（現状は主に「テーマの一時上書き」に使用）
3. **ユーザー**由来のメタデータ（MVP では未注入）
4. 選択中テーマの **`themes/<テーマID>/theme.yaml`** の `defaults`

**MVP の注意:** VS Code の `kiboPress.*` から **余白・フォント・目次** などを直接注入する処理はまだありません。文書単位の調整は **front matter** か **テーマファイルの編集** で行います。

## どこを編集するか（早見）

| やりたいこと | 主に触る場所 |
|--------------|----------------|
| タイトル・著者・日付・表紙・目次の有無 | front matter（Pandoc メタデータ） |
| 既定の余白・フォント・用紙・行間 | `theme.yaml` の `defaults`、または front matter で同名キーを上書き |
| 見出しサイズ・ヘッダー／フッタの装飾・表の罫線色など | `pandoc-template.typ`（Typst） |
| 別の体裁テーマに切り替え | `kibo_theme`（front matter）または VS Code の `kiboPress.defaultTheme` |

## メタデータキー一覧（business-report）

Pandoc に渡るキーは、テーマの `defaults` と front matter がマージされた結果です。よく使うものは次のとおりです。

| キー | 説明 |
|------|------|
| `kibo_theme` | テーマ ID（`themes/` 直下のディレクトリ名）。拡張がテーマを解決した後は Pandoc には渡しません。 |
| `kibo_cover` | `true` で表紙ページを出力してから本文へ。 |
| `toc` | `true` で目次。 |
| `toc-depth` | 目次に含める見出しの深さ。 |
| `papersize` | 用紙サイズ（Typst の `page` の `paper` に渡す文字列。例: `a4`）。 |
| `fontsize` | 本文のフォントサイズ（pt）。 |
| `par_leading_em` | 段落の行間（本文 `leading`、em 単位の数値。例: `0.75`）。 |
| `margin_x_mm` / `margin_y_mm` | 左右・上下の余白（mm）。 |
| `mainfont` / `sansfont` / `codefont` | 本文・サンセリフ・コードのフォントファミリー名。 |
| `lang` | 言語（Typst `text` の `lang`）。 |
| `title` / `subtitle` / `author` / `date` / `company` | 表紙やヘッダで利用。 |

標準の Pandoc / YAML メタデータとして使えるキー（例: `title`）もテンプレートから参照できます。

## ページ構成を変えたい

- **表紙:** front matter で `kibo_cover: true`。タイトル等は `title` / `subtitle` / `author` / `date` / `company` を設定。
- **目次:** `toc: true` と `toc-depth`。不要なら `toc: false`。
- **表紙・目次のあとに本文:** テーマの `pandoc-template.typ` で `#pagebreak()` や `$if(kibo_cover)$` のブロック順を変えると、ページの流れを変更できます。

## 余白を変えたい

- front matter または `theme.yaml` で `margin_x_mm` / `margin_y_mm` を変更。

## フォントを変えたい

- front matter または `theme.yaml` で `mainfont` / `sansfont` / `codefont` を変更。
- OS にそのフォントがインストールされている必要があります。推奨名は README の「必要環境」を参照。未インストール時は Typst が別フォントにフォールバックし、紙面が変わります。

## 行間を変えたい

- front matter または `theme.yaml` で `par_leading_em`（数値、em ベース）を変更。
- さらに細かく変える場合は `pandoc-template.typ` の `#set par(...)` や見出し周りの `#show heading` を編集。

## 用紙サイズを変えたい

- front matter または `theme.yaml` で `papersize` を設定（例: `a4`）。Typst が解釈できる用紙名に合わせてください。

## 新しいテーマを追加する

1. `themes/<新しいID>/` ディレクトリを作成する。
2. `theme.yaml` に `id` / `displayName` / `defaults` を定義する。
3. `pandoc-template.typ` を配置する（既存 `business-report` をコピーして改変してよい）。
4. Markdown の front matter で `kibo_theme: "<新しいID>"` を指定するか、VS Code 設定 `kiboPress.defaultTheme` をその ID にする。

テーマ ID の一覧は、拡張同梱の `themes/` ディレクトリを参照（[`themeDiscoveryService`](../src/services/themeDiscoveryService.ts) が列挙）。

## 関連ドキュメント

- [要件](spec.md)
- [アーキテクチャ](architecture.md)
- [README（拡張の使い方）](../README.md)
