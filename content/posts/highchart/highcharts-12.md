---
title: 學到新資視了 - Highcharts / 繪圖區設定
date: 2020/9/26 11:10:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/ExKRLGP**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

如果前面幾個圖表元素的設定介紹你都有跟到的話，你可以想想看繪圖區設定還能調整或修改什麼？

繪圖區裡的數據列和數據點都有專屬的區塊設定，隔線、標記線(帶)由座標軸控制，就連繪圖區自己本身的背景、外框都是在「圖表整體設定」裡做調整，那繪圖區設定到底還能設定什麼？

**其實繪圖區本身沒有任何屬性可以設定，但它卻可以幫我們把數據列的重複設定抽出並統一管理。**

---

## 繪圖區設定 - 使用方法

繪圖區的設定就像是我們把重複的值抽出來設為變數一樣，它可以把重複的數據列設定給拉出來，統一放在它自己這邊，讓所有數據列都能吃到個設定。

由此可知，繪圖區的所有屬性都跟「數據列」一模一樣，除了 `type`、`name`、`data`、`index`、`legendIndex`...這些「不該共用」數據列的屬性。你可以自己比較看看折線圖的 **[數據列設定](https://api.highcharts.com/highcharts/series.line)** 和 **[繪圖區設定](https://api.highcharts.com/highcharts/plotOptions.line)** 有哪些不同。

<br/>

不過你可能會好奇，如果是 `marker`、`size` 這類專屬於某個圖表類型的屬性怎麼辦？其實繪圖區設定的撰寫方式是這樣的...

```javascript
var myChart = Highcharts.chart(container, {
  plotOptions: {
    series:{
      // 在這張圖表裡的所有數據列都會套用
    },
    line: {
      // 在這張圖表裡type為line的數據列會套用
    },
    column: {
      // 在這張圖表裡type為column的數據列會套用
    }
  },
});
```

透過這樣的設定結構，你可以把通用的屬性放在 `series` 子物件底下，而折線圖專屬的設定放在 `line` 底下，這樣就可以區分通用與專門屬性了。
> 但其實寫在一起也沒關係，就算設定了一個該圖表沒有的屬性，也不會發生錯誤或造成影響。

<br/>

#### 用一個簡單的案例來感受繪圖區設定的方便：
假設我們今天有一個「兩組折線圖／一組柱狀圖」的複合圖表，當中的三組數據列都要顯示「數據標籤」，然後兩組折線圖都要將線條改為虛線。沒用繪圖區設定的話要這樣寫...

```javascript
var myChart = Highcharts.chart(container, {
  // 省略其他區塊設定...
  series: [
    {
      type: "column",
      name: "柱狀圖",
      data: [10,20,30,40,50],
      dataLabels: { enabled: true }
    },
    {
      name: "折線圖一",
      data: [35,35,35,35,35],
      dashStyle: "Dash",
      dataLabels: { enabled: true }
    },
    {
      name: "折線圖二",
      data: [55,55,55,55,55],
      dashStyle: "Dash",
      dataLabels: { enabled: true }
    }
  ]
});
```

但如果利用繪圖區設定改寫一下，我們就可以避免大量重複的程式碼，而且如果未來要調整，就只要統一修改繪圖區設定一個地方就好，大大提升了程式碼的管理品質。

```javascript
var myChart = Highcharts.chart(container, {
  // 省略其他區塊設定...
  plotOptions: {
    series: {
      dataLabels: { enabled: true }
    },
    line: {
      dashStyle: "Dash",
    }
  },
  series: [
    {
      name: "折線圖一",
      data: [1,3,5,7,9]
    },
    {
      name: "折線圖二",
      data: [2,4,6,8,10]
    },
    {
      type: "column",
      name: "柱狀圖",
      data: [10,20,30,40,50]
    }
  ]
});
```
<br/>

> 其實就算不是複合圖表，甚至只有單組數據列，我都習慣把數據列設定挪到繪圖區設定裡，這樣可以讓數據列專注在設定「數據點資料」。

---

## 繪圖區設定 - 權重高低

既然「數據列設定」和「繪圖區設定」都能調整數據列，那如果不小心兩邊對同個屬性設定了不同的值會發生什麼事呢？

「越細節，權重越高」，在 Highcharts 中保持著一個觀念就不會容易被搞糊塗，以這個原則來看的話我們可以得到下圖的結果，也就是說如果「數據列設定」和「繪圖區設定」發生衝突，那最後會以數據列設定為優先。

![](/img/content/highcharts-12/weights.png)

<br/>

因此，只要把權重運用得宜的話，就可以這樣做：**https://codepen.io/max-lee/pen/RwaJyjg**

```javascript
var myChart = Highcharts.chart(container, {
  // 省略其他區塊設定...
  plotOptions: {
    series: {
       marker: { 
         enabled: true,
         symbol: "diamond",
         radius: 6
      }
    },
    line: {
      marker: { symbol: "triangle" }
    }
  },
  series: [
    {
      name: "折線圖一",
      marker: { enabled: false },
      data: [30,30,30,30,{
        y: 30,
        marker: { enabled: true, symbol: "triangle-down" },
      }]
    },
    {
      name: "折線圖二",
      data: [60,60,60,60,60]
    },
    {
      type: "area",
      name: "面積圖",
      fillColor: "rgba(144, 237, 125, 0.2)",
      data: [10,10,10,10,10]
    }
  ]
});
```

<img src="/img/content/highcharts-12/weight-case.png" style="max-width: 700px;" />


<br/>

那繪圖區設定的介紹就到這邊，是不是覺得這樣統一的集中數據列設定清爽多了呢？不僅避免重複的程式碼還增加了易讀性，所以強烈建議大家試著多利用繪圖區設定來管理數據列！

接著明天要介紹的是看似簡單卻被我刻意跳過的「顏色設定」。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10244400) -
