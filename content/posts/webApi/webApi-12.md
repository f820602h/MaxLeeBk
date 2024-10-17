---
title: 差點被當塑膠的 Web API / History
date: 2021/9/25 20:33:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 歷史是現在與過去之間永無休止的對話。

我們都知道瀏覽器提供了上一頁、下一頁，甚至可以讓你回到前兩頁、前三頁...，但其實我們也可以借助 History API 的力量，在網頁中自己實踐這樣的功能。

---

## History

History 是一個瀏覽器提供的歷史紀錄操作介面，你可以透過 `window.history` 來取得該物件，當中有一些屬性跟方法可以獲取來使用，下面我們就一一來認識一下。

<br/>

### # History.length

`length` 是一個唯讀屬性，可以取得目前瀏覽器分頁的歷史紀錄總數，當你開啟一個新分頁時，它會是 `1`，而每當你瀏覽一個新的網址，它便會不斷增加。

```javascript
console.log(history.length);
```

<br/>

### # History.scrollRestoration

`scrollRestoration` 這個屬性是可以修改的，它影響的是瀏覽器對於「使用者在歷史紀錄的頁面中移動時」的捲動行為，可以設定的值有兩個：

- `"auto"`: 當使用者離開某個頁面時，瀏覽器會紀錄離開時的卷動距離，並在使用者到該頁時，自動卷動到記錄的位置。
- `"manual"`: 瀏覽器不會紀錄捲動距離，每次頁面更換時都會回到頂部。

```javascript
if (history.scrollRestoration === "manual") {
  history.scrollRestoration = "auto";
}
```

> 雖然 MDN 上說，`scrollRestoration` 還是一個實驗中的屬性，但其實除了 IE，其他的瀏覽器都已經實踐這個功能了，且預設會是 `auto`。

<br/>

### # History.back

`back` 是 History 的其中一個 method，它相當於瀏覽器介面上的「上一頁」，所以如果你希望你的頁面中也有按鈕可以讓使用者返回上一頁，就可以適用它：

```javascript
document.querySelector("button").addEventListener("click", function () {
  history.back();
});
```

<br/>

### # History.forward

沒錯，有上一頁，自然也有下一頁，對應的 method 就是 `forward`。

```javascript
document.querySelector("button").addEventListener("click", function () {
  history.forward();
});
```

<br/>

### # History.go

比起 `back` 和 `forward` 來說，`go` 就比較靈活了，它可以傳入一個數字來代表要往前或往後至相對於目前頁面的哪個歷史位置，例如傳入 `-1` 就相當於「上一頁」，傳入 `1` 則相當於「下一頁」。

要注意的是，如果傳入的數字超出了歷史紀錄的範圍，那將不會有任何效果。

```javascript
history.go(-1); // 等於 history.back()
history.go(1); // 等於 history.forward()
history.go(-3); // 回到三頁之前
history.go(0); // 瀏覽器會重新整理目前的頁面
```

<br/>

## pushState / replaceState

上面介紹的 `back`、`forward` 和 `go`，其實都算是蠻簡單的，而且可能很多人都已經用過了，所以我們今天要重點介紹的其實是 `pushState` 和 `replaceState`，它們是 HTML5 中新增加的 API，讓我們可以添加或修改歷史紀錄。

<br/>

### # History.pushState

`pushState` 可以讓我們在不移動頁面的情況下，添加一筆歷史紀錄，它一共有三個參數

- state: 這個參數可以接受一個物件，該物件裡可以存放任何資料，至於有什麼實際用途，後面會再介紹。
- title: 這是一個被暫時保留的參數，實際上沒有任何用途，且會被瀏覽器忽略。
- URL: 這個參數是用來設定我們添加的這筆歷史紀錄的網址，可傳可不傳。

```javascript
history.pushState({ name: "max" }, null, "newPage.html");
```

假設我們原本所在頁面的網址是 `https://maxleebk.com/index.html`，那當我們執行上面這段程式碼時，網址就會被改成 `https://maxleebk.com/newPage.html`，並且歷史紀錄會被加上一筆，所以如果點擊上一頁，又會回到 `/index.html`。

更有趣的是，當網址被改為 `/newPage.html` 時，瀏覽器不會真的去讀取 `newPage.html` 這個文件，而是維持在 `index.html`，直到使用者進行重新整理。

<br/>

### # History.replaceState

`replaceState` 跟 `pushState` 的參數和效果都一樣，唯一不同的是 `replaceState` 並不是「添加」歷史紀錄，而是修改最新一筆的歷史紀錄。

```javascript
history.replaceState({ name: "max" }, null, "newPage.html");
```

以同樣的例子來說，在 `https://maxleebk.com/index.html` 執行上面這段程式碼，網址一樣會被改成 `/newPage.html`，但當你按上一頁時，並不會回到 `/index.html`，而是回到更往前的一次的頁面，因為 `/index.html` 其實是被 `/newPage.html` 取代了。

<br/>

### # Window:popstate Event

再來要介紹的這個 WindowEvent 與 `pushState` 跟 `replaceState` 息息相關，這個事件會在使用者進行歷史紀錄操作（例如上一頁、下一頁）時觸發。

還記得前面講到 `pushState` 和 `replaceState` 的 `state` 參數嗎？`popstate` 事件的回呼函示所拿到的 Event 物件會有一個 `state` 屬性，它存放的就會是當初設定的 `state` 參數副本。

```javascript
window.addEventListener("popstate", function (event) {
  console.log(event.state);
});
history.pushState({ name: "max" }, null); // 不指定URL，所以網址不會變
history.pushState({ name: "tom" }, null); // 不指定URL，所以網址不會變
//此時按下「上一頁」，console 會印出 { name: "max" }
//接著按下「下一頁」，console 會印出 { name: "tom" }
```

<br/>

### # 復原 / 重做小應用

那學會 `pushState`、`replaceState` 和 `popstate` 能做什麼呢？其實我們可以利用 `state` 的設定來把使用者的一些操作記錄在 History 中：

```html
<div id="editable" contenteditable="true"></div>

<script>
  window.addEventListener("popstate", function (e) {
    editable.textContent = "";
    if (e.state && e.state.text) {
      // 每次有歷史紀錄的「移動」時，便將當下紀錄的 state 丟到可編輯元素中
      editable.textContent = e.state.text;
    }
  });

  const editableDiv = document.querySelector("#editable");
  editableDiv.addEventListener("input", function () {
    // 每次輸入時新增一筆歷史紀錄，且會利用 state 儲存當下的輸入內容
    window.history.pushState({ text: editable.textContent }, null);
  });
</script>
```

我們一樣拿 `contenteditable` 的可編輯元素來示範，每當使用者輸入文字時我們就 `pushState` 一次，並把元素當中的文字內容紀錄在 `state` 中。而因為我們有監聽了 `popstate` 事件，使得使用者每次在進行「上一頁」或「下一頁」時，便能取得每一次輸入的內容。

這樣的好處就是，使用者可以透過瀏覽器的上一頁或下一頁來模擬「復原」和「重做」功能。

**如果想要玩玩看的話，這邊是我已經寫好的 [CodePen](https://codepen.io/max-lee/pen/KKqrbBO)**

<br/>

其實大家如果有使用過 VueRouter 的話，它底層就是透過 `pushState`、`replaceState`，來實踐 SPA 的網址變換的，所以才說其實很多 Web API 都是非常好用，甚至很多有名的套件都會採用，只是我們通常會忽視這些 Web API 的強大功能。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10273613) -
