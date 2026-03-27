---
title: "フォント指定を入れ替えた例"
subtitle: "font-family-compare"
author: "Kibo-Press Examples"
date: "2026-03-27"
company: "Examples"
kibo_theme: "business-report"
kibo_cover: false
toc: false
mainfont: "Noto Sans CJK JP"
sansfont: "Noto Serif CJK JP"
codefont: "Noto Sans Mono"
---

> **目的:** 既定では本文がセリフ（`mainfont`）、表がサンセリフ（`sansfont`）ですが、**両者を入れ替えた**ときの見え方の例です。フォントが OS に無い場合は Typst が別ファミリーに置き換えるため、**同じマシンで**既定テーマの PDF と比較してください。
> **PDF で確認:** 本文の字体がサンセリフ寄りに見える。表まわりの字体がセリフ寄りに見える。

# 比較用セクション

この段落は、レイアウト比較用の例の共通本文です。

## サブセクション

| 列A | 列B |
|-----|-----|
| 表は sansfont | 確認用 |

### さらに深い見出し

目次の深さを確認するための見出しです。
