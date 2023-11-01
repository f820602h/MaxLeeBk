---
title: 資視就是力量 - Highcharts / 雙Ｙ軸複合圖表
date: 2020/10/8 12:58:00
tags: [JavaScript,Highcharts,12th鐵人賽]
---

> 本章節範例：**https://codepen.io/max-lee/pen/mdPZaRr**

複合圖表和複數座標軸在前面的章節其實都有介紹過，不過今天我們要結合一下時事，用台灣疫情的資料來實際做一個「雙Ｙ軸複合圖表」。

---

## 實作目標

<img src="/img/content/highcharts-24/doubleY.png" style="max-width: 800px;" />

<br/>

如上圖所示，這次要做的是柱狀圖和折線圖的複合圖表，並且累計確診是使用左邊的人數Ｙ軸，而致死率則是右邊的百分比Ｙ軸。不過複合式圖表應該算是蠻簡單的，之前的 **[範例](https://codepen.io/max-lee/pen/mdPxGyq)** 也已經有展示過了，所以這次的重點會放在雙Ｙ軸上面。那今天為大家準備的原始資料如下：

```javascript
const colors = ["#8E354A", "#1C1C1C"];
const epidemic = [
  { "月份": 2, "累計確診": 39, "累計死亡": 1 },
  { "月份": 3, "累計確診": 322, "累計死亡": 5 },
  { "月份": 4, "累計確診": 429, "累計死亡": 6 },
  { "月份": 5, "累計確診": 442, "累計死亡": 7 },
  { "月份": 6, "累計確診": 447, "累計死亡": 7 },
  { "月份": 7, "累計確診": 467, "累計死亡": 7 },
  { "月份": 8, "累計確診": 488, "累計死亡": 7 },
  { "月份": 9, "累計確診": 514, "累計死亡": 7 },
];
```

---

## 動手開發

#### 1. 容器準備

第一步還是一樣，要先準備好放圖表的容器，另外今天偷偷跟大家說一個小撇步，如果容器有設定 HTML `id` 屬性的話，其實 ID 名稱可以直接作為 `chart()` 的 `element` 參數。但先前怕大家覺得怎麼突然沒來由的傳了一個字串，所以就還是用了比較保守的寫法。

```html
<div id="container"></div>
```

```javascript
// const container = document.querySelector('#container');
// 可以省略上面這行，直接將id名稱作為參數
let myChart = Highcharts.chart("container", {...});
```

<br/>

#### 2. 資料準備

再來就是把需要的資料透過原始資料 Mapping 出來，這裡我有把月份給 `map` 出來，因為這樣可以直接作為Ｘ軸的 `categories` 使用，就不用設定一堆屬性來做「日期座標軸」了。

```javascript
const month = epidemic.map(data => `${data["月份"]}月`);
const confirmedNum = epidemic.map(data => data["累計確診"]);
const deathRate = epidemic.map(data => {
  return Math.floor(data["累計死亡"] / data["累計確診"] * 10000) / 100;
});
```

<br/>

#### 3. 創建圖表與區塊設定

**資料準備好後就可以建立圖表了，不過大家要注意一下我們的圖表設定，有下面幾個重點：**
1. 因為要做的是複數座標軸，所以Ｙ軸設定傳入的是 **陣列**，裡面的兩組物件代表的就是兩組Ｙ軸。
2. 第二組的百分比Ｙ軸要加上 `opposite` 屬性，才會顯示在右邊。
3. 數據列必須要設定 `yAxis` 屬性，用來指定要使用陣列中哪一組座標軸。

<br/>

其中最容易忘記的就是第三點，要是沒有設定 `xAxis` 或 `yAxis` 屬性，那所有數據列都會採用第一組座標軸，最後圖表的結果就會很不一樣了。

```javascript
let myChart = Highcharts.chart("container", {
  chart: { height: 500 },
  colors: colors,
  credits: { text: "數據來源: 衛福部疾管署" },
  title: { text: "2020 臺灣疫情報告" },
  tooltip: {
    headerFormat: "<b>{point.key}</b><br/>",
    pointFormat: "{series.name}: {point.y} {series.userOptions.custom}",
  },
  xAxis: { categories: month },
  yAxis: [
    {
      title: { text: "人數" },
      labels: { format: "{value}人" }
    },
    {
      title: { text: "百分比" },
      labels: { format: "{value}％" },
      opposite: true
    }
  ],
  series: [
    {
      name: "累計確診人數",
      type: "column",
      data: confirmedNum,
      custom: "人"
    },
    {
      name: "致死率",
      data: deathRate,
      yAxis: 1, // 指定第二組座標軸，1 為索引值
      custom: "%"
    }
  ]
});
```

<br/>

今天實作了「雙Ｙ軸複合圖表」，算是一個很常見的圖表類型，能夠運用的情境應該蠻多的，建議大家可以練習看看。接著明天，我們要再換一個題目來做做看「金字塔圖表」，也即將會是最後一個實作範例。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10250764) -


