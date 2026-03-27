# Kibo-Press

Markdown を、**報告書・提案書のような整った体裁**の PDF に変換する VS Code 拡張です。変換は **Pandoc** と **Typst** を CLI 経由で利用します。

## 現在の状態

Kibo-Press は **MVP（0.1.x）段階**の拡張です。  
今は **「Markdown を business-report 系の PDF に出力する」** ことに集中しており、GUI で細かく編集する段階ではありません。

### 今できること

- 開いている Markdown を PDF にエクスポート
- `business-report` テーマで整った PDF を出力
- テーマを選んで PDF を出力（同梱テーマの切り替え）
- 最後に生成した PDF を既定アプリで開く（Open Preview）
- front matter の雛形を挿入（Create Document Config）
- 表紙・目次のオンオフを front matter で切り替える
- 余白・フォント・用紙サイズ・行間を front matter / `theme.yaml` で調整する
- より細かいレイアウトを `pandoc-template.typ` の編集で調整する

### まだできないこと

- GUI でのテーマ編集
- ライブプレビュー
- VS Code 設定 `kiboPress.*` から余白・フォント・目次などの文書メタデータを直接注入すること
- 複数 Markdown の結合
- DOCX / HTML 出力
- Typst を意識せずにすべてのレイアウトを設定だけで変えること

### 次に強化したいこと

- 複数テーマ同梱（proposal、manual など）
- 進捗表示の強化
- 画像キャプション、改ページの記法整理
- 必要に応じた簡易プレビュー UI

将来構想としては、ライブプレビュー、テーマエディタ、プロジェクト単位設定、DOCX / HTML 出力、複数 Markdown の結合などを想定しています。詳細は [ロードマップ](docs/roadmap.md) を参照してください。

## 向いている用途

- 提案書、報告書、技術文書を Markdown から PDF にしたい
- VS Code 上で完結して文書を書きたい
- 体裁をある程度そろえた PDF を素早く出したい
- 必要なら Typst テンプレートも触れる

## 向いていない用途

- Word のような GUI 操作だけで細部まで調整したい
- リアルタイムの紙面プレビューを見ながら編集したい
- 複数文書を結合したり、DOCX / HTML にも出したい

## 体裁を変えるには

- **表紙・目次・タイトルなど:** front matter を編集
- **余白・フォント・用紙サイズ・行間:** front matter または `theme.yaml` を編集
- **見出しサイズ・ヘッダ/フッタ・ページ構成・表の装飾:** `pandoc-template.typ` を編集

体裁の調整方法を具体的に知りたい場合は [カスタマイズ](docs/customization.md) を参照してください。

## 必要環境

- **VS Code**（または VS Code 互換）
- **Pandoc** 3.2 以降（`pandoc --version`）
- **Typst** 0.11 以降（`typst --version`）
- 日本語で読みやすい PDF にするには、次の**フォントファミリー名**が OS にインストールされていることが望ましいです。
  - 本文・見出し: *Noto Serif CJK JP*
  - 表・キャプション: *Noto Sans CJK JP*
  - コード: *Noto Sans Mono*

フォントが無い場合でも PDF は生成されますが、別フォントに置き換わり、紙面が想定と異なることがあります。Google の Noto フォント配布や、OS のパッケージマネージャで「Noto CJK」系を導入する方法が一般的です。

## 5分で試す

1. このリポジトリを開き `npm install`
2. `npm run compile`
3. VS Code で **Run Extension**（F5）するか、ビルドした `.vsix` を **Install from VSIX...** で入れる
4. `examples/sample.md` を開き、コマンドパレット（`Ctrl+Shift+P` / `Cmd+Shift+P`）から次のいずれかを実行
   - **Kibo-Press: Export PDF** — 既定テーマで PDF を保存
   - **Kibo-Press: Export PDF with Theme** — テーマを選んで PDF を保存
   - **Kibo-Press: Open Preview** — 直近の PDF を既定アプリで開く
   - **Kibo-Press: Create Document Config** — front matter の雛形を先頭に挿入

「今できること」全体と編集結果の対応は [Examples（ガイド）](examples/README.md) と [生成済み PDF（代表例）](media/examples/) を参照してください。

## コマンド一覧（拡張）

| コマンド | 説明 |
|----------|------|
| Kibo-Press: Export PDF | 既定テーマ（`kiboPress.defaultTheme`）で PDF を出力 |
| Kibo-Press: Export PDF with Theme | 一覧からテーマを選んで PDF を出力 |
| Kibo-Press: Open Preview | 最後にエクスポートした PDF を開く |
| Kibo-Press: Create Document Config | `title` / `kibo_theme` などの front matter 雛形を挿入 |

## CLI での検証（拡張なし）

```bash
npm run export:sample
```

Examples の代表 PDF を一括生成する場合（Pandoc / Typst が PATH に必要）:

```bash
npm run export:examples
```

デモ用の紹介資料 PDF を生成する場合:

```bash
npm run export:demo
```

## テスト

### 通常のテスト（`npm test`）

TypeScript のコンパイル後、**Vitest** で単体・回帰テストを実行します。外部の Pandoc / Typst を必須にはしません。

- マージやテーマ解決、テンプレートの簡易な不変条件などを検証します。

### 結合テスト（Pandoc / Typst が PATH にある環境）

実際に `pandoc` と `typst` を呼び出して PDF を生成するテストは、**環境変数を設定したときだけ**実行されます。

**Command Prompt (cmd):**

```bat
set KIBO_PRESS_RUN_INTEGRATION=1
npm test
```

**PowerShell:**

```powershell
$env:KIBO_PRESS_RUN_INTEGRATION = "1"
npm test
```

結合テストが無効なとき、該当ケースは早期リターンするため、**緑でも Pandoc/Typst 連携がローカルで検証されたとは限りません**。

## 設定（`settings.json`）

| キー | 説明 |
|------|------|
| `kiboPress.defaultTheme` | 既定テーマ ID（`themes/` 配下のディレクトリ名） |
| `kiboPress.defaultOutputDirectory` | 空なら Markdown と同じフォルダ。相対パスはワークスペース基準 |
| `kiboPress.openPdfAfterExport` | `true` ならエクスポート後に PDF を既定アプリで開く |
| `kiboPress.pandocPath` | 空なら PATH の `pandoc` |
| `kiboPress.typstPath` | 空なら PATH の `typst` |

**補足:** 余白やフォントなどの「文書メタデータ」を `kiboPress` から自動注入する機能は MVP では未実装です。詳しくは [アーキテクチャ](docs/architecture.md#4-設定マージ) を参照してください。

## ドキュメント

- [Examples（できることと編集の対応）](examples/README.md)
- [カスタマイズ（体裁・テーマ）](docs/customization.md)
- [要件](docs/spec.md)
- [アーキテクチャ](docs/architecture.md)
- [ロードマップ](docs/roadmap.md)
- [デモ文書（Markdown）](docs/demo.md)
- [デモ PDF](media/kibo-press-demo.pdf)

## パッケージング

```bash
npm run compile
npm run package
```

`package.json` の `package` スクリプトは、ローカルに入っている `@vscode/vsce` の `vsce package` を呼び出します。初見の人は `npm run package` を使うのが安全です。

初回は `npm install` 済みであることが前提です（`vsce` が `dependencies` を VSIX に同梱します）。

## ライセンス

MIT（[LICENSE](LICENSE)）
