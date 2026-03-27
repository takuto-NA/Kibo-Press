# Kibo-Press

Markdown を、**報告書・提案書のような整った体裁**の PDF に変換する VS Code 拡張です。変換は **Pandoc** と **Typst** を CLI 経由で利用します。

## 必要環境

- **VS Code**（または VS Code 互換）
- **Pandoc** 3.2 以降（`pandoc --version`）
- **Typst** 0.11 以降（`typst --version`）
- 日本語推奨フォント（紙面品質のため）
  - 本文・見出し: *Noto Serif CJK JP*
  - 表・キャプション: *Noto Sans CJK JP*
  - コード: *Noto Sans Mono*

## クイックスタート

1. このリポジトリを開き `npm install`
2. `npm run compile`
3. VS Code で **Run Extension**（F5）するか、生成した `.vsix` を **Install from VSIX...** で入れる
4. `examples/sample.md` を開き、コマンドパレットから **Kibo-Press: Export PDF** を実行

## CLI での検証（拡張なし）

```bash
npm run export:sample
```

デモ用の紹介資料 PDF を生成する場合:

```bash
npm run export:demo
```

結合テスト（Pandoc / Typst が入っているマシン向け）:

```bash
set KIBO_PRESS_RUN_INTEGRATION=1
npm test
```

## 設定（`settings.json`）

| キー | 説明 |
|------|------|
| `kiboPress.defaultTheme` | 既定テーマ ID（`themes/` 配下のディレクトリ名） |
| `kiboPress.defaultOutputDirectory` | 空なら Markdown と同じフォルダ。相対パスはワークスペース基準 |
| `kiboPress.openPdfAfterExport` | `true` ならエクスポート後に PDF を既定アプリで開く |
| `kiboPress.pandocPath` | 空なら PATH の `pandoc` |
| `kiboPress.typstPath` | 空なら PATH の `typst` |

## ドキュメント

- [要件](docs/spec.md)
- [アーキテクチャ](docs/architecture.md)
- [ロードマップ](docs/roadmap.md)
- [デモ文書（Markdown）](docs/demo.md)
- [デモ PDF](media/kibo-press-demo.pdf)

## パッケージング

```bash
npm run compile
npx vsce package
```

初回は `npm install` 済みであることが前提です（`vsce` が `dependencies` を VSIX に同梱します）。

## ライセンス

MIT（[LICENSE](LICENSE)）
