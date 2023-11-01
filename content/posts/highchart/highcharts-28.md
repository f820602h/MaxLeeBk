---
title: 資視就是力量 - Highcharts / Vue 做個記帳本 (上)
date: 2020/10/12 09:45:00
tags: [JavaScript,Highcharts,12th鐵人賽]
---

既然已經掌握了 Highcharts-Vue 的基本使用技巧，那今明兩天打算帶大家來實作一個「記帳本」，用一個比較完整的應用來完結這個系列，也算是一個學習成果的回顧。

---

## 記帳本實作

如下圖所示，第一天打算先把我們記帳本的介面、圖表及資料串接完成，畫面大致如上，上方為新增帳目的表單元件，下方則是顯示每日消費金額的柱狀圖，樣式的話大家可以自由發揮，文章中將只會說明程式邏輯的部分。

<img src="/img/content/highcharts-28/case.png" style="max-width: 800px;" />

<br/>

#### 1.安裝 Json-Server

為了可以讓記帳本真的可以記帳，我們會需要資料庫來紀錄帳目，而我選擇使用的是 Json-Server，它讓我們可以用一個 Json 檔來作為簡易的資料庫，而且內建基本的 REST API 可以使用，這樣我們就不用真的架一個後端伺服器了，在終端機輸入下方指令就可以全域安裝了。

```shell
npm install -g json-server
```

安裝完成後新增一個 `db.json`，然後可以先手動新增一筆帳目，檔案內容如下：

```json
{
  "accounts": [
    {
      "id": 1,
      "category": "伙食",
      "amount": "50",
      "date": 1602028800000,
      "description": "早餐"
    }
  ]
}
```

檔案備妥後，在終端機輸入以下指令就可以啟動 `json-server`，這時候到 `http://localhost:3000/accounts`，就可以看到剛剛建立的資料了，未來只要是開啟伺服器的狀態就可以使用 API 來讀寫 `db.json` 的資料了。

```shell
json-server db.json
```

<br/>

#### 2.安裝 axios

資料庫有了之後，接下來在專案資料夾底下輸入終端機指令來安裝 `axios`，它可以讓我們更便捷的處理 XMLHttpRequest。

```shell
npm install axios
```

安裝好後到 `main.js` 添加以下程式碼來引用它，這樣我們就可以在元件裡使用 `this.axios.get()` 來呼叫 API 了。

```javascript
import Vue from "vue";
import axios from "axios";
Vue.prototype.axios = axios;
```

<br/>

#### 3.Highcharts 全域設定

由於這次的應用會使用到日期座標，所以我們可以來調整一下「語言設定」，設定方法是在 `main.js` 引入原生 Highcharts，然後一樣是呼叫 `setOptions()`。

```javascript
import Vue from "vue";
import Highcharts from "highcharts";

Highcharts.setOptions({
  lang: {
    shortMonths: ["1月", "2月", ..., "12月"],
    weekdays: ["星期日", "星期一", ..., "星期六"],
  },
  // 也可增加其他你像要的全域設定
  credits: { enabled: false },
  colors: [...]
});
```

<br/>

#### 4.表單元件 - LedgerForm.vue

前置作業完成後就可以來開發元件了，首先是上方用來新增帳目的表單元件。新增一個檔案內容如下的元件，其中四個表單欄位剛好對應資料庫的內容，而點擊按鈕觸發的 `addItem` 就是用 `axios` 送出 `post` 請求，便會在資料庫添加一筆新的帳目。

<br/>

**對了，為了把重點放在圖表的應用上，有許多部分是被我省略的：**
1. 為了省去畫面處理的邏輯，我故意使用 Form 表單，讓資料送出時會自動刷新頁面，這部分的使用體驗可以再改善。
2. 表單驗證的部分也被我省略了，為了防止錯誤的資料格式存進資料庫，再請各位自行撰寫。

```vue
<template>
  <form>
    <fieldset>
      <legend>新增帳目</legend>
      <div class="input-group">
        <label>日期</label>
        <input type="date" v-model="date">
        <label>分類</label>
        <select v-model="category">
          <option value="伙食">伙食</option>
          <option value="交通">交通</option>
          <option value="生活">生活</option>
          <option value="帳單">帳單</option>
          <option value="娛樂">娛樂</option>
        </select>
        <label>金額</label>
        <input type="number" v-model.number="amount">
      </div>
      <div class="input-group">
        <label>說明</label>
        <input type="text" v-model="description">
      </div>
      <button @click="addItem">+</button>
    </fieldset>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        date: "",
        category: "伙食",
        amount: 0,
        description: ""
      }
    },
    methods: {
      addItem() {
        this.axios.post("http://localhost:3000/accounts", {
          date: new Date(this.date).getTime(),
          category: this.category,
          amount: this.amount,
          description: this.description
        })
      }
    }
  }
</script>
```

<br/>

#### 5.圖表元件 - LedgerChart.vue

**可以紀錄帳目後，就要讓消費記錄透過圖表呈現出來了，而需求規格有以下幾點：**
1. 每一個支出類別都是一組數據列，例如伙食、娛樂、交通..等。
2. 圖表為柱狀圖，不同數據列需要疊加，以便觀察每日總消費的起伏。
3. Ｘ軸為日期座標軸，並且顯示只顯示從今天算起的前七天。

> 避免模糊焦點，這次圖表只做到近七天的資料顯示，有興趣的話你也可以根據自己你想法改善這個範例。

根據需求，我們先準備好需要的資料，包括儲存今日時間戳的 `todayTimeStamp`，儲存 API 資料的 `fetchData`，以及圖表設定 `chartOptions`。

```javascript
data() {
  return {
    todayTimeStamp: 0,
    fetchData: [],
    chartOptions: {
      chart: { type: "column" },
      title: { text: "每日消費" },
      tooltip: {
        shared: true,
        headerFormat: "{point.key:%Y/%m/%d %A}<br/>",
        valuePrefix: "NT$"
      },
      xAxis: {
        type: "datetime",
        categories: [],
        labels: { format: "{value:%b%d}日" },
      },
      yAxis: {
        title: undefined,
        labels: { format: "NT$ {value}" },
      },
      plotOptions: {
        series: { stacking: "normal" }
      },
      series: [],
    }
  };
}
```

而API資料我們需要再 `created` 時先去取得，順便把今天的時間戳儲存起來，方便我們之後計算近七天的時間。

```javascript
created() {
  // 取得當日的時間戳
  let now = new Date().getTime();
  this.todayTimeStamp = now - now  % 86400000;
  // call json-server api
  this.axios.get("http://localhost:3000/accounts").then((response) => {
    this.fetchData = response.data;
  });
},
```

有了這些資料後，就可以透過 `computed` 來將資料處理成我們所需的格式了。

```javascript
computed: {
  // 利用當日時間戳來計算Ｘ軸所需的 categories 陣列
  xAxisCategories() {
    return Array(7).fill(0).map((date ,index) => {
      return this.todayTimeStamp - 86400000 * index
    }).reverse()
  },
  // 抓出所有不重複的支出類別
  expendType() {
    let allType = this.fetchData.map(item => item.category);
    return Array.from(new Set(allType));
  },
  // 把 API 資料 map 成我們需要的格式
  seriesData() {
    return this.expendType.map(cate => {
      let itemByCate = this.fetchData.filter(item => item.category === cate);
      let points = this.xAxisCategories.map(date => {
        return itemByCate.reduce((acc, item) => {
          return item.date === date ? acc + Number(item.amount) : acc
        }, 0)
      })
      return { name: cate, data: points };
    });
  },
  // 將圖表設定和處理完的資料合併
  options() {
    let options = Object.assign(this.chartOptions, {});
    options.series = this.seriesData;
    options.xAxis.categories = this.xAxisCategories;
    return options;
  }
}
```

最後把 `options` 傳入圖表，並且記得把今天新增的兩個元件掛載到 `App.vue` 上，就可以看到消費紀錄呈現在圖表上囉。

```html
<template>
  <div class="chart-container">
    <div v-if="!fetchData.length" class="noData">無任何消費記錄</div>
    <highcharts v-else :options="options"></highcharts>
  </div>
</template>
```

<img src="/img/content/highcharts-28/ledger.gif" style="max-width: 800px;" />

<br/>

辛苦各位了，今天的篇幅比較長，不過跟著今天一步步的流程下來，終於完成了一個比較完整的 Highcharts-Vue 應用，而明天我們將利用「事件屬性」來為這個應用再添加一個小功能。


---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10252336) -


