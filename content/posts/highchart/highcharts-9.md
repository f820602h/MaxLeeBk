---
title: 學到新資視了 - Highcharts / 座標軸設定 - 座標刻度
date: 2020/9/23 18:07:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/KKzQmRZ**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

雖然有部分圖表類型（如圓餅圖、文字雲）並不會用到座標軸，但大多數常見的圖表都是需要座標軸來輔助的，座標軸提供的是一個絕對值尺標，讓觀看者可以得到確切的資料數值，而非只是觀察資料間的相對關係。

由於座標軸的屬性較多，將會以屬性性質的不同分為「外觀樣式」與「座標刻度」兩篇文章來介紹。

---

## 座標軸設定 - 座標刻度相關

以常見的折線圖或長條圖來說，一般Ｘ座標軸的刻度通常是標示數據列的項目或日期，Ｙ座標軸刻度則標示數據列的統計數值（數字），但也有部分圖表的ＸＹ座標軸會各別標示不同的統計數值，例如速度曲線圖表會於ＸＹ座標軸上顯示時間和距離的數值。

**特別注意，座標軸的設定其實是使用陣列，因為圖表是可以有多Ｘ軸或多Ｙ軸的，但如果確定只有單個的話，你可以省略陣列的中括號。**

```javascript
var myChart = Highcharts.chart(container, {
  xAxis: [{}], // Ｘ座標軸設定
  yAxis: [{}]  // Ｙ座標軸設定
});
```

<br/>

> 以下以 Axis 同時表示 xAxis 及 yAxis

<br/>

### # Axis.visible
`型別: Boolean` `預設: true`

座標軸正常來說是必要的圖表元素，所以不像其他元素有 `enabled` 屬性來做開關，但你可以用 `visible` 來隱藏座標軸。

<br/>

### # Axis.type
`型別: String` `預設: "linear`

座標軸共有四種類型可以設定，
- 線性（linear）：線性會根據你提供的數據去做由小到大的數字刻度
- 類別（category）：當你有設定 `Axis.categories` 時，座標軸會自動改成「類別」類型，並以你提供的 category 作為座標刻度
- 日期（datetime）：以日期作為座標刻度。因為必須配合數據列（series）一起設定，所以我們會在後面的章節詳細介紹
- 對數（logarithmic）：以對數作為座標刻度，也就是高中數學教的 log，由於使用情境太少，所以就不多作介紹

![](/img/content/highcharts-9/type.png)

如果你好奇線性座標如何設定的話可以看這個範例：**https://codepen.io/max-lee/pen/eYZVWxP**

<br/>

### # Axis.categories
`型別: Array[String]` `預設: undefined`

當你要以類別作為座標刻度時，你需要為這個屬性提供一組陣列，當中即是你所要顯示的類別字串，我們的範例就是一個使用 `categories` 的案例，

```javascript
xAxis: {
  categories: ["18-24歲", "25-29歲", "30-34歲"]
}
```

<br/>

### # Axis.tickAmount
`型別: Number` `預設: undefined`

這個屬性是線性類型專屬，它可以控制你的座標刻度的數量，如果沒有設定的話，則 Highcharts 會自動幫你計算合適的數量。

<br/>

### # Axis.tickInterval / Axis.minorTickInterval
`型別: Number` `預設: undefined`

座標刻度之間要相隔多少數值也是可以調整的，而根據不同的座標軸類型會有不同的定義：
- 線性（linear）：表示刻度相隔多少「值」，若設定 `2`，則刻度會是 `0`, `2`, `4`, `6`, `8`...
- 類別（category）：表示刻度間相隔多少「個」，預設是 `1` 每個都會出現，若設定 `2`，則只有奇數個會出現
- 日期（datetime）：表示刻度間相隔多少「毫秒」，若設定 `24 * 3600 * 1000`，則刻度之間會相隔一天

<br/>

### # Axis.minTickInterval
`型別: Number` `預設: undefined`

和上面兩個很類似的還有這個屬性，你可以設定座標刻度「最少」要間隔多少數值，定義方法跟上面列舉的方式一模一樣。

<br/>

### # Axis.tickPositions
`型別: Array[Number]` `預設: undefined`

你可以用這個屬性來決定「哪幾個」座標刻度要出現，設定時你需要提供一組陣列，陣列裡則是你希望顯示刻度的索引，當然在線性座標軸中數值本身就是索引。

<br/>

### # Axis.tickPositioner
`型別: Function => Array[Number]` `預設: undefined`

這個屬性與 `tickPositions` 有一樣的功能，不過你提供的是一個函式，想當然這個函式的輸出也必須是索引陣列，但好處是你可以進行一些計算，而且在函式中你可以透過 `this.tickPositions` 來拿到初始的刻度索引陣列。

```javascript
var myChart = Highcharts.chart(container, {
  xAxis: {
    tickPositions: [1, 3, 6, 7]
  },
  yAxis: {
    tickPositioner() {
      console.log(this.tickPositions) // [0, 10, 20, 30, 40] 
      return [...this.tickPositions, 44.3, 55, 60, 100]
    }
  }
}
```

<img src="/img/content/highcharts-9/tickPositions.png" style="max-width: 600px;" />

### # Axis.reversed
`型別: Boolean` `預設: false`

一般來說座標刻度大小是由左至右/由下至上地排列，但你可用這個屬性將這樣的順序給顛倒。

<br/>

### # Axis.opposite
`型別: Boolean` `預設: false`

這個屬性可以決定要不要讓座標軸出現在另外一邊，即Ｘ軸出現在上方或Ｙ軸出現在右邊，像如果你有雙座標軸的話，其中一個就可以放在另一邊。

<br/>

### # Axis.alignTicks
`型別: Boolean` `預設: false`

另一個與雙座標軸相關的屬性是 `alignTicks`，它可以決定兩邊的座標刻度是否要對齊，關掉的話觀看起來會比較混亂，所以如果沒特殊需求的話一般不會調整。

![](/img/content/highcharts-9/alignTicks.png)

<br/>

### # Axis.allowDecimals
`型別: Boolean` `預設: true`

這個屬性可以決定是否允許出現浮點數的座標軸刻度，如果不希望出現小數點記得要設為 `false`。

<br/>

### # Axis.max / Axis.min
`型別: Number` `預設: undefined`

預設的情況下 Highcharts 會自動幫你計算合適的座標刻度的數值範圍，但你可以用這兩個屬性來設定座標軸的最大／最小刻度，並且會固定顯示在座標軸上，當有數據點高於 `max` 或低於 `min` 就會被畫布切掉。

<br/>

### # Axis.softMax / Axis.softMin
`型別: Number` `預設: undefined`

與上面的 `min/max` 相似，這兩個屬性也是設定座標軸的最大／最小刻度，並且會固定顯示在座標軸上，不過當有數據點高於 `softMax` 或低於 `softMin` 時並不會被切掉，而是會重新計算合適的刻度數值。

<br/>

### # Axis.ceiling / Axis.floor
`型別: Number` `預設: undefined`

另外一組設定最大／最小刻度的是 `ceiling` 和 `floor`，當你設定它們時，它們並不會固定顯示在座標軸上，而是當有數據點高於 `softMax` 或低於 `softMin` 時才會出現，並且將其切掉。

想更清楚了解上面三組屬性之間的差別可以看這個範例 **https://codepen.io/max-lee/pen/NWNXoVy**

<img src="/img/content/highcharts-9/max.png" style="max-width: 800px;" />

<br/>

### # Axis.startOnTick / Axis.endOnTick
`型別: Boolean` `預設: 請見提醒`

這兩個屬性可以控制你的座標軸是否要以一個座標刻度做開頭／結尾，如果設為 `false`，第一個／最後一個座標刻度就會與繪圖區 (plot) 邊界有些微的間距。

:exclamation: **提醒：**Ｘ軸預設均為 `false`，Ｙ軸預設均為 `true`。

<br/>

### # Axis.showFirstLabel / Axis.showLastLabel
`型別: Boolean` `預設: true`

決定座標軸的第一個／最後一個座標刻度要不要顯示它的文字標籤。 

<br/>

我們終於花了兩天把常見的座標軸屬性都介紹完了，不過我們目前介紹的所有屬性你都不用熟記，等有需要的時候再查找就好。而明天要繼續介紹的就是圖表中最重要的「數據列」了。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙]() -
