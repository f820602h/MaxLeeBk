---
title: 那些被忽略但很好用的 Web API / SessionStorage
date: 2021/9/26 17:33:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 狡兔有三窟，儲存用戶端的資料當然也要有三個。

相信大家應該都有遇過需要將資料儲存在用戶端的需求，像是將後端的 SessionID 儲存在 Cookie，或是將一些靜態資料存在 LocalStorage，但今天想要分享的是一個大家比較少選擇的 API - SessionStorage。

---

## Cookie & LocalStorage

在介紹 SessionStorage 之前，我們先來複習一下 Cookie 和 LocalStorage 的一些特性，這樣之後如果遇到類似情境就可以依照需求選擇更適合的 API。

<br/>

#### # Cookie

- 每筆可儲存的資料大小約為 4KB
- 有時效的限制，到期後就會自動刪除
- 每次進行 http request 時所有 cookie 會一併送出
- 有同源政策，無法讀取其他網站設定的 cookie
- 明碼儲存，不適合儲存機敏性資料

> 根據上面的特性，我們就知道 Cookie 比較適合儲存小量、以時效性的資料，而且也因為每次發送請求時都會送出，所以才會被拿來儲存 SessionID，以供後端進行驗證。

<br/>

#### # LocalStorage

- 每筆可儲存的資料大小約為 5MB
- 沒有時效限制，除非使用者手動刪除，不然會一直存在
- 進行 http request 時並不會送出
- 有同源政策，無法讀取其他網站設定的 localStorage
- 明碼儲存，不適合儲存機敏性資料

> 跟 Cookie 比較不同，LocalStorage 就可以存一些比較大型、長期性的資料，常常會被拿來當作用戶端的快取，以減少 fetch 資料的次數。

<br/>

## SessionStorage

SessionStorage 則是跟 LocalStorage 幾乎一樣，且存放大小也是 5MB，最大的不同點在於，它會受到分頁的限制，也就是說就算兩個分頁都處在同一個網站中，它們的 SessionStorage 也不會共用，且只要把分頁關掉也同時會把 SessionStorage 給刪除。

<br/>

SessionStorage 這樣的特性其實就有一個很實用的情境，那就是表單內容的儲存，在網頁中時常會有表單需要用戶填寫，例如基本資料、訂單資料、意見調查等等，但如果使用者在填寫過程中不慎離開頁面或是重新整理，那可就功虧一簣了。

這時候 SessionStorage 就可以派上用場，把使用者填到一半的內容給儲存起來，只要使用者不是關掉分頁，離開再回來都可以保留填寫進度。而且就算使用者開了好幾個分頁進行不同訂單的填寫，分頁間的 SessionStorage 資料也不會相互干擾。

<br/>

#### # SessionStorage.setItem

SessionStorage 就連 methods 也都和 LocalStorage 是一樣的，`setItem` 可以讓我們下增/修改一筆 SessionStorage：

```javascript
sessionStorage.setItem("key", "value");
// 如果想要儲存物件、陣列等複雜型別，可以先進行字串化
sessionStorage.setItem("object", JSON.stringify({ key: "value" }));
```

<br/>

#### # SessionStorage.getItem

`getItem` 則是可以幫我們讀取 SessionStorage 中的某筆資料：

```javascript
const data = sessionStorage.getItem("object");
console.log(JSON.parse(data));
```

<br/>

#### # SessionStorage.removeItem

`removeItem` 則是刪除某筆資料：

```javascript
const data = sessionStorage.removeItem("object");
```

<br/>

#### # SessionStorage.clear

而 `clear` 會將 SessionStorage 中的所有資料都清除：

```javascript
sessionStorage.clear();
```

<br/>

不曉得今天認識了 SessionStorage 之後，各位有沒有靈光一閃，突然覺得之前某些資料其實可以存在 SessionStorage 就好了呢？之後如果再有這種要在用戶端儲存資料的需求，大家就可以再多思考一下，選出符合情境的 Storage API 囉。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10274151) -
