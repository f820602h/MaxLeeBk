---
title: 資視就是力量 - Highcharts / 提示框設定
date: 2020/9/21 09:39:00
tags: [JavaScript,Highcharts,12th鐵人賽]
---

> 本章節範例：**https://codepen.io/max-lee/pen/gOroOjd**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

提示框這個圖表元素算是網頁式圖表特有的，畢竟紙本或 PowerPoint 裡的圖表應該是無法透過使用者介面進行互動的，而提示框功能在於顯示別數據點（point）的詳細資料，可以讓使用者在閱讀圖表時更直覺方便。

---

## 提示框設定

提示框會在使用者對某個折線圖上的點或柱狀圖上的矩形（也就是數據點）進行 `hover` 互動時會出現，而其內容會顯示該數據點所屬數據列的名稱、X軸刻度標籤以及數值。

```javascript
var myChart = Highcharts.chart(container, {
  tooltip: {} // 提示框設定
});
```

<br/>

#### # tooltip.enabled
`型別: Boolean` `預設: true`

你可以利用這個屬性將提示框功能開啟/關閉。

<br/>

#### # tooltip.backgroundColor

`型別: String|Object|Null` `預設: undefined`

背景色的設定方式與 `chart.backgroundColor` 一樣，可以按 **[這裡](/posts/highcharts/highcharts-4/#chartbackgroundColor-chartplotBackgroundColor)** 複習。

<br/>

#### # tooltip.border系列

因為 `border` 的相關設定在 **[圖表整體設定](/posts/highcharts/highcharts-4/#chartborderWidth-chartplotBorderWidth)** 提過了，所以這邊就只放預設值給大家參考。

```javascript
legend: {
  borderWidth: 1,         // Number
  borderRadius: 3,        // Number
  borderColor: undefined  // String
}
```

<br/>

#### # tooltip.style
`型別: Object` `預設: 如下顯示`

樣式屬性在前面已經介紹過蠻多次了，如果需要複習的話可以 **[按這邊](/posts/highcharts/highcharts-5/#titlestyle)**，這裡就不再多做介紹。

```javascript
tooltip: {
  style: {
    color: "#333333",
    cursor: "default",
    fontSize: "12px",
    whiteSpace: "nowrap"
  }
}
```

<br/>

#### # tooltip.padding
`型別: Number` `預設: 8`

用來調整提示框的內間距，預設有 `8px` 的距離。

<br/>

#### # tooltip.distance
`型別: Number` `預設: 8`

用來調整提示框與數據點之間的距離，官網是寫預設為 `16px` 但我測試起來應該是 `8px`，剛好是提示框小箭頭的高度，另外如果你設為 `0` 的話，小箭頭會自動隱藏。

<br/>

#### # tooltip.followPointer
`型別: Boolean` `預設: false`

這兩個屬性與互動行為有關，指的是提示框是否要跟著**鼠標**一起移動，如果開啟的話， `tooltip.distance` 會變成是提示框與鼠標之間的距離。

:exclamation: **提醒：**在某些圖表類型中（如圓餅圖）這個屬性會預設是開啟。

<br/>

#### # tooltip.outside
`型別: Boolean` `預設: undefined`

用來決定提示框是否可以超出整個圖表的外框範圍，這個屬性的使用情境比較少，一般是用在圖表較小的時候。

<br/>

#### # tooltip.hideDelay
`型別: Number` `預設: 500`

當數據點離開 `hover` 狀態時，提示框在延遲一段時間後才會消失，而這個屬性可以調整這段時間，單位是毫秒。

<br/>

#### # tooltip.shared
`型別: Boolean` `預設: false`

這個屬性可以調整當使用者 `hover` 數據點時，提示框的資訊要顯示**該數據點**還是**所有數據列中的數據點**資料。

![](/img/content/highcharts-7/shared.png)

<br/>

#### # tooltip.format系列  

昨天在「圖例設定」中有看到所謂的「格式化屬性」，而提示框也是有的，而且數量還不少，`headerFormat` `pointFormat` `footerFormat`...等，不過使用方法都大同小異，所以就等之後的獨立章節再來統一介紹吧，現在暫時先跳過。

<br/>

#### # tooltip.valuePrefix / tooltip.valueSuffix 
`型別: String` `預設: undefined`

這兩個屬性和格式化屬性做的事情非常相似，不過使用方式單純很多，單純就是在數據點的數值加上前/後綴詞，非常適合用來增加單位或符號，例如我們在範例中這樣設定就可以改變提示框的文案。

```javascript
tooltip: { valuePrefix: "共", valueSuffix: "人" }
```
<img src="/img/content/highcharts-7/prefix.png" style="max-width: 550px;" />

<br/>

#### # tooltip.valueDecimals
`型別: Number` `預設: undefined`

這個屬性跟上面兩個屬性相關，它控制的是數據點的數值要顯示小數點後幾位。

<br/>

提示框的屬性就介紹到這邊了，不過你可以等之後把「格式化屬性」補齊了再重新回來看一次這個章節，因爲它其實才是提示框的精華。那明天的話會繼續介紹「座標軸」的設定。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10241091) -
