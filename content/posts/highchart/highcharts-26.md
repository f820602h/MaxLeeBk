---
title: 資視就是力量 - Highcharts / Vue 建立圖表
date: 2020/10/10 14:20:00
tags: [JavaScript,Highcharts,12th鐵人賽]
---

經過連續五天的實作練習，相信大家應該對於製作 Highcharts 圖表暸若指掌了，不過現在使用前端框架已是網頁開發的主流，Highcharts 是否有因應的方案呢？答案是有的，無論是 Angular、React 還是 Vue，都有對應的套件可以使用，不過本系列會以 Vue 的版本來介紹，若是其他框架的使用者，可以到 **[官方Github](https://github.com/highcharts)** 去找找對應的套件。

---

## VisUalizE

其實在 Vue 裡使用 Highcharts 是件非常容易的事，下面我們就一步步從零開始，使用 Vue CLI 工具來達成資料視覺化。

<br/>

#### 1.安裝 Vue CLI

如果你還未安裝 Vue CLI，那請先打開終端機／命令提示字元並輸入以下指令，將 Vue CLI 工具安裝在全域環境中。

> 請先安裝 Node.js 才能使用 `npm` 指令。

```shell
npm install -g @vue-cli
```

<br/>

#### 2.建立專案

全域安裝 Vue CLI 後就可以在終端機／命令提示字元中使用 `vue` 指令了，先用以下指令來創建一個新的專案。指令輸入完後，系統會詢問你要使用何種設定，這次系列文章使用 `default` 即可，若是有使用過的話也可以按你自己的習慣設定。

```shell
vue create vue-highchart
```

<br/>

#### 3.安裝套件

專案建立完成後，先移動到專案資料夾，並依序安裝 Highcharts 和 Highcharts-Vue，分別是主程式以及 Vue 的擴充。

```shell
cd vue-highcharts
npm install highcharts
npm install highcharts-vue
```

等待安裝完畢後，我們要打開 `src` 資料夾下的 `main.js`，增加下面這幾行程式碼來啟動套件。

```javascript
import Vue from 'vue';
import HighchartsVue from 'highcharts-vue';

Vue.use(HighchartsVue);
```

<br/>

#### 4.新增元件

那此時前置作業都完成了，接者就可以在 `src/components` 底下新增 `Chart.vue` 元件，名稱你可以自行調整，檔案內容如下：

```vue
<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
export default {
  data() {
    return {
      chartOptions: {
        chart: { type: "column" },
        title: { text: "公司員工年齡分佈" },
        xAxis: {
          categories: [
            "18-24歲",
            "25-29歲",
            "30-34歲",
            "35-39歲",
            "40-44歲",
            "45-49歲",
            "50-54歲",
            "55歲+"
          ]
        },
        yAxis: {
          title: { text: "人數" }
        },
        series: [{
          name: "XX公司員工",
          data: [12, 18, 22, 25, 32, 35, 26, 18]
        }]
      }
    };
  }
};
</script>
```

其中 `<highcharts>` 就是 Highcharts-Vue 註冊的全域元件，而 `:options` 這個 Prop 要傳入的就是 `options` 物件，所以你會看到 `chartOptions` 其實就是我們已經寫了二十幾天的圖表設定。

<br/>

#### 5.掛載元件

元件完成後就，我們打開 `App.vue`，然後將內容改成下面這樣，將剛剛寫好的元件掛載進來，取代原本的 `HelloWorld.vue`。

```vue
<template>
  <div id="app">
    <chart />
  </div>
</template>

<script>
import chart from "./components/Chart.vue"

export default {
  name: 'App',
  components: {
    chart
  }
}
</script>
```

<br/>

#### 6.執行APP

最後只要在專案資料夾底下執行指令就可以看到圖表囉！

```shell
npm run serve
```

<img src="/img/content/highcharts-26/vue-chart.png" style="max-width: 800px;" />

<br/>

今天我們成功使用 Vue CLI 配合 Highcharts 的套件來完成圖表的繪製，不過目前還沒有真正發揮 Vue 的優勢，所以明天還要繼續了解如何透過 Vue 的資料雙向綁定來動態更新圖表資料或設定。

---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10251641) -


