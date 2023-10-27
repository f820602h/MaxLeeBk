---
title: 在 Vue 聰明使用 SVG-Icon
date: 2020/5/18 20:46:25
tags: [Vus.js,SVG,Webpack]
---
> 一般來說我們在Vue的專案裡使用SVG，會有兩種比較簡單的方式。

<br />

#### 第一種：Using SVG as an ＜img＞
利用 `<img>` 標籤來引入，此時 SVG 被視為一個圖檔載入，最大的缺點就是無法利用 CSS 來改變 SVG 的樣式。
但不幸的是如果你的 icon 會有改變顏色的需求，你就需要兩張不同顏色的圖檔，兩個 `<img>` 標籤，然後用 `display` 來控制，非常繁瑣。
```html
<img src="/img/content/icon.svg" />
```

<br />

#### 第二種：Inline SVG
直接將 `<svg>` 標籤放進 Html 結構中，這種方法雖然解決了改變顏色的問題，但卻讓程式碼看起來非常雜亂。
```html
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <g fill-rule="evenodd" stroke="#EA475B" stroke-linecap="round">
    <path d="M8 3.5v9M4.5 9.5l3.5 4 3.5-4"/>
  </g>
</svg>
```
---
## SVG Sprites

SVG Sprites 是一種對於 SVG 中 `use` 元素的應用，可以像是蓋印章一樣，不斷復用已經定義好的 SVG 圖形，而在 Vue 專案中，我們可以透過 `webpack` 的 `loader` 以及一些設定來達到同樣的效果。

首先建立資料夾路徑 `src/assets/icon`，之後的 `.svg` 檔都會放在這裡。
再來要安裝今天的主角 `svg-sprite-loader`，他就是這次要使用的 Webpack Loader。

```
$ npm install svg-sprite-loader -D
$ yarn add svg-sprite-loader -D
```

安裝好後要調整一下 `webpack` 設定，在 [官方文件](https://github.com/JetBrains/svg-sprite-loader) 中有詳細說明如何配置。但剛好 vue-cli 支援 `webpack-chain` ，我們就用它來設定吧！
在 `vue.config.js` 中撰寫以下程式碼：

```javascript
module.exports = {
  chainWebpack: config => {
  
    // 先刪除預設的svg配置
    config.module.rules.delete("svg")
    
    // 新增 svg-sprite-loader 設定
    config.module
      .rule("svg-sprite-loader") 
      .test(/\.svg$/)
      .include
      .add(resolve("src/assets/icon")）
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({ symbolId: "[name]" })
      
    // 修改 images-loader 配置
    config.module
      .rule("images")
      .exclude.add(resolve("src/assets/icon"))
  }
}
```
* 記得把 SVG 的路徑 `src/assets/icon` 給 `add` 進來。
* 使用 `options` 設定 `symbolId` 屬性，用來決定 SVG 的 `symbolId` 該以什麼方式命名，這次用的是 `"[name]"`，指定以檔名來命名。
* 另外把原本的 images-loader 排除 `icon` 資料夾，這樣只要放在 `src/assets/icon` 的 SVG 就不能用 `<img>` 引入了。

<br />

大功告成，這樣之後就可以在 vue 元件中引入 `.svg` 檔。

```javascript
import "@/src/assets/icon/target.svg";
```

然後在 `template` 裡使用下面這樣簡便的寫法，就可以清爽的使用 svg-icon 了，而且還可以隨心所欲的改變顏色！

```html
<svg><use xlink:href="#target" /></svg>
<!-- #target 改成svg的檔名就好囉，記得加井字號 -->
```

---

## 全域引入與全域元件

雖然已經解決了改變icon顏色以及程式碼雜亂的問題，但每當要使用icon時，都必須在元件中引入對應的 `.svg` 檔，也是增添不少管理上的麻煩，這時候一樣可以透過 `webpack` 幫我們處理。

在 `main.js` 中，利用 `webpack` 的 `require.context` 可以一次性的引入檔案。 [官方說明](https://webpack.js.org/guides/dependency-management/#require-context)
這樣 `.svg` 檔就會全域性的引入，之後就不用一個個 `import` 了，而且未來如果要新增圖示，只要把檔案丟進資料夾就好，導入的部分 `webpack` 會自動幫你處理，真的幫我們省下不少功夫。
```javascript
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context("@/src/assets/icon", true, /\.svg$/)
requireAll(req)
```

<br />

再者，我們還可以新增一個元件來包裝 SVG Sprites，並且全域註冊這個元件。

```javascript
import SvgIcon from "@/components/common/SvgIcon"
Vue.component("icon", SvgIcon)
```
```vue
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="`#${iconName}`" />
  </svg>
</template>

<script>
export default {
  name: "SvgIcon",
  props: {
    iconName: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor !important;
  overflow: hidden;
}
</style>
```

這樣就可以直接用元件的方式使用 SVG 囉！

```html
<icon iconName="target" />
<!-- 就像是在用 FontAwesome 一樣舒服 -->
```

---
### 補充
icon 的顏色是吃父層的 css:color ，如果發現 icon 顏色改不了，記得把 SVG 檔裡的 fill 或 stroke 改成 currentColor ，或是請設計師幫你設定一下輸出的檔案配置喔！
