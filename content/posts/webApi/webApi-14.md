---
title: 差點被當塑膠的 Web API / CustomEvent
date: 2021/9/27 21:03:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 自己的事件自己決定。

網頁最重要的兩件事，資訊顯示與使用者交互，而使用者交互在頁面中所代表的行為就是「監聽事件」與「觸發事件」，相信這是大家在熟悉不過的了，`click`、`input`、`blur`、`scroll`...等等，幾乎充斥在我們的網站中，但除了這些常見的、預設的事件之外，其實我們也可以自己創造出全新的事件。

---

#### # Window.CustomEvent

CustomEvent 本身是一個建構函式，也就是我們常講的 `class`，當我們想要建立自訂事件時，就透過 `new` 關鍵字來呼叫它即可，並且要記得傳入代表事件名稱的字串，另外還可以傳入第二個參數來設定事件觸發時傳遞的資料。

要注意的是，用來設定資料的第二個物件必須要是一個物件，且要傳遞的資料必須設定在該物件的 `detail` 屬性底下。

```javascript
const customEvent = new CustomEvent("myEvent", {
  detail: { customData: "maxLee" },
});
```

而當有 DOM 元素需要綁定這個事件時，一樣使用 `addEventListener` 來處理即可，而其中事件 Callback 會拿到的 Event 物件就會多一個 `detail` 的屬性，該屬性就會是我們當初設定的事件傳遞資料。

```javascript
const customEvent = new CustomEvent("myEvent", {
  detail: { customData: "maxLee" },
});
document.querySelector("#element").addEventListener("myEvent", function (event) {
  console.log(event.detail); // { customData: "maxLee" }
});
```

<br/>

#### # EventTarget.dispatchEvent

與 CustomEvent 最極其相關的 API 就是 DispatchEvent 了，它是一個可以讓我們主動觸發事件的方法，當我們創建並綁定了一個事件後，就必須要倚靠它來幫我們啟動事件了。

其中 EventTarget 是一個代稱，它所指的是綁定事件的 DOM 對象，例如以下程式碼中，`div` 就是 EventTarget：

```javascript
const customEvent = new CustomEvent("myEvent", {
  detail: { customData: "maxLee" },
});
const div = document.querySelector("div");
div.addEventListener("myEvent", function (e) {
  console.log(event.detail);
});
```

此時上面的 `div` 已經被綁上了我們自訂的 `myEvent` 事件，這時候我們就可以使用 `dispatchEvent` 來主動觸發事件，只要在呼叫它時傳入 CustomEvent 物件即可：

```javascript
const customEvent = new CustomEvent("myEvent", {
  detail: { customData: "maxLee" },
});
const div = document.querySelector("div");
div.addEventListener("myEvent", function (e) {
  console.log(event.detail);
});
div.dispatchEvent(customEvent);
```

<br/>

#### # 運用場景

認識了 CustomEvent 後，我們來假設一個需求：**_「今天有個頁面，在進入時會向後端 request 資料，當資料回來後，我們要更改頁面的標題及一個 list 的內容」_**，當然了，如果使用前端框架的話，這是一個非常簡單的事情，但我們先假如這次專案不允許使用框架，那一般的寫法可能會是這樣：

```javascript
function updateTitle(title) {
  const title = document.querySelector("h1");
  title.textContent = title;
}

function updateList(list) {
  const ul = document.querySelector("ul");
  ul.innerHtml = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function onDataFetch(res) {
  updateTitle(res.data.title);
  updateList(res.data.list);
}

// 如果不認識 axios，可以把它當成一個請求資料的 Promise 即可
axios.get("https://backend/data").then(onDataFetch);
```

以上這樣的寫法其實已經算是盡量避免耦合了，因為還額外包裝了一支 `onDataFetch` 函式來獨立處理取得資料後的事情，但如果未來還有其他的事情要處理，就必須再加進這個函式中，而且其他人在閱讀時，可能會誤以為裡面執行內容可能有順序性。那接下來我們看看使用 CustomEvent 可以怎麼寫：

```javascript
let dataFetchEventTarget = [];

function addDataFetchEvent(element, callback) {
  dataFetchEventTarget.push(element);
  element.addEventListener("dataFetch", callback);
}

addDataFetchEvent(document.querySelector("h1"), function (e) {
  this.textContent = e.detail.title;
});

addDataFetchEvent(document.querySelector("ul"), function (e) {
  this.innerHtml = "";
  e.detail.list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    this.appendChild(li);
  });
});

// 用 setTimeout 來模擬請求資料
setTimeout(() => {
  const dataFetchEvent = new CustomEvent("dataFetch", {
    detail: res.data,
  });
  dataFetchEventTarget.forEach((target) => {
    target.dispatchEvent(dataFetchEvent);
  });
}, 3000);
```

首先我們先宣告了一個陣列 `dataFetchEventTarget`，打算來存放所有有註冊事件的元素，然後寫了一個函式 `addDataFetchEvent` 來註冊事件，並且同時將元素丟進陣列中，直到我們將資料請求回來後開始建立自訂事件，並且把 `dataFetchEventTarget` 中的元素一一取出並 `dispatchEvent` 事件。

這樣寫法的好處在於，「取得資料」跟「後續行為」完全沒有耦合，「註冊事件」與「觸發事件」完全是獨立的兩件事，所以未來如果有其他地方註冊了這個事件，我們也不需要額外處理任何事，等到事件觸發了，Callback 自然會去執行。

<br/>

一般來說，沒有特別去設計的話，大家都會使用第一種方式吧？但其實使用 CustomEvent 的話，會很接近 Design Patterns 中的觀察者模式(Observer Pattern)，其實是一個非常不錯的撰寫方式，大家可以在未來的開發中嘗試看看。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10274924) -
