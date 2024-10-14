---
title: 學到新資視了 - Highcharts / 下鑽圖表
date: 2020/10/7 10:35:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/oNxrMRr**

今天要來實作的是「下鑽圖表」，原文是 DrillDown Charts，它的概念其實就是把數據列分為上下層，可以透過點擊上層來鑽到下層，從而觀看更細節的資料，光用說的可能很難想像，我們直接看看範例吧。

---

## 實作目標

<img src="/img/content/highcharts-23/drilldown.gif" style="max-width: 800px;" />

<br/>

下鑽圖表就如上圖所示，點擊數據點就可以看到更細節的資料，右上角還有個返回按鈕，是不是覺得和「圖表連動」的範例有點像呢？

其實還真的有點類似，但其實差異還是不小的：
- **下鑽圖表:** 只能運用在「單個圖表」，而且是透過點擊上層「數據點」，來看下層「數據列」。
- **圖表連動:** 可以讓「多個圖表」進行交互，無論數據列或數據點都可以設定事件或更新資料。

那接下來就來實作看看吧，事前資料也和前兩天一樣：

```javascript
const categories = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55+"];
const colors = [ "rgb(119, 146, 174)", "rgb(83, 119, 122)", "rgb(99, 99, 104)"];
const data = {
  "工程部": [24, 37, 30, 24, 18, 11, 3, 2],
  "銷售部": [23, 30, 35, 28, 10, 8, 2, 1],
  "企劃部": [22, 32, 27, 25, 16, 6, 4, 3]
};
```

---

## 動手開發

#### 1. 掛載下鑽模組

下鑽功能的支援必須要額外掛載模組，所以除了原本基礎的 Highcharts 之外，我們還要在加入一支 `script`。

```html
<script src="http://cdn.highcharts.com.cn/highcharts/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/drilldown.js"></script>
```

<br/>

#### 2. 容器準備

下鑽圖表一單個圖表的操作互動，所以只需要一個容器即可。

```html
<div id="pie"></div>
```

<br/>

#### 3. 學習下鑽屬性 

那想要圖表有下鑽功能就必須要設定 `drilldown` 屬性，但既然是一個新的屬性，就先來看看如何使用吧！

```javascript
var myChart = Highcharts.chart(container, {
  series: [{
    data: [
      { name: "數據點1", drilldown: "id1", y: 10 },
      { name: "數據點2", drilldown: "id2", y: 20 }
    ] 
  }],
  drilldown: {
    series: [
      { name: "下層數據列1", id: "id1", data: [5, 5] },
      { name: "下層數據列2", id: "id2", data: [10, 10] },
    ]
  }
});
```

其實重點就在於為上層數據列中的「數據點」添加 `drilldown` 名稱，並在 `drilldown` 設定區塊中加上對應的「數據列」，而數據列必須有著和上層數據點相同名稱的 `id` 屬性，這樣兩者就可以聯繫起來，而後產生我們要的效果。

<br/>

#### 4. 資料準備

知道下鑽屬性的設定方法後，就把原生資料 Mapping 出符合需求的格式吧。`piePoints` 為上層的 **三個數據點**，要加上 `drilldown` 屬性，`drilldownSeries` 為下層的 **三組數據列**，要加上 `id`。

```javascript
const dataKeys = Object.keys(data);

const piePoints = dataKeys.map((department, index) => ({
  name: department,
  drilldown: department,
  color: colors[index],
  y: data[department].reduce((arr, val) => arr + val)
}));

const drilldownSeries = dataKeys.map((department, sIndex) => ({
  name: department,
  id: department,
  data: data[department].map((value, pIndex) => ({
    name: categories[pIndex],
    color: rgbToRgba(colors[sIndex], 1 - pIndex * 0.05),
    y: value,
  }))
}))
```

下鑽資料的漸層依然是透過 `rgbToRgba` 這個函式來幫忙轉換。

```javascript
function rgbToRgba(rgb, alpha) {
  return rgb.replace("rgb", "rgba").replace(")", `,${alpha})`)
};
```

<br/>

#### 5. 創建圖表與區塊設定

再來就是把圖表創建出來，把區塊設定調整一下，最後帶入資料就完成了，是不是很簡單呢？

```javascript
const pie = document.querySelector('#pie');
let pieChart = Highcharts.chart(pie, {
  chart: { height: 500, type: "pie" },
  credits: { enabled: false },
  title: { text: "公司部門年齡人數佔比" },
  tooltip: {
    headerFormat: "<b>{point.key}</b><br/>",
    pointFormat: "{point.percentage:.1f} %／{point.y}人",
  },
  plotOptions: {
    series: {
      states: {
        inactive: { enabled: false }
      }
    }
  },
  series: [{ data: piePoints }],
  drilldown: { series: drilldownSeries }
});
```

<br/>

這幾天的實作大家是否有發現，其實最難的部分都是在「資料準備」的環節，不過實際開發就是會如此，我們從後端或外部 API 獲得的資料未必會符合 Highcharts 所需的格式，所以就必須靠前端來把原始資料重新組裝轉換一下，才能套用在圖表裡。

那今天透過實作又認識了「下鑽圖表」這個新的圖表型態，明天的話我們換個題目來實作看看「雙Ｙ軸複合圖表」吧！

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10250229) -


