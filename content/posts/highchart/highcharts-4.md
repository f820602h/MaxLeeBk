---
title: 學到新資視了 - Highcharts / 圖表整體設定
date: 2020/9/18 10:05:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/BaKwdyN**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

接下來的幾天，將陸續介紹 Highcharts 圖表設定裡五花八門的屬性，所以之後每個章節的開頭我都會準備一個線上範例，建議大家利用範例來玩玩看當天介紹的屬性。

相信大家都有接觸過線上遊戲，在遊戲開始時總是會創建角色並決定初始樣貌以及職業，而「圖表整體設定」正是為圖表做這些初始設定。

---

## 圖表整體設定

圖表整體設定主要是一些調整圖表外觀或是整體呈現的屬性，而且這些屬性會大大影響其他區塊的設定內容，像是如果你用 `chart.type` 屬性把圖表設定為圓餅圖，那之後的座標軸設定你肯定就用不到了，所以它算是整個圖表的基底及前置。

```javascript
var myChart = Highcharts.chart(container, {
  chart: {} // 圖表整體設定
});
```

<br/>

#### # chart.type

`型別: String` `預設: "line"`

這個算是比較重要的屬性，它決定了這張圖表要採用的類型是哪一種，我們的範例中設定的是 `column` 長條圖，如果沒特別設定的話，則預設會是折線圖。想知道所有圖表類型的話，可以到 **[官方文件](https://api.highcharts.com/highcharts/series)** 查看。

<br/>

#### # chart.inverted

`型別: Boolean` `預設: false`

這個屬性比較特別，如果你設為 `true` 的話，它會將你的座標軸給交換，這會導致圖表的方向性改變，像是用在柱狀圖的話它就會變成橫條圖，或是下面的折線圖改為由上而下繪製。

![](/img/content/highcharts-4/inverted.png)

#### # chart.width / chart.height

`型別: String|Number|null` `預設: null`

寬高就是非常基本的屬性了，兩者都可以用數字或字串來做設定，並且支援所有 CSS 的長度單位，如果沒特別設定的話會是預設值 `null`，不過 `null` 並非為零，而是寬度部分會自動填滿與容器，高度則預設為 `400px`。

<br/>

#### # chart.reflow

`型別: Boolean` `預設: true`

前面提到過，當你沒有為圖表設定寬度時，它會主動填滿容器元素，但若你的容器會根據視窗大小和縮放時，圖表就會跟著一起變寬變窄，而 `reflow` 可以讓你決定要不要讓圖表一起縮放。

<br/>

#### # chart.backgroundColor / chart.plotBackgroundColor

`型別: String|Object|null` `預設: "#ffffff"`

這兩個都是調整背景顏色，可以使用16進制的色碼、顏色名以及 `rgba()` 的顏色設定，若設為 `null` 的話則取消背景。那為何背景色要分成兩個設定呢？因為調整的區塊其實不太一樣，一個是設定整個圖表 (chart) 的背景，另一個則是設定繪圖區 (plot) 的背景。

![](/img/content/highcharts-4/plot.png)

另外也可以設定漸層色，不過寫法稍微複雜，必須用一個物件來設定，其中 `linearGradient` 屬性是調整漸層方向的，而 `stops` 則是設定顏色的，說明寫在註解了，你可以試著寫寫看。

```javascript
chart: {
  backgroundColor: {
    //x1:0, x2:1 為水平漸層，y1:0, y2:1 為垂直的漸層，以此邏輯便能調整出斜向或反向漸層
    linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 }, 
    //第一個值為顏色位置(0~1)，第二個值為顏色
    stops: [ [0, 'pink'], [0.5, 'red'], [1, 'orange'] ]
  }
}
```

<br/>

#### # chart.borderWidth / chart.plotBorderWidth

`型別: Number` `預設: 0`

同樣地，圖表與繪圖區的邊框寬度都可以各自設定，如果不設定則沒有邊框。另外也可以用 `chart.borderRadius` 設定圖表的邊框圓角，繪圖區則沒有圓角設定。

<br/>

#### # chart.borderColor / chart.plotBorderColor

`型別: String` `預設: "#335cad" / "#cccccc"`

邊框顏色的設定方式和背景色一樣，要注意的是圖表與繪圖區的邊框色預設值不一樣，圖表是深藍色 `#335cad`，繪圖區則是淺灰色 `#cccccc`。

<br/>

#### # chart.spacing

`型別: Array[Number]` `預設: [10, 10, 15, 10]`

這個屬性如同圖表的 `padding`，代表的是圖表 (chart) 內容與邊框之間的內間距，設定方式是四個數字的陣列，順序和 CSS 一樣是上右下左，若你想要個別設定可以用 `spacingTop`、`spacingBottom`、`spacingRight`、`spacingLeft`，它們會覆蓋掉 `spacing`。

<br/>

#### # chart.margin

`型別: Array[Number]` `預設: undefined`

這是一個容易被混淆的屬性，你可能會以為它與 `spacing` 相對，不過它調整可不是圖表的外間距，他調整的是**繪圖區 (plot) 與圖表 (chart) 邊框的距離**，我覺得這算是一個蠻大的地雷，如果沒有仔細理解肯定會被搞糊塗。

![](/img/content/highcharts-4/margin.png)

灰色區域是兩者各自代表的間距，可以發現 `margin` 的距離其實是包含 `spacing` 的。另外當你沒有設定 `margin` 的時候，間距並不為零，而是 Highcharts 會去計算圖表的其他區塊(標題、座標軸等..)，並調整成能夠避開它們的間距。

當然，`margin` 也有 `marginTop`、`marginBottom`、`marginRight`、`marginLeft` 的版本可以使用。

<br/>

那麼以上就是「圖表整體設定」中比較常會使用到的屬性了，明天會介紹的是標題、說明等文字性質的圖表元素。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10239103) -
