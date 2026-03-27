# Kibo-Press Examples

## 責務

[README の「今できること」](../README.md#現在の状態) を、**操作例・設定例・生成結果（PDF）** に対応付けた学習用の入口です。プロモ用の長文デモは [docs/demo.md](../docs/demo.md) と [デモ PDF](../media/kibo-press-demo.pdf) を参照してください。

## クイックスタート（VS Code）

1. リポジトリを開き `npm install` → `npm run compile`
2. **Run Extension**（F5）で拡張を起動するか、ビルドした VSIX をインストールする
3. 次のいずれかの Markdown を開き、コマンドパレットからコマンドを実行する

| やりたいこと | コマンド | 例で試すファイル |
|--------------|----------|------------------|
| PDF を出力する | **Kibo-Press: Export PDF** | [sample.md](sample.md) |
| テーマを選んで PDF を出力する | **Kibo-Press: Export PDF with Theme** | [theme-compare-compact.md](theme-compare-compact.md)（`business-report-compact`） |
| 直近の PDF を開く | **Kibo-Press: Open Preview** | いずれかの PDF を一度エクスポートした直後 |
| front matter 雛形を挿入する | **Kibo-Press: Create Document Config** | [document-config-before.md](document-config-before.md) |

**Open Preview の注意:** 対象は「最後にエクスポートした PDF」です。先に **Export PDF** などで PDF を生成してください。

## クイックスタート（CLI・拡張なし）

リポジトリルートで:

```bash
npm run compile
npm run export:examples
```

単一ファイルだけ試す場合:

```bash
node out/cli/exportCli.js --input examples/margin-narrow.md --output out/margin-narrow.pdf
```

## README「今できること」と Examples の対応

| README の項目 | 触るもの | このディレクトリの例 | 生成結果（PDF） |
|---------------|----------|----------------------|-----------------|
| 開いている Markdown を PDF にエクスポート | コマンド | [sample.md](sample.md) | [sample.pdf](../media/examples/sample.pdf) |
| `business-report` テーマで整った PDF | `kibo_theme` / 既定テーマ | [sample.md](sample.md) | [sample.pdf](../media/examples/sample.pdf) |
| テーマを選んで PDF を出力 | `kibo_theme` または Export with Theme | [theme-compare-compact.md](theme-compare-compact.md)、各 `template-*.md` | [theme-compare-compact.pdf](../media/examples/theme-compare-compact.pdf) など |
| 最後の PDF を開く（Open Preview） | コマンド（操作のみ） | 上記のあと Open Preview | （ファイルなし・操作確認） |
| front matter 雛形を挿入 | Create Document Config | [document-config-template.md](document-config-template.md)、[document-config-before.md](document-config-before.md)、[document-config-after.md](document-config-after.md) | （挿入内容の確認用） |
| 表紙・目次のオンオフ | front matter | [cover-on-toc-on.md](cover-on-toc-on.md)、[cover-off-toc-off.md](cover-off-toc-off.md)、[toc-depth-1.md](toc-depth-1.md) | [cover-on-toc-on.pdf](../media/examples/cover-on-toc-on.pdf) など |
| 余白・フォント・用紙・行間 | front matter / `theme.yaml` | [margin-narrow.md](margin-narrow.md) / [margin-wide.md](margin-wide.md)、[leading-tight.md](leading-tight.md) / [leading-loose.md](leading-loose.md)、[fontsize-small.md](fontsize-small.md) / [fontsize-large.md](fontsize-large.md)、[papersize-alt.md](papersize-alt.md)、[font-family-compare.md](font-family-compare.md) | `media/examples` 内の同名 PDF |
| 細かいレイアウト（Typst） | `pandoc-template.typ` | [template-large-headings.md](template-large-headings.md)、[template-header-footer-variant.md](template-header-footer-variant.md) | [template-large-headings.pdf](../media/examples/template-large-headings.pdf) など |

## 同梱テーマ一覧（`themes/`）

| テーマ ID | 用途 |
|-----------|------|
| `business-report` | 既定。ビジネスレポート体裁 |
| `business-report-compact` | 既定より余白・文字サイズ・行間を詰めた比較用（テンプレは business-report と同一） |
| `business-report-large-headings` | 見出しサイズだけ大きい比較用 |
| `business-report-left-header` | 2 ページ目以降のヘッダを左揃えにした比較用 |

## `pandoc-template.typ` のどこを触ると何が変わるか（business-report 系）

| 見え方 | Typst の場所（目安） |
|--------|----------------------|
| 用紙・余白・ヘッダ／フッタ | `#set page(` 〜 `)` |
| 本文フォントサイズ・言語 | `#set text(` |
| 段落の行間 | `#set par(leading: ...)` |
| 見出しの大きさ | `#show heading.where(level: N)` |
| 表紙・目次の有無と順序 | `$if(kibo_cover)$` / `$if(toc)$` と `#outline` |
| 表の字体 | `#show table:` |
| コードブロックの枠 | `#show raw.where(block: true)` |

詳細は [docs/customization.md](../docs/customization.md) を参照してください。

## 既定値の基準

`business-report` の既定メタデータは [themes/business-report/theme.yaml](../themes/business-report/theme.yaml) です。各例の front matterでは、この値から **何を変えたか** を本文の「この例の目的」に書いています。

## Create Document Config と同期

[document-config-template.md](document-config-template.md) の先頭ブロックは、[createDocumentConfigCommand.ts](../src/commands/createDocumentConfigCommand.ts) が挿入する内容と一致させています。どちらかを変えたら、もう一方も同じ内容に更新してください。
