---
title: 那些被忽略但很好用的 Web API / ScrollIntoView
date: 2021/10/7 16:47:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 將元素玩弄與指尖，說來就來，呼風喚雨

既然有 IntersectionObserver 能夠偵測元素是否進入視窗中，那當然也會有 API 能夠主動讓元素進入到我們的視野當中，第一時間，各位可能有想到 `window.scrollTo` 來指定「捲軸」的滾動距離，但其實今天介紹的 ScrollIntoView 能夠更方便的做到這件事。

---

## ScrollIntoView

說到操作「捲軸」這件事，最常使用的可能會是 `window.scrollTo` 或 `window.scrollBy`，可以讓視窗動到任何位置，例如「回到頂部」功能就會使用 `scrollTo(0,0)` 來完成，不過如果是希望捲軸移動到某個指定元素的位置，那就還需要先計算元素之於文件頂部的距離才能做到，這時候反而運用 ScrollIntoView 就可以輕輕鬆鬆解決。

<br/>

#### # Element.scrollIntoView

`scrollIntoView` 並不隸屬於 Window，反而是 Element 的 method，而執行 `scrollIntoView` 就會是需要進入視窗中的目標元素。

```javascript
const element = document.getElementById("box");
window.addEventListener("click", function () {
  element.scrollIntoView();
});
```

<img src="/img/content/webApi-24/intoView.gif" style="max-width: 600px;" />

呼叫之後，視窗捲軸就會直接 **「跳」** 到 **「元素頂部對齊視窗頂部」** 的距離，而其實我們可以傳入參數來調整捲軸移動的方式與位置，可以接收的參數形式有兩種：

<br/>

- **alignToTop**： 第一種是傳入布林值，這個布林值會決定是否要讓「捲軸位置」剛好讓元素頂部對齊視窗頂部。

- **scrollIntoViewOptions**： 第二種是傳入物件，這物件當中可以有三個屬性來調整更細節的捲動設定：
  - `behavior`： 這個屬性接受 `auto`、`smooth` 兩個值，決定了捲軸的移動方式要用「跳」的還是用「滑」的。預設為 `auto` 跳的
  - `block`： 這個屬性決定了垂直捲軸的位置，接受 `start`、`center`、`end` 和 `nearest` 四種。預設為 `start`
  - `inline`： 這個屬性則決定水平捲軸的位置，也是 `start`、`center`、`end` 和 `nearest` 四種。預設為 `nearest`

其中 `start` 代表對齊垂直捲軸的頂部、水平卷軸的左側，`end` 對齊垂直底部、水平右側，`center` 自然就是對齊中心點，而 `nearest` 則是依據元素當下位置來判斷最近的位置來對齊

```javascript
element.scrollIntoView();
element.scrollIntoView(true);
element.scrollIntoView(false);
element.scrollIntoView({ block: "end" });
element.scrollIntoView({
  behavior: "smooth",
  block: "center",
  inline: "nearest",
});
```

<img src="/img/content/webApi-24/align.png" style="margin: 24px auto;" />

另外如果目標元素被放在其他也有「捲軸」的元素中，那它會將每一層的捲軸都進行滾動，並且盡可能的達成我們指定的位置，會說「盡可能」是因為未必視窗會有垂直或水平捲軸，若沒有捲軸，ScrollIntoView 也是無能為力的。

```html
<div class="wrap">
  <div class="placeholder"></div>
  <div class="target"></div>
  <div class="placeholder"></div>
</div>
```

```javascript
const target = document.querySelector(".target");
target.scrollIntoView({
  behavior: "smooth",
  block: "start",
  inline: "end",
});
```

<img src="/img/content/webApi-24/move.gif" style="max-width: 600px;" />

<br/>

不曉得有沒有人有發現其實 ScrollIntoView 的功能很像 HTML 中 `<a>` 標籤的錨點（Anchor Link）功能，所以這也是為什麼 ScrollIntoView 可能比較少用的原因，但其實錨點連結並不能實踐 `smooth` 滑動效果，也不能指定位置，所以如果你想讓 UI/UX 的體驗好一點，其實 ScrollIntoView 是更好的選擇喔。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10279669) -
