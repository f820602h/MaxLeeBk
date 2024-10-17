---
title: 學到新資視了 - Highcharts / 雙層圓餅圖
date: 2020/10/6 14:15:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/vYGqGJj**

今天要延續昨天「公司部門年齡分佈與人數佔比」的主題，把昨天需要點擊柱狀圖才能看到的「年齡佔比圓餅圖」和「部門人數佔比圓餅圖」合併在同一張圖表裡。

---

## 實作目標

<img src="/img/content/highcharts-22/case.png" style="max-width: 800px;" />

<br/>

就如文章開頭所說，我們今天要將兩個圓餅圖合併起來，而最後的成果就出現像上圖分為內外層的雙層圓餅圖，而「雙層圓餅圖」的設定其實沒有想像的那麼複雜，下面我們就來一步步完成它吧。而事前的資料也和昨天一樣：

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

### 1. 容器準備

既然是把兩個圓餅圖合併，那容器當然只需要一個，先把它準備好。

```html
<div id="pie"></div>
```

<br/>

### 2. 資料準備

再來也是要先把圖表資料給準備好，利用原始資料來 Mapping 出我們想要的資料格式，內層的資料會是部門的人數加總，外層則是將各部門的八個年齡層分散開來，也就是總共會有二十四個數據點。

```javascript
const dataKeys = Object.keys(data);

const innerPiePoints = dataKeys.map((department, index) => ({
  name: department,
  color: colors[index],
  y: data[department].reduce((arr, val) => arr + val)
}));

const outerPiePoints = dataKeys.map((department, sIndex) => {
  return data[department].map((value, pIndex) => ({
    name: categories[pIndex],
    color: rgbToRgba(colors[sIndex], 1 - pIndex * 0.05)
    y: value,
  }))
}).flat();
```

另外為了讓外層的扇形有漸層顏色，一樣要用到昨天的顏色轉換函式，就偷偷把它拿過來使用吧。

```javascript
function rgbToRgba(rgb, alpha) {
  return rgb.replace("rgb", "rgba").replace(")", `,${alpha})`)
};
```

<br/>

### 3. 創建圖表與區塊設定

最後就是創建圓餅圖了，這次的設定重點在於我們設定了內外兩組數據列，並且利用 `innerSize` 屬性將外層變為「甜甜圈圖」，而內層則利用 `size` 屬性來設定成可以剛好放入甜甜圈缺口中的尺寸，如此就可以製作出「雙層圓餅圖」的效果，所以可以發現 `size` 和 `innerSize` 的值是一樣的。

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
  series: [
    { 
      size: "220px",
      data: innerPiePoints,
      states: { inactive: { enabled: false } },
      dataLabels: {
        distance: -50,
        style: { fontSize: "14px" }
      },
    },
    {
      innerSize: "220px",
      data: outerPiePoints,
      dataLabels: {
        format: "{key}歲",
        style: { color: "#7e7e7e" }
      }
    },
  ]
});
```

<img src="/img/content/highcharts-22/inner.png" style="max-width: 900px;" />

> **注意:** 內層數據列的「數據標籤」要將 `distance` 設為負數，不然會蓋在外層數據列上方，可能比較不美觀，也不方便觀看。

<br/>

雙層圓餅圖是不是一個 CP 值很高的圖表呢？簡簡單單設定就可以製作出看起來很專業的圖表，之後大家如果有遇到類似的資料型態，也可以試試看喔。至於明天，我們還是會延續同一個題目來介紹「下鑽圖表」。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10249790) -
