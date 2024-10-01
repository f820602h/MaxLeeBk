---
title: 資視就是力量 - Highcharts / 事件屬性
date: 2020/10/2 11:22:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/bGpzoZr**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

第一天就有跟各位說過，Highcharts 除了豐富的圖表設定外，另一大看點就是可以做到圖表的事件監聽，讓我們的圖表不僅僅只是展示資料，更是一個可以跟使用者互動的介面，所以今天就要來好好講講「事件屬性」。

---

## 事件屬性

事件屬性和格式化屬性一樣，分佈在各個圖表區塊當中，不過基本上「圖表事件」、「數據列事件」、「數據點事件」這三個就能囊括八成以上的應用了，下面就大致先讓大家看看有哪些事件名稱吧。

```javascript
var myChart = Highcharts.chart(container, {
  chart: {
    events: { // 圖表整體事件屬性
      load: function() {},
      redraw: function() {},
      render: function() {},
      addSeries: function() {},
      click: function() {}
    }
  },
  series: [{
    events: { // 數據列事件屬性，繪圖區設定亦同
      click: function() {},
      mouseOver: function() {},
      mouseOut: function() {},
      show: function() {},
      hide: function() {},
      legendItemClick: function() {}
    },  
    data: [{
      events: { // 數據點事件屬性
        click: function() {},
        mouseOver: function() {},
        mouseOut: function() {},
        select: function() {},
        unselect: function() {},
        update: function() {},
        remove: function() {}
      }
    }]
  }]
});
```

其實這些事件屬性都不會很複雜，有部分跟 DOM 元素的事件也大同小異，而且設定上也很簡單，就是給予一個回呼函式 (Call-Back) 就好了，未來只要事件觸發了，Highcharts 就會幫你執行函式囉。

<br/>

#### # this 和 event 物件

在一般 JavaScript 的事件中，`this` 代表的是被賦予事件監聽的那個 DOM 元素，在 Highcharts 也是類似的，`this` 代表的就是那個被設定事件的圖表物件、數據列物件或數據點物件。

相同地，你可以透過參數的設定去接住回呼函式中被 Highcharts 傳入的 `event` 物件，而不同的事件類型，`event` 物件會提供不同的屬性內容。

```javascript
events: {
  click: function(event) {
    console.log(this, event)
  }
}
```

透過 `this` 與 `event` 所提供的內容，我們就可以利用這些資訊來達到許多複雜互動與操作。

<br/>

> 由於實在是很難特別想一些應用來給大家做演示，所以今天主要會介紹的是事件的觸發時機以及 `event` 物件的資料內容。


---

## 圖表整體事件

> 圖表整體事件中，`this` 會是「圖表物件」，內容包含了該圖表的各種屬性內容與方法。

<br/>

#### # chart.events.load
`型別: Function` `預設: undefined`

當圖表載入完成後觸發，`event` 物件中則沒有什麼特別的屬性，倒是 `event.target` 和 `this` 一樣，提供的是「圖表物件」。

<br/>

#### # chart.events.redraw
`型別: Function` `預設: undefined`

當圖表重新繪圖時觸發，包括「尺寸改變」、「數據列、數據點或座標軸的變更」，`event` 物件的內容則與 `load` 事件相同。

<br/>

#### # chart.events.render
`型別: Function` `預設: undefined`

這個事件觸發時機等於 `load` 事件加上 `redraw` 事件，而 `event` 物件的內容也與它們相同。

<br/>

#### # chart.events.addSeries
`型別: Function` `預設: undefined`

這個事件的觸發時機比較特別，當有一個新的數據列被加進圖表時會觸發，也就是使用 `addSeries()` 這個方法的時候會觸發，而它的 `event` 物件中有一個 `options` 屬性，有著該次加入的數據列內容。

另外你也可以在函式中返回 `false` 就可以阻止這次的新增，如果成功新增也會觸發 `redraw` 和 `render` 事件。

```javascript
var myChart = Highcharts.chart(container, {
  chart: {
    events: {
      addSeries: function(event) {
        console.log(event.options)
        return event.options.data.length >= 5;
        // 如果要被加入的數據列少於五個數據點，就不加入
      }
    }
  }
});

myChart.addSeries({
  name: "newSeries",
  data: [12, 15, 12, 5]
})

// console: { name: "newSeries", data: [12, 15, 12, 5] }
```

<br/>

#### # chart.events.click
`型別: Function` `預設: undefined`

當你點擊「繪圖區」時會觸發這個事件，它的 `event` 物件除了有滑鼠事件的相關屬性外，還有提供「座標軸物件」，甚至還有「該點擊處」在圖表中所代表的Ｘ／Ｙ軸數值。

```javascript
var myChart = Highcharts.chart(container, {
  chart: {
    events: {
      click: function(event) {
        // 拿到點擊處的Ｘ／Ｙ數值，並加進數據列當中
        this.series[0].addPoint([
          event.xAxis[0].value,
          event.yAxis[0].value,
        ])
      }
    }
  }
});
```

---

## 數據列事件

> 數據列事件中，`this` 會是「數據列物件」，內容包含了該數據列的各種屬性內容與方法。

<br/>

#### # series.events.click
`型別: Function` `預設: undefined`

當數據列被點擊時會觸發這個事件，由於是滑鼠事件，所以 `event` 中會有鼠標的相關資訊，另外 `event.point` 會提供你點擊時，處於聚焦狀態的數據點之「數據點物件」。

<img src="/img/content/highcharts-18/seriesClick.png" style="max-width: 800px;" />

<br/>

#### # series.events.mouseOver
`型別: Function` `預設: undefined`

當鼠標使數據列聚焦時就會觸發這個事件，要注意的是有一些圖表類型 (例如折線圖)，有預設開啟 `series.stickyTracking` 這個屬性，導致鼠標進入繪圖區時，一定會使數據列被聚焦。

它的 `event` 物件比較沒那麼特殊，當中的 `target` 屬性和 `this` 一樣，都是「數據列物件」。

<img src="/img/content/highcharts-18/seriesOver.png" style="max-width: 800px;" />

<br/>

#### # series.events.mouseOut
`型別: Function` `預設: undefined`

當鼠標使數據列從聚焦轉為失焦時就會觸發，其他內容與 `mouseOver` 都一樣。

<br/>

#### # series.events.show
`型別: Function` `預設: undefined`

當你將數據列從隱藏狀態改為顯示狀態時，就會觸這個事件，另外這個動作也會同時觸發前面介紹的 `redraw` 和 `render` 事件。

而它的 `event` 物件也是只有 `target` 屬性而已，內容為「數據列物件」。

<br/>

#### # series.events.hide
`型別: Function` `預設: undefined`

就是 `show` 的相反版本，其餘並無不同。

> 大部分都是透過點擊圖例來顯示／隱藏數據列，但你也可以使用 `show()`、`hide()` 這兩個數據列方法來操作，可見本章節範例。

<br/>

#### # series.events.legendItemClick
`型別: Function` `預設: undefined`

這個屬性是你只要點擊圖例就會觸發，因此觸發順序應該會是 `legendItemClick` 才接到 `show` 或 `hide`，另外你還可以在回呼函式中返回一個 `false`，那就會使本次點擊圖例的效果失效。

它的 `event` 物件比前兩者多了一個 `browserEvent`，內容為滑鼠事件的相關屬性。

```javascript
series: [{
  events: {
    legendItemClick: function(event){
      // event.target.visible 為數據列目前是否顯示
      // 會使數據點只許隱藏，卻無法再次顯示
      return event.target.visible;
    } 
  }
}] 
```

<br/>

---

## 數據點事件

> 數據點事件中，`this` 會是「數據點物件」，內容包含了該數據點的各種屬性內容與方法。

<br/>

#### # series.data.events.click
`型別: Function` `預設: undefined`

會在點擊數據點時觸發，要注意的是，只要有數據點是「聚焦狀態」，點擊到數據列的任一位置都會觸發此事件，也就是說鼠標並非要在「點」上。而它的 `event` 物件一樣有滑鼠事件的相關屬性，且 `point` 屬性中也有該數據點的「數據點物件」，和數據列的點擊事件只差在 `this` 的不同。

<br/>

#### # series.data.events.mouseOver
`型別: Function` `預設: undefined`

當鼠標使數據點聚焦時就觸發，依然受到 `series.stickyTracking` 屬性影響，而 `event` 物件也是只有 `target` 屬性，內容與 `this` 一樣是「數據點物件」。

<br/>

#### # series.data.events.mouseOut
`型別: Function` `預設: undefined`

當鼠標使數據點從聚焦轉為失焦時觸發，其他內容與 `mouseOver` 都一樣。

<br/>

#### # series.data.events.select
`型別: Function` `預設: undefined`

在你選取了數據點時會觸發這個事件，此事件必須在 `series.allowPointSelect` 開啟的狀態下才能作用，`event` 物件的內容和 `mouse` 系列相同。此外你可以透過回傳 `false` 來取消選取動作：

```javascript
data: [{
  y: 3,
  events: {
    select: function(){
      // 這個數據點將無法被選取
      return this.y > 5 
    } 
  }
}]
```

<br/>

#### # series.data.events.unselect
`型別: Function` `預設: undefined`

當數據點被取消選取時觸發，其餘特性均與 `select` 相同。

<br/>

#### # series.data.events.update
`型別: Function` `預設: undefined`

當數據點被更新時會觸發事件，它與 `addSeries` 很類似，`event` 物件中一樣有 `options` 屬性來提供這次要更新的內容，並且也可以在函式中返回 `false` 來阻止這次更新，且數據點成功更新也會觸發 `redraw` 和 `render` 事件。

<br/>

> 要更新數據點要使用 `update()` 這個數據點方法，請見本章節範例。

<br/>

#### # series.data.events.remove
`型別: Function` `預設: undefined`

當數據點被移除時會觸發，`event.target` 和 `this` 中都會有此次被刪除的數據點之「數據點物件」，且一樣可以返回 `false` 來阻止這次刪除，且數據點成功刪除也會觸發 `redraw` 和 `render` 事件。

<br/>

> 要更新數據點要使用 `remove()` 這個數據點方法，請見本章節範例。

<br/>

今天把比較主力的幾個事件屬性介紹完畢，非常強烈建議大家到今天的範例裡去玩玩看，我準備的應該算很周全，可以讓大家知道各件事的機制以及觸發順序，明天的話則是要跟大家介紹 Highcharts 裡一些更新資料與設定的方法 (method)。

像是今天就有稍微帶到 `addSeries()` 和 `update()`...等等，在下個章節中都會比較詳細的介紹它們。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10247862) -
