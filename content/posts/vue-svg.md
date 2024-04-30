---
title: 在 Vue 聰明使用 SVG-Icon
date: 2020/5/18 20:46:25
tags: [Vus.js,SVG,Webpack]
---

> 2024/4/30 更新：
> 雖然這篇是在 Vue3 還沒出的時候寫的，但由於看到這篇偶爾還是有些點擊率，所以決定更新一下，並免點進來看的人失望離開。
> 以下將包含 Vue2 & Vue3 的不同方案

<br />

一般來說我們在 Vue 的專案裡使用 SVG，會有兩種比較簡單的方式。

<br />

##### 第一種：Using SVG as an ＜img＞
利用 `<img>` 標籤來引入，此時 SVG 被視為一個圖檔載入，最大的缺點就是無法利用 CSS 來改變 SVG 的樣式。
但不幸的是如果你的 icon 會有改變顏色的需求，你就需要兩張不同顏色的圖檔，兩個 `<img>` 標籤，然後用判斷式來控制，非常繁瑣。

```html
<template>
  <img v-if="theme === 'light'" src="/img/content/icon-light.svg" />
  <img v-else-if="theme === 'dark'" src="/img/content/icon-dark.svg" />
</template>
```

<br />

##### 第二種：Inline SVG
直接將 `<svg>` 標籤放進 Html 結構中，這種方法雖然解決了改變顏色的問題，但卻讓程式碼看起來非常雜亂。

::advance-code{:line='[3]'}
```html
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g 
      :stroke="myColor"
      stroke-linecap="round">
      fill-rule="evenodd" 
      <path d="M8 3.5v9M4.5 9.5l3.5 4 3.5-4"/>
    </g>
  </svg>
</template>
```
::

---

## SVG Sprites 精靈圖

為了解決上述的困擾 SVG Sprites 是一種對於 SVG 中 `<use>` 及 `<symbol>` 標籤的應用，透過這兩個標籤，我們可以將所有的 SVG 圖示放在一個檔案中，並且透過 `id` 來引用，這樣就可以達到一次引入，多次使用的效果。例如下面的範例：

```html
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="myDot" width="10" height="10" viewBox="0 0 2 2">
    <circle cx="1" cy="1" r="1" />
  </symbol>
</svg>

<svg>
  <use xlink:href="#myDot" />
</svg>
```

而不管是 Vue2 或 Vue3，我們最終都是透過打包工具（Webpack、Vite）來將專案中的 SVG 檔案轉換為上述的 `<symbol>`，以達到 SVG Sprites 的效果。

<br />

### # Vue3 + Vite

在 Vue3 + Vite 的專案中，我們可以透過 Vite 的 Plugin 來製作 SVG Sprites。目前市面上有許多不同的 Plugin 可以使用，例如 [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) 或 [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) ，你可以選一個你自己喜歡的，這裡我打算自己寫一個簡單的 Plugin 來處理。

<br />

##### 一、撰寫 Vite Plugin

在專案中新增一個 `svgBuilder.js`，名稱和路徑你都可以自己調整，並且撰寫以下程式碼：

::advance-code{:file-name='svgBuilder.js'}
```javascript
import { readFileSync, readdirSync } from "fs";

// 將 SVG 內容轉換為 Symbol 的函式，接受一個 SVG 檔案路徑作為參數
function symbolFormatter(svgPath) {
  const svgFrontTag = /<svg([^>+].*?)>/;
  const hasViewBox = /(viewBox="[^>+].*?")/g;
  const clearHeightWidth = /(width|height)="([^>+].*?)"/g;
  const clearReturn = /(\r)|(\n)/g;

  return readFileSync(svgPath)
    .toString()
    .replace(clearReturn, "") // 移除換行符號
    .replace(svgFrontTag, (match, $1) => {
      let width = 0;
      let height = 0;

      // 取得 SVG 的 width 和 height 的值後，將其從 SVG 內容中移除
      let content = $1.replace(clearHeightWidth, (match, s1, s2) => {
        if (s1 === "width") width = s2;
        if (s1 === "height") height = s2;
        return "";
      });

      // 如果 SVG 沒有 viewBox 屬性，則加入 viewBox 屬性
      if (!hasViewBox.test($1)) content += `viewBox="0 0 ${width} ${height}"`;
      
      // 將 SVG 內容轉換為 Symbol，並使用檔名作為 Symbol 的 id
      return `<symbol id="${content.name.replace(".svg", "")}" ${content}>`;
    })
    .replace("</svg>", "</symbol>");
}

// 遞迴尋找資料夾中的 SVG 檔案的函式，接受一個資料夾路徑作為參數
function findSvgFile(dir) {
  const symbolRes = [];
  const dirent = readdirSync(dir, { withFileTypes: true });

  for (const content of dirent) {
    // 如果是資料夾，則遞迴尋找，反之則將其轉換為 Symbol
    if (content.isDirectory()) {
      symbolRes.push(...findSvgFile(dir + content.name + "/"));
    } else {
      symbolRes.push(symbolFormatter(dir + content.name));
    }
  }

  // 返回所有被轉換為 Symbol 的 SVG 內容
  return symbolRes;
}

// 最終要 export 的 Plugin 函式，接受一個資料夾路徑作為參數
export const svgBuilder = (path) => {
  if (path === "") return;
  const symbols = findSvgFile(path);
  return {
    name: "svg-builder",
    transformIndexHtml(html) {
      return html.replace(
        "<body>",
        `<body>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            style="position: absolute; width: 0; height: 0"
          >
            ${symbols.join("")}
          </svg>
        `
      );
    }
  };
};
```
::

- 由於 Vite 是在 Node 環境中執行，所以我們可以取用 Node.js 的 `fs` 模組來讀取檔案。
- 在 `symbolFormatter` 中，透過 `readFileSync` 讀取 SVG 檔案內容，並以 `replace` 做字串處理。
- 在 `findSvgFile` 中，透過 `readdirSync` 讀取整個指定的資料夾中的檔案。
- 在 `svgBuilder` 中的 `transformIndexHtml` 則是 Vite 提供的 [Hook API](https://vitejs.dev/guide/api-plugin#transformindexhtml)，用來處理 Html 的內容。

<br />

##### 二、使用 Plugin

完成 Plugin 後，我們要在 `vite.config.js` 中正式使用 Plugin。

::advance-code{:file-name='vite.config.js'}
```javascript
import { svgBuilder } from "./src/plugins/svgBuilder";

export default () => {
  return {
    plugins: [
      vue(),
      svgBuilder("./src/assets/icon/"),
    ],
  }
}
```
::

<br />

##### 三、全域元件

最後，新增一個元件來包裝 SVG Sprites，並且全域註冊這個元件。

::advance-code{:file-name='main.js'}
```javascript
import SvgIcon from "@/components/common/SvgIcon"

const app = createApp(App);
app.component("icon", SvgIcon);
app.mount("#app");
```
::

```vue
<template>
  <svg aria-hidden="true">
    <use :xlink:href="`#${iconName}`" />
  </svg>
</template>

<script setup>
defineProps({
  iconName: {
    type: String,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
```

你就可以在專案中像這樣使用這個元件了，若顏色並未照你預期的變換，請看文末的補充

```html
<template>
  <p style="color: red">
    <icon icon-name="icon-faq" />
  </p>
</template>
```

<br />

### # Vue2 + Webpack

在 Vue2 + Webpack 專案中，我們可以透過 Webpack Loader 以及一些額外操作來製作 SVG Sprites。

<br />

##### 一、安裝

首先建立資料夾路徑 `src/assets/icon`，之後的 `.svg` 檔都會放在這裡。接著安裝今天的主角 `svg-sprite-loader`，它就是這次要使用的 Webpack Loader。

```shell
$ npm install svg-sprite-loader -D
$ yarn add svg-sprite-loader -D
```

安裝好後要調整一下 Webpack 設定，在 Loader [文件](https://github.com/JetBrains/svg-sprite-loader) 中有詳細說明如何配置。不過我們這邊用的是 Vue CLI，其中的 Webpack 版本支援 `chainWebpack`，所以可以用以下方式來配置。

::advance-code{:file-name='vue.config.js'}
```javascript
module.exports = {
  chainWebpack: (config) => {
    // 先刪除預設的svg配置
    config.module.rules.delete("svg")
    
    // 新增 svg-sprite-loader 設定
    config.module
      .rule("svg-sprite-loader")               // 規則名稱
      .test(/\.svg$/)                          // 驗證檔案格式
      .include.add(resolve("src/assets/icon")) // 加入接受的檔案路徑
      .end()                                   // 結束規則的基本設定
      .use("svg-sprite-loader")                // 選取剛剛建立的規則
      .loader("svg-sprite-loader")             // 指定規則要使用的 loader
      .options({ symbolId: "[name]" })         // 設定 loader 的選項
      
    // 修改 images-loader 配置
    config.module
      .rule("images")
      .exclude.add(resolve("src/assets/icon"));
  }
}
```
::

- 使用 `.include.add()` 來加入你未來要存放 `.svg` 檔的資料夾路徑。
- 使用 `options()` 來設定 Loader， 相關屬性可以看 Loader 的 [文件](https://github.com/JetBrains/svg-sprite-loader?tab=readme-ov-file#configuration)。
- 使用 `symbolId` 屬性來決定 Symbol 的 `id` 該以什麼方式命名，這邊用的是 `[name]` 以檔名來命名。
- ***（可選）*** 預設的 `images-loader` 可以排除存放 `.svg` 檔的資料夾，未來該資料夾下的檔案便不可用 `<img>` 引入。

<br />

##### 二、使用

這樣處理完之後就可以在 Vue 元件中引入 `.svg` 檔，並且在 `template` 裡使用 `<use>`，你就可以獲得一個能夠改變顏色的 SVG icon 了。

```vue
<template>
  <svg><use xlink:href="#target" /></svg>
</template>

<script>
import "@/src/assets/icon/target.svg";
</script>
```

`xlink:href` 是用來指定 Symbol ID 的屬性，前面已經透過設定將 ID 設定為檔名，因此只要將 `#target` 改成對應的 `.svg` 檔名即可，例如： `faq.svg` 就是 `#faq`。

<br />
<br />
<br />

##### 三、全域引入與全域元件

雖然已經解決了改變 Icon 顏色以及程式碼雜亂的問題，但每當要使用 Icon 時，都必須在元件中引入對應的 `.svg` 檔，也是增添不少管理上的麻煩，這時可以在 `main.js` 中，利用 Webpack 的 `require.context` 一次性引入所有檔案（[官方說明](https://webpack.js.org/guides/dependency-management/#require-context)）。

這樣 `.svg` 檔就會全域性的引入，之後就不用一個個 `import` 了，未來如果要新增圖示，只需把檔案丟進資料夾即可，導入的部分 Webpack 會自動處理，能夠省下不少功夫。

::advance-code{:file-name='main.js'}
```javascript
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context("@/src/assets/icon", true, /\.svg$/)
requireAll(req)
```
::

另外，我們還可以新增一個元件來包裝 SVG Sprites，並且全域註冊這個元件。

::advance-code{:file-name='main.js'}
```javascript
import SvgIcon from "@/components/common/SvgIcon"
Vue.component("icon", SvgIcon)
```
::

```vue
<template>
  <svg aria-hidden="true">
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
  overflow: hidden;
}
</style>
```

這樣就可以直接用元件的方式使用 SVG 囉！

```html
<template>
  <p style="color: red">
    <icon icon-name="icon-faq" />
  </p>
</template>
```

---

## 補充

若你發現 Icon 沒有根據你的期望變換顏色，你需要將對應 Symbol 的 `.svg` 檔打開，並且確認是否有 `fill` 或 `stroke` 的屬性。如果有，請將它們的值由指定顏色改為 `currentColor`，這樣 Icon 便會根據父元素的文字顏色來變換。

