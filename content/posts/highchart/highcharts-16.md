---
title: 學到新資視了 - Highcharts / 主題設定
date: 2020/9/30 09:30:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/Vwaqvab**

昨天在介紹到「語言設定」時有提到 `Highcharts.setOptions`， 說到它的功能是負責調整全域設定，讓整個網頁的圖表都受到影響，而今天要介紹的「主題設定」其實就是透過它來達成的。

---

## 主題設定

目前我們已經把七成的圖表區塊設定屬性給認識完了，基本上已經可以把 Highcharts 順利地運用在網頁中，但隨著頁面中的圖表越來越多，就會逐漸發現程式碼也變得越來越龐大。

由於我們在設計網頁時，總會有固定的風格、字型、顏色等等，所以會精心調整圖表的樣式細節，例如標題的字型樣式，圖例、提示框的顏色邊框等等。但是當我們想要把精心設定的樣式套用到每張圖表時，卻發現只能不斷寫著重複的程式碼。

```javascript
var lineChart = Highcharts.chart(container, {
  chart: {
    type: "line"
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
});

var columnChart = Highcharts.chart(container, {
  chart: {
    type: "column"
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
});
```

就像上面這個簡單的案例，明明只是想要把每個圖表都加上邊框，卻要每張圖表都寫一堆重複的設定。這時候就可以使用 `Highcharts.setOptions` 來解決這種麻煩的窘境。

<br/>

首先要把每張圖表都會重複的部份抽出來，然後再透過 `Highcharts.setOptions` 進行設定，這樣以後每個圖表都只要設定那些不一樣地方就好了。

```javascript
var theme = {
  chart: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
};

Highcharts.setOptions(theme);

var lineChart = Highcharts.chart(container, {
  chart: { type: "line" }
});

var columnChart = Highcharts.chart(container, {
  chart: { type: "column" }
});
```

<br/>

### # 權重最小

當然，要是圖表數量多了，總是會有變動的可能，但如果你還記得「越細節，權重越高」這個原則的話，就會知道「主題設定」的權重是最小的，因為它影響的範圍是所有設定中最大的。

```javascript
var theme = {
  chart: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
};

Highcharts.setOptions(theme);

var myChart = Highcharts.chart(container, {
  chart: {
    // 主題設定是可以被覆蓋的
    borderColor: "blue",
    borderRadius: 5
  }
});
```

所以要是有與「主題設定」不同的設定，直接寫在圖表設定中就可以了，Highcharts 會自動幫你覆蓋。

<br/>

### # 深層合併

如果遇到某些物件類型的屬性，例如 `style`、`xAxis.label` ...等等，你可能會覺得要把整個屬性重新覆蓋一次，但其實你一樣只要撰寫不同的地方即可，因為 Highcharts 會自動幫我們做到深層的物件合併。

```javascript
var theme = {
  title: {
    style: {
      fontFamily: "微軟正黑體",
      fontWeight: "bold",
      color: "#292929"
    }
  },
};

Highcharts.setOptions(theme);

var myChart = Highcharts.chart(container, {
  title: {
    text: "公司員工年齡分佈",
    style: { color: "red" } // 還是有吃到字型和粗細
  }
});
```

<br/>

### # 順序與重複

雖然「主題設定」非常的方便，不過要特別注意它的執行順序以及重複執行的問題，像是下面的程式碼中，我們先建立圖表才進行主題設定，那圖表是吃不到主題設定的。

```javascript
var theme = {
  chart: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
};

// 沒有吃到主題設定
var lineChart = Highcharts.chart(container, {
  chart: { type: "line" }
});

Highcharts.setOptions(theme);

// 執行全域設定後，才吃得到主題設定
var columnChart = Highcharts.chart(container, {
  chart: { type: "column" }
});
```

另外，重複執行 `Highcharts.setOptions` 是允許的，Highcharts 會自動把每次執行的設定內容合併，但是一樣要注意執行的順序。

```javascript
var theme = {
  chart: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4
  }
};

// 第一次執行全域設定
Highcharts.setOptions(theme);

// 有邊框，顏色為 #ddd
var lineChart = Highcharts.chart(container, {
  chart: { type: "line" }
});

// 第二次執行全域設定
Highcharts.setOptions({
  chart: { borderColor: "red" }
});

// 一樣有邊框，但邊框顏色為 red
var columnChart = Highcharts.chart(container, {
  chart: { type: "column" }
});
```

那今天的「主題設定」就介紹到這邊，雖然是比較間單的功能，但卻能幫我們省去很多重複的工作，跟先前介紹的「繪圖區設定」有異曲同工之妙，接著明天要繼續介紹的是「響應式設定」，讓我們的圖表也能適應 RWD 網站。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10246743) -
