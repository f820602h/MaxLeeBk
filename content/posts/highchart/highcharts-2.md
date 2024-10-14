---
title: 學到新資視了 - Highcharts / 圖表的意義
date: 2020/9/16 09:25:00
tags: [JavaScript, Highcharts, 12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 資料視覺化是一門藝術也是一門科學，它藉由人類喜愛以視覺理解資訊的特性來增強我們資料處理的效率。

上一篇文章裡已經知道資料視覺化大大影響現在網頁開發的趨勢，而今天就要正式使用 Highcharts 來將資料做成圖表，同時也讓大家了解為何圖表對於資料的理解有非常大的幫助。

---

## 使用情境

如果把資料比喻成故事，那視覺化就是我們說故事的手法，由此可知「資料」其實才是資料視覺化中的主角，而為了讓我們的資料更有實際意義，我幫大家模擬了一個情境：

**_假設公司的人資想透過員工資料來統計公司內部的年齡分佈，他經過一連串的計算後給了你下面的表格，並請你幫他生成柱狀圖表，你會怎麼做？_**

| 18-24 歲 | 25-29 歲 | 30-34 歲 | 35-39 歲 |
| :------: | :------: | :------: | :------: |
|  12 人   |  18 人   |  22 人   |  25 人   |

| 40-44 歲 | 45-49 歲 | 50-54 歲 | 55 歲+ |
| :------: | :------: | :------: | :----: |
|  32 人   |  35 人   |  26 人   | 18 人  |

~~其實你可以請他自己用 PowerPoint 做~~，喂～不是啦，我們要幫這位人資利用 Highcharts 來將這些數據繪製成圖表並顯示在網頁上。

此時，你也可以試想一下要是沒有圖表的話，光看表格你能分析出這份資料的含義嗎？

---

## 快速上手

如果你只是要一個簡單的圖表，沒有特別的設計與互動需求，那其實簡單幾個步驟 Highcharts 就能讓你的資料圖像化。

#### 1. 引入 Highcharts

你可以用 CDN 的方式將 Highcharts 的 js 檔引入，或是到 [官網](https://www.highcharts.com/blog/download/) 下載放進專案裡。

```html
<script src="http://cdn.highcharts.com.cn/highcharts/highcharts.js"></script>
```

<br/>

#### 2. 新增圖表容器

然後你需要一個容器來放置你的圖表，你可以給它設定寬度以免圖表佔滿整個畫面。

```html
<div id="container" style="max-width: 600px;"></div>
```

<br/>

#### 3. 準備好你的資料

根據我們的情境，我們可以先把表格資料先整理成物件：

```javascript
const data = {
  "18-24歲": 12,
  "25-29歲": 18,
  "30-34歲": 22,
  "35-39歲": 25,
  "40-44歲": 32,
  "45-49歲": 35,
  "50-54歲": 26,
  "55歲+": 18,
};
```

<br/>

#### 4. 繪製表格

接下來我們只要根據 Highcharts 制定好的方法將資料帶入並設定，圖表就完成啦！
若你對下面的程式碼一知半解的話先不用太在意，我們明天會好好解釋的。

```javascript
const container = document.querySelector("#container");
const xAxisCate = Object.keys(data);
const seriesData = xAxisCate.map((key) => data[key]);

var myChart = Highcharts.chart(container, {
  chart: { type: "column" },
  title: { text: "公司員工年齡分佈" },
  xAxis: { categories: xAxisCate },
  yAxis: {
    title: { text: "人數" },
  },
  series: [
    {
      name: "XX公司員工",
      data: seriesData,
    },
  ],
});
```

<img src="/img/content/highcharts-2/chart.png" style="max-width: 600px;" />

## 資料視覺化的意義

這麼一來我們就完成資料視覺化的任務了，而仔細一看會發現這張柱狀圖的圖峰偏右，表示員工的平均年齡偏高，若隨著員工年老退休，公司可能會面臨技術或生產力的下降，所以這位人資應該要想辦法吸引年輕的求職者來公司應徵了。

想想，若光看數據表格的話你需要花多久時間看出員工年齡的趨勢，並作出上面這段結論呢？而這就是圖表存在的意義，讓我們能夠快速的看出資料背後的資訊。

<br/>

今日成果：**https://codepen.io/max-lee/pen/BaKwdyN**

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10237584) -
