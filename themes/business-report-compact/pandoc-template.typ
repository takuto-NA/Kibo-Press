// 責務: business-report と同一の紙面規則（theme.yaml の defaults のみ差を付ける比較用）

#set page(
  paper: "$papersize$",
  margin: (
    x: $margin_x_mm$mm,
    y: $margin_y_mm$mm,
  ),
  header: context [
    #if counter(page).get().first() > 1 [
      #align(right)[
        #set text(size: 9pt, font: ("$sansfont$",))
        $if(short-title)$[$short-title$]$else$$if(title)$[$title$]$endif$$endif$
      ]
    ]
  ],
  footer: context [
    #align(center)[
      #set text(size: 9pt, font: ("$sansfont$",))
      #counter(page).display()
    ]
  ],
)

#set text(
  font: ("$mainfont$",),
  size: $fontsize$pt,
  lang: "$lang$",
)

#set par(leading: $par_leading_em$em)
#set heading(numbering: "1.1")

#show heading.where(level: 1): it => block(
  above: 1.2em,
  below: 0.6em,
)[
  #set text(size: 16pt, weight: "bold", font: ("$mainfont$",))
  #it
]
#show heading.where(level: 2): it => block(
  above: 1em,
  below: 0.5em,
)[
  #set text(size: 13pt, weight: "bold", font: ("$mainfont$",))
  #it
]
#show heading.where(level: 3): it => block(
  above: 0.8em,
  below: 0.4em,
)[
  #set text(size: 12pt, weight: "bold", font: ("$mainfont$",))
  #it
]

#show table: set text(font: ("$sansfont$",), size: 10pt)
// ガード: Typst 0.14 では table.cell コンテキストに set inset が無いため block で余白を付与する
#show table.cell: it => block(inset: 6pt)[
  #align(horizon, it)
]

#set table(
  stroke: 0.4pt + rgb("#c9d1d9"),
)

#show raw.where(block: true): it => block(
  width: 100%,
  inset: 10pt,
  fill: rgb("#f6f8fa"),
  stroke: 0.5pt + rgb("#d0d7de"),
  radius: 4pt,
  breakable: false,
)[
  #set text(font: ("$codefont$",), size: 9.5pt)
  #it
]

#show figure.caption: it => [
  #set text(size: 9.5pt, font: ("$sansfont$",))
  #it
]

$if(kibo_cover)$
#align(center + horizon)[
  #block(spacing: 2em)[
    #set text(size: 24pt, weight: "bold", font: ("$mainfont$",))
    $if(title)$[$title$]$endif$
  ]
  $if(subtitle)$#block[
    #set text(size: 14pt, font: ("$sansfont$",))
    [$subtitle$]
  ]$endif$
  #v(1.5em)
  $if(company)$#block[
    #set text(size: 11pt, font: ("$sansfont$",))
    [$company$]
  ]$endif$
  #v(2em)
  $if(author)$
    #set text(size: 11pt, font: ("$sansfont$",))
    $for(author)$[$author$]$sep$、$endfor$
  $endif$
  #v(0.6em)
  $if(date)$#block[
    #set text(size: 10pt, font: ("$sansfont$",))
    [$date$]
  ]$endif$
]
#pagebreak()
$endif$

$if(toc)$
#outline(
  title: [目次],
  depth: $toc-depth$,
)
#pagebreak()
$endif$

$body$
