---
title: 資視就是力量 - Highcharts / Vue 資料綁定
date: 2020/10/11 21:22:00
tags: [JavaScript,Highcharts,12th鐵人賽]
---

昨天我們成功安裝 Highcharts-Vue 並繪製出一個基本的圖表，不過既然都已經使用 Vue 了，我們應該要好好運用「資料綁定」的概念，也就是當資料變動時，我們不需要再額外操作圖表，圖表就會自己動態的更新變化。

---

## Data Binding

我們在「資料更新 Method」有說過，在網頁中資料不會總是靜態的，所以當資料變動時，我們需要透過一些 Method 的呼叫來更新圖表，不過當我們使用前端框架後，圖表應該要可以自己響應資料的變動進而更新畫面，那下面我們就來把昨天的 `Chart.vue` 改寫一下。

<br/>

#### 1.資料形式調整

首先要把資料改寫一下，照理說原始資料應該比較難像昨天那樣是已經處理過的模樣，所以我們另外用 `data` 物件來模擬從後端拿到的資料，然後將 `chartOptions` 裡面的 `xAxis.categories` 和 `series.data` 給清空，因為這兩個屬性的值應該是原始資料處理過後才拿得到的。

```javascript
data() {
  return {
    data: {
      "18-24歲": 12,
      "25-29歲": 18,
      "30-34歲": 22,
      "35-39歲": 25,
      "40-44歲": 32,
      "45-49歲": 35,
      "50-54歲": 26,
      "55歲+": 18
    },
    chartOptions: {
      chart: { type: "column" },
      title: { text: "公司員工年齡分佈" },
      xAxis: { categories: [] },
      yAxis: { 
        title: { text: "人數" }
      },
      series: [{ 
        name: "XX公司員工",
        data: []
      }]
    }
  };
}
```

<br/>

#### 2.撰寫 computed

那因為現在原始資料的格式並不是我們要的，而且未來資料還有可能會變動，所以可以選擇用 Vue 的 `computed` 來幫我們處理資料，而且它也會在資料變動時自動更新。

那其中 `xAxisCate` 和 `seriesData` 就是用來處理資料的，而 `options` 則是將資料與圖表設定進行結合，最後導出一個完整的 `options` 物件。

```javascript
computed: {
  xAxisCate() {
    return Object.keys(this.data);
  },
  seriesData() {
    return Object.values(this.data);
  },
  options() {
    let options = Object.assign(this.chartOptions, {});
    options.xAxis.categories = this.xAxisCate;
    options.series[0].data = this.seriesData;
    return options;
  }
}
```

<br/>

#### 3.資料綁定

有了 `options` 物件後，就可以把它作為 `prop` 傳入 `<highcharts>`，然後就可以看到跟昨天一樣的結果了。

```html
<template>
  <highcharts :options="options"></highcharts>
</template>
```

<img src="/img/content/highcharts-27/vue-chart.png" style="max-width: 800px;" />

<br/>

#### 4.資料變動

經過前面幾個步驟後，我們已經將資料與圖表做了綁定，接下來就要看看在資料改變時，圖表是否會更新畫面了。我們可以在畫面上新增以幾個按鈕，並綁定事件。

```html
<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
    <button @click="changeData">改變資料</button>
    <button @click="changeType('line')">改為折線圖</button>
    <button @click="changeType('column')">改為柱狀圖</button>
  </div>
</template>
```

我們分別為按鈕綁定改變原始資料和圖表設定的 `methods`，看看圖表能不能在點擊按鈕後成功更新。

```javascript
methods: {
  changeData() {
    this.xAxisCate.forEach((key) => {
      this.data[key] = Math.floor(Math.random() * 20);
    });
  },
  changeType(type) {
    this.options.chart.type = type;
  }
}
```

實際測試後，發現圖表確實的在資料發生變動的時候自動響應了新的圖表設定，並且根據設定進行了畫面上的更新。

<img src="/img/content/highcharts-27/vue-binding.gif" style="max-width: 800px;" />

<br/>

今天算是真正使用上了 Vue 的特性來繪製 Highcharts 的圖表，透過資料綁定的方式讓圖表可以響應資料的改變，讓我們可以專注在資料的處理，而不用一再的操作圖表或呼叫 Method。

不過我今天的範例算是相當粗略，目的只在於向大家展示「資料綁定」的概念，假如你有 Vue 的開發經驗，肯定可以大幅改善這個元件的彈性、重用性。而明後兩天我也會透過比較完整的應用來展示更多 Highcharts-Vue 的使用方式。


---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10252156) -


