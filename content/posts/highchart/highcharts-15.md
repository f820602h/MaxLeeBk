---
title: 資視就是力量 - Highcharts / 日期座標軸&語言設定
date: 2020/9/29 12:30:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/GRZwKjW**

今天要又要來填坑了，在座標軸設定時有說會特別介紹「日期座標軸」，因為它的設定不僅僅與「座標軸設定」有關，還必須連動「數據列設定」，並且搭配昨天介紹的「格式化屬性」，算是比較複雜的應用。

<br/>

另外今天還會提到「語言設定」，它可以讓我們定義一些因 **地區習慣** 不同而變化的預設字符，包含昨天的千份位符號以及今天會用到的月份、星期名稱...等等。

---

## 日期座標軸

當圖表的資料是包含時間維度的，那就有使用「日期座標軸的」需求，用來標示個別數據點的測量／紀錄時間。

而在 **[座標軸設定](/posts/highchart/highcharts-9/#axistype)** 介紹過了，只要將 `Axis.type` 設為 `datetime` 即可將座標軸設定為「日期座標軸」。

```javascript
var myChart = Highcharts.chart(container, {
  title: { text: "臺北市每日氣溫" },
  subtitle: { text: "2020年9月第一週" },
  credits: { enabled: false },
  xAxis: {
    type: "datetime"
  },
  yAxis: {
    title: { text: "攝氏溫度" },
    labels: { format: "{value}°C"}
  },
  series: [{
    name: "平均溫度",
    data: [30, 30, 31, 28, 29, 29, 28]
  }]
});
```

但如果僅僅只是這樣設定，你會發現座標軸的刻度與 **每日氣溫** 這個圖表主題不太相符，因為「日期座標軸」預設是以 `1970/1/1` 作為數據點的起始值，並且間距為 `1毫秒`。那下面我們就以完成這張圖表為目標，一步步學習如何設定「日期座標軸」吧。

<img src="/img/content/highcharts-15/axisNoDate.png" style="max-width: 650px;" />

#### # 調整座標刻度間距

<br/>

首先，我們先將座標刻度的間距改為「一天」，這裡要運用的屬性是 `Axis.tickInterval`，之前在 **[座標軸設定](/posts/highchart/highcharts-9/#axistickinterval-axisminortickinterval)** 裡一樣有介紹過。

```javascript
xAxis: {
  type: "datetime",
  tickInterval: 24 * 3600 * 1000 // 一天的毫秒數
},
```

設定完之後會發現座標刻度都消失了，只剩下一個 `1.Jan`，因為雖然刻度間距已經調整為一天了，但數據點之間的時間間隔還是被 Highcharts 認定為是 `1毫秒`。所以對圖表來說，這七個點都是同一天的數據，自然也就不需要顯示第二天、第三天的刻度了。

<img src="/img/content/highcharts-15/tickInterval.png" style="max-width: 650px;" />

<br/>

#### # 調整數據點間距

<br/>

為了解決上面的問題，要利用之前在 **[數據點設定](/posts/highchart/highcharts-11/#seriespointinterval)** 中提過的 `series.pointInterval` 來將數據點的間距改為一天。

```javascript
series: [{
  name: "平均溫度",
  data: [30, 30, 31, 28, 29, 29, 28],
  pointInterval: 24 * 3600 * 1000 // 一天的毫秒數
}]
```

這樣座標刻度與數據點就對上了，剛好一天一個點，不過目前的起始Ｘ軸座標還是 `1970/1/1`，所以接下來要將日期改成我們要的九月第一週。

<img src="/img/content/highcharts-15/pointInterval.png" style="max-width: 650px;" />

<br/>

#### # 調整數據點起始Ｘ值

<br/>

由於我們設定數據點資料的方式是「數值設定法」，所以數據點本身沒有Ｘ軸數值，使得 Highcharts 以 `1970/1/1 零毫秒` 作為我們第一個數據點的起始Ｘ軸數值，所以我們要用 `series.pointStart` 來將數據點的起始設定為 `8/31`，也就是九月第一週的星期一。

```javascript
series: [{
  name: "平均溫度",
  data: [30, 30, 31, 28, 29, 29, 28],
  pointStart: new Date("2020/8/31").getTime(),
  pointInterval: 24 * 3600 * 1000 
}]
```

在使用日期座標軸的圖表中，數據點Ｘ軸數值是以「時間戳數值」來表示的，所以我們只要傳入 `2020/8/31` 這一天的時間戳數值即可。

但如此設定後，卻發現數據點發生了偏移，而且看了一下第一個數據點的提示框，發現起始點竟然不是 `2020/8/31` 而是 `2020/8/30 16:00`，原來 Highcharts 是以格林威治的時間來計算的，但 `new Date()` 拿到的是台灣本地時間，所以才會早了八個小時。

<br/>

> 台灣的時區是 `GMT+8`，比格林威治標準時間快八個小時。所以在台灣進入 `2020/8/31 00:00` 時，格林威治還在 `2020/8/30 16:00`。

<img src="/img/content/highcharts-15/pointStart.png" style="max-width: 650px;" />

<br/>

#### # 調整時區的時間差

<br/>

為了讓圖表的數據點時間點和刻度可以對得起來，就要處理因為時區所造成的時間差，這裡有兩種方法提供給大家。

你可以使用「時間設定」裡的 `time.timezoneOffset` 來告訴 Highcharts 你的時區偏移隔離威治多少，而這個數值可以透過 `getTimezoneOffset` 這個日期方法來取得。

```javascript
let offset = new Date().getTimezoneOffset(); // -480

var myChart = Highcharts.chart(container, {
  time: { timezoneOffset: offset }
});
```

或是比較簡單的做法是以 `Date.UTC` 來取得時間戳數值，而非 `new Date()`，因為它可以直接取得國際標準時間的時間戳。

```javascript
series: [{
  name: "平均溫度",
  data: [30, 30, 31, 28, 29, 29, 28],
  pointStart: Date.UTC(2020, 7, 31),
  pointInterval: 24 * 3600 * 1000 
}]
```

如此一來，我們就有一個時間完全正確的圖表了。

<img src="/img/content/highcharts-15/utc.png" style="max-width: 650px;" />

<br/>

#### # 指定時間的數據點

<br/>

雖然目前的成果基本滿足需求，但假如 `9/3 中午12:00` 有一個歷年高溫我們想要加到圖表中，那該怎麼辦？

由於我們已經利用 `pointStart` 設定了數據點間隔，如果從中穿插一個點，只會讓圖表多增加一天而已，所以在加入這個數據點時，我們要直接為它指定時間戳在Ｘ軸數值。

```javascript
let specifyPoint = {
  x: new Date("2020/9/3 12:00").getTime(),
  y: 36,
  color: "red",
  custom: "中午12:00"
} 

var myChart = Highcharts.chart(container, {
  series: [{
    name: "平均溫度",
    data: [30, 30, 31, 28, specifyPoint, 29, 29, 28],
    pointStart: new Date("2020/8/31").getTime(),
    pointInterval: 24 * 3600 * 1000 
  }]
});
```

這樣就可以有指定時間的數據點了，另外，其實你也可以不用 `pointStart` 和 `pointInterval`，完全使用指定的Ｘ軸數值來製作日期座標軸圖表。

<img src="/img/content/highcharts-15/specifyPoint.png" style="max-width: 650px;" />

<br/>

#### # 語言設定

<br/>

到這裡，我們的溫度圖表已經完全可以拿來提供給使用者觀看了，可是看著英文的月份和星期實在是有點不親切，為了改變這些 Highcharts 預設的字符，必須使用全域的「語言設定」。

```javascript
Highcharts.setOptions({
  lang: {
    months: ['一月', '二月', .... '十二月'], // 中間省略
    shortMonths: ['1月', '2月', .... '12月'], // 中間省略
    weekdays: ["星期一","星期二", .... "星期日"] // 中間省略
  }
})

var myChart = Highcharts.chart(container, {
  //...省略
});
```

程式碼中可以看到一個新的方法 `Highcharts.setOptions`，它是用來設定全域設定的，影響範圍是頁面中的全部圖表，所以只要設定一次即可。其中「語言設定」必須使用這個方式來定義，這裡我們將月份和星期改成中文的版本。

如此一來，刻度標籤和提示框就有親切的中文顯示囉～

<img src="/img/content/highcharts-15/lang.png" style="max-width: 650px;" />

> 另外昨天提到的小數點與千分位符號也是在「語言設定」中調整的。
```javascript
lang: {
  decimalPoint: ".", // 小數點預設值
  thousandsSep: "\u0020" // 千分位預設值，\u0020 為空白符號
}
```

<br/>

#### # 日期格式化

<br/>

雖然已經有中文了，不過日期的字串格式似乎不太符合台灣人的習慣，這時候就可以運用昨天才學到的格式化屬性來調整了，而且 Highcharts 一樣有提供日期的特殊符號可以使用。

<img src="/img/content/highcharts-15/dateSymbol.png" style="max-width: 500px;" />

```javascript
var myChart = Highcharts.chart(container, {
  yAxis: {
    title: { text: "攝氏溫度" },
    labels: { format: "{value}°C"}
  },
  tooltip: {
    headerFormat: "{point.key:%Y/%m/%d %A}<br/>",
    pointFormatter() {
      let type =  this.custom ? "最高溫度" : "平均溫度";
      let time = this.custom ? `(${this.custom})` : "" ;
      return `${type}: ${this.y}°C ${time}`
    }
  },
});
```

最後把上面的符號表規則應用在昨天學到的格式化屬性後，我們就有一個非常完美的客製化圖表了，同時也把「日期座標軸」的設定方法和應用搞清楚了。

<img src="/img/content/highcharts-15/format.png" style="max-width: 650px;" />

<br/>

今天利用了一整個範例來學習「日期座標軸」，並且成功製作了一個包含時間維度的圖表，相信未來如果有類似需求，各位應該可以易如反掌得解決了。而明天要繼續跟大家介紹的是「主題設定」。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10246182) -
