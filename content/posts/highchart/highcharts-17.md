---
title: 資視就是力量 - Highcharts / 響應式設定
date: 2020/10/1 13:13:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/NWNeevP**

近年來響應式網站已成為主流，尤其當網站需要支援行動裝置的使用時，RWD 的設定勢必要考慮進去，好加在 Highcharts 本來就對各種瀏覽器、裝置、系統有很高的相容性，而且還提供了「響應式設定」讓我們隨視窗大小的改變而修改圖的設定。

---

## 響應式設定 - 基本介紹

一般在設計響應式網站時，肯定會使用 CSS 的媒體查詢 (Media queries) 來規範元素樣式要在什麼樣的視窗尺寸下做何種變化，而 Highcharts 的「響應式設定」也是類似原理。

```javascript
var myChart = Highcharts.chart(container, {
  responsive: { // 響應式設定
    rules: [{
      condition: {},     // 條件設定
      chartOptions: {}   // 圖表options物件
    }] 
  }
});
```

---

## 響應式設定 - 條件設定

Media queries 在撰寫時都會相下面這樣去訂定變化的條件時機，其中 `max-width:790px` 就是樣式的轉變時機。

```css
/* 在視窗寬度小於 790px 時，做以下變化 */
@media screen and (max-width:790px) { 
  color: red;
  border: 1px solid #292929;
}
```

而 Highcharts 的「響應式設定」也是一樣的，同樣要定義圖表設定變化的條件，而 `condition` 屬性可以幫我們做到這件事，不過...

<br/>

> Highcharts 監聽的並非視窗寬高，而是圖表本身的寬高，這點非常重要，千萬別搞錯了！

<br/>

#### # responsive.rules.condition.maxWidth
`型別: Number` `預設: undefined`

當圖表的寬度小於這個屬性設定的值時，便會發生設定變化。

<br/>

#### # responsive.rules.condition.maxHeight
`型別: Number` `預設: undefined`

當圖表的寬度小於這個屬性設定的值時，便會發生設定變化。

<br/>

#### # responsive.rules.condition.minWidth
`型別: Number` `預設: 0`

當圖表的寬度大於這個屬性設定的值時，便會發生設定變化。

<br/>

#### # responsive.rules.condition.minHeight
`型別: Number` `預設: 0`

當圖表的高度大於這個屬性設定的值時，便會發生設定變化。

<br/>

看完屬性的介紹後，應該會發現「響應式設定」真的就和 `@media` 一樣，只要將條件設定完畢，Highcharts 就會自動偵測圖表的大小了。

```javascript
var myChart = Highcharts.chart(container, {
  responsive: {
    rules: [{
      // 當圖表寬度在 768 ~ 1280 之間，就會發生設定變化
      condition: {
        maxWidth: 1280,
        minWidth: 768,
      }
    }] 
  }
});
```

---

## 響應式設定 - 圖表變化

有了條件，剩下就是讓圖表產生改變了，這時候 `chartOptions` 屬性就是「響應式設定」中的主角了。

<br/>

#### # responsive.rules.chartOptions
`型別: Object` `預設: undefined`

物件內容就是你希望改變的圖表設定及其值，前面所有介紹過的圖表元素設定都可以改變！

```javascript
var myChart = Highcharts.chart(container, {
  responsive: {
    rules: [{
      condition: {}
      chartOptions: {
        chart: {},       // 圖表整體設定
        credits: {},     // 版權標籤設定
        title: {},       // 標題設定
        subtitle: {},    // 副標題設定
        caption: {},     // 圖表說明設定
        colors: [],      // 顏色設定
        xAxis: [{}],     // Ｘ座標軸設定
        yAxis: [{}],     // Ｙ座標軸設定
        legend: {},      // 圖例設定
        tooltip: {},     // 提示框設定
        plotOptions: {}, // 繪圖區設定
        series: [{}]     // 數據列設定
      }
    }] 
  }
});
```

其實全部列出來才發現，我們已經認識了一大堆的圖表設定，而這些你全部都可以在 `chartOptions` 裡進行新的設定，而只要 `condition` 當中的條件發生了，圖表就會被套用這些設定。

---

## 響應式設定 - 實際使用

既然兩個屬性都知道如何設定了，那接下來就是實際運看看囉，今天就來做個手機市佔率的圓餅圖好了。

在之前的範例中，我們都會把容器的寬度給寫死，但這樣圖表就不會隨視窗改變大小了，所以這次的容器就不設定固定寬度了：

```html
<div id="container"></div>
```

接著先把資料給準備好，然後用 `showInLegend` 屬性把圓餅圖的圖例打開，並且做一些細節的設定：

```javascript
let phoneData = [
  ["蘋果", 30],
  ["三星", 29.8],
  ["realme", 9.2],
  ["OPPO", 7.2],
  ["vivo", 6.3],
  ["其他", 17.5]
];
```

```javascript
var myChart = Highcharts.chart(container, {
  chart: { type: "pie" },
  title: { text: "手機品牌市佔率" },
  credits: { enabled: false },
  legend: {
    align: "center",
    verticalAlign: "middle",
    layout: "vertical",
    floating: true,
    x: 260,
    itemMarginTop: 5,
    itemMarginBottom: 5,
    labelFormat: "{name} {y}%"
  },
  plotOptions: {
    series: {
      showInLegend: true,
       dataLabels: { enabled: false }
    }
  },
  series: [{ data: phoneData }]
});
```

<img src="/img/content/highcharts-17/pie.png" style="max-width: 800px;" />

這樣我們就有一張手機品牌市佔率的圓餅圖了，並且將圖例顯示在圓餅圖的右側，不過如果你有跟著做的話，就會發現當圖表的寬度隨著視窗縮小到一定程度時，圖例就會超出畫面而無法完整顯示，為了解決這樣的「破版」，就來增加「響應式設定」吧！

```javascript
var myChart = Highcharts.chart(container, {
  //..省略原設定
  responsive: {
    rules: [
      {
        condition: {  maxWidth: 650 },
        chartOptions: {
          legend: {
            verticalAlign: "bottom",
            layout: "horizontal",
            floating: false,
            x: 0
          }
        }
      },
      {
        condition: { maxWidth: 450 },
        chartOptions: {
          legend: { verticalAlign: "top" },
        }
      }
    ]
  }
});
```

是否有發現，我在 `responsive.rules` 增加的是兩組條件與設定呢？就如同 `@media` 一樣，「響應式設定」並非只能設立一個斷點，所以現在當圖表寬度小於 `650px` 以及 `450px` 的時候都會有一次改變，最後的成果就像下面這樣。

![](/img/content/highcharts-17/legendChange.gif)


<br/>

是不是覺得「響應式設定」還蠻有趣的呢？透過它我們可以做到很多的排版上的變化，讓任何尺寸的裝置都可順利的觀看圖表。

另外也要特別恭喜各位，因為到今天為止，我們已經把所有常見的「基本API」給介紹完了，而接下來的三天則會進入「進階API」的介紹，首當其衝的就是負責互動操作的「事件屬性」。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10247405) -
