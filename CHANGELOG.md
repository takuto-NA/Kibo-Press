# Changelog

## 0.1.0

- 初版（MVP）
- Markdown → Pandoc → Typst → PDF パイプライン
- コマンド: Export PDF、Export PDF with Theme、Open Preview、Create Document Config
- テーマ: `business-report`、比較用 `business-report-compact`、`business-report-large-headings`、`business-report-left-header`
- Examples: [examples/README.md](examples/README.md)、代表 PDF は `media/examples/`、`npm run export:examples` で再生成
- 設定: `kiboPress.defaultTheme`、`kiboPress.defaultOutputDirectory`、`kiboPress.openPdfAfterExport`、実行ファイルパス
