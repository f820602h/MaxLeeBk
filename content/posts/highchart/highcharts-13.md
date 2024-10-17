---
title: 學到新資視了 - Highcharts / 顏色屬性
date: 2020/9/27 11:00:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/poyZgWx**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

我猜可能有些人在前面幾天一直很在意到底要怎麼更換「數據列／點」的顏色吧，還是其實已經有人等不及，自己偷偷跑去翻出調整顏色的屬性了。

Highcharts 當然是可以調整顏色的，但不是我不想跟大家介紹，而是能夠設定顏色的方法很多，而且又有權重的問題，所以才會想接在「繪圖區設定」後面介紹顏色的部分。

---

## 數據列顏色

昨天有講到繪圖區、數據列、數據點的權重大小，而調整顏色的屬性除了在這些區塊裡都可以調整外，顏色本身也有獨立的屬性可以設定。

```javascript
var myChart = Highcharts.chart(container, {
  colors: ["red", "orange"],    // 所有數據列依序採用陣列中顏色 
  plotOptions: {
    series:{ 
      color: "green",           // 所有數據列都採用這個顏色
      colorByPoint: true,       // 所有數據列是否都用colors設定數據點顏色
      colors: ["cyan", "navy"], // 所有數據列的數據點依序採用陣列中顏色
    },
    line: { 
      color: "blue",            // 指定類型數據列都採用這個顏色
      colorByPoint: true,       // 指定類型數據列是否都用colors設定數據點顏色
      colors: ["lime", "plum"], // 指定類型數據列的數據點依序採用陣列中顏色
     }
  },
  series: [{
    color: "purple",            // 這組數據列採用這個顏色
    colorByPoint: true,         // 是否要用colors設定數據點顏色
    colors: ["pink", "gray"],   // 這組數據列裡的數據點依序採用陣列中顏色
    data: [{ color: "black" }]  // 這個數據點採用這個顏色
  }]
});
```

是不是看得頭都暈了？這樣應該知道為何我要等的現在才講顏色了吧？那下面就從權重最低到最高一個個詳細介紹。

<br/>

### # options.colors
`型別: Array[String]` `預設: 請見下方`

這個顏色屬性直接隸屬於 `options` 物件底下，而它的值是一組陣列，陣列裡必須是合法的顏色字串，然後 **「所有數據列」** 便會依據它自己的順序從 `colors` 裡拉出顏色來設定，**假如顏色用完了就會在回到第一個繼續循環**。

這也是為什麼我們前面的範例總是藍色的，因為它被設定的是預設 `colors` 裡的第一個顏色 `#7cb5ec`。

```javascript
default = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"]
``` 

<img src="/img/content/highcharts-13/color.png" style="max-width: 600px;" />

<br/>

### # plotOptions.series.color
`型別: String` `預設: undefined`

這個顏色屬性就非常很單純了，就是把 **「所有數據列」** 改成指定的顏色。

<br/>

### # plotOptions.[type].color
`型別: String` `預設: undefined`

由於昨天解釋過繪圖區的權重關係，所以這個顏色屬性應該也不難懂，就是把 **「所有指定類型的數據列」** 改成指定的顏色，須要特別注意的是，假如你設定的圖表種類未涵蓋所有圖表的話，那其他圖表會「從頭」開始設定 `options.colors` 中的顏色，並且跳過已經有指定顏色的圖表。

```javascript
var myChart = Highcharts.chart(container, {
  colors: ["green", "blue", "purple"], // 所有數據列依序採用陣列中顏色 
  plotOptions: {
    column: { color: "red" }
  },
  series: [
    { type: "column", data: [2, 2, 2] }, // 紅色
    { type: "line",   data: [6, 6, 6] }, // 綠色
    { type: "column", data: [4, 4, 4] }, // 紅色
    { type: "line",   data: [2, 2, 2] }  // 藍色
  ]
});
```

<br/>

### # series.color
`型別: String` `預設: undefined`

這個顏色屬性一樣很簡單，就是把 **「這個數據列」** 改成指定的顏色。而且和上一個屬性一樣，剩下的數據列會「從頭」開始設定 `options.colors` 中的顏色，並且跳過已經有指定顏色的圖表。

<br/>

### # plotOptions.series.colorByPoint
`型別: Boolean` `預設: false`

這個屬性可以決定是否要用 `colors` 來依序設定 **「所有數據列的數據點顏色」**，這裡指的 `colors` 不一定是 `options.colors`，而是權重最高的 `colors`。

<br/>

### # plotOptions.series.colors
`型別: Array[String]` `預設: undefined`

假如你的數據列沒有開啟 `colorByPoint`，那這個顏色屬性基本上就沒以任何作用，但如果開啟了，這個屬性就會覆蓋 `options.colors`，並用你提供的顏色陣列來依序設定**「所有數據列的數據點顏色」**。
```javascript
var myChart = Highcharts.chart(container, {
  colors: ["green", "blue", "purple"],
  plotOptions: {
    series: {
      colorByPoint: true,
      colors: ["pink", "red", "orange"]
    }
  },
  series: [{ 
    // 粉紅色, 紅色, 橘色, 粉紅色, 紅色
    data: [5, 3, 7, 4, 10] 
  }] 
});
```

<br/>

### # plotOptions.[type].colorByPoint / plotOptions.[type].colors

這組應該就不用多作介紹了吧，作用和前面一樣，只不過對象換成 **「所有指定類型數據列的數據點顏色」**。

```javascript
var myChart = Highcharts.chart(container, {
  colors: ["green", "blue", "purple"],
  plotOptions: {
    series: {
      colors: ["pink", "red", "orange"]
    },
    line: {
      colorByPoint: true,
    }
  },
  series: [
    // 粉紅色, 紅色, 橘色, 粉紅色, 紅色
    { type: "line", data: [5, 5, 5, 5, 5] },
    // 所有數據列都是綠色的
    { type: "column", data: [3, 3, 3, 3, 3] },
    // 粉紅色, 紅色, 橘色, 粉紅色, 紅色
    { type: "line", data: [2, 2, 2, 2, 2] }
  ] 
});
```

<img src="/img/content/highcharts-13/color1.png" style="max-width: 600px;" />

<br/>

### # series.colorByPoint / series.colors

數據列中也是有同一組的設定，也是必須要 `colorByPoint` 開啟才會作用，不過作用對象就換成了 **「單一數據列的數據點顏色」**。

```javascript
var myChart = Highcharts.chart(container, {
  chart: { type: "column" },
  colors: ["green", "blue", "purple"],
  plotOptions: {
    series: {
      colorByPoint: true,
      colors: ["pink", "red", "orange"]
    },
  },
  series: [
    // 粉紅色, 紅色, 橘色, 粉紅色, 紅色
    { data: [5, 3, 7, 4, 10] },
    // 所有數據列都是綠色的
    { colorByPoint: false, data: [5, 3, 7, 4, 10] },
    // 黑色, 灰色, 褐色, 黑色, 灰色
    { colors: ["black", "gray", "brown"], data: [5, 3, 7, 4, 10] }
  ] 
});
```

<img src="/img/content/highcharts-13/color2.png" style="max-width: 600px;" />

<br/>

### # series.data.color
`型別: String` `預設: undefined`

這個顏色屬性是權重最高的，它可以決定 **「單一數據點顏色」**，不過跟數據列不同的是，它會直接覆蓋 `colors` 設定的顏色，而 **不會被跳過**。

```javascript
var myChart = Highcharts.chart(container, {
  chart: { type: "column" },
  colors: ["green", "blue", "purple"],
  plotOptions: {
    series: { colorByPoint: true }
  },
  series: [{ 
    // 綠色, 紅色, 紫色, 綠色, 藍色
    data: [5, { y: 3, color: "red" }, 7, 4, 10]
  }] 
});
```

<img src="/img/content/highcharts-13/color3.png" style="max-width: 600px;" />

<br/>

> 補充： 圓餅圖這類以「數據點」為單位的圖表類型，`colorByPoint` 是強制開啟無法調整的。

<br/>

今天完全在物理上體會了什麼叫「給你一點顏色瞧瞧」，單單一個顏色 Highcharts 就可以搞得那麼複雜。不過也因為這樣，在圖表的設計上就可以有很大的發揮空間，例如依據數據點的數值大小來調整顏色深淺。

而明天終於要來填「格式化屬性」的坑了。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10244723) -
