---
title: 前端效能改善與 Lighthouse
date: 2023/8/16 12:00:00
tags: [Performance, Lighthouse]
---

## 基本介紹

#### LCP (最大內容繪製)

從使用者要求網址時開始，轉譯可視區域中最大可見內容元素所需的時間。最大元素通常是圖片或影片，也可能是區塊層級大型文字元素。這項指標的重要性在於可以看出訪客多快能看到該網址實際載入。

#### FID (首次輸入延遲時間)

自使用者首次與網頁互動起算 (例如點選連結、輕觸按鈕等)，到瀏覽器回應該互動所需的時間。這項測量作業是針對使用者首次點選的互動式元素進行。對於需要使用者主動操作的網頁來說，這項指標非常重要，因為網頁要經過這段延遲時間才會變為互動式網頁。

#### CLS (累計版面配置位移)

CLS 能針對使用者開啟網頁期間，加總計算每一次非預期版面配置位移的評分。分數評分範圍為 0 到任何正數，其中 0 表示沒有任何位移，而數字越大表示網頁上發生的位移越多。這項指標的重要性在於，如果網頁元素在使用者嘗試與網頁互動時移動了位置，會對使用者體驗造成負面影響。如果你找不到評分過高的原因，請嘗試與網頁互動，就能瞭解獲得該評分結果的原因。

> 跟效能較無關，跟使用者體驗有關

#### FCP (首次內容繪製)

首次內容繪製(FCP) 指標測量頁面從開始加載到頁面內容的任何部分在屏幕上完成渲染的時間。對於該指標，"內容"指的是文本、圖像（包括背景圖像）、`<svg>` 元素或非白色的 `<canvas>` 元素。

|  | 良好 | 需要改善 | 不良 |
| --- | --- | --- | --- |
| LCP | 2.5 秒以下 | 4 秒以下 | 超過 4 秒 |
| FID | 100 毫秒以下 | 300 毫秒以下 | 超過 300 毫秒 |
| CLS | 0.1 以下 | 0.25 以下 | 超過 0.25 |
| FCP | 1.8 秒以下 | 3 秒以下 | 超過 3 秒 |

<br/>

- 提升 LCP：[https://web.dev/lcp/](https://web.dev/lcp/)
- 提升 FID：[https://web.dev/fid/](https://web.dev/fid/)
- 提升 CLS：[https://web.dev/cls/](https://web.dev/cls/)
- 提升 FCP：[https://web.dev/i18n/zh/fcp/](https://web.dev/i18n/zh/fcp/)

<br/>

## 檢測工具

#### Lighthouse & Performance

![](/img/content/lighthouse/lighthouse.png)

![](/img/content/lighthouse/performance.png)

<br/>

## 圖片壓縮及轉檔：LCP

1. 先壓縮就對了
2. 轉檔為 webp 會更小

<br/>

## 打包策略調整：FCP

#### Route Lazy Load 

[https://router.vuejs.org/zh/guide/advanced/lazy-loading.html](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)

```jsx
const viewsModules = import.meta.glob("../views/**/*.vue");
const views = Object.keys(viewsModules).reduce((acc, path) => {
  const name = path.match(/\/(\w+)\.vue$/)[1];
  acc[name] = viewsModules[path];
  return acc;
}, {});
```

#### Vite ManualChunks  

[https://rollupjs.org/configuration-options/#output-manualchunks](https://rollupjs.org/configuration-options/#output-manualchunks)

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "vue-vender": ["vue", "vuex", "vue-router"],
        "naive-vender": ["naive-ui"],
        "lottie-vender": ["lottie-web"],
        "lodash-vender": ["lodash-es"],
        "gsap-vender": ["gsap"],
        "swiper-vender": ["swiper"],
        "highcharts-vender": [
          "highcharts",
          "highcharts-vue",
          "highcharts/modules/no-data-to-display"
        ],
        "highcharts-word-cloud-vender": ["highcharts/modules/wordcloud"],
        "highcharts-map-vender": [
          "topojson-client",
          "highcharts/modules/map"
        ]
      }
    }
  }
},
```

<br/>

## 套件汰除、替換、載入優化: FCP

1. 自己刻還是比較小
2. Lodash 有出更小的版本 lodash-em
3. script cdn 動態插入 

<br/>

## 元素格局調整：CLS

1. 先準備空間給資料，不要用資料撐開空間

<br/>

## 設定圖片寬高比：CLS

1. 如果有自適應寬高的圖片可以使用 `<img>` 搭配 `aspect-ratio`，或是 `background-image` 搭配 `padding-bottom`
2. 位移動畫要小心 使用 `transform: translate()` 而非 `top`  `left` , 使用 `transform: scale()`, 而非 `height`和`width`
