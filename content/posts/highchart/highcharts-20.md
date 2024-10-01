---
title: 資視就是力量 - Highcharts / 其他實用 Method
date: 2020/10/4 11:47:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

Highcharts 的方法（Method）當然不止昨天介紹的「資料更新」這種類型，還有很多方便好用的 Method，而且有了它們，我們就可以在頁面的其他程式邏輯中操作圖表，讓圖表和網頁更密切的結合。

---

## 全域 Method

當我們在網頁中引入 Highcharts 時，`window` 底下就會被註冊一個 `Highcharts` 物件，裡面會有許多函式可以使用，我習慣叫它們「全域方法」，因為你不需要建立圖表就可以在網頁中的任何位置呼叫它們，像是最重要的`Highcharts.chart()` 就是其中一個全域方法。

```javascript
console.log(window.Highcharts);
Highcharts.chart(container, options); // 建立一個新的圖表
Highcharts.setOptions(options);       // 主題設定(全域性設定)
```

而除了 `chart()`、`setOptions()` 這些核心函式外，`Highcharts` 底下其實還有很多輔助類型的函式供我們使用，像是在「格式化屬性」中介紹的 `numberFormat()` 就屬於輔助性的函式，而下面要介紹的都是屬於這類的 Method。

<br/>

#### # Highcharts.arrayMax(data) / Highcharts.arrayMin(data)
`data: Array`

這兩個 Method 非常的方便，可以在一組陣列裡找到最大／最小的值並將它返回。

```javascript
console.log(Highcharts.arrayMax([3, 9, 4, 11, 2])); // 11
```

<br/>

#### # Highcharts.fireEvent(el, event)
`el: targetObject` `event: String` 

這個 Method 可以讓你主動觸發事件，第一個參數要傳入要觸發事件的目標，第二個參數則是事件名稱。

```javascript
function clickHandle() {
  console.log("click fire");
};
var myChart = Highcharts.chart(container, {
  series: [{ data: [1,2,3], events: clickHandle }]        
});

Highcharts.fireEvent(myChart.series[0], "click");
// "click fire"
```

<br/>

#### # Highcharts.merge(obj, obj,...)
`obj: Object` 

你可用這個 Method 來把多個物件進行深層合併，就像主題設定、資料更新 Method 作的事情一樣。

```javascript
let obj1 = { a: 1, b: { x: 5, y: 10 } };
let obj2 = { b: { z: 15 }, c: 2 };
let obj3 = { a: 10, c: 20, d: 3 };

let newObj = Highcharts.merge(obj1, obj2, obj3);
// { a: 10, b: { x: 5, y: 10, z: 15}, c: 20, d: 3 }
```

<br/>

> 全域方法還有不少，但這邊就介紹個功能比較實用的，想看全部可以到  **[官方文件](https://api.highcharts.com/class-reference/Highcharts#toc12)**。


---

## 整體圖表 Method

> 整體圖表的 Method 昨天有介紹過了，必須要先用 `Highcharts.chart()` 建立一個圖表後，才能透過「圖表物件」去呼叫下面這些方法。

<br/>

#### # chart.setSize(width, height)
`width: Number` `height: Number`

這個 Method 可以改變圖表的寬高尺寸，單純卻實用的功能。

```javascript
var chart = Highcharts.chart(container, options);
chart.setSize(800, 500);
chart.setSize(800); // 只更改寬度
chart.setSize(undefined, 800); // 只更改高度
```

<br/>

#### # chart.setTitle(options) / chart.setSubtitle(options)
`options: Object`

這兩 Method 是用來更新主標題／副標題的設定的，只要把想更新的設定物件作為參數傳入即可。

```javascript
var chart = Highcharts.chart(container, options);
chart.setTitle({
  text: "新的標題文字",
  style: { color: "red" }
});
```

<br/>

#### # chart.destroy()

如果你想要將一整個圖表移除可以呼叫這個 Method。

```javascript
var chart = Highcharts.chart(container, options);
chart.destroy();
```

---

## 數據列 Method

> 數據列 Method 也和昨天說明的一樣，必須要取得你要操作的「數據列物件」後才能呼叫其方法。

<br/>

#### # series.setVisible(visible)
`visible: Boolean|undefined`

這個 Method 可以用來顯示或隱藏數據列，傳入 `true` 作為參數則顯示，傳入 `false` 則隱藏，如果不傳參就會自動進行切換。

```javascript
var chart = Highcharts.chart(container, {
  series: [{ data: [1, 2, 3] }]
});
chart.series[0].setVisible(false); // 隱藏，等同 hide()
chart.series[0].setVisible(true); // 顯示，等同 show()
chart.series[0].setVisible(); // 自動切換 顯示<=>隱藏
```

<br/>

#### # series.getName()

一個很簡單的 Method，呼叫後可以取得該數據列的名字。

```javascript
var chart = Highcharts.chart(container, {
  series: [
    { name: "數據列A", data: [1, 2, 3] },
    { name: "數據列B", data: [1, 2, 3] }
  ]
});
let result = chart.series.map(series => series.getName());
// ["數據列A", "數據列B"]
```

<br/>

#### # series.is(type)
`visible: String`

也是一個很單純的 Method，可以幫你判斷一組數據列的類型，例如以 `"column"` 作為參數，便會判斷此數據列是否為柱狀圖並回傳布林值。

```javascript
var chart = Highcharts.chart(container, {
  chart: { type: "column" }
  series: [
    { type: "line", data: [1, 2, 3] },
    { data: [1, 2, 3] }
  ]
});
let result = chart.series.map(series => series.is("column"));
// [false, true]
```

---

## 數據點 Method

> 數據點 Method 也是一樣，必須要取得你要操作的「數據點物件」後才能呼叫其方法。

<br/>

#### # point.getClassName()

假如你有為數據點設定 `className` 屬性，那你就可以透過這個 Method 來得到其屬性值。

```javascript
var chart = Highcharts.chart(container, {
  series: [{ 
    data: [
      {className: "point-1", y: 10},
      {className: "point-2", y: 20},
    ] 
  }]
});
let result = chart.series[0].data.map(point => point.getClassName());
// ["point-1", "point-2"]
```

<br/>

#### # point.onMouseOver()

這個 Method 可以主動出發數據點的 `mouseOver` 事件，而且就算你沒有設定事件屬性，依然會使數據點進入聚焦狀態。

```javascript
chart.series[0].data[0].onMouseOver();
```

<br/>

#### # point.select()

這個 Method 可以使用來選取數據點，如果有設定 `select` 事件的話也會被觸發，而且可以無視 `allowPointSelect` 的設定。

```javascript
var chart = Highcharts.chart(container, {
  series: [{
    allowPointSelect: false,
    data: [1, 2, 3, 4]
  }]
});
chart.series[0].data[3].select(); // 依然可以選取數據點
```

<br/>

今天介紹的 Method 其實不多，而且使用方式也不是非常複雜，所以就不特別附上範例了。

隨著這個章節的結束，我們也算是掌握了 Highcharts 的核心基礎，包括圖表元素、主題、響應式設定..等「基本API」，以及事件處理、圖表操作的「進階API」。而後面幾天的時間則會開始分享一些小技巧以及進階圖表的實作，透過簡單的範例來讓大家更熟悉 Highcharts 的應用。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10248806) -
