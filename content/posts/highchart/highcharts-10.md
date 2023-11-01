---
title: 資視就是力量 - Highcharts / 數據列設定
date: 2020/9/24 09:50:00
tags: [JavaScript,Highcharts,12th鐵人賽]
---

> 本章節範例：**https://codepen.io/max-lee/pen/mdPxGyq**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

我們前面的章節其實時不時都會提到數據列，而所謂的數據列指的是「一系列的數據」，這些數據是以某個統一的基準進行統計與計算的，然後在圖表中我們將這一系列的數據畫出合適的圖形。而數據列設定其實就是在設定圖表上這些具體圖形。

---

## 數據列設定

同樣的一組數據列，在不同的圖表中就會用不同圖形呈現，所以數據列設定會根據你的圖表類型有不一樣的屬性，不過我們先介紹所有圖表都通用的屬性，最後再補充一些不同圖表類型的專屬屬性。

**特別注意，同一張圖表中可以有多組數據列，所以是用陣列來做設定，就算只有一組數據列也「不能」省略中括號。**

```javascript
var myChart = Highcharts.chart(container, {
  series: [{}] // 數據列設定
});
```

<br/>

#### # series.type
`型別: String` `預設: undefined`

在圖表整體設定中有介紹過 `chart.type` 這個非常重要的屬性，它決定了圖表是何種類型，所以在一般情況下你不用再特別設定 `series.type`，因為它會直接從整體設定中繼承。

**但是，Highcharts 是可以製作複合圖表的，像是柱狀圖和折線圖就常常搭配使用，此時就必須為數據列指定它的資料類型了。**

<img src="/img/content/highcharts-10/complex.png" style="max-width: 600px;" alt="折線圖與柱狀圖的複合圖表" />

<br/>

#### # series.data
`型別: Array[Number|Array|Object]` `預設: undefined`

這是整個圖表中**「最重要」**的屬性，也就是我們賦予圖表資料的地方，但是因為它設定的方式有很多種，加上數據點 (point) 又還有獨立的屬性，所以讓我明天再用整篇文章來好好介紹，今天暫時先跳過。

<br/>

#### # series.name
`型別: String` `預設: undefined`

這個屬性是設定數據列名稱用的，其用處在於「圖例」會以這個名稱來標示你的數據列，基本上沒有不設置理由。不過部分圖表的圖例顯示的可能會是數據點 (point) 名稱，如圓餅圖。

<br/>

#### # series.visible
`型別: Boolean` `預設: true`

這個屬性可以設定該數據列是否要在初始化時顯示，不過設為 `false` 並不是完全消失，依然可以透過點擊圖例來再次顯示。

<br/>

#### # series.showInLegend
`型別: Boolean` `預設: true | false`

這個屬性我們之前在圖例設定有提過，在某些圖表類型中，數據列不會顯示圖例，必須開啟這個屬性才會出現。而如果你希望某個數據列不要出現在圖例中的話，也可以特別將其設為 `false`。

<br/>

#### # series.index / series.legendIndex / series.zIndex
`型別: Number` `預設: undefined`

因為數據列設定是陣列，所以每組數據列都有索引值，這個索引值會影響「圖例的順序」以及「圖形覆蓋的順序」，而你可以透過 `index` 來手動決定數據列的索引值，或是你也可以單一去調整 `legendIndex` 來改變圖例的順序，以及調整 `zIndex` 來改變覆蓋的上下順序。

<br/>

#### # series.cursor
`型別: String` `預設: undefined`

調整鼠標移至數據列上時的光標樣式，適用的值與 CSS 相同。

<br/>

#### # series.allowPointSelect
`型別: Boolean` `預設: false`

決定數據列上的數據點（point）能否被選取，選取之後該數據點會有外觀上的改變，並且你可以透過 `getSelectedPoints` 這個函式來取得「被選取的」數據點的相關訊息。

```javascript
// 在數據列設定裡增加 allowPointSelect 屬性
var myChart = Highcharts.chart(container, {
  series: [{ allowPointSelect: true }]
});
// 在畫面上新增一個按紐，並監聽點擊事件
document.querySelector("button").adEventListener("click", function(){
  console.log(myChart.getSelectedPoints()); // 數據點相關的訊息
});
```
有興趣的話我也有準備完整的範例：**https://codepen.io/max-lee/pen/MWyVOmP**

<br/>

#### # series.enableMouseTracking
`型別: Boolean` `預設: true`

開啟或關閉數據列的滑鼠互動，一般來說鼠標停留在數據列上時樣式會稍微改變並顯示提示框，但當你關閉這個屬性時，便不會再有這些效果。

<br/>

#### # series.shadow
`型別: Boolean|Object` `預設: false`

你可以為數據列開啟陰影的選項，重現一種不一樣的畫面風格。也可以透過傳入物件來微調陰影的樣式，有需要可以看看 **[官方文件](https://api.highcharts.com/class-reference/Highcharts.ShadowOptionsObject)**，文章中就不多著墨。

<br/>

#### # series.xAxis / series.yAxis
`型別: Number` `預設: 0`

在「座標軸設定」時有說過，只要在座標軸設定中傳入陣列就可以畫出複數Ｘ軸或複數Ｙ軸，這樣的話勢必要為數據列指定它該以哪一組座標軸作為尺標，而這兩個屬性的作用就是如此，設定時要傳入的是你要指定的座標軸索引值。

```javascript
var myChart = Highcharts.chart(container, {
  yAxis: [
    { }, // 第一組Ｙ軸設定，索引值：0
    { }  // 第二組Ｙ軸設定，索引值：1
  ],
  series: [
    { yAxis: 0 }, // 採用第一組Ｙ軸
    { yAxis: 1 }  // 採用第二組Ｙ軸
  ]
});
```

<br/>

#### # series.stacking
`型別: String` `預設: undefined`

這個屬性可以決定數據列的堆疊模式，讓數據點的數值疊加上去，很適合用在面積圖或柱狀圖，有純粹疊加數值的 `normal` 模式，或是計算成百分比的 `percent` 模式。而在不同的模式下圖表會被賦予不同的意義，所以使用前要仔細思考你的用途是什麼。

範例：**https://codepen.io/max-lee/pen/yLOjYMj**

![](/img/content/highcharts-10/stacking.png)

---

## 數據標籤設定

數據標籤是呈現在每個數據點附近用來明確標示個數據點數值的文字標籤，可以讓觀看者不用對照座標軸就能立即獲得資料數據。由於數據標籤的屬性不少都跟前面介紹的圖表元素重複了，所以我們下面就只介紹一些比較重要的，想看完整內容再請大家到 **[官方文件](https://api.highcharts.com/highcharts/series.line.dataLabels)**。

```javascript
var myChart = Highcharts.chart(container, {
  series: [{
    dataLabels: {} // 數據標籤設定
  }],
});
```

<img src="/img/content/highcharts-10/dataLabels.png" style="max-width: 600px;" alt="其中一個數據列加上數據標籤" />

#### # series.dataLabels.enabled
`型別: Boolean` `預設: true|false`

數據標籤在某些圖表類型是預設顯示，有些則無，但你依然可以透過這個屬性來決定是否顯示。

<br/>

#### # series.dataLabels.allowOverlap
`型別: Boolean` `預設: true|false`

這個屬性是決定數據標籤之間能不能重疊，在數據點比較密集情況下，數據標籤常常會擠在一起影響閱讀，這時後就可以禁止重疊，Highcharts 會自動把部分標籤給隱藏。

<br/>

#### # series.dataLabels.overflow
`型別: String` `預設: "justify"`

這個屬性會控制數據標籤在溢出繪圖區 (plot) 時的作法，預設情況下它調整溢出標籤的對齊設定，想辦法讓它進到繪圖區內。但假如你不想破壞標籤的位置一致性，你可以把這個屬性改為 `allow`，那它就會放任數據標籤渲染到繪圖區外。

<br/>

#### # series.dataLabels.crop
`型別: Boolean` `預設: true`

這個屬性似乎只是輔助 `overflow` 用的，當你把 `overflow` 改為 `allow`，那你必須將這個屬性一起改為 `false`，才能達到效果。

<br/>

#### # series.dataLabels.format / # series.dataLabels.formatter

相信你已經發現了，只要是**標籤**或**隨資料變動的文字**都會有這兩個「格式化屬性」，但請耐住性子，我們後面會再好好介紹的。

---

## 線條類圖表專屬設定

> 線條類的圖表算是最常見的，適用的 `type` 有折線圖 (line)、曲線圖 (spline)、折線面積圖 (area)、曲線面積圖 (areaspline) 等...

<br/>

#### # series.lineWidth
`型別: Number` `預設: 2`

應該非常容易理解，這個屬性是調整線條類圖表中「線」的粗，單位為 `px`，如果設為 `0` 線便會消失。

<br/>

#### # series.dashStyle
`型別: String` `預設: "Solid"`

可以改變線條類圖表中「線」的線條樣式，所有樣式可以看 **[官方範例](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/)**。

<br/>

#### # series.marker
`型別: Object` `預設: 請見下方`

Marker 指的是線條類圖表中標記「數據點」的符號，預設是實心圓，而你可以透過一組物件來調整他的樣式。下面我們只介紹幾個重要的，要了解所有屬性請看 **[官方文件](https://api.highcharts.com/highcharts/series.line.marker)**。

簡單的範例：**https://codepen.io/max-lee/pen/zYqjGya**

```javascript
series: [{
  marker: {
    enabled: true,          // 是否要顯示 marker
    fillColor: undefined,   // 圖形的填色，預設繼承數據列顏色
    lineWidth: 0,           // 圖形的外框粗細
    lineColor: "#ffffff",   // 圖形的外框填色，改為 undefined 則繼承數據列顏色
    radius: 4,              // 圖形的半徑
    symbol: "circle"        // 決定圖形的形狀，有"circle","square","diamond","triangle","triangle-down"
  }
}],
```

---

## 長條類圖表專屬設定

> 長條類的圖表也是很常見，常用的 `type` 主要有直橫兩種的柱狀圖 (column) 及橫條圖 (bar)。

<br/>

#### # series.pointWidth
`型別: Number` `預設: undefined`

長條類圖表中的矩形寬度會因應圖表大小而調整，但你可以透過這個屬性自行決定一個固定的寬度。

<br/>

#### # series.minPointLength
`型別: Number` `預設: 0`

在一組數據列中，假如有某個數據點的數值大幅低於平均值，那該數據點的矩形很有可能會被 Highcharts 省略，此時你可以利用這個屬性來決定圖表中的矩形最短要多少長度。

<br/>

#### # series.stack
`型別: Number` `預設: undefined`

這個屬性其他類型的圖表也有，但用在長條類圖表中效果是最好的，當你開啟 `stacking` 時，這個屬性可以決定堆疊的分組方式。

你可以調整看看這個範例的 `stack` 屬性：**https://codepen.io/max-lee/pen/PoNeqMZ**

![](/img/content/highcharts-10/stack.png)

---

## 圓餅圖專屬設定

> 另外一個常見的圖表類型就是圓餅圖，但因為它和那些有座標軸的圖表類型相當不同，所以專屬的屬性也就比較多。

<br/>

#### # series.size / # series.innerSize
`型別: Number|String` `預設: null`

你可以用像素(可省略單位)或百分比調整圓餅圖的尺寸，甚至可以用 `innerSize` 設定圓餅圖的內圈空白，來讓圓餅圖改為甜甜圈圖。

有興趣可以看看範例：**https://codepen.io/max-lee/pen/eYZrYQo**

<img src="/img/content/highcharts-10/donut.png" style="max-width: 600px;" alt="" />

<br/>

#### # series.dataLabels.distance
`型別: Number|String` `預設: 30`

這是圓餅圖的數據標籤才有的圖特屬性，它可以調整標籤距離圓餅圖的距離，可以接受像素或百分比，而且如果以負數設定的話，標籤會顯示在圓餅圖內部。

<br/>

#### # series.dataLabels.connectorWidth
`型別: Number|String` `預設: 30`

如果圓餅圖中某幾個數據點所佔的百分比較低時會導致扇形面積較小，讓數據標籤難以顯示，所以 Highcharts 會將某些標籤的距離拉遠並用連接線標示，而你可以用這個屬性來調整連間線的粗細。

另外還可以透過 `connectorColor`、`connectorShape` 來調整連接線的顏色和形狀，有興趣的話再到 **[官方文件](https://api.highcharts.com/highcharts/series.pie.dataLabels)** 看看，這邊就不細說了。

<br/>

今天介紹了數據列中比較常用的一些屬性，不過 Highcharts 的圖表類型實在太多了，每種數據列的設定都不太一樣，請原諒我沒辦法全部介紹，但這種大型的 library 本來就是邊做邊查，所以剩下的屬性就留給大家慢慢發掘吧！

至於明天，終於要輪到整個圖表的靈魂「數據點」的設定了！

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10243081) -
