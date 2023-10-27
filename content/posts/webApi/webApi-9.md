---
title: 那些被忽略但很好用的 Web API / Selection
date: 2021/9/22 22:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 選你所愛，愛你所選。

在瀏覽網站時，反白(或稱反藍)其實是一個非常常見的動作，不管是要強調目前的閱讀區域或是想要複製某個段落，使用者都會透過游標進行反白，而 Selection API 就是針對反白的選取區塊進行操作。

---

## Selection

Selection 本身是一個物件，它代表的是目前使用者所選的文本範圍，或是「輸入游標」插入的位置，這文本範圍可能會涵蓋到多個元素，也可能會坍縮在一個點(也就是沒有選取到任何文本)，而這整個選取範圍又包含了幾個專有術語：

<img src="/img/content/webapi-9/selection.png" style="margin: 24px auto;" />

> 你該知道：
>
> 1. anchor 有可能在 focus 前面也有可能在 focus 後面，這取決於你拖曳游標的方向。
> 2. range 可能會橫跨多個節點，但 anchor 和 focus 只會存在在最初與最後的節點當中。

<br/>

#### # Window.getSelection

如果想要取得目前選取範圍的 Selection 物件，那只要呼叫這個 method 就可以了：

```javascript
let selectionObj = window.getSelection();
console.log(selectionObj); // Selection 物件
```

<br/>

#### # Selection.anchorNode

取得了 Selection 物件後我們就可以讀取它本身的一些屬性了，而 `anchorNode` 就是其中之一，它會給我們當初反白時 anchor 位置所在的節點。

```javascript
let selectionObj = window.getSelection();
console.log(selectionObj.anchorNode); // 一個文字節點
```

<img src="/img/content/webapi-9/anchor.gif" style="margin: 24px auto;" />

<br/>

#### # Selection.anchorOffset

知道 anchor 所在節點後，還可以透過 `anchorOffset` 來知道 anchor 點下的位置距離節點開頭相差了幾個字：

```javascript
let selectionObj = window.getSelection();
console.log(selectionObj.anchorOffset); // 一個 number，代表與節點開頭相差了幾個字
```

<br/>

#### # Selection.focusNode

當然了，可以知道 anchor 的位置，自然也能知道 focus 的位置。

```javascript
let selectionObj = window.getSelection();
console.log(selectionObj.focusNode); // 一個文字節點
```

<br/>

#### # Selection.focusOffset

以此類推，有 `focusNode` 就也會有 `focusOffset`：

```javascript
let selectionObj = window.getSelection();
console.log(selectionObj.focusOffset); // 一個 number，代表與節點開頭相差了幾個字
```

<br/>

#### # Selection.toString

那除了一些唯讀屬性之外呢，Selection 物件有有一些自身的 methods 可以使用，其中最簡單也最重要的自然就是取得所選範圍的文本內容，這時候只要呼叫 `toString` 就可以了：

```javascript
let selectionObj = window.getSelection();
console.log(selectionObj.toString()); // 所選範圍的文本內容
```

<br/>

#### # Selection.collapse

`collapse` 是個比較特別的 method，它會讓 Selection 坍縮到只剩下一個點，也就是從一個反白區塊變成只剩下一個閃爍的輸入游標在畫面上。

而 `collapse` 有兩個參數可以傳入，第一個是你想坍縮 Selection 到哪一個節點上，第二個參數則是你要坍縮在該節點上的第幾個位置。

```html
<div contenteditable="true">這裡的文字可以編輯</div>
<button>collapse</button>
<script>
  const button = document.querySelector("button");
  button.addEventListener("mousedown", function (e) {
    e.preventDefault();
  });
  button.addEventListener("click", function () {
    const selection = window.getSelection();
    // 將選取範圍坍縮在 anchor 所在節點的第十個字
    selection.collapse(selection.anchorNode, 10);
  });
</script>
```

> 要注意，儘管你看不到閃爍的游標，但其實游標還是被放到了你 focus 或 collapse 的位置。而如果你將元素改為 `contenteditable`，你就可以清楚看到游標了。

<br/>

#### # Selection.extend

另一個和 `collapse` 很像的是 `extend`，它會讓 anchor 保持不變並移動 focus，也就是說你可以改變反白的區域。它的參數也和 `collapse` 一樣，第一個是你要將 focus 移動到哪個節點，第二個則是要移動到該節點的第幾個字。

```html
<div contenteditable="true">這裡的文字可以編輯</div>
<button>extend</button>
<script>
  const button = document.querySelector("button");
  button.addEventListener("mousedown", function (e) {
    e.preventDefault();
  });
  button.addEventListener("click", function () {
    const selection = window.getSelection();
    // 將 focus 移動到跟 anchor 一樣的位置，此時 Selection 會是坍縮的
    selection.extend(selection.anchorNode, selection.anchorOffset);
  });
</script>
```

<br/>

#### # Selection.selectAllChildren

這個 method 算是非常好用的，它可以夠傳入一個元素節點來指定目前的選取範圍。如果你傳的是整個 `document.body` 那就相當於是全選整個網頁。

```html
<div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
<script>
  const div = document.querySelector("div");
  const selection = window.getSelection();
  selection.selectAllChildren(div); // div 中的內容將整個被反白起來
</script>
```

<br/>

#### # Selection.deleteFromDocument

`deleteFromDocument` 可以幫我們將目前選取的區塊從整個文件中刪除，當然，他指的是目前瀏覽的頁面，並不會連同你的程式碼一併刪除。

```html
<div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
<script>
  const div = document.querySelector("div");
  const selection = window.getSelection();
  // 我們將 div 中的內容整個反白起來後刪除了
  selection.selectAllChildren(div);
  selection.deleteFromDocument();
</script>
```

<br/>

#### # Document:selectionchange Event

最後，除了主動針對 Selection 物件進行操作外，Document 本來還可以監聽 `selectionchange` 的事件，當今天文件中的選取範圍有了更動，該事件就會觸發，並執行我們指定的 Callback。

```javascript
document.addEventListener("selectionchange", () => {
  // 講選取起來的文本內容設定到指定的容器中
  document.querySelector("#text").textContent = window.getSelection().toString();
});
```

<br/>

相信看完今天的內容，你可能會覺得 Selection API 功能似乎蠻齊全的，但好像也不知道要拿來做什麼應用，但其實只要搭配昨天的 DesignMode，我們就可以製作一個簡易的文章編輯器了，不過等到明天的 Clipboard 一併介紹完後，我們再來實際動手做，屆時各位就會知道 Selection API 其實是蠻好玩的。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10271519) -
