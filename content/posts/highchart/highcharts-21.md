---
title: 學到新資視了 - Highcharts / 圖表連動
date: 2020/10/5 11:35:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/JjXqYyz**

經過前面各種設定屬性與 Method 的轟炸後，我們先來個簡單的小應用，也算是給自己的一個小驗收。

---

## 實作目標

![](/img/content/highcharts-21/case.gif)

今天打算要來實作圖表連動的功能，主題是「公司部門年齡分佈與人數佔比」，功能如上圖所示，柱狀圖會有三個部門的數據列資料，且點擊數據列時會使圓餅圖更換標題，並且呈現特定部門的各年齡人數佔比，額外還提供一個按鈕來重新觀看各部門的人數佔比。而事前我們已得知的資料如下：

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

#### 1. 容器與元素準備

大略了解功能需求後，就要來一步步來完成應用了，首先把容器和按鈕準備一下吧，樣式部分就留給各位自由發揮了

```html
<div class="container">
  <div id="column"></div>
  <div id="pie"></div>
</div>
<button class="overview">返回看整體佔比</button>
```

<br/>

#### 2. 資料準備

接著把一些基本變數跟圖表資料準備一下，這個部分要注意的是「柱狀圖」和「圓餅圖」的資料格式，柱狀圖的部分我準備的是「數據列」的資料，而圓餅圖則是 Mapping 出了「數據點」的資料。

```javascript
const dataKeys = Object.keys(data);

const columnSeries = dataKeys.map(department => ({
  name: department,
  data: data[department]
}));

const piePoints = dataKeys.map(department => ({
  name: department,
  y: data[department].reduce((arr, val) => arr + val)
}));
```

<br/>

#### 3. 主題設定

再來先用「主題設定」把一些共同的設定先處理一下，像是顏色和版權標籤。

```javascript
Highcharts.setOptions({
  colors: colors,
  credits: { enabled: false }
});
```

<br/>

#### 4. 創建圖表與區塊設定

然後用 `Highcharts.chart()` 來把這次的兩個主要圖表處建出來，這邊我暫時還沒有設定「事件屬性」，而是先把基本的區塊設定給完成，讓圖表先出顯示出來，後面會再透過其他方式加上去。

> 記得要用變數將「圖表實例」存起來，之後才能呼叫其中的 Method。

```javascript
const column = document.querySelector('#column');
let columnChart = Highcharts.chart(column, {
  chart: { type: "column" },
  title: { text: "公司部門年齡分佈" },
  xAxis: {
    categories,
    labels: { format: "{value}歲" }
  },
  yAxis: { 
    title: { text: "人數" } 
  },
  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.category}: {point.y}人",
  },
  series: columnSeries
});

const pie = document.querySelector('#pie');
let pieChart = Highcharts.chart(pie, {
  chart: { type: "pie" },
  title: { text: "公司部門人數佔比" },
  tooltip: {
    headerFormat: "<b>{point.key}</b><br/>",
    pointFormat: "{point.percentage:.1f} %／{point.y}人",
  },
  plotOptions: {
    series: {
      size: "80%",
      states: { inactive: { enabled: false } }
    }
  },
  series: [{ data: piePoints }]
});
```

這邊我在圓餅圖設定了一個之前沒介紹的屬性 `series.states`，它可以開關數據列的狀態及調整樣式，像這次我把 `inactive` (非聚焦狀態) 給關閉，這樣當我在聚焦某個數據點(扇形)時，其他非聚焦狀態的數據點就不會被反灰了。想更了解這個屬性的話可以看 **[官方文件](https://api.highcharts.com/highcharts/series.line.states)**。

<img src="/img/content/highcharts-21/state.png" style="max-width: 800px;" />

<br/>

#### 5. 柱狀圖的事件設定

圖表都出來後，我們就要來處理事件的部分了，這邊用圖表的 `update()` 方法來為柱狀圖更新「繪圖區設定」，這樣所有數據列就都會被設定到了。那 `columnClick` 這個變數就是事件的回呼函式了，點擊發生時的邏輯就會寫在這裡面。

```javascript
columnChart.update({
  plotOptions: {
    series: {
      events: { click: columnClick }
    }
  }
});
```

**先來細數一下當點擊發生時會發生哪些事：**

1. 圓餅圖的數據點顏色會變成該部門數據列的顏色漸層
2. 圓餅圖的數據點資料會改為該部門的各年齡人數資料
3. 圓餅圖的標題會顯示該部門的的名稱

<br/>

知道要做哪些事情後，就可以來設計邏輯了，主要概念會是點擊柱狀圖數據列時可以透過 `event` 事件物件來取得「數據列物件」，並利用數據列的顏色、資料和名稱來改變圓餅圖的設定。

```javascript
function columnClick() {
  const { color, points, name } = event.point.series;
  console.log(color, points, name);
};
```

首先顏色因為是自己設定的，所以已經知道會是 `rgb` 格式了，若要把圓餅圖數據點的顏色改成漸層色，可以轉成 `rgba` 後利用透明度做出漸層效果，所以可以先設計一個調整顏色透明度的輔助函式吧。

```javascript
function rgbToRgba(rgb, alpha) {
  return rgb.replace("rgb", "rgba").replace(")", `,${alpha})`);
};
```

再來就可以透過 `points` 來 Mapping 出我們要的數據點格式，並且使用 `setData()` 和 `setTitle()` 來更新圓餅圖了。


```javascript
function columnClick() {
  const { color, points, name } = event.point.series;
  let data = points.map((point, index) => ({
    y: point.y,
    color: rgbToRgba(color, 1 - index * 0.05),
    name: point.category
  }));
  pieChart.series[0].setData(data);
  pieChart.setTitle({ text: `${name}年齡佔比` });
};
```

<br/>

#### 6. 返回觀看整體佔比

最後，把按鈕也加上原生的 `click` 事件，並在回呼函式中將圓餅圖改回最初的設定內容就大公告成了！

```javascript
const overview = document.querySelector('.overview');
overview.addEventListener("click", function() {
  pieChart.series[0].setData(piePoints);
  pieChart.setTitle({ text: `公司部門人數佔比` })
});
```

<br/>

今天的範例比較著重在「事件屬性」和「方法」的使用，是否有幫助大家熟悉使用呢？另外如果對於「主題設定」、「繪圖區設定」、「格式屬性」來不太理解，也可以利用這個範例來複習一下。

接著明天，要用同一個資料案例來示範「雙層圓餅圖」的實作技巧。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10249008) -
