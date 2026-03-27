---
title: "Typst テンプレでヘッダを左揃えにした例"
subtitle: "template-header-footer-variant"
author: "Kibo-Press Examples"
date: "2026-03-27"
company: "Examples"
kibo_theme: "business-report-left-header"
kibo_cover: false
toc: true
toc-depth: 3
---

> **目的:** `kibo_theme: business-report-left-header` は、**2 ページ目以降のヘッダ行**を `business-report` の右揃えから **左揃え**に変えたテーマです。フッタは中央のページ番号のままです。編集箇所は [themes/business-report-left-header/pandoc-template.typ](../themes/business-report-left-header/pandoc-template.typ) の `#set page` 内 `header:` ブロックです。
> **PDF で確認:** 2 ページ目以降の右上にあったタイトル行が、左側に出る。

# 比較用セクション

この段落は、レイアウト比較用の例の共通本文です。複数ページにまたがるように、文章を続けてもよいです。

## サブセクション

### さらに深い見出し

目次の深さを確認するための見出しです。
