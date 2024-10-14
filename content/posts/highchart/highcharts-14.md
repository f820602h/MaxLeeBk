---
title: 學到新資視了 - Highcharts / 格式化屬性
date: 2020/9/28 18:10:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/mdPjEEZ**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

在 Highcharts 中，格式化屬性是一個很強大的功能，它可以讓我們把圖表做得更細緻完善，例如將座標軸的刻度標籤加上單位、千分位，或是把提示框的內容補充的更詳盡等等...

---

## 格式化屬性 - 基本介紹

雖然我們已經看過格式化屬性很多次了，但是卻一直避過不談，它到底是做什麼用的？其實它做的事情就是 **「把一系列相似的項目轉換為相同規格的文字」**，可以用一個簡單的 JavaScript 程式碼來解釋這個過程：

```javascript
let max =  { name: "Max", age: "27" };
let sam =  { name: "Sam", age: "32" };
let items = [max, sam];

let formatter = function(){
  return `${this.name} is ${this.age} years old`;
} 

let result = items.map(item => formatter.apply(item)); 
// ["Max is 27 years old", "Sam is 32 years old"]
```

Highcharts 就是這樣把一系列的物件輸出成我們想要的文字格式，最後呈現在標籤上或內容裡。而這 **「一系列物件」** 在不同的區塊屬性中都不盡相同。

例如在「圖例設定」的格式化屬性中你可以拿到一組組的數據列物件，但在「座標軸設定」中你拿到的又會是一組組的刻度標籤物件。

<br/>

**而格式化屬性主要分佈在以下四個區塊設定中：**
- **圖例設定：** 調整圖例標籤
- **提示框設定：** 調整提示框內容
- **座標軸設定：** 調整刻度標籤
- **數據列設定：** 調整數據標籤


```javascript
var myChart = Highcharts.chart(container, {
  legend: {
    labelFormat: "",
    labelFormatter: function() {}
  },
  tooltip: {
    headerFormat: "",
    footerFormat: "",
    pointFormat: "",
    pointFormatter: function() {},
    formatter:  function() {}
  },
  xAxis: { // Y軸亦同
    labels: {
      format: "",
      formatter: function() {}
    }
  },
  series: [{ // 繪圖區和數據點亦同
    dataLabels: {
      format: "",
      formatter: function() {}
    }
  }]
});
```

看到這堆屬性大家可能又頭昏了，不過「格式化屬性」不像昨天的顏色屬性那麼複雜，就只是屬性看起來多了點，如果仔細一看就會發現，其實格式化屬性就分為兩種，一個是用字串設定的 `format`，以及利用函式設定的 `formatter`。

所以我們只要先把這兩種設定方式搞清楚後，再看看每個區塊能拿到什麼樣的物件，就可以知道如何利用格式化屬性啦。

---

## 格式化屬性 - Format

先來介紹以字串設定的 `format`，假如希望顯示的文字格式不是太複雜，而且不需要特別的判斷或計算，那基本上 `format` 就已經可以滿足我們的需求了，設定技巧如下：

<br/>

#### # 格式語法
其實就和我們上面的 JavaScript 案例中使用的「ES6 - 模版字符串」有點類似，但只需要「大括號」即可。
```javascript
`這是一個變數: ${variables}` // ES6 - 模版字符串
"這是一個變數: {variables}" // Highcharts - format設定字串
```

<br/>

#### # HTML標籤
另外，格式化字串中可以使用部分 HTML 行內元素，像是 `<b>`、`<strong>`、`<i>`、`<em>`、`<br/>`、`<span>`，並且也可以加上行內樣式來調整外觀，但因為 Highcharts 是以 SVG 渲染的，所以只接受能夠與 SVG 相容的 CSS 屬性。

```javascript
"<b>這是一個變數</b>:<br/> <span style='color: red'>{variables}<span>"
```

<br/>

#### # 數字處理

最後，Highcharts 還提供了一些符號來幫助我們處理數字「千分位」與「小數點」。當中的「冒號」要接在你的變數名稱後，而「逗號」表示使用千分位符號，而後面的 `.0f` 表示要顯示小數點後第幾位。

```javascript
// 假如 variables 為 12500.333
"{variables:,.2f}" // 12 500.333
"{variables:.4f}" // 12500.3330
"{variables:,}" // 不可單獨使用！！！
```

> 你可能有發現千分位是用空白格開的，明天會教大家如何改變預設的千分位符號。

---

## 格式化屬性 - Formatter

再來是用函式設定的 `formatter` 屬性，這個函式必須返回一組字串，且不需要使用 Highcharts 的特殊語法，直接使用 JavaScript 的字串即可，而使用函式的好處就是可以對資料先進行計算或判斷處理。

<br/>

#### # 函式裡的This

其實 `formatter` 的原理和開頭的 JavaScript 程式碼一樣，Highcharts 會把一組一組的物件放進 `this` 裡。

以數據標籤來說，假如數據點有五個，那格式化函式就會執行五次，而每一次都可以從 `this` 裡拿到個別的 **「數據點物件」**，如此一來，就可以獲取需多資訊來進行判斷或計算。

<br/>

> **注意：** 因為需要使用 `this` 才能取得物件資料，所以不能使用箭頭函式，箭頭函式沒有 `this`。

```javascript
series: [{
  data: [5, 6, 7, 8, 9],
  dataLabels: {
    enabled: true,
    formatter: function() {
      console.log(this); // 會有五次console，每一次代表一個數據點
      return this.y // 數據點物件中 y 屬性即數據點數值
    }
  }
}]
```

<br/>

#### # 數字處理

在 `formatter` 函式中你可以呼叫 `Highcharts.numberFormat` 來處理「千分位」與「小數點」，不需要自己寫冗長的程式碼。

```javascript
formatter: function() {
  // 假如 this.y 為 12500.333
  return Highcharts.numberFormat(this.y, 4, ".", ",") // 輸出 12,500.3330
  return Highcharts.numberFormat(this.y, 2, ",", "")  // 輸出 12500.33
  return Highcharts.numberFormat(this.y, 0)  // 輸出 12 500
}
```

<br/>

#### # series.custom / series.data.custom
`型別: Any` `預設: undefined`

假如你很肯定某些資訊在 `this` 是沒有的，那可以在這兩個屬性中放入自定義的資料，這樣就可以在 `formatter` 中拿到這些資料了

```javascript
series: [{
  custom: { total: 35 },
  data: [5, 6, 7, 8, 9],
  dataLabels: {
    enabled: true,
    formatter: function() {
      let total = this.series.options.custom.total
      return Highcharts.numberFormat(this.y / total * 100, 1) + "%";
    }
  }
}]
```

---

## 格式化屬性 - 區塊屬性

了解兩種屬性的設定方式後，就可以來看看各個區塊裡的格式化屬性可以拿到什麼「物件」了。

但這些「物件」裡的屬性又是一個海量的存在，應該都夠我參加兩次鐵人賽了，所以就只大概簡介一下，如果想要深入了解，最好辦法還是直接使用看看，然後用 `formatter` 直接 `console.log(this)` 最快。

<br/>

![](/img/content/highcharts-14/config.png)

<br/>


>##### ※ 補充說明
> 這裡的「物件」指的是 Highcharts 將該區塊的相關資料包裝好後提供給格式化屬性的，並且只要是同一組的格式化屬性，拿到的物件都是相同的，因此 `this.y` 和 `{y}` 代表的都是一樣的值。
> 
> **注意：** 有些屬性 `format` 不支援，如果確定要使用的話就改用 `formatter` 吧！

<br/>

#### # 圖例文字標籤

圖例標籤的格式化屬性拿到的物件一般是「數據列物件」，但如果是圓餅圖這種以數據點為圖例單位的圖表，則是「數據點物件」，兩種物件長得不太一樣，不過常用的有 `name`、`color`、`index` 這幾個。

- **官方文件： [數據列物件](https://api.highcharts.com/class-reference/Highcharts.Series) / [數據點物件](https://api.highcharts.com/class-reference/Highcharts.Point)**


```javascript
// 以下為預設值
legend: {
  labelFormat: "{name}",
  labelFormatter: undefined
}
```

另外「數據點物件」還多了 `total`、`percentage` 這兩個直接幫你計算好的值，所以你就可以直接在圖例上顯示百分比。

<img src="/img/content/highcharts-14/legend.png" style="max-width: 600px;" />



#### # 提示框內容

提示框內容的格式化屬性是最多也最特別的，可以看看下方的說明圖可能較好理解，另外 `tooltip.formatter` 所拿到的物件屬性會受到 `tooltip.shared` 的影響，建議可以印出來看看差別。

> **注意：** `pointFormat` 在屬性前方必須加上 `point.` 例如 `{point.color}`，但並不清楚為何這個屬性多了這個規定。

這邊也提供我的應用給大家參考：**[https://codepen.io/max-lee/pen/bGpmmjj](https://codepen.io/max-lee/pen/bGpmmjj)**

- **官方文件： [數據點物件](https://api.highcharts.com/class-reference/Highcharts.Point) / [提示框內容物件](https://api.highcharts.com/class-reference/Highcharts.TooltipFormatterContextObject)**

```javascript
// 以下為預設值
tooltip: {
  headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
  footerFormat: '',
  pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b><br/>.',
  pointFormatter: undefined,
  formatter:  undefined
}
```

<img src="/img/content/highcharts-14/tooltip.png" style="max-width: 800px;" />

<br/>

#### # 座標軸刻度標籤

座標軸刻度標籤的格式化屬性拿到的物件是「刻度標籤物件」，裡面會有座標軸的相關設定屬性、圖表物件，以及該刻度所代表的Ｘ／Ｙ值 `value`，也有 `isFirst`、`isLast`，幫助你判斷該刻度是否為第一個或最後一個。

- **官方文件： [刻度標籤物件](https://api.highcharts.com/class-reference/Highcharts.AxisLabelsFormatterContextObject)**

```javascript
// 以下為預設值
xAxis: { // Y軸亦同
  labels: {
    format: "{value}",
    formatter: undefined
  }
}
```

<br/>

#### # 數據標籤

數據標籤的格式化屬性拿到的物件是「數據標籤物件」，基本上內含屬性就和圖例標籤是差不多的，不過同時包含了「數據列物件」、「數據點物件」，所以可用的數據又更多了。

另外繪圖區跟數據點也都可以設定格式化屬性，權重大小就和之前介紹的一樣。

- **官方文件： [數據標籤物件](https://api.highcharts.com/class-reference/Highcharts.PointLabelObject)**

```javascript
// 以下為預設值
series: [{ // 繪圖區和數據點亦同
  dataLabels: {
    format: "{point.value}",
    formatter: undefined
  }
}]
```

<br/>

今天又解決一個難纏的屬性，不過難歸難，格式化屬性在 Highcharts 中的重要性還是非常高的，大大提升了圖表的自定義程度，尤其提示框內容運用得宜的話，可以很大程度上的補充圖表資訊。

但如果真覺得很複雜的話，我推薦一律使用 `formatter`，寫起來就跟一般在寫 JavaScript 沒兩樣，想知道有哪些屬性也可以直接 `console`。

那接著明天，要帶大家完整設定出一個「日期座標軸」的圖表，當中涉及了座標軸設定、數據列設定以及今天的格式化屬性。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10245718) -
