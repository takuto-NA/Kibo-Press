---
title: "Kibo-Press Demo"
subtitle: "Markdown を提出品質の PDF に変換する VS Code 拡張"
author: "Kibo-Press"
date: "2026-03-25"
company: "Kibo-Press Project"
kibo_theme: "business-report"
kibo_cover: true
toc: true
---

# 概要

Kibo-Press は、Markdown を **報告書・提案書・技術文書のような整った見た目の PDF** に変換する VS Code 拡張です。  
Markdown の軽快さを保ちながら、提出や共有に使える紙面品質を目指しています。

## 価値

- 書き方は Markdown のままでよい
- 出力は文書として読みやすい PDF に寄せられる
- VS Code からコマンドで完結できる

# 解決したい課題

一般的な Markdown → PDF 変換では、次の点が不足しがちです。

- 余白や行間が詰まり、文書らしい落ち着きが出にくい
- 見出し、表、画像、コードブロックの見た目が揃いにくい
- 社内配布や提出にそのまま使いにくい
- 開発者が Word に持ち替えないと整った体裁にしづらい

Kibo-Press はこれを補い、Markdown を「下書き」ではなく「完成文書」へ近づけます。

# 変換パイプライン

Kibo-Press の基本構成は次のとおりです。

1. Markdown を読む
2. Pandoc で Typst 向けの中間表現へ変換する
3. Typst で PDF を組版する

```text
Markdown -> Pandoc -> Typst -> PDF
```

この構成により、Markdown の構造解釈と PDF の組版品質を両立できます。

# 利用イメージ

## VS Code コマンド

| コマンド | 役割 |
|----------|------|
| `Kibo-Press: Export PDF` | 現在の Markdown を PDF に出力 |
| `Kibo-Press: Export PDF with Theme` | テーマを選んで PDF に出力 |
| `Kibo-Press: Open Preview` | 最後に出力した PDF を既定ビューアで開く |
| `Kibo-Press: Create Document Config` | front matter 雛形を挿入 |

## 使い方の流れ

1. Markdown を開く
2. 必要なら front matter を追加する
3. `Export PDF` を実行する
4. PDF を既定ビューアで確認する

# front matter の例

```yaml
---
title: "月次報告書"
subtitle: "2026年3月"
author: "開発チーム"
date: "2026-03-25"
company: "Kibo Inc."
kibo_theme: "business-report"
kibo_cover: true
toc: true
---
```

この front matter により、表紙・目次・タイトル情報・テーマを文書単位で切り替えられます。

# 設定の考え方

設定責務は次の 3 系統に分けています。

| ソース | 用途 |
|--------|------|
| Markdown front matter | 文書単位の設定 |
| VS Code `kiboPress.*` | ワークスペース / ユーザー既定 |
| `themes/<theme>/theme.yaml` | テーマの既定値 |

優先順位は次の順です。

1. front matter
2. ワークスペース設定
3. ユーザー設定
4. テーマ既定値

# 紙面品質の方針

`business-report` テーマでは、少なくとも次の要素を整えます。

- A4 前提の余白
- 見出し階層のメリハリ
- 表の読みやすさ
- コードブロックの視認性
- 表紙、目次、ヘッダ、フッタ、ページ番号

日本語フォントの推奨セットは次です。

- 本文・見出し: `Noto Serif CJK JP`
- 表・キャプション・補助情報: `Noto Sans CJK JP`
- コード: `Noto Sans Mono`

# 開発者向けセットアップ

## 必要ツール

- VS Code
- Pandoc
- Typst
- Node.js / npm

## 主要コマンド

```bash
npm install
npm run compile
npm test
npm run export:sample
```

# このデモで見せたいこと

この文書自体が Kibo-Press で生成される PDF 見本です。  
つまり、README の説明を読むだけでなく、**実際にどの程度「文書らしい見た目」になるか**をそのまま確認できます。

## 確認ポイント

- 表紙が先頭に来ること
- 目次が自動で入ること
- 見出し番号が自然であること
- 表とコードが崩れないこと
- そのまま共有できる紙面になっていること
