---
title: 學到新資視了 - Highcharts / 座標軸設定 - 外觀樣式
date: 2020/9/22 13:15:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/abNqLjX**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

雖然有部分圖表類型（如圓餅圖、文字雲）並不會用到座標軸，但大多數常見的圖表都是需要座標軸來輔助的，座標軸提供的是一個絕對值尺標，讓觀看者可以得到確切的資料數值，而非只是觀察資料間的相對關係。

由於座標軸的屬性較多，將會以屬性性質的不同分為「外觀樣式」與「座標刻度」兩篇文章來介紹。

---

## 座標軸設定 - 外觀樣式相關

本次系列我們只會提到平面圖表，所以最多只會有Ｘ座標軸和Ｙ座標軸，而座標軸中又由刻度、標籤、隔線等等...元素所組成，在 Highcharts 中你都可以為這些元素做樣式的微調。

![](/img/content/highcharts-8/axis.png)

**特別注意，座標軸的設定其實是傳入陣列，因為圖表是可以有多Ｘ軸或多Ｙ軸的，但如果確定只有單個的話，你可以省略陣列的中括號。**

```javascript
var myChart = Highcharts.chart(container, {
  xAxis: [{}], // Ｘ座標軸設定
  yAxis: [{}]  // Ｙ座標軸設定
});
```

<br/>

> 以下以 Axis 同時表示 xAxis 及 yAxis

<br/>

### # Axis.title

座標軸標題與圖表標題的設定非常相像，這邊就不多花篇幅介紹，有興趣可以看看 **[官方文件](https://api.highcharts.com/highcharts/xAxis.title)**。

需要注意的是Ｘ軸預設是沒有標題的，但Ｙ軸會有一個預設的 `"Values"` 標題。

<br/>

### # Axis.minorTicks
`型別: Boolean` `預設: false`

你可以決定是否要顯示座標軸中的副刻度及副格線，另外要注意「類別座標軸」是無法開啟此屬性的。
<p style="font-size:12px; line-height:1.5;">注：類別座標即以「類別」作為座標刻度，在下篇文章中會介紹。</p>

<br/>

### # Axis.tickWidth / Axis.minorTickWidth
`型別: Number` `預設: 請見表格`

這兩個屬性分別是調整主刻度／副刻度的粗細，單位為 `px`，設為 `0` 的話則會隱藏。

座標軸|tickWidth|minorTickWidth|
:-:|:-:|:-:|
Ｘ軸|預設值：1|預設值：0|
Ｙ軸|預設值：0|預設值：0|
類別座標軸|預設值：0|無|

<br/>

### # Axis.tickLength / Axis.minorTickLength
`型別: Number` `預設: 10 / 2`

除了粗細之外，主刻度／副刻度的長度也可以調整，單位為 `px`，設為 `0` 的話則會隱藏。

<br/>

### # Axis.tickColor / Axis.minorTickColor
`型別: String` `預設: "ccd6eb" / "#999999"`

顏色的部分也是可以主刻度／副刻度個別調整，先前提過的顏色格式都是適用的。

<br/>

### # Axis.tickPosition / Axis.minorTickPosition
`型別: String` `預設: "outside"`

這兩個屬性是調整主刻度／副刻度要在軸線以內或以外，但並不包括刻度標籤，可接受的值有 `outside`、`inside`。

![](/img/content/highcharts-8/tickPosition.png)

<br/>

### # Axis.tickmarkPlacement
`型別: String` `預設: "between"`

這個屬性是專屬於「類別座標軸」的，與「線性座標軸」不同的是，它的刻度標籤並不會與主刻度對齊，而是夾在兩個刻度之間，因此你可以透過這個屬性來調整，可接受的值有 `between`、`on`。

![](/img/content/highcharts-8/tickmarkPlacement.png)

<br/>

### # Axis.lineWidth / Axis.gridLineWidth / Axis.minorGridLineWidth
`型別: Number` `預設: 請見表格`

這三屬性分別是調整軸線／主格線／副格線的粗細，單位為 `px`，設為 `0` 的話則會隱藏。

座標軸|lineWidth|gridLineWidth|minorGridLineWidth|
:-:|:-:|:-:|:-:|
Ｘ軸|預設值：1|預設值：0|預設值：0|
Ｙ軸|預設值：0|預設值：1|預設值：0|

<br/>

### # Axis.lineColor / Axis.gridLineColor / Axis.minorGridLineColor
`型別: String` `預設: "ccd6eb" / "#e6e6e6" / "#f2f2f2"`

軸線／主格線／副格線的線條顏色也可以透過這三個屬性做個別設定，先前提過的顏色格式都是適用的。

<br/>

### # Axis.gridLineDashStyle / Axis.minorGridLineDashStyle
`型別: String` `預設: "Solid"`

主格線和副格線的線條樣式是能夠調整的，除了實線外，有各種類的虛線可以選擇。想看所有類型的話可以看這個**[官方範例](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/)**。


---


## Axis.labels 刻度標籤

座標軸的刻度標籤設定也是一包不小的物件，所以我們往裡面深入一個層級來看看刻度標籤中又有哪些屬性。

```javascript
var myChart = Highcharts.chart(container, {
  xAxis: [{
    labels: {} // Ｘ軸刻度標籤設定
  }],
  yAxis: [{
    labels: {} // Ｙ軸刻度標籤設定
  }]
});
```

<br/>

### # xAxis.labels.style
`型別: Object` `預設: { color: "#666666", fontSize: "11px" }`

樣式屬性在前面已經介紹過蠻多次了，如果需要複習的話可以 **[按這邊](/posts/highchart/highcharts-5/#titlestyle)**，這裡就不再多做介紹。

<br/>

### # Axis.labels.align
`型別: String` `預設: 見清單`

這次跟前面的「水平位置」就不一樣了，這次代表的就真的是「文字對齊」了，一樣有 `left`、`center`、`right`可以設定。
- Ｘ座標軸預設值：`center`
- Ｙ座標軸預設值：`right`

<br/>

### # Axis.labels.reserveSpace
`型別: Boolean` `預設: undefined`

決定是否要為刻度標籤保留空間，一般來說它會是啟動的，但下面兩個狀況會取消，所以記得要特別設定，不然標籤會跟標題擠在一起或超出畫布。
1. `labels.align` 設定為 `right` 的右側Ｙ軸。
2. `labels.align` 設定為 `left` 的左側Ｙ軸。

<br/>

### # Axis.labels.x / Axis.labels.y
`型別: Number` `預設: 見清單`

調整刻度標籤的偏移量，用法在之前都有介紹過，單位為`px`。
- Ｘ座標軸預設值：`x: 0` `y: 0`
- Ｙ座標軸預設值：`x: -8` `y: 3`

<br/>

### # Axis.labels.rotation
`型別: Number` `預設: 0`

你可以設定刻度標籤的旋轉角度，這在刻度較多或圖表較窄的時候非常實用。

<br/>

### # Axis.labels.autoRotation
`型別: Array[Number]` `預設: [-45]`

如果你希望標籤的旋轉角度可以是漸進式的，那你可以提供這個屬性一組度數的陣列，Highcharts 會自動在陣列中找一個最合適的角度來設定，很適合用在「自適應」的區塊。

<br/>

### # Axis.labels.format / Axis.labels.formatter

我們前面在圖例和提示框都有看到「格式化屬性」，而座標軸的刻度標籤也能夠自訂文字格式，不過我們一樣等到之後獨立章節再來詳細介紹吧，今天先跳過。

---

## Axis.plotLines 標註線

標註線主要是用來特別標註某個特殊的值，例如在業績統計表中標註目標，或收支圖中標註預算等等，文章中我們只介紹重點屬性，其餘請見 **[官方文件](https://api.highcharts.com/highcharts/xAxis.plotLines)**。

```javascript
var myChart = Highcharts.chart(container, {
  xAxis: [{
    plotLines: [{}] // Ｘ軸標註線設定
  }],
  yAxis: [{
    plotLines: [{}] // Ｙ軸標註線設定
  }]
});
```

<br/>

### # Axis.plotLines.value
`型別: Number` `預設: undefined`

標註線中最重要的屬性，也就是你要標示在哪個數值刻度上。

<br/>

### # Axis.plotLines.color
`型別: String` `預設: "#999999`

標註線的線條顏色，前面提過的顏色格式都適用。

<br/>

### # Axis.plotLines.width
`型別: Number` `預設: "2`

標註線的粗細，單位為 `px`，設為 `0` 則會消失。

---

## Axis.plotBands 標註帶

標註帶用途與標註線相，不過由單一數據變為數據區間，例如可以在有時間座標的圖表中標註某段特殊時間，文章中我們只介紹重點屬性，其餘請見 **[官方文件](https://api.highcharts.com/highcharts/xAxis.plotBands)**。

```javascript
var myChart = Highcharts.chart(container, {
  xAxis: [{
    plotBands: [{}] // Ｘ軸標註帶設定
  }],
  yAxis: [{
    plotBands: [{}] // Ｙ軸標註帶設定
  }]
});
```

<br/>

### # Axis.plotLines.from / # Axis.plotLines.to
`型別: Number` `預設: undefined`

標註帶中最重要的兩個屬性，用來設定數值範圍的起點與終點，兩點間距將產生標註帶。

<br/>

### # Axis.plotLines.color
`型別: String` `預設: "#e6ebf5`

標註帶的區塊顏色，前面提過的顏色格式都適用。

<br/>

那今天就把座標軸中與外觀相關的設定介紹完了，但希望大家還沒有感到疲乏，因為明天還有另一半與「座標刻度」有關的設定在等著我們，撐住啊！！

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10241866) -
