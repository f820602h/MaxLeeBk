---
title: 學到新資視了 - Highcharts / 圖例設定
date: 2020/9/20 10:26:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/gOroOjd**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

有時候圖表上的數據列（series）未必只有一組，會使得我們必須協助觀看者分辨每一組數據列所代表的身份或資料內容，以我們員工年齡分佈的案例來說，假如人資想要與其他公司的資料進行比較時，那我們的圖表就必須要加上圖例。

---

## 圖例設定

在有兩組以上數據例的圖表中，會利用不同的顏色或符號來區分不同的數據列，而圖例的功能就是負責說明各個顏色或符號代表的是哪一組數據列。

另外 Highcharts 的圖例有一些基本的特性：
- **圖例的順序與你設定的數據列在陣列裡的索引值有關**
- **圖例是可以點擊的，用途是將對應的數據列進行顯示或隱藏**

```javascript
var myChart = Highcharts.chart(container, {
  legend: {} // 圖例設定
});
```

<br/>

#### # legend.enabled
`型別: Boolean` `預設: undefined`

你可以利用這個屬性將圖例顯示/隱藏，另外要特別注意，假如你已經將 `enabled` 設為 `true` 卻沒顯示圖例，這是因為 `series.showInLegend` 這個屬性在某些圖表類型（例如圓餅圖）中預設是 `false`，必須要同時把這個屬性打開，圖例才會出現。

<br/>

#### # legend.align

`型別: String` `預設: "center"`

決定圖例在圖表中的水平位置，可以輸入 `left`、`center`、`right`。

<br/>

#### # legend.verticalAlign

`型別: String` `預設: "bottom"`

決定圖例在圖表中的垂直位置，可以輸入 `top`、`middle`、`bottom`。

<br/>

#### # legend.layout

`型別: String` `預設: "horizontal"`

前兩個屬性，相信大家已經很熟了，但圖例多了一個 `layout` 屬性來和它們搭配，是用來調整圖例的水平或垂直排列的，如此一來圖例就可以有很多呈現的方式。

可以設定的值有 `"horizontal"` 和 `"vertical"`。

![](/img/content/highcharts-6/layout.png)

<br/>

#### # legend.floating

`型別: Boolean` `預設: false`

這也是昨天在標題就提過的屬性，可以讓圖例浮動在圖表之上。

<br/>

#### # legend.x / legend.y

`型別: Number` `預設: 0`

一樣的，圖例也有 `x` 和 `y` 的屬性讓你調整元素的偏移位置。

<br/>

#### # legend.backgroundColor

`型別: String|Object` `預設: undefined`

背景色的設定方式與 `chart.backgroundColor` 一樣，可以按 **[這裡](/posts/highchart/highcharts-4/#chartbackgroundcolor-chartplotbackgroundcolor)** 複習。

<br/>

#### # legend.border系列

因為 `border` 的相關設定在 **[圖表整體設定](/posts/highchart/highcharts-4/#chartborderWidth-chartplotBorderWidth)** 提過了，所以這邊就只放預設值給大家參考。

```javascript
legend: {
  borderWidth: 0,         // Number
  borderRadius: 0,        // Number
  borderColor: "#999999"  // String
}
```

<br/>

#### # legend.margin
`型別: Number` `預設: 12`

若圖例的垂直位置靠下，那圖例的 `margin` 是調整圖例與 **座標軸** 的間距，垂直對齊靠上則是與 **繪圖區** 的間距。

<br/>

#### # legend.padding
`型別: Number` `預設: 8`

所有圖例會全部包在一個容器裡，你可以調整容器的內間距，這個屬性在有設定背景色或邊框時會比較看得出來。

<br/>

#### # legend.itemDistance
`型別: Number` `預設: 8`

這個屬性只有在 `legend.layout` 是水平配置的情況下才會有效，調整的是個別圖例之間的水平間距。

<br/>

#### # legend.itemMarginTop / legend.itemMarginBottom
`型別: Number` `預設: 0`

這兩個屬性剛好相對於 `itemDistance`，它們調整的是個別圖例之間的垂直間距，不過不管是水平配置或垂直配置下都可以使用。

為了讓大家更好理解，我做了下面這張圖來標出這些跟間距有關的屬性所調整的區塊。

![](/img/content/highcharts-6/gutter.png)

<br/>

#### # legend.itemStyle / legend.itemHoverStyle / legend.itemHiddenStyle
`型別: Object` `預設: 如下顯示`

```javascript
legend: {
  itemStyle: {
    color: "#333333",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "bold",
    textOverflow: "ellipsis"
  },
  itemHoverStyle: {
    color: "#000000"
  },
  itemHiddenStyle: {
    color: "#cccccc"
  }
}
```
圖例本身有 `normal`、`hover`、`hidden` 三種狀態，而這三種狀態下的樣式你都可以作調整，剛好對應的就是這三個屬性，用法和之前介紹的樣式屬性都一樣，如果需要複習的話可以 **[按這邊](/posts/highchart/highcharts-5/#titlestyle)**。

<br/>

#### # legend.symbolWidth / legend.symbolHeight
`型別: Number` `預設: undefined`

你可以透過這兩個屬性調整圖例符號（symbol）的寬高，在沒有設定時會自動去抓 `itemStyle.fontSize` 的大小。

<br/>

#### # legend.squareSymbol
`型別: Boolean` `預設: true`

這個屬性會大大影響圖例符號的寬高設定，它會決定是否要讓符號維持寬高相等，所以如果你需要長方形/橢圓形的符號，記得關閉這個設定。

<br/>

#### # legend.symbolRadius
`型別: Number` `預設: undefined`

這個屬性決定了圖例符號的倒圓角，不設定的話會自動計算為 `symbolHeight` 的一半，這也是為什麼預設會是圓形的原因。

<br/>

#### # legend.symbolPadding
`型別: Number` `預設: 5`

圖例符號與圖例文字之間的間距可以透過這個屬性調整，預設有 `5px` 的距離。

<br/>

#### # legend.labelFormat / legend.labelFormatter

這兩個屬性在「圖例設定」中算是比較重要也比較實用的，它們可以用來調整圖例標籤的「文字格式」，不過它們的使用方式比較複雜度，所以之後會用獨立的章節來特別介紹「格式化屬性」，今天我們就暫時先跳過。

<br/>

經過三天的設定介紹，目前累積屬性也不少，但其實可以發現同樣概念的屬性不斷在重複，所以應該大家應還消化得了吧？那圖例設定的部分就到這裡，而明天要介紹的圖表元素是「提示框」。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10240463) -
