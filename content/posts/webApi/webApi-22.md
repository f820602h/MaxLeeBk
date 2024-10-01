---
title: 那些被忽略但很好用的 Web API / IntersectionObserver
date: 2021/10/5 20:11:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 當你進入我的眼簾，我們的命運就有了交集～

看到 Observer，應該就知道今天要介紹的又是「觀察者」系列的 API 了，而且這次的觀察者可能比前面的 MutationObserver 和 ResizeObserver 還要實用。只要有了它，Scroll Animation 就只是一塊小蛋糕了。

---

## IntersectionObserver

IntersectionObserver 幫我們觀察的是元素的「相交（intersect）」變動，也就是元素與指定可視窗口的「相交與否」發生變動時觸發。

簡單來說就是頁面元素因捲動而進入到可視範圍中，或是離開了可視範圍時，IntersectionObserver 就會執行指定任務，所以我們可以利用它來偵測「某個元素是不是進入視窗中」了，而且還可以調整許多細微的偵測設定，相當強大。

<img src="/img/content/webApi-22/inter.gif" style="max-width: 600px;" />

<br/>

#### # Window.IntersectionObserver

和其他「觀察者」一樣，`IntersectionObserver` 為一個建構函示，需要使用 `new` 關鍵字來創建實體，並且需要傳入 Callback Function 作為參數，該 Callback 會獲得一個存放 IntersectionObserverEntry 的陣列以及「觀察者（observer）」自身實體，

<br/>

- **IntersectionObserverEntry**： 其中會有一些關於觀測元素與可視範圍交互的相關資訊，後面會詳細介紹。
- **IntersectionObserver**： 呼叫 Callback 的 IntersectionObserver 實體，即為該 Function 的 `this`。

<br/>

```javascript
const observer = new IntersectionObserver((entries, owner) => {
  console.log(owner); // IntersectionObserver 實體
  entries.forEach((entry) => {
    console.log(entry); // IntersectionObserverEntry 物件
  });
});
```

<br/>

另外，IntersectionObserver 除了 Callback 之外還有一個可選的 `options` 參數可以設定：

```javascript
const callback = function (entries) {
  console.log(entries);
};

const observer = new IntersectionObserver(callback, {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0.0,
});
```

<br/>

這個 `options` 參數須為物件，並接受上面這三個屬性：

- **root**： 這個屬性將決定要以哪個元素的可視窗口作為觀察依據，預設為 `null`，表示以 Viewport 作為判斷依據，也可以設定成其他元素。
- **rootMargin**： 這個屬性決定的是窗口的縮放，設定規則和 CSS 的 `margin`，可以給定一個值，也可以四邊各自設定，正值為外擴，負值為內縮。
- **threshold**： 這個屬性是設定觸發的**比例門檻**，當目標元素與可視範圍的相交範圍「經過」了這道門檻，Callback 就會被觸發，舉例來說：
  - 預設值 `0`： 當相交範圍的比例「開始大於 0%」或「開始小於 0%」 的瞬間會觸發。
  - 設定為 `1`： 當相交範圍的比例「開始大於 100%」或「開始小於 100%」 的瞬間會觸發。
  - 設定成陣列 `[0, 0.5, 1]`： 規則如上，但目標元素就會有三個觸發時機。

<img src="/img/content/webApi-22/options2.png" style="margin: 24px auto;" />

<br/>

#### # IntersectionObserver.observe

老樣子，觀察者們都需要我們使用 `observe` method 來指定觀察對象：

```javascript
const observer = new IntersectionObserver((entries) => {
  console.log(entries);
});

const div = document.querySelector("div");
observer.observe(div);
```

<br/>

#### # IntersectionObserver.unobserve

若要註銷某元素的觀察，IntersectionObserver 一樣有 `unobserve` method 可以使用：

```javascript
const observer = new IntersectionObserver((entries) => {
  console.log(entries);
});

const div = document.querySelector("div");
observer.observe(div);
observer.unobserve(div);
```

<br/>

#### # IntersectionObserver.disconnect

當然也可以一次性的註銷所有元素的觀察，同樣要記得，IntersectionObserver 實體並不會消失，只是沒有觀測中的元素而已，你依然可以再次使用 `observe` 來註冊一個新的觀察：

```javascript
const observer = new IntersectionObserver((entries) => {
  console.log(entries);
});
const box1 = document.querySelector(".box1");
const box2 = document.querySelector(".box2");
observer.observe(box1);
observer.disconnect();
observer.observe(box2);
```

<br/>

#### # IntersectionObserverEntry 物件

IntersectionObserver 和之前介紹的 MutationObserver 和 ResizeObserver 不同，它是**「非同步」**觸發的，畢竟「相交與否」這件事情是一個瞬間，不會有不斷疊加的狀態，所以也就不需要考慮連續觸發導致的效能問題，也就是說儘管你非常快速的來回捲動，它也不會將事件合併。

而 IntersectionObserverEntry 需要用陣列存放，是因為會有多個觀測中的元素同時進入／離開可視範圍的可能，這時候每一筆的 IntersectionObserverEntry 便代表一個元素的變動，而其中有許多屬性可以提供我們使用，下面就一一向各位介紹：

<br/>

- **IntersectionObserverEntry.target**
  發生進出變動的目標元素(element)，每個「觀察者」都會提供的資訊。

<br/>

- **IntersectionObserverEntry.isIntersecting**
  `isIntersecting` 是當中非常實用的屬性，用來表示目前元素是否與可是範圍（root）相交，也就是目標元素是否進入到可視範圍中。

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 目標元素進入 viewport 時執行
    } else {
      // 目標元素離開 viewport 時執行
    }
  });
});
```

<br/>

- **IntersectionObserverEntry.intersectionRatio**
  這個屬性提供的是目前元素與觀察窗口的相交比例，會是一個 0~1 的數值，計算方式是 `相交面積 / 目標元素面積`。

<br/>

- **IntersectionObserverEntry.boundingClientRect**
  這個屬性會提供目標元素的尺寸、座標資訊，而它就等於拿 `target` 去執行昨天介紹的 `getBoundingClientRect` 所得到的結果。

<br/>

- **IntersectionObserverEntry.rootBounds**
  這個拿到的也會是 `getBoundingClientRect` 資訊，但計算的是可視窗口的尺寸、座標，要記得有 `rootMargin` 的影響。

<br/>

- **IntersectionObserverEntry.intersectionRect**
  和前面都一樣，不過提供的區塊範圍很特別，是目標元素與可視窗口的「交疊範圍」。

<img src="/img/content/webApi-22/rect.png" style="max-width: 600px;" />

<br/>

#### # 使用情境

IntersectionObserver 的使用情境很多，可以做「捲動特效」或是「無限捲動」，下面我們就來試試寫個無間捲動的功能看看，先看效果：

<img src="/img/content/webApi-22/infinity.gif" style="max-width: 600px;" />

```html
<ul class="list">
  <li class="item">
    <div class="avatar"></div>
    <div>
      <h3>Name</h3>
      <h5>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem tenetur odit.rem ipsum dolor sit, amet consectetur
        adipisicing elit. Rem tenetur odit
      </h5>
    </div>
  </li>
</ul>
```

```javascript
const ul = document.querySelector("ul");

// 這個 function 會一次新增20筆項目到 ul 中
// 用來模擬獲取資料後渲染畫面
const getMoreItem = () => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i <= 20; i++) {
    const item = document.querySelector("li:first-child");
    const newItem = item.cloneNode(true);
    fragment.appendChild(newItem);
  }
  ul.appendChild(fragment);
};

const observer = new IntersectionObserver(
  function (entries, observer) {
    // 每當目標元素進入畫面後就新增20筆，並且重置觀察的元素
    if (entries[0].isIntersecting) {
      getMoreItem();
      observer.unobserve(entries[0].target);
      observer.observe(document.querySelector("li:nth-last-child(2)"));
    }
  },
  { root: ul } // 觀察窗口為 ul 的元素範圍
);

getMoreItem();
observer.observe(document.querySelector("li:nth-last-child(2)"));
```

無限捲動的功能是非常常見的一個功能，平常在滑 FB 或 IG 時，貼文能不段的出現就是使用無線捲動，而使用 IntersectionObserver 就可以輕鬆做到。

我們實踐的概念也非常簡單，就是在目標元素進入窗口時去向後端獲取資料並渲染在畫面上，然後不斷的重新觀察倒數第二個 `li`，所以可以看到 Callback 中有執行 `unobserve` 來註銷原本的元素，然後又再次使用 `observe` 來註冊新元素。

<br/>

IntersectionObserver 是不是非常方便呢？昨天我們還在用 `getBoundingClientRect` 來計算元素是否進入畫面，今天已經連計算都不用計算，完全交由「觀察者」來幫忙偵測，我們只要坐等通知就好了，大家快把它學起來，當個懶惰的工程師吧！

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10279046) -
