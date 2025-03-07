---
title: 學到新資視了 - Highcharts / 數據點設定
date: 2020/9/25 09:50:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/rNevgYm**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

昨天我們才介紹完數據列設定，而數據列其實就是一個個數據點所組成的一系列資料。講簡單一點，數據點就是折線圖裡的一個個點，圓餅圖裡的一個個扇形，而 Highcharts 的設定就是細到這樣的顆粒度，讓你每個點都能微調。

<img src="/img/content/highcharts-11/point.png" style="max-width: 800px;" />

---

## 數據點設定 - 基本介紹

數據點其實就是透過數據列的 `data` 屬性設定的，也就是說數據列與數據點是相依相存的，而且就算只有一個數據點依然能稱為一個數據列。

而既然數據列設定的屬性會受到圖表類型影響，理所當然數據點就也會，甚至連設定方式都會有所改變。而且每一種圖表類型的數據點方式還不只一種，所以常常讓人搞得霧煞煞，不過今天就讓我幫大家統整歸納一下吧！


```javascript
var myChart = Highcharts.chart(container, {
  series: [{
    data: [] // 數據點設定
  }]
});
```

`series.data` 能夠接受的型別是陣列，其中陣列裡每個項目所代表的就是一個一個的數據點（point），每個數據點又能以數字、陣列、或物件這三種型別來表示，至於要用哪一種取決於**每個數據點之間的差異程度**。

---

## 數據點設定 - 數值設定法

```javascript
series: [{
  data: [0, 5, 3, 5] // 數據點設定-數字型別
}]
```

若以數字設定數據點，則這個數字會被 Highcharts 解析為數據點的Ｙ軸數值，Ｘ軸數值則會根據你的 `xAxis.type` 自動計算，如下。
- 線性座標軸：從 `0` 開始，每個數據點依序增加 `1`
- 類別座標軸：從 `xAxis.categories[0]` 開始，每個數據點依序拉出項目
- 日期座標軸：從 `1970/1/1 00:00` 開始，每個數據點依序增加一毫秒

<br/>

**而當你用數值設定法來設定數據點，就可以下方兩個數據列屬性來調整上述規則。**

### # series.pointStart
`型別: Number` `預設: 0` 

這個屬性設定的是你數據列中第一個數據點的Ｘ軸起始數值。

<br/>

### # series.pointInterval
`型別: Number` `預設: 1`

這個屬性設定的是你數據列中每個數據點之間相隔多少Ｘ軸數值。如果不太理解這兩個屬性的話，可以看看我準備的 **[範例](https://codepen.io/max-lee/pen/XWdqNmR)**。

<br/>

> 只要數據點本身沒有指定的Ｘ軸數值就很適合用這種設定方式，缺點是這種設定方式不能對數據點進行額外的屬性設定，所以要是希望各別數據點能有不一樣的外觀或特性的話，就不太適用了。

:exclamation: **提醒：**圓餅圖的數據點雖然也可以用這個方式法設定，但會缺失數據點名稱。

---

## 數據點設定 - 陣列設定法

```javascript
series: [{
  // 數據點設定-陣列型別[Number,Number]
  data: [[0, 5], [3, 5], [6, 12]]
}]
```

若以陣列來設定數據點的話，這個陣列就必須要有兩個型別為「數字」的值，其一會被 Highcharts 解析為數據點的Ｘ軸數值，其二為Ｙ軸數值。

> 如果數據點需要有指定Ｘ數值的話，就必須採用這個設定方式，例如散佈圖或是加速度圖這種類的圖表，不過缺點依然是無法對數據點進行額外的屬性設定。

<br/>

```javascript
series: [{
  // 數據點設定-陣列型別[String,Number]
  data: [["數據點1", 5], ["數據點3", 5], ["數據點3", 12]] 
}]
```

或是你也可以將第一個值改為字串，這樣 Highcharts 就會把第一個值解析為該數據點的名稱，而第二個值依然是Ｙ軸數值。

> 這種設定方式雖然和「數值設定法」很像，就只是多了一個名稱的字串而已，但卻是圓餅圖很常用的數據點設定方式。

---

## 數據點設定 - 物件設定法

```javascript
series: [{
  // 數據點設定-物件型別
  data: [
    { x:5, y: 5, name: "Point1" },
    { x:8, y: 8, name: "Point2" }
  ] 
}]
```

如果以物件型別來設定數據點，那靈活性就非常高了，因為每個數據點（物件）內部又有不少屬性可以個別設定，也就代表每個數據點都可以有不同的外觀或特性。

但其實數據點大部分的屬性在數據列都有，只不過數據列設定是一次改變所有數據點，而數據點設定就單單只是改變它自身，下面的話我們就只介紹數據點才有的屬性，要看全部到話就到 **[官方文件](https://api.highcharts.com/highcharts/series.line.data)** 吧。

<br/>

### # series.data.x / series.data.y
`型別: Number` `預設: undefined`

**特別注意，這裡的Ｘ和Ｙ不再是調整偏移量了，它們設定的是數據點的Ｘ軸數值以及Ｙ軸數值。**

Ｘ軸數值並非必要屬性是可以省略的，甚至某些圖表也不會有 `x` 屬性（如圓餅圖），但Ｙ軸數值就是必須的了，如果沒設定就等同沒有數據，沒有數據就畫不出數據點。

<br/>

### # series.data.name
`型別: String` `預設: undefined`

這個屬性可以對數據點設定名稱，如果有設定的話提示框還會以名稱來取代Ｘ軸刻度標籤，另外這個屬性對圓餅圖來說也很重要，因為圓餅圖的圖例、數據標籤顯示的都是「數據點名稱」，而非數據列名稱或數值。

<br/>

### # series.data.className
`型別: String` `預設: undefined`

顧名思義，這個屬性是用來增加數據點在 HTML 中的 Class Attribute 的，好處是我們可以更針對性地選取到某個數據點，可以方便日後進行圖表互動。

<br/>

### # series.data.legendIndex
`型別: Number` `預設: undefined`

前面有說圓餅圖的圖例顯示的是「數據點名稱」，而這個屬性就是讓圓餅圖數據點可以調整圖例順序的，用法和 `series.legendIndex` 一樣。

<br/>

### # series.data.sliced
`型別: Boolean` `預設: undefined`

這個屬性也是圓餅圖的數據點才有，讓你可以決定某塊扇形是否要向外突出。而突出的偏移量你可以用數據列的 `series.slicedOffset` 屬性來調整。

<img src="/img/content/highcharts-11/sliced.png" style="max-width: 600px;" alt="特別突顯25-29歲" />

> 物件設定法適用於所有圖表類型，而且非常適合各數據點差異性大的情況。

---

## 數據點設定 - 混合

```javascript
series: [{
  data: [[0, 5, {y: 3, name: "數據點"}, 5]] // 數字混物件
}]
```

```javascript
series: [{
  data: [[0, 5], {x: 3, y: 5, name: "數據點"}, [6, 12]] // 陣列混物件
}]
```

是的沒錯，以上這三種設定法還可以混用，讓你的數據點設定更加彈性輕鬆，不過數字搭陣列的效果不是很優，所以大部分都是用物件去搭配另外兩種。

> 這種混和的設定方法，很適合用在你想要為某幾個特定的數據點進行額外設定時使用。

---

## 數據點設定 - 陣列搭配Keys設定法

```javascript
series: [{
  keys: ["y", "name", "className"],
  data: [
    [13, "數據點一", "point-1"],
    [21, "數據點二", "point-2"]
  ]
}]
```

這種設定方式比較特別，它和陣列設定法一樣是以陣列設定數據點，但卻能放進不只兩個項目，而且沒有順序的限制。不過這樣的彈性，使得 Highcharts 不知道如何解析陣列裡的數值，此時就需要借助 `keys` 的幫忙。

<br/>

### # series.keys
`型別: Array[String]` `預設: undefined` 

這個屬性融合了陣列設定法與物件設定法，讓你能用陣列設定數據點卻又可以加入額外屬性，而使用方式是提供 `keys` 一組陣列，陣列項目為想設定的**數據點屬性名稱**，接下來你只要按這個陣列的順序來設定數據點，Highcharts 就會以這個順序去解析你的 `data` 項目。

<br/>

> 如果你想調整的數據點屬性僅僅只有一兩個，那就很適合使用這種設定方式，不用像物件法一樣搞得很冗長，卻又能設定少量的額外屬性。


<br/>

恭喜各位，我們已經把最重要的數據列與數據點介紹完了，雖然後面還有一部分的設定技巧和屬性，但基本上到這裡你就可以很順利的將 Highcharts 導入專案中了，那明天我們要介紹的是「繪圖區」，雖然它是圖表中占比不小的元素區塊，但它其實不僅沒有額外屬性，還能為我們省很多事。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10243702) -
