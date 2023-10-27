---
title: 那些被忽略但很好用的 Web API / Drag & Drop
date: 2021/10/9 21:19:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 就是要拖拖拉拉

現在使用手機、平板來瀏覽網站的機會比起電腦來說，實在是多太多了，所以其實 Web API 也不斷針對這樣的趨勢在靠攏，像是我們前期介紹的 Battery API 就是一個案例。

使用者在長期使用行動裝置的情況下，已經習慣了系統 OS 或 APP 的操作，所以對於「拖曳物件」這個手勢動作已經是直覺反應了，而在網站開發中，Drag & Drop API 就是協助我們完成「拖曳」功能的好幫手。

---

## Drag & Drop

Drag & Drop 其實是「拖」和「放」兩個動作，也就是除了「拖曳」元素外，也可以將其「放置」在特定位置。這也代表說整個過程中會與使用者交互的元素不只有一個，會發生的事件也不只有一個，在拖放的過程中至少會有兩個角色，各自也都有對應的事件：

<br/>

- **Drag Source**： 被使用者點擊不放並「拖曳」的目標元素。

|   事件    |                          說明                          |
| :-------: | :----------------------------------------------------: |
| dragstart |      當使用者**開始**拖曳時觸發（滑鼠開始移動時）      |
|   drag    | 開始拖曳到結束拖曳前都會不斷觸發（約幾百毫秒觸發一次） |
|  dragend  |      當使用者**結束**拖曳時觸發（滑鼠按鍵放開時）      |

<br/>

- **Drop Location**： 一個可以「放置」 `drag source` 的元素。

|   事件    |                           說明                           |
| :-------: | :------------------------------------------------------: |
| dragenter |            當使用者拖曳期間**進入**元素時觸發            |
| dragover  | 當使用者拖曳期間**經過**元素時觸發（約幾百毫秒觸發一次） |
| dragleave |            當使用者拖曳期間**離開**元素時觸發            |
|   drop    |         當使用者將拖曳的目標**放置**在元素時觸發         |

<br/>

#### # Attribute:draggable

通常來說，按住元素不放也是沒辦法拖曳的，若要使其可以拖曳必須要在 HTML 標籤上加入 `draggable` 屬性：

```html
<div class="box" draggable="true"></div>
```

> Drop Location 則不用額外添加屬性，任何元素都可以是 Drop Location。

<br/>

#### # 交互事件

由於前面的表格已經大致說明了各個事件的觸發時機了，應該也都不難離解，所以我們就直接試試看能夠利用事件做些什麼效果，以及 Drag Source 和 Drop Location 之間該怎麼互動。

<br/>

**- 樣式改變**

我們可以利用 `dragstart` 和 `dragend` 來改變 Drag Source 的樣式，讓使用者能更清楚目前被拖曳的元素是哪一個，以及利用 `dragenter` 和 `dragleave` 來改變 Drop Location 的樣式：

```html
<div class="container">
  <div class="box" draggable="true"></div>
  <div class="box" draggable="true"></div>
  <div class="box" draggable="true"></div>
</div>
<div class="container"></div>
```

```css
.container {
  background: white;
}
.container.hover {
  background: aliceBlue;
}
.box {
  background: lightblue;
  cursor: grab;
}
.box.dragging {
  background: lightgreen;
  cursor: grabbing;
}
```

```javascript
const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });
  box.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  });
});

const containers = document.querySelectorAll(".container");
containers.forEach((container) => {
  container.addEventListener("dragenter", (e) => {
    e.target.classList.add("hover");
  });
  container.addEventListener("dragleave", (e) => {
    e.target.classList.remove("hover");
  });
});
```

<br/>

**- 鼠標位置**

由於 `drag` 和 `dragover` 都是不斷觸發的事件，所以我們可以用來追蹤使用者游標的位置：

```javascript
const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("drag", (e) => {
    console.log(`滑鼠在視窗中的座標: ${e.clientX} / ${e.clientY}`);
  });
});

const containers = document.querySelectorAll(".container");
containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    console.log(`滑鼠在 Drop Location 中的座標: ${e.offsetX} / ${e.offsetY}`);
  });
});
```

<br/>

**- 移動元素**

最後只要搭配上 `drop` 事件，我們就可以達成移動元素的效果，不過有個要注意的事情是 `dragover` 和 `drop` 會有執行上的衝突，所以如果要讓 `drop` 的 Callback 能夠順利觸發，必須要在 `dragover` 中將預設行為給取消掉：

```javascript
let source = null;

const boxes = document.querySelectorAll(".box");
boxes.forEach((box) => {
  box.addEventListener("dragstart", (e) => {
    source = e.target;
  box.addEventListener("dragend", (e) => {
    source = null;
  });
});

const containers = document.querySelectorAll(".container");
containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  container.addEventListener("drop", (e) => {
    e.target.appendChild(source)
    e.target.classList.remove("hover");
  });
});
```

<img src="/img/content/webApi-25/move.gif" style="margin: 24px auto;" />

<br/>

看過以上示範後是不是覺得 Drag & Drop API 還蠻簡單的呢？只要先設定好需要拖曳的元素後，透過幾個事件的交互就可以達到這樣的效果。不過其實很多 API 都是這樣的，使用起來都很容易，但實際上要應用時就容易邏輯卡住，所以為了讓各位能對 Drag & Drop 有更具體的印象，明天就來實際寫一個拖拉的 ToDo List 吧！

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10280217) -
