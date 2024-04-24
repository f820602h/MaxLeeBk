---
title: Signal - 蓄勢待發的 Virtual DOM 殺手
date: 2024/4/20 15:30:00
tags: [Javascript]
---

## No Virtual DOM 浪潮

#### # Signal 提案

最近在前端圈有個 Github Repo 算是蠻受關注的 - [proposal-signals](https://github.com/tc39/proposal-signals)，這是一項由 Daniel Ehrenberg 為主導，向 TC39 提案的項目，主要是希望可以透過一系列稱為 Signal 的 API 來為 Javascript 提供一個更方便的狀態（State）與視圖（View）更新同步方案。

<img src="/img/content/signal/proposal-signals.png" style="max-width: 500px;" />

目前這項提案在此篇文章發布時已經進入到階段一。當然，這項提案受到很多開發者的青睞與期待，但其實也有不少質疑的聲音，不過這不會是這篇文章的重點，下面我們先用作者提供的程式碼來感受一下它可能為我們帶來的改變。


<br/>

假設今天有個 `counter` 變數，而在畫面上將會渲染出這個變數的為奇數或偶數，每當 `counter` 變數改變時，畫面上的文字也會隨之改變。因此在原生 Javascript 中，我們可能會這樣寫：

```javascript
let counter = 0;
const setCounter = (value) => {
  counter = value;
  render();
};

const isEven = () => (counter & 1) == 0;
const parity = () => isEven() ? "even" : "odd";
const render = () => element.innerText = parity();

// Simulate external updates to counter...
setInterval(() => setCounter(counter + 1), 1000);
```

而這種方式，會使狀態和畫面渲染緊密的耦合，並且可能會產生不必要的渲染（例如 `counter` 從 2 更新為 4 時）。而 `Signal` 的誕生將會改變這樣的寫法：

```javascript
const counter = new Signal.State(0);
const isEven = new Signal.Computed(() => (counter.get() & 1) == 0);
const parity = new Signal.Computed(() => isEven.get() ? "even" : "odd");

// A library or framework defines effects based on other Signal primitives
declare function effect(cb: () => void): (() => void);

effect(() => element.innerText = parity.get());

// Simulate external updates to counter...
setInterval(() => counter.set(counter.get() + 1), 1000);
```

如果你是一位前端框架的使用者，可能會覺得這樣的寫法很熟悉，這種寫法與目前眾多框架的寫法有著異曲同工之妙，但這裡的 `Signal` 並不是一個框架，而是一個提供狀態管理的 API。其實 Signal 的提案確實受到了不少的框架作者支持，例如 Vue 的作者 - 尤雨溪。

<br/>

#### # Vue Vapor Mode

如果你在 2022 年之後，有聽過尤雨溪大大在各大技術 Conf 上的演講，高機率會聽到他提到 [Vapor Mode](https://github.com/vuejs/core-vapor)，它是一個正在開發的不同版本的 Vue，而與原版最大的不同在於，它不再使用 Virtual DOM 來進行 DOM 的比對，而是直接對 DOM 進行操作。在 Vue 的 [官方文件](https://vuejs.org/guide/extras/reactivity-in-depth.html#connection-to-signals) 中你也可以看到關於 Vapor 的描述，並且也可以看到 Signal 的字眼，而會有這個版本誕生，尤雨溪也不避言得表示是受到 Solid.js 的啟發。

![](/img/content/signal/vapor.webp)

> 2023 年 8 月在台北舉辦的 \{ Laravel x Vue \} Conf Taiwan 2023 中，亦有幸邀尤雨溪大大到場演講，當中便有提到 Vapor Mode 的相關內容，並且也透露正在與其他框架的作者計畫將這樣的響應式設計標準化。

<br/>

#### # Svelte & Solid.js

這一兩年可謂是前端框架的戰國時代，各個框架新秀都有著自己的特色，不過其中有兩個框架在這波浪潮中脫穎而出，分別是 Svelte 和 Solid.js，而恰巧的是這兩個框架都是不使用 Virtual DOM 的框架。

Svelte 是一個由 Rich Harris 所開發的框架，它的特色是將所有的編譯工作都放在編譯階段，這樣在運行時就不需要再進行 Virtual DOM 的比對，而是直接對 DOM 進行操作。而 Solid.js 則是由 Ryan Carniato 所開發，它的特色是使用了 React Hooks 的概念，並且也是直接對 DOM 進行操作。而它們也因為各自的撰寫風格被戲稱為次世代的 Vue 和 React。

這兩個框架目前在 [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) 上也都是名列前茅，因此也可以看出不使用 Virtual DOM 的框架在性能上的優勢。

---

## Virtual DOM 跌落神壇？

可以看得出來，不使用 Virtual DOM 的框架在這波浪潮中有著不小的優勢，不僅誘發 Vue Vapor Mode 的誕生，更是讓 Signal 提案受到了關注。不過 Virtual DOM 到底發生了什麼事，讓以往喊著「真香」的開發者們，現在卻又開始對它有所懷疑呢？

在 Virtual DOM 大鳴大放的當時，React 可以說是最大的推手，它透過 Virtual DOM 機制讓更新視圖變得抽象，開發者們可以專注在狀態的管理上，而不用擔心 DOM 的操作。你也可能曾經聽過「Virtual DOM 對比直接操作 DOM 來說，有效能上的優勢」，但這可能並不完全正確。

<br/>

2013 年時，React 的核心成員 Pete Hunt 在一次演講 [React: Rethinking best practices](https://www.youtube.com/watch?v=x7cQ3mrcKaY) 中提到：

<p style="background: rgba(125,125,125,0.1); padding: 16px; color: #999; font-style: italic">
  
</p>

::quote-box
This is actually extremely fast, primarily because most DOM operations tend to be slow. There's been a lot of performance work on the DOM, but most DOM operations tend to drop frames.
::

不過 Pete Hunt 也因為這番話．受到一些攻擊和質疑，隨後他也進行了澄清。

![](/img/content/signal/rethinking-best-practices.jpg)

<br/>

而事實是，Virtual DOM 未必會比直接操作 DOM 快，這取決於你的應用程式的複雜度，當然也取決於框架的實現方式。而 Virtual DOM 的優勢在於它的抽象性，讓開發者可以專注在狀態的管理上，而不用擔心 DOM 的操作，以及比起將整個 `innerHTML` 重新渲染，Virtual DOM 可以只更新需要更新的部分。

但相反的，如果今天只是更新小部分的 DOM，那麼直接操作 DOM 可能會比 Virtual DOM 更快，畢竟 Diff 演算法也是需要成本的。或是在初次渲染大量元素時，由於 Virtual DOM 需要先花費時間先建立一個 Virtual DOM Tree，這也會是一個成本。

因此，現在在 React [官方文件](https://react.dev/learn/reacting-to-input-with-state) 中你不會看見其宣稱採用 Virtual DOM 是為了效能或速度，而是為了可以使用聲明式的程式碼來描述你的 UI，以及跨平台的能力。

<br/>

其實尤雨溪也曾在一些社群中表示自己對於 Virtual DOM 的看法，以及為何會在 Vue2 借鑑 React 的 Virtual DOM 機制。

::quote-box{from="知乎 - Vue 的理念問題" url="https://zhuanlan.zhihu.com/p/23752826"}
React 的 vdom 其實性能不怎麼樣。Vue 2.0 引入 vdom 的主要原因是 vdom 把渲染過程抽象化了，從而使得元件的抽象能力也得到提升，並且可以適配 DOM 以外的渲染目標。
::

::quote-box{from="知乎 - 網上都說操作真實 DOM 慢，但測試結果卻比 React 更快，為什麼？" url="https://www.zhihu.com/question/31809713/answer/53544875"}
没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。
::

---

## Virtual DOM vs. Real DOM

了解 Virtual DOM 的優勢與劣勢後，下面我想用具體的程式碼來展示用 Virtual DOM 的框架與不用 Virtual DOM 的框架渲染機制上的巨大差異。下面我們會使用 React、Vue 以及 Solid.js 來寫一個 `App -> Parent -> ChildrenOne -> ChildrenTwo` 的元件結構，並觀察父元件的狀態改變時，子元件的渲染情況。

#### # React (v18.2)

::advance-code{file-name="Parent.jsx"}
```javascript
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>Update: { count }</button>
        <div>{ Math.random() }</div>
        <ChildrenOne count={count} />
      </div>
    </>
  )
}
```
::

::flex-box
  ::advance-code{file-name="ChildrenOne.jsx"}
  ```javascript
  function ChildrenOne(props) {
    return (
      <>
        <div>
          <div>{ Math.random() }</div>
          <div>Parent Count: { props.count }</div>
          <ChildrenTwo />
        </div>
      </>
    )
  }
  ```
  ::

  ::advance-code{file-name="ChildrenTwo.jsx"}
  ```javascript
  function ChildrenTwo() {
    return (
      <>
        <div>{ Math.random() }</div>
      </>
    )
  }
  ```
  ::
::

![](/img/content/signal/react.gif)

<br/>

#### # Vue (v3.4)

::advance-code{file-name="Parent.vue"}
```vue
<template>
  <div>
    <button @click="count++">Update: {{ count }}</button>
    <div>{{ Math.random() }}</div>
    <ChildrenOne :count="count" />
  </div>
</template>

<script setup>
const count = ref(0)
</script>
```
::

::flex-box
  ::advance-code{file-name="ChildrenOne.vue"}
  ```vue
  <template>
    <div>
      <div>{{ Math.random() }}</div>
      <div>Parent Count: {{ count }}</div>
      <ChildrenTwo />
    </div>
  </template>

  <script setup>
  defineProps({ count: Number })
  </script>
  ```
  ::

  ::advance-code{file-name="ChildrenTwo.vue"}
  ```javascript
  <template>
    <div>{{ Math.random() }}</div>
  </template>
  ```
  ::
::

![](/img/content/signal/vue.gif)

<br/>

#### # Solid.js (v1.8)

::advance-code{file-name="Parent.jsx"}
```javascript
function Parent() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>Update: { count() }</button>
        <div>{ Math.random() }</div>
        <ChildrenOne count={count()} />
      </div>
    </>
  )
}
```
::

::flex-box
  ::advance-code{file-name="ChildrenOne.jsx"}
  ```javascript
  function ChildrenOne(props) {
    return (
      <>
        <div>
          <div>{ Math.random() }</div>
          <div>Parent Count: { props.count }</div>
          <ChildrenTwo />
        </div>
      </>
    )
  }
  ```
  ::

  ::advance-code{file-name="ChildrenTwo.jsx"}
  ```javascript
  function ChildrenTwo() {
    return (
      <>
        <div>{ Math.random() }</div>
      </>
    )
  }
  ```
  ::
::

![](/img/content/signal/solid.gif)

<br/>

#### # 差異

我們在各階層的元件中都加入了 `Math.random()` 來觀察每次渲染時的情況，只要數字有更新就可以判斷元件有被重新渲染過，另外 `ChildrenOne` 會接收 `Parent` 所傳入的 `count` 狀態，`ChildrenTwo` 則是單純顯示的元件。

當我們透過按鈕來更新 `Parent` 中的 `count` 時，可以觀察到 `Math.random()` 重新執行的情況：

| 框架 | Parent | ChildrenOne | ChildrenTwo |
| --- | --- | --- | --- |
| React | Ｏ | Ｏ | Ｏ |
| Vue | Ｏ | Ｏ | Ｘ |
| Solid.js | Ｘ | Ｘ| Ｘ |

會有這樣的差異，主要來自於各個框架採取的編譯及渲染機制，其中 React 和 Vue 因為使用了 Virtual DOM，必須在每次狀態更新時重新「render」一組全新的 Virtual DOM Tree 用來比較所導致的，如果要避免多餘的渲染，需要額外透過 `React.memo` 或 `computed` 來協助。

反觀 Solid.js 因為是直接將狀態更新編譯為獨立的 DOM 操作，所以可以讓狀態響應的單位降低至資料等級。

---

## 編譯與狀態更新

#### # Solid.js (v1.8)

前面說了，Solid 能夠在極小的粒度上進行狀態更新，是得益於它將狀態更新編譯為獨立的 DOM 操作。我們可以用官方提供的 [Playground](https://playground.solidjs.com/) 來看看程式碼的編譯結果：

::flex-box
  ::advance-code{file-name="編譯前"}
  ```javascript
  function Counter() {
    const [count, setCount] = createSignal(1);
    const [disabled, setDisabled] = createSignal(false);

    return (
      <button disabled={disabled()}>
        { count() }
      </button>
    );
  }
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```javascript
  function Counter() {
    const [count, setCount] = createSignal(1);
    const [disabled, setDisabled] = createSignal(false);
    return (() => {
      var _el$ = _tmpl$();
      _$insert(_el$, count);
      _$effect(() => _el$.disabled = disabled());
      return _el$;
    })();
  }
  ```
  ::
::

可以看到 Solid 和 React 或 Vue 一樣會將元件編譯為一個函式，但不同的是，這個函式只會在初次渲染時執行一次，因為 Solid 不需要「產生新 vDOM Tree」這個過程。

接著 `createSignal` 則是 Solid 的核心 API，用來創建一個 Signal，並且透過訂閱發布模式（Pub-Sub）來收集依賴的訂閱者，以便在狀態更新時通知相應的訂閱者。

再來可以看到一個 IIFE 函式，這個就是主要的渲染函式，其中有幾個 API：

- `_tmpl$` 是用來創建元素的方法，背後其實就是執行 `createElement`。
- `_$effect` 背後是創建一個觀察者並向對應的 Signal 訂閱依賴，這樣當 Signal 的值改變時，就會執行傳入的回呼函式。
- `_$insert` 其實背後一樣是建立 `effect`，只不過回呼函式中是執行 `appendChild` 或 `replaceChild` 這類 DOM 操作。

看完編譯結果後就可以知道 Solid 最核心就是透過 Signal 來實現 Pub-Sub 模式，並用直接的 DOM 操作取代 Virtual DOM Render。

<br/>

#### # React (v18.2)

React 不像 Solid 有那麼重的編譯程度，僅僅只是透過 Babel 的插件將 JSX 轉換為 `React.createElement`。而在每一次的更新時，React 都會重新呼叫 Function Component 中的 render 函式，並將新的狀態作為參數傳入，最終產生一個新的 Virtual DOM Tree。

最終再透過 Diff 演算法來比對前後差異，並將差異的部分更新到真實 DOM 上。這也是為什麼 React 自己也在 [官方文件](https://react.dev/learn/state-as-a-snapshot) 中用 Snapshot 來形容每一次的渲染。

![](/img/content/signal/snapshot.png)

<br/>

#### # Vue (v3.4)

Vue 的編譯程度也不低，畢竟它需要將模板語言轉換為 Javascript，首先依然會將元件編譯為一個 render 函式，不過 Vue 還會在編譯階段為元件中的元素進行 Patch Flag 的標記以及靜態提升（Static Hoisting），目的是讓其在執行階段進行畫面更新時可以再更精確，避免 Diff 演算法的過度比對。也就是所謂的「靶向更新」，更是 Vue 3 大幅提升效能的原因之一。

::flex-box
  ::advance-code{file-name="Patch Flag - 編譯前"}
  ```javascript
  <template>
    <div :class="{ active }"></div>
  </template>
  ```
  ::

  ::advance-code{file-name="Patch Flag - 編譯後" :line='[4]'}
  ```javascript
  function render(_ctx, _cache, $props, $setup) {
    return (_openBlock(), _createElementBlock("div", {
      class: _normalizeClass({ active: $setup.active })
    }, null, 2 /* CLASS */))
  }
  ```
  ::
::

::flex-box
  ::advance-code{file-name="靜態提升 - 編譯前"}
  ```javascript
  <template>
    <div>
      <p>text</p>
    </div>
  </template>
  ```
  ::

  ::advance-code{file-name="靜態提升 - 編譯後" :line='[1,2,3]'}
  ```javascript
  const _hoisted_1 = /*#__PURE__*/_createElementVNode(
    "p", null, "text", -1 /* HOISTED */
  )
  function render(_ctx, _cache) {
    return (
      _openBlock(),
      _createElementBlock("div", null, [_hoisted_1])
    )
  }
  ```
  ::
::

另外在狀態更新時，Vue 3 也有進行一些最佳化的工作，像是會檢查元件的 `props` 是否有變動，如果沒有變動則不會進行重新渲染，這就是為什麼前面的 Vue 範例中 `ChildrenTwo` 元件不會重新渲染的原因。

```typescript
export function shouldUpdateComponent(
  prevVNode: VNode,
  nextVNode: VNode,
  optimized?: boolean,
): boolean {
  //...省略大量程式碼
  if (prevProps === nextProps) return false
  return false
}
```

> Vue 本身在官方文件 [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom) 中也說明得非常清楚，有興趣的話非常建議看一下。

<br/>

#### # Vue Vapor Mode

另外我們也額外來看看 Vue 的 Vapor Mode 會怎麼編譯程式碼，可以透過 Vapor Mode 提供的 [Playground](vapor-repl.netlify.app) 測試：

::flex-box
  ::advance-code{file-name="編譯前"}
  ```vue
  <script setup>
  import { ref } from 'vue';

  const count = ref("1")
  const disabled = ref(false)
  </script>

  <template>
    <button :disabled="disabled">{{ count }}</button>
  </template>
  ```
  ::

  ::advance-code{file-name="編譯後"}
  ```javascript
  // ...省略部分程式碼
  const count = ref("1")
  const disabled = ref(false)

  const t0 = _template("<button></button>")
  function render(_ctx) {
    const n0 = t0()
    _renderEffect(() => _setText(n0, _ctx.count))
    _renderEffect(() => _setDynamicProp(n0, "disabled", _ctx.disabled))
    return n0
  }
  ```
  ::
::

這邊用了和 Solid 一樣的案例，可以看到基本上跟 Solid 編譯後的樣樣子非常相似，`ref` 對應 `createSignal`; `_renderEffect` 對應 `_$effect`，而 `_setText` 和 `_setDynamicProp` 則可以合理推斷背後是直接的 DOM 操作。果然如尤雨溪本人所說，Vue Vapor Mode 確實是受到了 Solid 的啟發。

---

## Virtual DOM 依然穩站腳步

雖然前面說了那麼多看似 Virtual DOM 的缺點，但這並不代表 Virtual DOM 就要被淘汰了，畢竟相比傳統的 Virtual DOM Diff 演算法，React 和 Vue 都有進行了不少的優化工作。

傳統的 Virtual DOM Diff 雖然可以做到精準的差異計算，但計算的成本卻是非常昂貴的，當每次狀態更新後，Virtual DOM 機制都需要產生一個完整的虛擬樹，然後遍歷新舊樹的每個節點進行比對，最後再將差異的部分更新到真實 DOM 上。

這整個過程的時間複雜度是 O(n^3)，當你的 Dom Tree 有 100 個節點，整個過程將會花費 100 萬個單位時間。

<br/>

#### # React & Heuristic Algorithm & Fiber

React 為了解決傳統 Virtual DOM Diff 演算法的效能問題，開發出了啟發式演算法（Heuristic Algorithm），透過兩個假設將原本複雜度為 O(n^3) 的過程最佳化到 O(n)，隨後又在 React 16 中推出了 [Fiber](https://react.dev/learn/reacting-to-input-with-state) 架構，這個架構可以讓原本遞迴生成虛擬 DOM Tree 的過程轉變為鏈結的結構的 Fiber Tree，使得過程中可以中斷並恢復，而不會阻塞 UI 的更新，以此避免渲染卡頓掉禎的問題。

> 如果對 React 的啟發式演算法以及 Fiber 架構有興趣，可以參考 莫力全 Kyle Mo 寫的 [React 開發者一定要知道的底層機制 — React Fiber Reconciler](https://medium.com/starbugs/react-%E9%96%8B%E7%99%BC%E8%80%85%E4%B8%80%E5%AE%9A%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E5%BA%95%E5%B1%A4%E6%9E%B6%E6%A7%8B-react-fiber-c3ccd3b047a1)。應該是目前最詳盡的中文文章了。

<br/>

#### # Vue & Compiler-Informed Virtual DOM & 雙端 Diff

前面已經有提過 Vue 在編譯階段所做的最佳化，包含了 Patch Flag 標記、靜態提升還有 Block Tree，這些都讓 Vue 在執行階段進行 Virtual DOM Diff 可以更加有效率，Vue 將其稱為 Compiler-Informed Virtual DOM。

除此之外，Vue 中的雙端 Diff 演算法也是為人津津樂道的，只要搜尋 「Vue Diff」 你可以看到無數文章的解析，這個演算法在同層節點比對時可以在大多數的情況下大幅提升效能。

> 這邊一樣推薦我覺得非常完整的兩篇文章，分別詳細說明了 Vue 的編譯細節以及雙端 Diff 的原理：
> - [Vue3 Compiler 优化细节，如何手写高性能渲染函数](https://juejin.cn/post/6913855965792043021)
> - [根据大崔哥的mini-vue来理解vue3中的diff算法](https://juejin.cn/post/7045976871116210213)

---

## 結語

其實 Solid 作者 Ryan Carniato 自己也在 [The Fastest Way to Render the DOM](https://betterprogramming.pub/the-fastest-way-to-render-the-dom-e3b226b15ca3) 一文章中提到：

::quote-box
Similarly, the recent chorus of "The Virtual DOM is slow" is just as ill-informed. Rendering a virtual DOM tree and diffing it is going to be pure overhead compared to not doing so, but does not doing so scale? And what if you have to deal with a data snapshot?
::

所以說一切技術的選用都是取決於你的應用場景，沒有最好的技術，只有最適合的技術。Virtual DOM 依然是一個非常好的抽象層，讓開發者可以專注在狀態的管理上，而不用擔心 DOM 的操作，這也是為什麼 React 和 Vue 依然是前端框架的主流。

![](/img/content/signal/framework.png)

<p style="font-size: 12px; text-align: right; margin-top: -12px; color: #999;">

  [State of Javascript 2022 - 前端框架使用率排名](https://2022.stateofjs.com/en-US/libraries/front-end-frameworks/)

</p>


但確實在 Svelte 和 Solid.js 這類不使用 Virtual DOM 的框架出現後，開始讓大家思考似乎 Virtual DOM 並不一定是前端框架的唯一解，而每當有新的蓋難或實作出現時，我們燈應該抱持著「好奇、了解、實驗」的態度，而不是一味的跟風或吹捧，Virtual DOM 是如此，Signal 亦是如此。

> 文章開頭也說了，Signal 標準化的提案其實也有不少人提出質疑，下面貼上幾個不錯的 issue 連結，建議大家多可以看看不同的意見。
> - [What are Signals introducing that Proxy doesn't currently handle? #101 - ddamato](https://github.com/tc39/proposal-signals/issues/101)
> - [Feedback and Concerns on the Proposal Signals #105 - SukkaW](https://github.com/tc39/proposal-signals/issues/105)
> - [Don't we need Events/Observer Pattern first? #111 - rbuckton](https://github.com/tc39/proposal-signals/issues/111)

