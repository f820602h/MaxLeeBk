---
title: 那些被忽略但很好用的 Web API / FullScreen
date: 2021/9/18 14:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 一起來延伸視野，迎接更大的畫面吧！

今天要介紹的 FullScreen API 會被忽略的原因可能是因會需要使用到它的情境比較少，但如果你撰寫網站的經驗有累積到一定程度的話，應該或多或少還是有需要它的可能性。雖然使用度沒有那麼高，不過我們還是把它整理到我們的系列文章中一起分享給大家吧。

---

## FullScreen

FullScreen API 主要是幫我們處理全螢幕顯示的功能，大部分都會運用在影片的呈現，像是內嵌的 Youtube 影片都會內建這個功能讓使用者切換，不過如果今天影片並沒有上傳 Youtube 的打算，或是你今天想要全螢幕顯示的是其他元素時，你就可以運用這個 API。

<br/>

#### # Document.fullscreenEnabled

這是一個唯讀屬性，用來確認目前的頁面是否允許我們開啟全螢幕顯示，所以在你操作之前，可以先確認該屬性是否為 `true`。

> 絕大多數的大型企業，如 Facebook、Google 都會有自己嵌入 iframe 的政策，它們通常就會禁止你使用全螢幕來顯示。

```javascript
const enabled = document.fullscreenEnabled;
```

<br/>

#### # Document.fullscreen

這也是一個唯讀屬性，用來確認目前的頁面是否正處於全螢幕模式。

```javascript
console.log(document.fullscreen);
```

<br/>

#### # Element.requestFullscreen

這個的話就是主要用來開啟全螢幕的 API 了，這裡的 Element 代表的是 DOM 元素，所以看到這裡可以發現 FullScreen API 並沒有提供一個全域物件，FullScreen API 反而是多個不同 methods 的總稱。

要使用的話就是先選定要全螢幕的元素，然後呼叫：

```javascript
const images = document.querySelectorAll("img");
images.forEach((img) => {
  img.addEventListener("click", function () {
    this.requestFullscreen();
  });
});
```

這邊要注意的是 `requestFullscreen` 不能直接在頁面載入時呼叫，如果你這麼做會接到瀏覽器的錯誤警告，`API can only be initiated by a user gesture`，跟你說該 API 只能被使用者的手勢觸發，也就是說我們必須要透過事件的方式處理。

另外 `requestFullscreen` 其實會回傳 Promise，當全螢幕顯示完畢後就會被 `resolve`，所以你可以做到這樣的效果：

```javascript
const images = document.querySelectorAll("img");
images.forEach((img) => {
  img.addEventListener("click", function () {
    this.requestFullscreen().then(() => {
      this.src = "ugly.jpg";
    });
  });
});
```

<img src="/img/content/webApi-5/fullscreen.gif" style="margin: 24px auto;" />

<br/>

#### # Document.exitFullscreen

有開啟全螢幕，自然就會有關閉的部分，基本上使用者可以自己按 ESC 鍵離開全螢幕模式，不過你也可以透過 `exitFullscreen` 來觸發這件事，例如讓 Enter 鍵也可以關閉：

```javascript
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 13)
    document.exitFullscreen().then(() => {
      alert(document.fullscreen);
    });
});
```

當然了，`exitFullscreen` 也是會回傳 Promise 的，可以使用 `then` 來串接。不過要注意 `exitFullscreen` 這個 method 是在 Document 底下喔！

<br/>

#### # Document.fullscreenElement

`fullscreenElement` 是一個唯讀的屬性，它會指向目前正在全螢幕模式的元素。

```javascript
const images = document.querySelector("img");
images.addEventListener("click", function () {
  this.requestFullscreen().then(() => {
    console.log(this === document.fullscreenElement); // true
  });
});
```

<br/>

#### # 瀏覽器支援度

看完今天的介紹後，你可能覺得全螢幕是一個非常基本的功能，但其實 FullScreen API 在瀏覽器中的支援度還不是非常完整，所以當我們想要使用的時候可能要做一些額外的處理：

```javascript
document.fullscreenEnabled =
  document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  }
}

if (document.fullscreenEnabled) {
  requestFullscreen(document.documentElement);
}
```

目前是 IE11 和 Safari 還需要加上前綴詞，且另外 iphone 是完全不支援的，也希望之後 FullScreen API 的支援度可以越來越完善，我們前端工程師才不用寫這些冗長的 code。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10268620) -
