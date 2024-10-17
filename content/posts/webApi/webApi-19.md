---
title: 差點被當塑膠的 Web API / MutationObserver
date: 2021/10/2 17:19:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 我的改變，你看得見！

在開發網頁過程中，我們最常做的事情就是對資料進行修改後運用在 DOM 元素上，像是新增 / 刪除節點、調整樣式、改寫內容或是屬性(attribute)的調整，而這些「修改 DOM」的動作通常散落在程式碼的各個角落，發生時機也並不相同，在這樣的情況下，我們能不能追蹤這些動作呢？

---

## MutationObserver

MutationObserver API 就是用來解決上述問題的，它可以讓我們追蹤 DOM 的變化，無論是子節點的變動或內容、屬性的變動，並且獲得相關的資訊，以便作出後續的行動。

<br/>

### # Window.MutationObserver

MutationObserver 本身是建構函式，所以我們需要用 `new` 關鍵字來建立實體，建立時需要傳入一個 Callback Function 作為參數，該 Function 可以接到由 MutationObserver 提供的 MutationRecords 陣列和 MutationObserver 實體作為參數：

<br/>

- **MutationRecords**： 這個陣列會存放 MutationRecord 物件，該物件記錄著 DOM 變動的相關資訊，後面再詳細介紹。
- **MutationObserver**： 呼叫此 Callback Function 的 MutationObserver 實體，其實就等於該 Function 的 `this`。

<br/>

```javascript
const observer = new MutationObserver(function (mutations, owner) {
  console.log(mutation, owner);
});
```

<br/>

### # MutationObserver.observe

我們可以把剛剛 `new` 出來的 MutationObserver 實體譬喻成一個「觀察者」，當這位觀察者監測到節點變動，他就會執行設定好的任務(callback)，但他目前並未被指派要觀察哪一個元素，所以我們要透過 `observe` 這個 method 來指定「被觀察的對象」，其中需要傳入兩個參數：

<br/>

- **target**： 一個要受到觀察的 DOM 節點。
- **options**：一個初始化設定物件，用來指定 DOM 節點的哪些項目需要被觀察等相關設定。

|         屬性          |                  解釋                  |     型別、預設值     |
| :-------------------: | :------------------------------------: | :------------------: |
|       childList       |      是否觀察節點的直屬子節點變動      |   boolean、`false`   |
|        subtree        |      是否觀察節點的所有子節點變動      |   boolean、`false`   |
|      attributes       |         是否觀察節點的屬性變動         |   boolean、`false`   |
|     characterData     |        是否觀察節點中的內容變動        |   boolean、`false`   |
|   attributeOldValue   |         是否紀錄變動前的屬性值         |   boolean、`false`   |
| characterDataOldValue |         是否紀錄變動前的內容值         |   boolean、`false`   |
|    attributeFilter    | 需要觀察的屬性名稱，如果為空則全部觀察 | array\[string]、`[]` |

<br/>

```javascript
const observer = new MutationObserver(function (mutations) {
  console.log(mutations);
});

const div = document.querySelector("div");
observer.observe(div, {
  childList: true,
  attributes: true,
  characterData: true,
});
```

如此一來，只要元素有被觀察到我們所指定項目的變動，MutationObserver 就會去執行 Callback。

<br/>

### # MutationObserver.disconnect

另外還可以透過 `disconnect` 來註銷目前已經被觀察的 DOM，但 MutationObserver 實體並不會消失，只是暫時不再進行觀察，直到你又使用 `observe` 來註冊一個被觀察對象。

```javascript
const observer = new MutationObserver(function (mutations) {
  console.log(mutations);
});

observer.disconnect();
```

<br/>

### # MutationRecord 物件

前面有說，MutationObserver 在執行 Callback 時會提供一個 MutationRecords 陣列，裡面會存放 MutationRecord 物件，這個段落我們要來了解為何 MutationRecord 要存放在陣列中，以及它到底存放著哪些資訊供我們使用。

<br/>

- **首先要先知道一個 MutationObserver 的特性：**

  MutationObserver 並非事件監聽，事件是同步執行的，而 MutationObserver 則是非同步執行的，這意味著，如果目前執行的一段程序中有多次的節點變動，MutationObserver 會等到一切結束後才呼叫 Callback。

  這是為了避免大量 DOM 操作所帶來的效能問題，也因此，MutationObserver 會將該程序時間內所有的變動記錄下來並包裝成陣列給我們。

```javascript
const observer = new MutationObserver(function (mutations) {
  mutations.forEach((record) => {
    console.log(record); // MutationRecord 物件
  });
});

const div = document.querySelector("div");
observer.observe(div, {
  childList: true,
  attributes: true,
  characterData: true,
});

div.textContent = "example";
div.style.background = "pink";
// 此時 MutationObserver 只會呼叫一次 Callback
// 而 mutations 中會有兩個 MutationRecord
```

<br/>

- **接著來看一下 MutationRecord 中有哪些屬性：**
  以下這些並非全部的屬性，只介紹了幾個比較實用的，如果想知道完整內容的話可以看[這裡](https://developer.mozilla.org/zh-TW/docs/Web/API/MutationObserver#mutationobserverinit)。

|     屬性      |               解釋                |  型別  |
| :-----------: | :-------------------------------: | :----: |
|     type      |         觀察到的變動類型          | string |
|    target     |            變動的節點             |  Node  |
|  addedNodes   | 被新增的節點，如果沒有會是 `null` |  Node  |
| removedNodes  | 被刪除的節點，如果沒有會是 `null` |  Node  |
| attributeName |      觀察到的變動屬性之名稱       | string |
|   oldValue    |            變動前的值             | string |

> MutationRecord.oldValue 只有在 `observe()` 的 `options` 有開啟設定時才會有值。

<br/>

### # 使用情境

老實說，一定要使用 MutationObserver 的情況並不多，可能比較需要使用的情境會是：「專案中使用了第三方套件，為了觀測該套件所進行的一些 DOM 操作」，由於我們無法直接對第三方套件的程式碼進行修改，導致無法掌控 DOM 變動的程序，所以只能透過 MutationObserver 來追蹤。

但因為平常的 DOM 操作其實都是由我們主動執行的，所以真的需要在節點變動後做什麼事情就直接放在後面一起執行就好了，例如：

```html
<button onclick="changeContent()">改變內容</button>
<button onclick="changeColor()">改變顏色</button>
<div>Hi I'm Max</div>

<script>
  const div = document.querySelector("div");

  // 當 DOM 變動時我們想做的事情
  function onDomMutation(info) {
    console.log(info);
  }

  function changeContent() {
    const oldValue = div.textContent;
    div.textContent = "Hi I'm Tom";
    onDomMutation({
      target: div,
      oldValue,
      type: "characterData",
    });
  }

  function changeColor() {
    const oldValue = div.style;
    div.style.color = "red";
    onDomMutation({
      target: div,
      oldValue,
      type: "attributes",
    });
  }
</script>
```

**其實透過上面這樣的寫法依然可以做到類似的效果，但我認為 MutationObserver 最主要的優點是「減少耦合」，就像之前介紹的 CustomEvent 一樣，透過「觀察者模式」的 Design Patterns 來讓原本是許多「一對一的依賴關係」整合成單個「一對多的依賴關係」。**

```html
<button onclick="changeContent()">改變內容</button>
<button onclick="changeColor()">改變顏色</button>
<div>Hi I'm Max</div>

<script>
  const div = document.querySelector("div");
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach((record) => {
      console.log(record);
    });
  });

  observer.observe(div, {
    childList: true,
    attributes: true,
    characterData: true,
  });

  function changeContent() {
    div.textContent = "Hi I'm Tom";
  }

  function changeColor() {
    div.style.color = "red";
  }
</script>
```

<br/>

不曉得經過這樣的解釋後，各位有沒有理解使用 MutationObserver 的好處呢？後面我們還會陸續介紹幾個也是採用「觀察者模式(Observer Pattern)」的 API，可以期待一下喔。另外有使用過 Vue 的朋友，你知道 `$nextTick` 其實就是基於 MutationObserver 實踐出來的喔，有興趣的人可以去看看[原始碼](https://github.com/vuejs/vue/blob/2.6/src/core/util/next-tick.js)。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10277536) -
