---
title: Vue、SCSS、CSS 三角神力
date: 2024/6/28 16:00:00
tags: [Vue, SCSS, CSS]
---

> 此篇相關技術的版本： Vue (v3 以上) / SCSS (Dart Sass v1.23 以上)

<!-- MARK: 背景 -->
## 背景 

這篇文章的起因是最近在專案中遇到了「網站中有些頁面需要 RWD，有些頁面不需要」的需求，導致在這些不同頁面中的共用元件樣式會根據要不要 RWD 而改變。

雖然聽起來不是什麼困難的需求，但一般常見的處理方式總讓我覺得不是很俐落，於是就開始尋找其他作法。而在研究的過程中讓我聯想到了很多在 Vue 專案中使用 SCSS 與 CSS 的小技巧，所以就乾脆趁著這個機會把一些相關特性以及最終方案和大家分享。

<img src="/img/content/vue-scss-css/cover.png" style="width: 100%; height: 400px; object-fit: cover" />


---

<!-- MARK: 變數之間的三角輪迴 -->
## 變數之間的三角輪迴

在前端開發中，不外乎就是處理資料、狀態和樣式，在這個過程中偶爾會希望邏輯與樣式之間可以互通有無，若能夠直接傳遞變數就可以減少繁瑣的操作，下面就來了解 Vue、SCSS 與 CSS 中的變數該如何轉移。

<br />

<!-- MARK: SCSS Variables -> CSS Variables -->
#### # SCSS Variables -> CSS Variables

先說說為什麼會有 SCSS 變數要轉換成 CSS 變數的需求，這是因為在 Vue 專案中，除非做了一些額外設定，否則 SCSS 變數是無法共享給子原件的，但 CSS 變數卻可以，所以經過這樣的轉換就可以更便捷的設定樣式。

> 這裡的「額外設定」指的是 Vite 中的 `preprocessorOptions`，後面會再詳細介紹。

::flex-box
  ::advance-code{file-name="SCSS Variables"}
  ```vue
  <!-- Parent.vue -->
  <style lang="scss">
  $primary-color: #3498db;
  </style>

  <!-- Child.vue -->
  <style lang="scss" scoped>
  p {
    color: $primary-color; /* 會噴錯，子元件吃不到變數 */
  }
  </style>
  ```
  ::

  ::advance-code{file-name="CSS Variables"}
  ```vue
  <!-- Parent.vue -->
  <style lang="scss">
  $primary-color: #3498db;
  :root {
    --primary-color: #{$primary-color};
  }
  </style>

  <!-- Child.vue -->
  <style lang="scss" scoped>
  p {
    color: var(--primary-color); /* #3498db */
  }
  </style>
  ```
  ::
::

而且這樣的特性沒有限定父層一定要用 Global Style，只要將 `:root` 換成有包裹子層的元素，就算使用 `scoped` 依然可以讓子層的取得變數。

::flex-box
  ::advance-code{file-name="Parent.vue" :line=[1]}
  ```vue
  <style lang="scss" scoped>
  $primary-color: #3498db;
  .parent-wrapper {
    --primary-color: #{$primary-color};
  }
  </style>
  ```
  ::

  ::advance-code{file-name="Child.vue"}
  ```vue
  <style lang="scss" scoped>
  p {
    color: var(--primary-color); /* #3498db */
  }
  </style>
  ```
  ::
::

另外，比起 SCSS 變數，使用 CSS 變數還有一個好處，就是可以透過在子層覆蓋變數的方式來達到不同頁面的樣式設定，你只要在子層透過 `:root` 重新定義變數即可，因為 CSS 變數一樣有後蓋前、深蓋淺的權重特性。

::flex-box
  ::advance-code{file-name="App.vue"}
  ```vue
  <template>
    <div>
      <router-view />
      <p>Hello World</p>
    </div>
  </template>

  <style lang="scss">
  :root {
    --primary-color: #3498db;
  }
  </style>
  <style lang="scss" scoped>
  p {
    /* 進入 PageA 時會是 #e74c3c，在其他頁面則為 #3498db */
    color: --primary-color
  }
  </style>
  ```
  ::

  ::advance-code{file-name="PageA.vue"}
  ```vue
  <template>
    <p>Is Page A</p>
  </template>

  <style lang="scss">
  :root {
    --primary-color: #e74c3c;
  }
  </style>
  ```
  ::
::

<br />

<!-- MARK: CSS Variables -> SCSS Variables -->
#### # CSS Variables -> SCSS Variables

基本上 CSS 變數是可以直接在 SCSS 中使用的，但或許在寫 SCSS 的 `@function` 或 `@mixin` 時希望使用一個 SCSS 變數來儲存管理時，還是可以很簡單的轉換。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  :root {
    --primary-color: #3498db;
  }
  $primary-color: var(--primary-color);

  p {
    color: $primary-color;
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  :root {
    --primary-color: #3498db;
  }

  p {
    color: var(--primary-color); /* #3498db */
  }
  ```
  ::
::

> 注意：SCSS 是預處理器，所以實際上在編譯期間 SCSS 無法得知 CSS 變數具體的值，所以它並不會幫你將 CSS 變數轉變成值，而是直接將 `var(--primary-color)` 字串作為編譯結果。

<br />

<!-- MARK: Vue State -> CSS Variables / SCSS Variables -->
#### # Vue State -> CSS Variables / SCSS Variables

接著是可能更實用的 Vue 狀態轉換成樣式變數，由於不管是 CSS 還是 SCSS 方法都一樣，所以就一起講。在 Vue3 中，多了一個「v-bind in CSS」的功能，可以很簡單的將邏輯中的資料綁定到樣式當中，並且是動態響應的。

```vue
<script setup>
import { ref, computed } from "vue";

const isLoading = ref(false);
const loadingColor = computed(() => {
  return isLoading.value ? "red" : "blue";
});
</script>

<style lang="scss">
$loading-color: v-bind(loadingColor); /* SCSS Variables */

:root {
  --loading-color: v-bind(loadingColor); /* CSS Variables */
}

p {
  color: v-bind(loadingColor); /* Direct Use */
}
</style>
```

你可能想為甚麼不直接透過 `v-bind:style` 傳入就好了呢？其實原因就是「簡化復用方式」，要是 `loadingColor` 並不是只用在單一樣式上，而是有很多地方需要用到，那麼這樣的寫法就會讓模板區塊更乾淨。

::flex-box
  ::advance-code{file-name="v-bind in inline style"}
  ```vue
  <template>
    <div :style="{ borderColor: loadingColor }">
      <p :style="{ color: loadingColor }">
        <span :style="{ backgroundColor: loadingColor }">
          Hi~~
        </span>
        Hello World
      </p>
    </div>
  </template>
  ```
  ::

  ::advance-code{file-name="v-bind in CSS"}
  ```vue
  <style lang="scss" scoped>
  $loading-color: v-bind(loadingColor);

  div {
    border-color: $loading-color;
  }
  p {
    color: $loading-color;
  }
  span {
    background-color: $loading-color;
  }
  </style>
  ```
  ::
::

另外還記得前面將 SCSS 變數轉換成 CSS 變數的好處嗎？那就是跨元件之間的變數分享，想想看如果不用 CSS 變數，那其他元件也想要取得 `loadingColor` 時，我們只能使用 Vue 中傳遞資料的方式，不管是透過 `props`、`inject` 還是狀態管理工具如 `pinia`，都會讓程式碼變得更繁瑣。

但只要透過「v-bind in CSS」將狀態變成 CSS 變數，就可以跟前面所說的一樣，在子層樣式中直接取用變數。

<br/>

<!-- MARK: CSS Variables -> Vue State -->
#### # CSS Variables -> Vue State

要將 CSS 變數轉變為 Vue State 也是可以的，只要透過 `window.getComputedStyle()` 取得元素的樣式，再透過 `getPropertyValue()` 取得 CSS 變數的值，不過這個方法所拿到的值並不是響應式的，所以如果 CSS 變數有變動，Vue State 並不會跟著變動。

```vue
<script setup>
import { ref, onMounted } from "vue";

const myColor = ref("");
onMounted(() => {
  const root = document.documentElement; // 也可以是其他元素
  const color = window.getComputedStyle(root).getPropertyValue("--my-color");
  myColor.value = color;
})
</script>
```

目前我沒有想到這個作法的實際作用或需求，但或許未來會有適合的場景，可以先學起來以備不時之需。

> 另外也補充一下，`setProperty()` 方法可以用來動態設定 CSS 變數的值，Vue 的「v-bind in CSS」背後就是用此實作的。

<br/>

<!-- MARK: SCSS Variables -> Vue State -->
#### # SCSS Variables -> Vue State

最後是 SCSS 變數轉變為 Vue State，這個方法主要是透過 Vite 的 CSS Modules 功能搭配 SCSS 的 `:export` 變數匯出來實現，好處是可以是將 `.scss` 檔案作為一個變數的統一管理模組，並且無論是在 `<script>` 還是 `<style>` 都可以引入變數。

::flex-box
  ::advance-code{file-name="variables.module.scss"}
  ```scss
  $foo: green;
  $bar: blue;

  :export {
    foo: $foo;
    bar: $bar;
  }
  ```
  ::

  ::advance-code{file-name="App.vue"}
  ```vue
  <script setup>
  import { foo, bar } from "src/scss/variables.module.scss";
  console.log(foo, bar); // "green" "blue"
  </script>

  <style lang="scss">
  @import "src/scss/variables.module.scss";

  p {
    color: $bar;
  }
  </style>
  ```
  ::
::

>  注意：儲存變數的 `.scss` 檔一定要有 `.module` 的綴詞，這樣 Vite 才會將它視為 CSS Modules 檔案。

---

<!-- MARK: 智慧的三角神力 - CSS -->
## 智慧的三角神力 - CSS

#### # var() 預備值

`var()` 在 CSS 中可以用來取得變數的值，不過它其實還有第二個參數，當變數不存在或未定義時就會回傳這個參數，這樣就可以避免變數不存在時的也能有一個預備值。

```css
p {
  color: var(--my-color, red); /* 如果 --my-color 不存在就會是 red */
}
```

<br/>

#### # initial 關鍵字

`initial` 關鍵字是用來重置元素的樣式，當你想要讓某個樣式屬性回到預設值時，就可以使用它。

```html
<p><em>This text is in the initial color</em></p>

<style>
  p {
    color: red;
  }
  em {
    color: initial; /* #000000 */
  }
</style>
```

而當 `initial` 使用在 CSS 變數時，變數會被視為未定義，所以這時候當 `var()` 有設定預備值時，就會發揮作用。

```css
:root {
  --my-color: initial;
}
p {
  color: var(--my-color, red); /* red */
}
```

<br/>

#### # CSS 邏輯運算

沒錯，儘管 CSS 並非程式語言，但我們依然可以通過一些特殊的技法來模擬邏輯運算。首先要搭配前面「v-bind in CSS」的方法，將 `isLoading` 與 `isLogin` 轉換成值為 `0` 或 `1` 的 CSS 變數。

接著透過 `calc()` 搭配乘法，就可以模擬出 `AND` 邏輯運算，最後一樣透過 `calc()` 的運算來模擬三元運算的效果。

```vue
<script setup>
import { ref } from "vue";

const isLoading = ref(false);
const isLogin = ref(true);
</script>

<style lang="scss">
#app {
  --is-loading: v-bind(Number(loading)); /* 0 or 1 */
  --is-login: v-bind(Number(isLogin)); /* 0 or 1 */
  --is-loading-and-login: calc(var(--is-loading) * var(--is-login)); /* 0 or 1 */
}

p {
  font-size: calc(
    /* 當 isLoading 和 isLogin 都為 true 時為 32px，否則為 12px */
    /* 1 * 32px + (1 - 1) * 12px = 32px */
    /* 0 * 32px + (1 - 0) * 12px = 12px */
    var(--is-loading-and-login) * 32px + (1 - var(--is-loading-and-login)) * 12px
  );
}
</style>
```

> 細心的人應該有發現，以上做法其實只支援「數字」的屬性，如果是 `display` 或 `overflow` 這類的值為文字的屬性就無法運作。
> 如果你對 CSS 變數的運用有興趣，可以額外深入看看 [這篇文章](https://css-tricks.com/logical-operations-with-css-variables/)。

---

<!-- MARK: 力量的三角神力 - SCSS -->
## 力量的三角神力 - SCSS

#### # SCSS @mixin

`@mixin` 是 SCSS 提供的一種 At-Rule，用途是為了避免撰寫重複的樣式，將重複的樣式抽出來，並透過 `@include` 來使用。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  @mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    @include flex-center;
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ```
  ::
::


而 `@mixin` 本身有兩個很重要的特性，分別是 Arguments 和 Content Block，這兩個特性讓 `@mixin` 的使用變得更加靈活彈性。

<br/>

- **Arguments**：可以接受參數。
- **Content Block**：接受整個樣式區塊，並透過 `@content` 取得並組合使用。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  @mixin media-breakpoint-up($breakpoints) {
    @media (min-width: $breakpoints) {
      @content;
    }
  }

  .container {
    @include media-breakpoint-up(1024px) {
      font-size: 16px;
    };
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  @media (min-width: 1024px) {
    .container {
      font-size: 16px;
    }
  }
  ```
  ::
::

<br/>

#### # SCSS @at-root

`@at-root` 是另一個 At-Rule，它的作用是將樣式提升到最外層，當不希望巢狀樣式是有階層關係時就可以使用它。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  .parent {
    color: white;
    @at-root .not-your-child {
      color: black;
    }
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  .parent {
    color: white;
  }
  .not-your-child {
    color: black;
  }
  ```
  ::
::

<br/>

#### # Parent Selector

`&` 是 SCSS 中的特殊符號，代表的是父層的選擇器，這個特性在撰寫巢狀樣式時非常好用，可以讓我們在子層樣式中直接取用父層的選擇器。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  .parent {
    color: white;
    &:hover {
      color: black;
    }
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  .parent {
    color: white;
  }
  .parent:hover {
    color: black;
  }
  ```
  ::
::

這可能是 SCSS 中大家最常用的特性之一，但其實顯為人知的是，`&` 其實就是單純的字串，你可以將其用在各種不同的地方。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  .red-item {
    color: red;

    :not(&) {
      color: blue;
    }
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  .red-item {
    color: red;
  }
  :not(.red-item) {
    color: blue;
  }
  ```
  ::
::

---

<!-- MARK: 勇氣的三角神力 - Vue -->
## 勇氣的三角神力 - Vue

其實 Vue 的厲害之處已經悄悄表現得淋漓盡致了，若是沒有 Vue 本身強大的編譯能力以及 Vite 的建置功能，前面很多技巧都是無法實現的。不過這邊依然有一些額外的技巧可以和大家分享。

<br/>

#### # Vue - Variables in Inline Style Binding

還記得前面說明「v-bind in CSS」時，有展示在模板中使用 `v-bind:style` 的效果不太優雅，但其實也是有一個相對折衷的方式，那就是雖然使用 `v-bind:style` 不過物件中定義的是 CSS 變數。沒想要 Vue 竟然還支援這樣的定義方式，真的想得很周到。

```vue
<template>
  <div :style="{ '--loading-color': loadingColor }">
    <p>Hello World</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const isLoading = ref(false);
const loadingColor = computed(() => {
  return isLoading.value ? "red" : "blue";
});
</script>

<style lang="scss" scoped>
div {
  border-color: var(--loading-color);
}
p {
  color: var(--loading-color);
}
</style>
```

<br/>

#### # Vite - Preprocessor Options AdditionalData

其實就是前面提到可以讓 SCSS 變數在 Vue 專案中全域共享的方法，這個設定可以將你提供的內容預載到每個元件的 Scoped Style 中。

::flex-box
  ::advance-code{file-name="vite.config.js"}
  ```js
  export default defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "src/scss/variables.scss;
            $injectedColor: orange;
          `,
        },
      },
    },
  })
  ```
  ::

  ::advance-code{file-name="SomeComp.vue"}
  ```vue
  <style lang="scss" scoped>
  p {
    color: $injectedColor;
  }
  </style>
  ```
  ::
::

---

<!-- MARK: 運用神力 -->
## 運用神力

有了以上的前置知識，就可以開始說明我是如何運用上述技巧來解決文章開頭的問題了。那先重新回顧一下問題並設定情境：

::quote-box
網站中有些頁面需要 RWD，有些頁面不需要，導致在這些不同頁面中的共用元件樣式會需要根據需不需要 RWD 來調整。

<br/>

1. 網站切換大小版的斷點是 `1024px`
2. 網站中有一個佈局層級的元件 `<Header>`
   - 在非 RWD 頁面中 `height: 70px`
   - 在 RWD 頁面中高度會在小版變為 `height: 50px`
3. 網站中有一個一般共用元件 `<MyComp>`
   1. 在非 RWD 頁面中 `flex-direction: row`
   2. 在 RWD 頁面中會在小版變為 `flex-direction: column`
::

<br />

#### # 頁面判斷

針對以上的情況，為了能夠釐清哪些頁面需要 RWD，哪些頁面不需要，才能在元件中正確的套用樣式，而這個判斷可以透過 Vue Router 的 `meta` 來設定，如此就可以在根元件 `<App>` 中透過 `route` 取得這個資訊。

::flex-box
  ::advance-code{file-name="router.js"}
  ```js
  const routes = [
    {
      name: "PageA",
      path: "/page-a",
      component: PageA,
      meta: { isRWD: true }
    },
    {
      name: "PageB",
      path: "/page-b",
      component: PageB,
      meta: { isRWD: false }
    },
  ]
  ```
  ::

  ::advance-code{file-name="App.vue"}
  ```vue
  <script setup>
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();
  const isRWD = computed(() => route.meta.isRWD);
  </script>
  ```
  ::
::

通常以往到了這裡，我們可能就會透過 `inject`、`provide` 來將這個資訊傳遞給子元件，然後再到子元件中寫這樣的內容：

::advance-code{file-name="Header.vue"}
```vue
<template>
  <header :class="{ isRWD }"></header>
</template>

<script setup>
import { inject } from "vue";

const isRWD = inject("isRWD");
</script>

<style lang="scss" scoped>
header {
  height: 70px;

  &.isRWD {
    height: 50px;

    @media (min-width: 1024px) {
      height: 70px;
    }
  }
}
</style>
```
::

這樣的缺點是我們總得在元件中取得 `isRWD` 這個資訊，並且需要額外為元素加上 `isRWD` 的 class，最後在 `<style>` 還得處理 `@media` 的部分，甚至其中還有重複的部分。所以必須重新規劃。

<br />

#### # CSS Module 管理變數

首先，`<Header>` 的高度很有可能被其他元件拿來使用，例如設定 `sticky` 元素的 `top`，或是計算 `scrollTo()` 這類用途。所以應該將這樣的變數使用 CSS Module 的來管理，這樣不管是要處理邏輯還是處理樣式時都可以取用。

::advance-code{file-name="global_variables.module.scss"}
```scss
$header-height: 70px;
$header-mobile-height: 50px;

:export {
  headerHeight: $header-height;
  headerMobileHeight: $header-mobile-height;
}
```
::

<br />

#### # 單一 CSS 變數

不過這樣在其他元件使用時還是得在樣式中透過 `@import` 來引入，所以乾脆在 `<App>` 中透過將其轉換為 CSS 變數，這樣就可以在任何元件中直接使用了。

而且甚至可以直接在 `<App>` 中就先將變版的變數覆蓋寫好，這樣其他元件裡就不需要再判斷應該要使用 `header-height` 還是 `header-mobile-height` 了。

::flex-box
  ::advance-code{file-name="App.vue"}
  ```vue
  <template>
    <div id="my-app" :class="{ isRWD }">
      <Header></Header>
      <router-view />
    </div>
  </template>

  <script setup>
  import Header from "src/components/Header.vue";
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const route = useRoute();
  const isRWD = computed(() => route.meta.isRWD);
  </script>

  <style lang="scss" scoped>
  @import "@/scss/global_variables.module.scss";

  #my-app {
    --header-height: $header-height;

    &.isRWD {
      --header-height: $header-mobile-height;

      @media (min-width: 1024px) {
        --header-height: $header-height;
      }
    }
  }
  </style>
  ```
  ::

  ::advance-code{file-name="Header.vue"}
  ```vue
  <template>
    <header></header>
  </template>

  <script setup></script>

  <style lang="scss" scoped>
  header {
    height: var(--header-height);
  }
  </style>
  ```
  ::
::

這時候 `<Header>` 就不需要再去判斷 `isRWD` 了，只要直接取用 CSS 變數即可，而且這並不只是將原本的邏輯搬到 `<App>` 中而已，而是未來所有需要使用 Header 高度的元件都不再需要關注 RWD 與大小版的判斷，只要直接取用 CSS 變數即可。此外，如果未來新增其他如 Footer、Sidebar 這類層級的元件時，也只要增加新的變數即可。

<br />

#### # @mixin 與其他技法搭配

這樣 `<Header>` 的部分就解決了，不過接下來 `<MyComp>` 的情況有些不同，畢竟把一般元件的樣式抽到 CSS Module 中管理可能會有點過頭，但反過來為了一個小小的樣式變動而去試圖判斷 RWD 狀態也有點麻煩，所以我打算透過 `@mixin` 來解決。

::flex-box
  ::advance-code{file-name="rwd.scss"}
  ```scss
  @mixin pc-and-no-rwd($breakpoint: 1024px) {
    $selector: #{&};

    @at-root #my-app:not(.isRwd) {
      @if #{$selector} != "#my-app" {
        #{$selector} {
          @content;
        }
      } @else {
        @content;
      }
    }

    @media (min-width: $breakpoint) {
      @content;
    }
  }
  ```
  ::

  ::advance-code{file-name="MyComp.vue"}
  ```vue
  <template>
    <ul class="my-comp">
      <li>foo</li>
      <li>bar</li>
    </ul>
  </template>

  <script setup></script>

  <style lang="scss" scoped>
  @import "@/scss/rwd.scss";

  .my-comp {
    display: flex;
    flex-direction: column; // RWD 頁面的小版

    @include pc-and-no-rwd {
      flex-direction: row; // RWD 頁面的大版、非 RWD 頁面
    }
  }
  </style>
  ```
  ::
::

這個 `@mixin` 本身接收一個 `$breakpoint` 參數，預設是 `1024px`，當中的 `$selector` 變數會儲存使用這個 `@mixin` 的選擇器，而傳進來的 `@content` 內容會被使用在判斷大版的 `@media` 中，以及一個使用 `@at-root` 傳到巢狀結構外的樣式中。

由於整個網站的根節點 `#my-app` 已經被改成會根據頁面狀態加上 `isRWD` 的 class，所以可以透過 `:not(.isRWD)` 來判斷是否為非 RWD 頁面，這樣只要是寫在這個區塊底下的樣式就會被套用在非 RWD 頁面中。

::flex-box
  ::advance-code{file-name="編譯前"}
  ```scss
  .my-comp {
    display: flex;
    flex-direction: column;

    @include pc-and-no-rwd {
      flex-direction: row;
    }
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```css
  .my-comp {
    display: flex;
    flex-direction: column;
  }

  #my-app:not(.isRwd) .my-comp {
    flex-direction: row;
  }

  @media (min-width: 1024px) {
    .my-comp {
      flex-direction: row;
    }
  }
  ```
  ::
::

相信看了編譯後的結果，應該可以比較理解整個 `@mixin` 的邏輯，以及它帶來的簡潔效果。

<br />

#### # Vite AdditionalData

另外為了不用每次都要 `@import` 這個 `rwd.scss`，可以透過 Vite 的 `preprocessorOptions` 來將它預載到每個元件的 Scoped Style 中。

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/scss/rwd.scss;`,
      },
    },
  },
})
```

最後，可以再回頭把 `<App>` 中的變數覆蓋改成使用 `pc-and-no-rwd`。

::advance-code{file-name="App.vue"}
```vue
<style lang="scss" scoped>
@import "@/scss/global_variables.module.scss";

#my-app {
  --header-height: $header-mobile-height;

  @include pc-and-no-rwd {
    --header-height: $header-height;
  }
}
</style>
```
::

那麼以上就是我為了解決文章開頭的問題所採取的方案。不曉得第一時間遇到這個問題時，你又會如何解決呢？無論如何，希望至少前半部的 Vue、SCSS 與 CSS 的技巧能對各位有所幫助。如果有什麼問題或建議，也歡迎和我交流看看。

<br/><br/>

##### 參考資料
- [Sass: @mixin and @include](https://sass-lang.com/documentation/at-rules/mixin/#indented-mixin-syntax)
- [Sass: Parent Selector](https://sass-lang.com/documentation/style-rules/parent-selector/)
- [Vue: v-bind() in CSS](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)
- [Logical Operations With CSS Variables | CSS-Tricks](https://css-tricks.com/logical-operations-with-css-variables/)