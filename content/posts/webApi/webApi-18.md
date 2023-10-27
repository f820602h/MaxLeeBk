---
title: 那些被忽略但很好用的 Web API / RequestIdleCallback
date: 2021/10/1 15:32:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 時間管力大師就是要忙裡偷閒

各位應該知道 JavaScript 是單執行緒(單線程)的程式語言，也就是一次只能處理一件事情。這樣的特性會使得事件的執行必定有個先後順序，這時候就會希望重要的事情能夠排序在前面，剩下比較不重要的任務等空閒時再處理即可，這時候就可以靠 RequestIdleCallback 來幫助我們。

---

## RequestIdleCallback

RequestIdleCallback 會在瀏覽器「每一幀」中剩下的空閒裡來執行當中的 Callback。

<br/>

我們之前在介紹 RequestAnimationFrame 時有提過「幀數(FPS)」的概念，也就是「一秒鐘內能夠更新多少幀」，假如在一秒內能夠更新 60 幀，則 FPS 為 60，每一幀的時間約為 16.7 ms(毫秒)。

對於瀏覽器來說每一次「重繪(Repaint)」就是「一幀」，而這一幀要花多少時間就要看當下的網路或硬體狀況而定了。在這每一幀中，瀏覽器都有可能正在執行任務，若這個任務完成時，當下那一幀還沒結束時，就會有一個短暫的空閒時間。

> 以 60FPS 為例，每一幀的空閒時間必定小於等於 16.7 ms。

<br/>

而只要有這個空閒時間 RequestIdleCallback 就會去執行當中的 Callback，來完成那些我們覺得不重要的任務，換句話說，如果瀏覽器一直處於繁忙狀態的話，那該任務就會一直無法執行。

<br/>

#### # Window.requestIdleCallback

`requestIdleCallback` 有兩個參數要傳入：

- callback: 需要在空閒時間(Idle)執行的函示。
- timeout: 這是一個可選參數，你可以設定一個時間來強制執行 `callback`，以避免瀏覽器因為持續繁忙的忽略(單位:毫秒)。

> 大部分情況不建議使用 `timeout`，因為會使用 `requestIdleCallback` 就代表不想影響主線程的任務進行 。

```javascript
const handlerId = requestIdleCallback(function () {
  //..做些不住要的事
}, 500);
cancelIdleCallback(handlerId); // 取消requestIdleCallback
```

<br/>

#### # IdleDeadline

而我們傳入的 Callback Function 會被丟進一個由 `requestIdleCallback` 提供的參數，該參數通常取名為 `deadline`，並且有兩個屬性可以使用：

- didTimeout: 這是一個唯讀屬性，以布林值來表示 Callback 是否是因為 `timeout` 被觸發的。
- timeRemaining: 它是一個 method，執行後會傳傳一個毫秒數，用來表示當下這一幀的剩餘時間。

```javascript
requestIdleCallback(function (deadline) {
  // 如果你在 requestIdleCallback 中沒有傳入 timeout 參數，didTimeout 必定為 false
  console.log(deadline.didTimeout);
  console.log(deadline.timeRemaining());
}, 500);
```

<br/>

#### # 實際測試

由於 JavaScript 是單執行緒，所以要是我今天進行了一個需要耗費大量時間的任務，那使用者的 UI 操作其實也會受到影響。
就像下面這個範例中，在 `count` 被函式 `add` 加到 1000000 以前，你不管怎麼敲擊鍵盤，`keydown` 事件都不會被觸發，因為瀏覽器正在忙著算數：

```javascript
window.addEventListener("keydown", function () {
  console.log("Hey !!!!!!!!!");
});

let count = 0;
add();
function add() {
  if (count < 10000) {
    console.log(count++);
    add();
  }
}
```

但是我們只要用 `requestIdleCallback` 來改寫一下，那狀況就不一樣了，因為這時候 `add` 這項任務的優先度會往後排，所以當我按下鍵盤時，瀏覽器會先處理 `keydown` 事件，等到閒置下來後才會繼續進行。

```javascript
window.addEventListener("keydown", function () {
  console.log("Hey !!!!!!!!!");
});

let count = 0;
requestIdleCallback(add);
function add(deadline) {
  if (deadline.timeRemaining() > 0) {
    if (count < 10000) {
      console.log(count++);
      requestIdleCallback(add);
    }
  }
}
```

<br/>

#### # 使用情境

在了解 RequestIdleCallback 的效果後，我第一個想到的實際應用會是 LazyLoad，想像以下，如果我們有個網頁，當中有幾十甚至幾百張的高畫質圖片需要顯示，可想而知瀏覽器的負擔會相當的大，非常有可能會影響頁面的效能與任務執行，但如果們我利用 `requestIdleCallback` 來處理，就可以在不影響主執行緒的情況下載入圖片。

```javascript
const images = [
  "https://img/001.png",
  "https://img/002.png",
  //.....
  "https://img/099.png",
  "https://img/100.png",
];

requestIdleCallback(loadImage);
function loadImage(deadline) {
  if (deadline.timeRemaining() > 0) {
    if (images.length) {
      const imgSrc = images.shift();
      const img = new Image(250, 150);
      img.onload = document.body.appendChild(img);
      img.src = imgSrc;
      requestIdleCallback(loadImage);
    }
  }
}
```

<br/>

不曉得使用過 React 的朋友有沒有了解過 React Fiber 呢？其實它的原理就和 RequestIdleCallback 一樣，將大量沒那麼優先的工作拆成許多小片段，在瑣碎的時間裡慢慢完成，也因為這樣的機制，使得我們可以去中斷它，將一些突發的重要任務(例如使用者的 UI 事件)插在這些小片段中，宛如有另一條執行緒一般。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10276904) -
