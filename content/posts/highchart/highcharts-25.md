---
title: 學到新資視了 - Highcharts / 金字塔圖表
date: 2020/10/9 10:30:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/wvGVGyR**

相信大家在學生時期都有在課本中看過人口金字塔，而今天我們就是要用臺灣的人口統計資料來實作「金字塔圖表」。

---

## 實作目標

<img src="/img/content/highcharts-25/pyramid.png" style="max-width: 900px;" />

<br/>

那上圖就是我們今天要製作圖表，其實分析一下可以發現金字塔圖表只是一個「雙Ｘ軸長條圖」，倒是它的Ｙ軸座標比較特別，最小刻度竟然在中間，越往兩側值越高。下面就來看看這是如何做到的吧！

> **提醒：**長條圖中垂直的座標軸為Ｘ軸，水平為Ｙ軸，剛好跟其他圖表類型相反。

這次的原始資料如下:

```javascript
const colors = ["#66BAB7", "#EB7A77"];

const age = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80+"];

const male = [1046336, 1248418, 1653942, 1848095, 1818996, 1789423, 1376599, 594861, 339574];

const female = [970889, 1142606, 1533181, 1851812, 1875771, 1849072, 1489570, 712084, 438873];
```

---

## 動手開發

### 1. 容器準備

無論如何，第一步永遠都是把要放圖表的容器先準備好。

```html
<div id="barChart"></div>
```

<br/>

### 2. 資料準備

其實今天的原始資料都已經可以直接拿來使用了，但再來就是Ｙ軸的秘密了，男性的資料我們要稍微動一下手腳。透過 `map` 把男性資料乘以 `-1`，這樣數據列剛好一組正數一組負數，自然就會往兩邊延伸了。

```javascript
const maleSeries = male.map(val => val * -1);
```

<br/>

### 3. 創建圖表與區塊設定

**資料備妥後，剩下就是圖表的設定跟創建了，不過要做出金字塔圖表有幾個重點要注意：**
1. 初始的Ｘ軸刻度會是上低下高，所以記得要把 `reversed` 屬性關掉翻轉回來。
2. 因為男性這側的Ｙ軸刻度會是負數，所以記得要用 `formatter` 來取絕對值，才不會出現負號。
3. 提示框內容裡也會出現負數，一樣要透過格式化屬性處理。
4. 數據列的 `stacking` 屬性要記得設定，才會有堆疊效果。

<br/>

只要有做到以上幾點，金字塔圖表就能輕輕鬆鬆做出來了，大家也試著做做看吧！

```javascript
let myChart = Highcharts.chart("container", {
  chart: { type: "bar" },
  credits: { text: "數據來源: 內政部戶政司" },
  colors: colors,
  title: { text: "2018 臺灣人口金字塔" },
  tooltip: {
    headerFormat: "<b>{point.key}歲</b><br/>",
    pointFormatter() {
      let value = Math.abs(this.y);
      let formatValue = Highcharts.numberFormat(value, 0, "", ",");
      return `${formatValue}人`;
    }
  },
  xAxis: [
    { 
      categories: age,
      reversed: false,
      labels: { format: "{value}歲" }
    },
    { 
      categories: age,
      opposite: true,
      reversed: false,
      labels: { format: "{value}歲" }
    }
  ],
  yAxis: {
    title: { text: undefined },
    labels: { 
      formatter() {
        return `${Math.abs(this.value / 10000)}萬人` 
      }
    }
  },
  plotOptions: {
    series: {
      groupPadding: 0,
      pointPadding: 0,
      stacking: "normal"
    }
  },
  series: [
    { name: "男性", data: maleSeries },
    { name: "女性", data: female, xAxis: 1 }
  ]
});
```

> `groupPadding` 和 `pointPadding` 都設為 `0`，才能移除長條圖之間的間距，也才會有這種階梯狀的圖形效果。

<br/>

那今天就正式完成了最後一個實作範例了，不過 Highcharts 的圖表應用當然還有百百種，可以到 [官方DEMO](https://www.highcharts.com/demo) 去挖挖寶，也希望大家可以發揮創意，組合自己獨特的圖表內容與功能。

那麼明天就要進入本系列的最後一個階段了，就是在前端框架-Vue 底下使用 Highcharts，透過 Vue 的元件和資料綁定的機制來協助我們開發。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10251181) -


