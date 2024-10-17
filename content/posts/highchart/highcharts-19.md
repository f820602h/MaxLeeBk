---
title: 學到新資視了 - Highcharts / 資料更新 Method
date: 2020/10/3 10:52:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/qBZvgGv**

在 Highcharts 中呢，除了五花八門的設定屬性之外，還有不少內建的函式可以操作圖表，這種函式通常都稱之為「方法（Method）」。

圖表最重要的目的在於呈現資料，而資料在網頁中不僅重要卻還時常變化，時常都會利用非同步請求來取得資料，而在請求回應後就需要有辦法改變圖表中的資料或設定，所以今天就是要來專門講講這些負責 **更新圖表資料或設定** 的 Method。

---

## 資料更新 Method

現在繪製圖表對我們來說已經駕輕就熟了，但目前圖表都是靜態的，頂多綁個事件增加一下互動功能，但假如今天想要做一個隨時更新資料的「動態圖表」好像就辦不到了。好在 Highcharts 提供了一些 Method 來讓我們可以在 **圖表載入完畢後** 還能操作它。

> 昨天在事件屬性中有提到的 `show()`、`update()`...等等都屬於 Method，不過今天先專注在「更新」這類的 Method 上。

```javascript
// 創建一個圖表，設定內容省略
var chart = Highcharts.chart(container, options);

// 圖表的更新 Method
chart.update();
chart.addSeries();
// 數據列的更新 Method
chart.series[0].update();
chart.series[0].remove();
chart.series[0].setData();
chart.series[0].addPoint();
chart.series[0].removePoint();
// 數據點的更新 Method
chart.series[0].data[0].update();
chart.series[0].data[0].remove();
```

<br/>

不曉得大家有沒有好奇過，為什麼在創建圖表的時候要用一個變數來儲存呢？原來在創建圖表的時候，Highcharts 會建立一個圖表的 **實例(Instance)**，其實也就是前面提過的「圖表物件」，裡面也包含了數據列、數據點、座標軸等等區塊的實例／物件。

而每個實例裡就會有它們專屬的 Method，當要使用時就必須從中索引後呼叫，所以才需要用變數接住實例，好方便我們呼叫。

---

## 整體圖表更新 Method

> 將圖表實例儲存於變數中是必要的，以此才能選取到該圖表並呼叫其方法。

<br/>

### # chart.update(options)
`options: Object`

這個 Method 可以更新圖表內的任何設定，包括數據列、座標軸等等都能夠更新，而使用方式便是將要更新
的 `options` 物件以參數傳入，而 Highcharts 一樣會幫你做深層的合併，所以你不需要把未更動的設定再撰寫一遍。

```javascript
var chart = Highcharts.chart(container, {
  title: { text: "我的圖表" },
  credits: { enabled: false },
  series: [
    { name: "數據列1", data: [1,2,3] },
    { name: "數據列2", data: [4,5,6] }
  ]        
});
// 只有第一組數據列會被更新，但第二組並不會消失
chart.update({
  title: { text: "我的圖表(已更新)" },
  series: [{ data: [10,20,30] }]
});
```

<br/>

### # chart.addSeries(series)
`series: Object`

昨天其實有簡單帶到這個 Method，它可以在圖表中新增一組新的數據列，只要把新數據列的設定物件傳進參數即可。

```javascript
chart.addSeries({
  name: "新數據列",
  dataLabels: { enabled: true },
  data: [[10,20], [30,40], [50,60]]
});
```

---

## 數據列更新 Method

> 要呼叫數據列的 Method 需要透過圖表實例裡的 `series` 陣列裡去找到你要操作的數據列。

<br/>

### # series.update(options)
`options: Object`

和前面的 `chart.update()` 是一樣概念，將你要更新的數據列設定物件作為參數傳入函式中，即可改變數據列的設定。

```javascript
var chart = Highcharts.chart(container, {
  series: [
    { name: "數據列1", data: [1,2,3] },
    { name: "數據列2", data: [4,5,6] }
  ]
});
// 第二組數據列將被更新
chart.series[1].update({
  name: "數據列2(被更新)",
  color: "red",
  data: [40, 50, 60]
});
```

<br/>

### # series.remove()

這個 Method 就單純很多，選取你要的數據列後呼叫這個方法，該數據點便會從圖表中移除。

```javascript
chart.series[0].remove();
```

<br/>

### # series.setData(data)
`data: Array`

如果僅僅只是要改變數據列的 `data` 屬性，那可以選擇使用這個 Method，而不需要使用 `update()`，呼叫時只要傳入新的數據點陣列即可。

```javascript
var chart = Highcharts.chart(container, {
  series: [{ data: [1,2,3] }]
});
// 數據列的數據將會改變
chart.series[0].setData([4,5,6]);
```

<br/>

### # series.addPoint(point)
`point: Number|Array|Object`

看過前面的 `addSeries()` 之後應該很好理解，就是在你要操作的數據列中新增一個數據點，而傳入的參數可以接受任何形式的數據點格式，形式種類之前在「數據點設定」的章節中有介紹過。

```javascript
chart.series[0].addPoint({x: 10, y: 10});
```

<br/>

### # series.removePoint(index)
`index: Number`

在你呼叫這個 Method 時，會從你正在操作的數據列中移除一個數據點，而你必須傳入該數據點的索引值，Highcharts 才知道要移除的是哪一個。

```javascript
var chart = Highcharts.chart(container, {
  series: [{ data: [6,7,8,9,10] }]
});
// 第三個數據點將會被移除
chart.series[0].removePoint(2);
```

---

## 數據點更新 Method

> 要呼叫數據點的 Method 需要透過圖表實例裡的 `series.data` 陣列或 `series.points` 陣列裡去找到你要操作的數據點。

<br/>

### # point.update(options)
`options: Number|Array|Object`

和前面的所有的 `update` 方法都是一樣的，將你要更新的數據點設定作為參數傳入函式中，即可改變數據點的設定，不過此 Method 的參數可以接受任何數據點設定格式。

```javascript
var chart = Highcharts.chart(container, {
  series: [{ data: [10, 11, 12, 13, 14] }]
});
// 第四個數據點將被更新
chart.series[0].data[3].update({ y: 20, color: "red" });
```

<br/>

### # point.remove()

也是很單純的一個 Method，選取好要操作的數據點後並呼叫函式，便會將該數據點從數據列中移除。

```javascript
chart.series[0].data[3].remove();
```

---

## 指定選取

我們把今天的更新 Method 都認識完了，不過卻發現，若是想要操作數據列或數據點似乎稍嫌麻煩，必須先知道他們的索引值，還要一層層往裡面找才能選到，所以這邊要額外介紹兩個設定屬性：

<br/>

### # series.id / series.data.id
`型別: String` `預設: undefined`

這兩個屬性可以為數據列／數據點設定 ID Name，這樣就可以透過 `chart.get()` 這個 Method 來直接選取它們。

```javascript
var myChart = Highcharts.chart(container, {
  series: [{ 
    id: "mySeries",
    data: [1, 2, {y: 3, id: "myPoint" }]
  }]
});

let series = myChart.get("mySeries");
let point = myChart.get("myPoint");
```

---

今天認識的這些 Method 都可以在圖表載入完成後去操作圖表，好處在於可以動態的更新圖表中的資料或設定，讓圖表可以跟整個網頁互動，或是利用非同步事件來做到下面這樣的效果，希望大家吸收的還順利，明天會繼續介紹其他的常用 Method。

<img src="/img/content/highcharts-19/dynamic.gif" style="max-width: 600px;" />

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10248326) -
