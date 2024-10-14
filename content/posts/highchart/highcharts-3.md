---
title: 學到新資視了 - Highcharts / 圖表的組成
date: 2020/9/17 09:24:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---
> 圖表的種類非常多，呈現方式各有不同，但幾乎都有幾個固定的元素內容，能夠使圖表的易讀性提昇

昨天我們成功做出了一個 Highcharts 的圖表，今天要重新說明一下我們到底寫了些什麼，另外也要讓大家知道，其實圖表是由很多重要的元素所組成的，它們扮演了重要的角色，使觀看者能更快速的理解圖表。

---

## 前情回顧

```javascript
const container = document.querySelector("#container");
const xAxisCate = Object.keys(data);
const seriesData = xAxisCate.map(key => data[key]);

var myChart = Highcharts.chart(container, {
  chart: { type: "column" },
  title: { text: "公司員工年齡分佈" },
  xAxis: { categories: xAxisCate },
  yAxis: {
    title: { text: "人數" }
  },
  series: [{
    name: "XX公司員工",
    data: seriesData
  }]
});
```

昨天這段程式碼，大家比較陌生的應該是 `Highcharts.chart` 這一段，而它其實就是 Highcharts 最主要的初始化函式。

```javascript
Highcharts.chart(element, options);
```

當你要創建一個新的圖表時，就必須使用這個函式，並且傳入兩個參數，第一個是 DOM 元素容器，第二個是圖表設定，在昨天的案例中 DOM 元素很明顯是 `#container` 這個容器，而圖表設定是這一大包物件。

```javascript
{
  chart: { type: "column" },
  title: { text: "公司員工年齡分佈" },
  xAxis: { categories: xAxisCate },
  yAxis: {
    title: { text: "人數" }
  },
  series: [{
    name: "XX公司員工",
    data: seriesData
  }]
}
```

不過目前我們不會去探究裡面的屬性到底做了些什麼，那是後面幾天會著墨的內容，今天會先用圖表的組成來理解這個 `options` 物件的結構。

---

## 圖表中的元素

其實圖表是由許多元素所組合而成的，Highcharts 的圖表也不例外，以昨天的 [範例](https://codepen.io/max-lee/pen/BaKwdyN) 來說的話，它包含了以下內容：

![](/img/content/highcharts-3/element.png)


透過上面的示意圖可以發現，Highcharts 圖表可以粗略的分成這七個主要區塊加上一個整體設定，並且在 `options` 物件中都有對應的屬性，不過如果圖表不會太複雜，Highcharts 本身都有預設設定，就未必每個區塊都要額外修改，像是我們的範例就沒有去調整圖例和提示框。

```javascript
{
  chart: {},      // 圖表整體設定
  title: {},      // 標題設定
  xAxis: [{}],    // Ｘ座標軸設定
  yAxis: [{}],    // Ｙ座標軸設定
  legend: {},     // 圖例設定
  tooltip: {},    // 提示框設定
  series: [{}],   // 數據列設定
  plotOptions: {} // 繪圖區設定
  // ...還有更多更多更多更多
}
```

另外 Highcharts 其實還有更多特殊的圖表元素可以進行設定，而且許多屬性底下還能再分成更細緻的區塊做調整，使得圖表的設定屬性數量非常可觀，所以後面我會把重點放在比較實用與常見的屬性上，而剩餘的就留給各位慢慢摸索了。

<br/>

豐富的圖表設定是 Highcharts 這個圖表庫強大的特點之一，你可以先偷偷到 [官方文件](https://api.highcharts.com/highcharts/) 感受一下所謂的數量可觀。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10238356) -
