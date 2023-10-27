---
title: 那些被忽略但很好用的 Web API / ResizeObserver
date: 2021/10/3 22:33:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 你的改變，我看得見！

今天要介紹的是 ResizeObserver，它和昨天的 MutationObserver 非常相像，都是透過「觀察者模式」的設計方式來監測元素，不過 ResizeObserver 監測的變動是元素的「大小」。

---

## ResizeObserver

各位應該有使用過 window 的 `resize` 事件吧？只要視窗大小有更動，事件就會觸發並執行 Callback，然後各位也一定跟我一樣，肖想著把 `resize` 事件綁定在一般元素上，可想而知是不會成功的，但 ResizeObserver 的出現，終於可以實現我們的願望了。

<br/>

#### # Window.ResizeObserver

ResizeObserver： 一樣是一個建構函式，所以需要使用 `new` 關鍵字來建立實體，建立時需要傳入一個 Callback Function 作為參數，該 Function 可以接到由 ResizeObserver 提供的一個陣列作為參數，該陣列中會一個或多個 ResizeObserverEntry 物件：

<br/>

- **ResizeObserverEntry**： 該物件中會有一些屬性，讓我們可以取得一些有關元素的「大小」、「位置」資訊，後面會再詳細介紹。

<br/>

```javascript
const observer = new ResizeObserver(function (entries) {
  console.log(entries);
});
```

<br/>

#### # ResizeObserver.observe

就和昨天說的一樣，ResizeObserver 創建後並不會直接開始進行觀察，我們需要透過 `observe` 來註冊想要監測的元素，這樣 ResizeObserver 才會在該元素發生變動時進行動作，這裡有兩個參數傳入：

<br/>

- **target**： 一個要受到觀察的 Element 元素。
- **options**：這是一個可選的參數，用來初始化觀測的設定選項，目前只有一個屬性：
  - box: 這個屬性會決定要觀測元素的哪一種「盒模型(Box Model)」。可接受的值有 `content-box` 和 `border-box` 兩種，預設為 `content-box`。（其實有第三種，但使用度很低）

> 如果對盒模型不太熟悉的朋友可以看[這裡](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model#%E4%BB%80%E4%B9%88%E6%98%AFcss_%E7%9B%92%E6%A8%A1%E5%9E%8B)瞭解一下

<br/>

```javascript
const observer = new ResizeObserver(function (entries) {
  console.log(entries);
});

const div = document.querySelector("div");
observer.observe(div, {
  box: "border-box",
});
```

這樣只要受到監測的元素發生寬高的變化，ResizeObserver 就會執行我們指定的行為了。

<br/>

#### # ResizeObserver.disconnect

和 MutationObserver 一樣，只要使用 `disconnect` 這個 method 就可以註銷目前所有被觀察的元素，後續只要再次呼叫 `observe` 來註冊一個被觀察的元素，ResizeObserver 依然會持續運作。

```javascript
const observer = new ResizeObserver(function (entries) {
  console.log(entries);
});

observer.disconnect();
```

<br/>

#### # ResizeObserver.unobserve

ResizeObserver 除了 `disconnect` 之外，還額外多了一個 `unobserve` method，它可以讓我們註銷「單個」元素的觀察，當某個元素已經不在需要受到監測，就可以將其做為參數，`unobserve` 便會把它從 ResizeObserver 的監測中移除。

```javascript
const observer = new ResizeObserver(function (entries) {
  console.log(entries);
});

const div = document.querySelector("div");
observer.observe(div, {
  box: "border-box",
});
observer.unobserve(div);
```

<br/>

#### # ResizeObserver 特性

一樣的，ResizeObserver 為了優化效能問題，如果有一連串連續且即時的元素尺寸變動，那 ResizeObserver 並不會一次次觸發，而是會將它們合併成一次變動，並且只會紀錄最終的結果。

而如果同一時間中，有多個觀測中的元素都發生了尺寸變動，那 ResizeObserver 就會有相應數量的紀錄，這也就是為什麼會以陣列形式來包裝 ResizeObserverEntry 物件。

```javascript
const observer = new ResizeObserver(function (entries) {
  entries.forEach((entry) => {
    console.log(entry); // ResizeObserverEntry 物件
  });
});

const element1 = document.querySelector("#element1");
const element2 = document.querySelector("#element2");
observer.observe(element1);
observer.observe(element2);

element1.style.width = "300px";
element1.style.height = "200px";
element2.style.width = "300px";
element2.style.height = "200px";
// 看似是四次變動，但 ResizeObserver 只會視為「兩個元素的一次變動」
// 因此 callback 只會觸發一次，且 entries 中會有兩組 ResizeObserverEntry
```

<br/>

#### # ResizeObserverEntry 物件

ResizeObserverEntry 的屬性雖然不多，但都較為複雜，所以下面就一一拉出來說明：

<br/>

- **ResizeObserverEntry.target**
  這是其中比較單純的屬性，讀取到的會是變動的元素(element)。

<br/>

- **ResizeObserverEntry.contentRect**
  這個屬性的值為一個 DOMRectReadOnly 物件，該物件會紀錄很多 `target` 的相關資訊：

  - **x**： 變動元素之 `contentBox` 在該元素中的Ｘ座標，通常等於 padding 寬度。
  - **y**： 變動元素之 `contentBox` 在該元素中的Ｙ座標，通常等於 padding 寬度。
  - **width**： 變動元素之 `contentBox` 的寬度。
  - **height**： 變動元素之 `contentBox` 的高度。
  - **top**： 變動元素之 `contentBox` 的「頂邊」的Ｙ座標，通常與 `y` 相同。
  - **bottom**： 變動元素之 `contentBox` 的「底邊」的Ｙ座標，通常與 `y + height` 相同。
  - **left**： 變動元素之 `contentBox` 的「左側」的Ｘ座標，通常與 `x` 相同。
  - **right**： 變動元素之 `contentBox` 的「右側」的Ｘ座標，通常與 `x + width` 相同。

<img src="/img/content/webApi-20/rect.png" style="max-width: 600px;" />

<br/>

- **ResizeObserverEntry.borderBoxSize**
  這個屬性會是一個陣列，而陣列中會是一個或多個 borderBoxSize 物件，該物件中又會有兩個屬性：

  - **blockSize**： 這個屬性的值會是一個數值，該數值通常代表元素的高，會說通常是因為，這取決於元素被設定的書寫方向，`blockSize` 代表的是「垂直」於書寫方向的元素邊長尺寸(單位:px)。

  - **inlineSize**： 而 `inlineSize` 剛好相反，它代表的是「平行」於書寫方向的元素邊長尺寸(單位:px)。

<br/>

- **ResizeObserverEntry.contentBoxSize**
  這個屬性會是一個陣列，而陣列中會是一個或多個 contentBoxSize 物件，而物件中一樣會有兩個屬性，其實跟 borderBoxSize 物件是一樣的，但是兩者的差別在於尺寸的計算方式，borderBoxSize 是依照 `border-box` 的方式計算，contentBoxSize 則是依 `content-box` 進行計算。

  - **blockSize**： 「垂直」於書寫方向的元素邊長尺寸(單位:px)。

  - **inlineSize**： 「平行」於書寫方向的元素邊長尺寸(單位:px)。

<img src="/img/content/webApi-20/box.png" style="max-width: 600px;" />

以上這些資訊我們都可以在 Callback 中取得，想要做任何判斷或計算都是非常方便，所以大家可以根據需求去決定需要利用的資訊有哪些。

```javascript
const observer = new ResizeObserver(function (entries) {
  entries.forEach((entry) => {
    const target = entry.target;
    const borderBox = entry.borderBoxSize[0];
    console.log(`${target.id} 寬度: ${borderBox.inlineSize} 高度: ${borderBox.blockSize}`);
  });
});
```

<br/>

相比 MutationObserver，ResizeObserver 的使用情境就比較多了，因為今天元素的變動會受到很多因素影響，且大部分都不是我們可以完全預測掌控的，例如視窗大小的壓縮、元素內容的增加/減少、RWD 的控制的等等，這時就可以透過 ResizeObserver 來監測元素的大小，並做出相對應的動作。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10278080) -
