---
title: 差點被當塑膠的 Web API / 簡易文字編輯器
date: 2021/9/24 16:48:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 學習之後，刻意進行練習能夠加深印象。

前面三天我們已經習得 DesignMode、Selection API、Clipboard API，今天我們就將這三個 Web API 一同使用，動手寫一個簡易的文字編輯器吧!

---

## 簡易文字編輯器

我們今天要做的文字編輯器沒有特別的功能，只會模擬「全選」、「複製」、「剪下」、「貼上」四大功能，純粹就是為了讓大家更熟悉前面認識的 Web API 而已，未來各位想要新增其他的 feature，可以再自行發揮。

<br/>

### # HTML

首先我們先準備一下今天的網頁版面：

```html
<div>
  <button id="all">全選</button>
  <button id="copy">複製</button>
  <button id="cut">剪下</button>
  <button id="paste">貼上</button>
</div>
<div id="editable" contenteditable="true"></div>
```

<img src="/img/content/webApi-11/rich.png" style="margin: 24px auto;" />

那上面就是我們這次的編輯器，上面是工具列的部分，下面則是文字編輯的區域，樣式的話各位可以自由發揮，CSS 的部分就不額外放上來了。而為了方便，這次的可編輯範圍我們使用 `contenteditable` 屬性，各位也可以改用 iframe 搭配 DesignMode。

<br/>

### # Utilities

再來，我們先準備一些共用的變數和函式：

```javascript
const editableDiv = document.querySelector("#editable");

function addClickListener(selector, callback) {
  const el = document.querySelector(selector);
  el.addEventListener("mousedown", function (e) {
    e.preventDefault(); // 關閉 mousedown 原生事件
  });
  el.addEventListener("click", function (e) {
    callback(e);
  });
}
```

由於我們這次有四個按鈕需要綁定事件，所以為了避免重複撰寫，我們把事件監聽的程式碼拉出來作為共用函式，**要注意的是**，因為我們在點擊按鈕時會使得「可編輯區域」（#editable）的 focus 造成失焦，所以要特別把 `mousedown` 的原生事件關閉。

<br/>

### # 全選按鈕

首先第一個按鈕是「全選」，我們希望使用者在點擊按鈕後可以把編輯區域中的文字全部反白：

```javascript
addClickListener("#all", function (e) {
  const selection = window.getSelection();
  selection.collapse(editableDiv, 0);
  if (!editableDiv.childNodes.length) return; // 避免在沒有任何文字節點時進行 extend
  selection.extend(editableDiv.childNodes[0], editableDiv.textContent.length);
});
```

利用前面的共用函式 `addClickListener`，來設定按鈕，而在 Callback 中我們的步驟是先將 Selection 坍縮（collapse）在編輯區的最前頭，然後透過 `extend` 來將 focus 移動到最後面，這樣編輯區自然就會被全部反白了。

不過要注意，當編輯區沒有任何文字節點時進行 `extend` 是會報錯的，所以我們在中間有加一行防禦性的判斷式。

<br/>

### # 複製按鈕

再來複製按鈕要讓使用者可以將目前反白的文字放進系統剪貼簿中，這樣之後才能將其「貼上」。

```javascript
addClickListener("#copy", function (e) {
  const selection = window.getSelection();
  navigator.clipboard.writeText(selection.toString());
});
```

複製功能就相對簡單很多了，只要使用之前介紹 Selection 和 Clipboard 的基本 method 就可以實現。

<br/>

### # 剪下按鈕

剪下按鈕要做的事情其實和「複製」沒差多少，不過除了要將文字加進剪貼簿外，原本的文本內容需要將其移除，所以最後我們使用 Selection 的 `deleteFromDocument` 來處理。

```javascript
addClickListener("#cut", function (e) {
  const selection = window.getSelection();
  navigator.clipboard.writeText(selection.toString());
  selection.deleteFromDocument();
});
```

<br/>

### # 貼上按鈕

最後就剩貼上按鈕了，也是本次練習中最複雜的功能，因為「貼上」這個動作在將剪貼簿的內容放入編輯區時，可能會有兩種情境需要必一併考慮：

1. 使用者要輸入游標插入編輯區的某個位置，想要並將剪貼簿內容貼上
2. 使用者先反白了文字，想要將剪貼簿內容貼上，並取代反白的文字

<br/>

**根據以上兩個情境，我們可以大致盤點出需要做的事情：**

1. 如果有反白文字，必須要將反白文字刪除
2. 如果有反白文字，反白文字以前和以後的文字要保留
3. 如果沒有反白文字，游標插入位置之前和之後的文字要保留
4. 最後編輯區要顯示的內容應該是，前半部保留的文字 + 剪貼簿的文字 + 後半部保留的文字

```javascript
addClickListener("#paste", async function (e) {
  const selection = window.getSelection();
  selection.deleteFromDocument();

  const offset = selection.anchorOffset;
  const prefix = editableDiv.textContent.substr(0, offset);
  const suffix = editableDiv.textContent.substr(offset);

  const clipboardText = await navigator.clipboard.readText();
  const textNode = document.createTextNode(prefix + clipboardText + suffix);
  editableDiv.innerHTML = "";
  editableDiv.appendChild(textNode);
  selection.collapse(textNode, (prefix + clipboardText).length);
});
```

在整理出事項後，上面就是我們最後撰寫出來的程式碼了，首先執行 `deleteFromDocument`，只要有反白的文字就會被刪除，而且與此同時，Selection 會被自動坍縮在一個點上，這樣只要取得 `anchorOffset` 就可以知道游標目前插入在第幾個字。

然後就可以使用 `substr` 把需要保留的文字分割出來，最後只要加上剪貼簿的內容再放回去就行囉，最後一行則是將游標放回原本的位置。

**如果想要玩玩看的話，這邊是這次練習的 [CodePen](https://codepen.io/max-lee/pen/wveYwKK)**

<br/>

不曉得大家對於這次的練習還滿意嗎？雖然今天做出來的功能並不是很實用，但主要還是希望和大家一起在複習前面幾天學習的內容，而且其實各位時間心力的話，可以再為這個範例不斷添加新功能，完成自己的作品。

另外這種文字編輯器，其實有很多 js 套件都有實現了，例如 [Slate.js](https://www.slatejs.org/examples/richtext) 就是一套很完整的工具，它使用的技術和我們今天使用的差不了多少，有興趣的人可以再去看看。

> 通常這種所見即所得的編輯器會稱作「富文字編輯器」（Rich Text）

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10272325) -
