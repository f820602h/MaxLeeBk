---
title: 差點被當塑膠的 Web API / PostMessage
date: 2021/9/28 17:15:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 親像愛情的限時批～

各位有想過該如何跟其他頁面進行溝通嗎？如果在Ａ頁面點擊了一個按鈕，能不能夠讓Ｂ頁面發生變化或執行動作呢？別說不可能，今天要介紹的 PostMessage 便能夠達成這樣的效果。

---

## PostMessage

一般來說，不同的頁面要相互溝通的話，它們的 Domain 必須相同，然後通常就會使用 LocalStorage 搭配 `storage` 事件來進行溝通，但 PostMessage 神奇的地方就在於它可以越過這項限制，讓我們甚至可以跟不同源的網站頁面進行溝通，這樣就能解決前端最討厭的 CORS 問題了。

> 雖然 PostMessage 可以跨域溝通，不過當然也要對方願意且有撰寫對應的機制程式碼，要不然世界就大亂了 XD

<br/>

### # otherWindow.postMessage

PostMessage API 底下就是只有 `postMessage` 這個 method，非常的單純，卻也無比強大，其中 `otherWindow` 所指的是「目前分頁以外的 Window」，這個 Window 可以是利用 `window.open` 執行返回的 Window 物件，或是一個 `iframe` 元素的 `contentWindow`，而也就是訊息要送達的目的地。

另外 `postMessage` 還必須傳入兩個參數：

- message: 第一個是你要傳送的訊息，任何型別格式都可以接受。
- targetOrigin: 第二個則是設定「能夠接收本次訊息」的網頁 Origin，必須要是在這個 Domain 底下的頁面才能接收到訊息。

```javascript
const url = "https://maxleebk.com//2021/09/28/webApi/webApi-15/";
const otherPage = window.open(url);
otherPage.postMessage("Hi,Max", "https://maxleebk.com/");
```

以上面的例子來說，我們先利用 `window.open` 打開了一個作者本人的部落格分頁，而該分頁的 Window 已經被儲存在 `otherPage` 中，再來我們就利用 `postMessage` 傳遞一個字傳，並且利用 `targetOrigin` 來確保一定要是 `https://maxleebk.com/` 底下的頁面才能真正接受到訊息。

> 你該注意：`targetOrigin` 這個參數建議一定要傳入並填妥，不然訊息有可能會被刻意攔截，導致無法預期的安全性問題。

<br/>

### # Window:message Event

訊息有傳送的一方，自然也要有接收的一方，而接收方要順利接到訊息的話，只要在 `window` 上監聽 `message` 這個事件即可，而訊息的部分則會被放在 Event 物件的 `data` 屬性裡:

```javascript
addEventListener("message", function (event) {
  console.log(event.data);
});
```

所以只要你想傳送的網站中，有打開一個這樣的通道，那你就可以透過 PostMessage 來與之溝通，不過接收方也不可能所有的訊息都照單全收，要是我們今天身為接收方，那應該要像下方這樣做一些防禦。

在 Event 物件中還有一個 `origin` 屬性，可以用來獲取傳送方的來源，所以我們可以利用它來過濾那些不在信任範圍的網址：

```javascript
addEventListener("message", function (event) {
  // 如果訊息不是來自於 IT邦幫忙 那就不執行任何動作
  if (event.origin !== "https://ithelp.ithome.com.tw") return;
  console.log(event.data);
});
```

當然了，信息往來總不能只有單向，如果接收方要回信的話，只要利用 Event 物件中的 `source` 屬性就可以進行訊息的傳送：

```javascript
addEventListener("message", function (event) {
  if (event.origin !== "https://ithelp.ithome.com.tw") return;
  console.log(event.data);
  event.source.postMessage("hi,IT邦幫忙", event.origin);
});
```

透過 PostMessage 訊息的相互傳遞，我們就可以不受同源政策的限制，向其他網域的網頁請求資料了，或利用訊息的格式判定來執行其他頁面的動作等等...

```javascript
addEventListener("message", function (event) {
  axios.get("/user", event.data.id).then((res) => {
    event.source.postMessage(res, event.origin);
  });
});

addEventListener("message", function (event) {
  window[event.data.method](); // 執行指定名稱的全域函式
});
```

<br/>

PostMessage API 是不是非常有趣又神奇呢？或許要遇到頁面溝通的情境並不多，但千萬忽略了它，等到遇到了，它會是非常強大的幫手，而且應用起來也相當簡單，大家如果有興趣，隨手就能寫個簡單的範例。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10275491) -
