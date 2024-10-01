---
title: 那些被忽略但很好用的 Web API / 拖拉式待辦清單
date: 2021/10/10 17:39:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 就算拖拖拉拉，也可以把待辦事項處理好

昨天雖然已經知道該如何使用 Drag & Drop API 了，不過今天會實際用它來做個「拖拉式待辦清單」，用具體的範例來讓我們更加理解它的運用技巧。

---

## 設計概念

#### # 確立需求與功能

1. 既然是待辦清單，那自然要可以新增待辦事項
2. 每項任務可以透過拖曳來進行狀態的更換（待處理、進行中、已完成）
3. 每項任務可以透過拖曳來進行排序的調換
4. 每項任務可以透過拖曳來進行刪除

<br/>

## 開始實踐

由於主要是為了示範 Drag & Drop，所以就不額外使用前端框架，並且也不進行資料的處理，完全使用 DOM 的增刪操作來完成作品，如果各位想要完善範例的話可以再自行採用更方便的技術。

首先準備好我們 ToDo List 的結構和樣式，大致上長成下面這樣，樣式部分各位可以各自發揮，這邊就不秀出完整 CSS 了。

```html
<div class="wrap">
  <div class="column">
    <div class="title todo">待處理</div>
    <div class="input-wrap">
      <input type="text" placeholder="＋ 新增事項" />
      <button>新增</button>
    </div>
    <ol class="list"></ol>
  </div>
  <div class="column">
    <div class="title handle">進行中</div>
    <ol class="list"></ol>
  </div>
  <div class="column">
    <div class="title complete">已完成</div>
    <ol class="list"></ol>
  </div>
</div>
<div class="delete">刪除</div>
```

<img src="/img/content/webApi-26/layout.png" style="margin: 24px auto;" />

<br/>

#### # 新增代辦任務

首先我們先來透過 `<input>` 和 `<button>` 來完成「新增任務」的功能，透過點擊按鈕或按下 Enter 就會執行 `createToDo` 函式，用來創造一個 `li` 元素，並加上屬性及文字後丟掉「待處理」的 `ol` 中。

```javascript
const input = document.querySelector("input");
const button = document.querySelector("button");
const todoList = input.parentElement.nextElementSibling;

function createToDo(content) {
  const newItem = document.createElement("li");
  newItem.classList.add("item");
  // 記得要加上 draggable，這樣任務才可以拖曳
  newItem.setAttribute("draggable", true);
  newItem.textContent = content;
  todoList.appendChild(newItem);
  input.value = "";
}

input.addEventListener("keydown", (e) => {
  if (!input.value.trim() || e.which !== 13) return;
  createToDo(input.value);
});

button.addEventListener("click", () => {
  if (!input.value.trim()) return;
  createToDo(input.value);
});
```

<img src="/img/content/webApi-26/add.gif" style="margin: 24px auto;" />

<br/>

#### # 拖曳以改變任務狀態

接著我們要讓任務可以進行「拖曳」，且三個不同的區塊都要可以「被放置」任務，也就是 Drag & Drop API 的部分了，分別把 Drag Source 和 Drop Location 監聽事件的流程包裝成函式，然後在新增任務時把元素加上 `drag` 相關事件，以及為三個狀態區塊加上 `drop` 相關事件。

```javascript
// 用來暫存被 drag 的元素
let source = null;
function addDragEvt(element) {
  element.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
    source = e.target;
  });
  element.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
    source = null;
  });
}

function createToDo(content) {
  // ...前面省略
  // 記得在 createToDo 中加入這一行來為新增的 li 監聽事件
  addDragEvt(newItem);
  todoList.appendChild(newItem);
  input.value = "";
}
```

```javascript
function addDropEvt(element) {
  element.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  element.addEventListener("drop", (e) => {
    e.currentTarget.querySelector("ol").appendChild(source);
  });
}

const columns = document.querySelectorAll(".column");
columns.forEach((column) => {
  addDropEvt(column);
});
```

<img src="/img/content/webApi-26/drag.gif" style="margin: 24px auto;" />

<br/>

#### # 拖曳以改變任務排序

現在各項任務已經可以通過拖曳放置在不同狀態的區塊了，現在要來處理排序問題了，我們可以先透過 `dragover` 事件來取得鼠標的位置，得以判斷使用者想要把項目放在哪一個位置，並且利用樣式的改變讓使用者能更清楚知道他放開滑鼠後，任務會被加在哪裡：

```css
.item {
  position: relative;
}
.item::before,
.item::after {
  content: "";
  position: absolute;
  display: block;
  width: 100%;
  height: 4px;
  background: lightblue;
  opacity: 0;
}
.item.before::before {
  top: -2px;
  left: 0;
  opacity: 1;
}
.item.after::after {
  bottom: -2px;
  left: 0;
  opacity: 1;
}
```

```javascript
// 用來暫存被 dragover 的元素
let overItem = null;

// 重置被 dragover 的元素
function clearOverItem() {
  if (!overItem) return;
  overItem.classList.remove("before");
  overItem.classList.remove("after");
  overItem = null;
}

function addDropEvt(element) {
  element.addEventListener("dragover", (e) => {
    clearOverItem();
    // 如果 dragover 的元素也是任務項目且不是目前被 drag 的 source 時執行
    if (e.target.getAttribute("draggable") && e.target !== source) {
      overItem = e.target;

      if (e.offsetY > overItem.offsetHeight / 2) {
        // 如果鼠標在元素的下半部顯示下方的藍條
        overItem.classList.add("after");
      } else {
        // 反之，顯示上方的藍條
        overItem.classList.add("before");
      }
    }
    e.preventDefault();
  });
  //...以下省略
}
```

<img src="/img/content/webApi-26/sort.gif" style="margin: 24px auto;" />

接著我們只要在修改一下 `drop` 事件，在當中判斷目前被 `dragover` 元素的狀態就可以放到對應的位置了：

```javascript
function addDropEvt(element) {
  //...以上省略
  element.addEventListener("drop", (e) => {
    const list = e.currentTarget.querySelector("ol");
    if (overItem) {
      if (overItem.classList.contains("before")) {
        // 如果 overItem 有 before class 就將 source 移動到它的前面
        list.insertBefore(source, overItem);
      } else {
        // 反之，有 after class 就將 source 移動到它的後面
        list.insertBefore(source, overItem.nextElementSibling);
      }
    } else {
      // 如果沒有 overItem 也沒有更換狀態就不動作
      if (e.currentTarget.contains(source)) return;
      // 反之，加到最後面
      else list.appendChild(source);
    }
    clearOverItem();
  });
}
```

<img src="/img/content/webApi-26/done.gif" style="margin: 24px auto;" />

<br/>

#### # 拖曳以刪除任務

最後在把刪除的功能給補上，這樣一切就大功告成了。

```javascript
const del = document.querySelector(".delete");
del.addEventListener("dragover", (e) => {
  e.preventDefault();
});
del.addEventListener("drop", (e) => {
  source.remove();
  clearOverItem();
});
```

<br/>

整個範例做完後，希望各位對於 Drag & Drop API 能有更深更具體的認識，如果你在動手做之前想先試玩看看的話，我把原始碼放在 [CodePen](https://codepen.io/max-lee/pen/rNzNXOX) 囉，如果文章中的說明看不是很懂的話，也可以在 CodePen 看看，有任何問題或建議也好歡迎各位提出～

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10280490) -
