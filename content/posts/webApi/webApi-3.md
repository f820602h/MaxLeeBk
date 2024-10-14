---
title: 差點被當塑膠的 Web API / CreateDocumentFragment
date: 2021/9/16 14:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 除了功能完善，有時候效能也該一併考慮。

今天要介紹的是 CreateDocumentFragment，它隸屬於 `document` 物件底下，而 Document 所指的就是整個網頁文件，也是節點樹（DOM tree）的一個進入點。簡單的說，Document 提供了一些 methods 讓我們去操作整個網頁文件，像是 `document.querySelector` 就是我們經常使用，拿來遍歷整個 DOM tree 並找到我們指定的元素。

---

## CreateDocumentFragment

<br/>

先直接說明 CreateDocumentFragment 的功能好了，它可以幫我們創建一個 DocumentFragment，而 DocumentFragment 就如同一個虛擬的文件片段，就算對其進行節點操作時並不會造成瀏覽器回流（reflow），也就是不會耗費資源來進行畫面更新，這也就是它最大的優點。

如果你還沒接觸過前端框架的話，那相信你在遇到需要新增動態元素至畫面上時你通常會有下面這幾個方法：

<br/>

#### # innerHTML

首先是比較基礎的方式是用，也就是用字串的方式來設定某個元素的 HTML 內容，使用起來非常間單，不過如果想要塞入的內容結構上比較複雜的話那就會非常麻煩了（字串裡可是沒有編輯器提示的啊～）。

```javascript
let list = ["egg", "milk", "sugar", "flour"];
let htmlContent = "";
for (let i = 0; i < list.length; i++) {
  htmlContent += `<li>${list[i]}</li>`;
}
const ul = document.querySelector("ul");
ul.innerHTML += htmlContent;
```

還有一點比較麻煩的是，在父元素已經有部分子元素情況下使用 `innerHTML`，會很難從中插入新的元素，會需要其他額外的處理，反而會造成程式碼很冗長，所以它大部分都不會是我們的最佳解決方案。

```html
<ul>
  <li>我是本來就在的元素</li>
  <li>我是本來就在的元素</li>
  <!--   如果你的新元素要放在這裡就會很麻煩 -->
  <li>我是本來就在的元素</li>
  <li>我是本來就在的元素</li>
</ul>
```

<br/>

#### # appendChild

相比 `innerHTML`，`appendChild` 應該才是更常使用的方法：

```javascript
let list = ["egg", "milk", "sugar", "flour"];
const ul = document.querySelector("ul");
for (let i = 0; i < list.length; i++) {
  const li = document.createElement("li");
  li.textContent = list[i];
  ul.appendChild(li);
}
```

這種方式就算想要創建比較複雜的 HTML 結構也可以寫得比較有系統性，程式碼也有比較好的易讀性及維護性，而且其實除了 `appendChild`，你也可以用 `insertBefore` 選擇新元素要注入的位置。

```html
<ul>
  <li>我是本來就在的元素</li>
  <!--  新元素將會放在這邊 -->
  <li>我是本來就在的元素</li>
</ul>
```

```javascript
let list = ["egg", "milk", "sugar", "flour"];
const ul = document.querySelector("ul");
const last_li = ul.querySelector("li:last-child");
for (let i = 0; i < list.length; i++) {
  const new_li = document.createElement("li");
  new_li.textContent = list[i];
  ul.insertBefore(new_li, last_li);
}
```

不過這樣的方式有個致命的缺點，每次迴圈在執行時都會直接在目前的 DOM tree 中塞入新元素時，此時會促使網頁更新畫面，這樣其實或多或少會引響效能。

<br/>

#### # createDocumentFragment

但如果使用 `createDocumentFragment` 可就不一樣了，我們是在一個虛擬的文件片段中加入新元素，這樣就完全不會造成畫面的更新，因為它根本就沒渲染在畫面上。

```javascript
let list = ["egg", "milk", "sugar", "flour"];
const ul = document.querySelector("ul");
const fragment = document.createDocumentFragment();
for (let i = 0; i < list.length; i++) {
  const li = document.createElement("li");
  li.textContent = list[i];
  fragment.appendChild(li);
}
ul.appendChild(fragment);
```

當我們將全部想要新增的元素都加進 DocumentFragment 後，再一次性的塞進我們真正想要放的位置就可以了，整體的感覺會很像 `innerHTML`，但 `innerHTML` 在設定後其實還多了一個字串轉換成節點的過程，所以 createDocumentFragment 在效能層面來說真的是比較友善。

> 不過現在的瀏覽器似乎對於短時間內的連續 DOM 操作都有做一些最佳化，不至於讓效能差到太多，但使用 CreateDocumentFragment 其實也可以讓 「不斷插入」 變成 「一次插入」，在程式碼的目的表達上也會更清楚。

<br/>

今天介紹的 CreateDocumentFragment 雖然不是什麼功能華麗的 API，但是非常建議大家可以使用看看，儘管能提升的效能或許不多，但這一點點很有可能就是你跟其他人的差異喔～

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10266640) -
