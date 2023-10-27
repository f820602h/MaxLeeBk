---
title: 那些被忽略但很好用的 Web API / Animation On Scroll
date: 2021/10/6 22:35:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 學以致用是最快樂的事情

昨天我們認識了 IntersectionObserver，知道它可以偵測到元素進入畫面的時機，而這個特性非常適合用來製作 Animation On Scroll 的捲動動畫效果，像是 [AOS](https://michalsnik.github.io/aos/) 就是一個很經典的套件，雖然 AOS 其實不是用 IntersectionObserver 實踐的，但我們可以嘗試做出類似效果的工具。

---

## 設計概念

#### # 確立需求與功能

1. 既然是工具，就代表要幫我們簡化一些繁複的動作
2. 這個工具需要在元素進入可視窗口時，進行指定樣式的變化
3. 除了樣式變化，還希望可以設定 Callback，讓我們做一些額外的操作

<br/>

#### # 機制規劃與設計

**1. 既然是工具，就代表要幫我們簡化一些繁複的動作**
在使用 IntersectionObserver 時，總是要進行的動作就是要建立實體然後註冊目標元素，我希望可以只用一個指令就處理完這些事。這個需求應該可以包裝一個「建構函式」來處理。

<br/>

**2. 這個工具需要偵測到元素進入可視窗口時，進行指定樣式的變化**
偵測元素的部分 IntersectionObserver 會幫我們處理，而元素的樣式變化最快的方式就是利用 `class` 的增減了，但用 `class` 可能會有撞名的風險，所以我們改用 `data-*` 屬性好了。而且改變屬性這件事應該由工具處理，而不是我們都要寫一遍。

<br/>

**3. 除了樣式變化，還希望可以設定 Callback，讓我們做一些額外的操作**
由於在第一點已經決定設計一個「建構函式」來幫我們創建 IntersectionObserver 實體，那原本在創建時該傳入的 Callback Function 和 options 物件就必須要先提供給「建構函式」，它才能幫我們建立實體。

<br/>

## 開始實踐

#### # 元素的樣式變換機制

整理完需求及機制後，就來開始動手吧，首先是為了讓元素可以透過 `data-*` 屬性的變化來轉換樣式，所以為想要有動畫效果的元素加上 `data-appear="hide"`，表示元素還沒進入畫面，未來只要把 `data-appear` 改成 `show` ，元素就會有樣式的變化。

```html
<div class="box" data-appear="hide"></div>
```

```css
.box {
  width: 500px;
  height: 500px;
  transition: 0.3s;
}
.box[data-appear="hide"] {
  background: white;
}
.box[data-appear="show"] {
  background: pink;
}
```

<br/>

#### # 自動建立實體與註冊元素

再來程式部分，先宣告一個叫做 `Appear` 建構函式，其中會有一個函式 `init`，要用來創建 IntersectionObserver 實體以及註冊要觀察的元素，未來只要執行 `appear.init()` 一行就搞定了，而且因為已經確定只要有 `data-appear` 屬性的元素就是要觀察的對象，所以直接全部抓出來註冊即可。

```javascript
const Appear = function () {
  this.init = function (callback, options) {
    this.observer = new IntersectionObserver(callback, options);

    const container = options.root || document;
    const targetList = container.querySelectorAll("[data-appear]");
    targetList.forEach((el) => {
      this.observer.observe(el);
    });
  };
};
const appear = new Appear();
```

<br/>

#### # Callback 包裝與元素屬性切換

前面有說，工具需要自動改變元素的 `data-appear` 屬性，而不是由我們手動寫在 Callback 中，所以看來傳入 `init` 的 `callback` 參數不能直接放到 IntersectionObserver 中，需要另外在包裝一次。

包裝後的 Callback 就可以在元素進出畫面時進行 `data-appear` 屬性的調整了，另外我們也將 `entry.target` 和改變後的狀態傳進 `init` 的 `callback` 中，讓使用工具的人可以取得額外資訊。

```javascript
const Appear = function () {
  this.init = function (callback, options) {
    // IntersectionObserver 要觸發的 Callback Function
    const obCallback = function (entries) {
      entries.forEach((entry) => {
        // 取得元素進入當下的狀態
        let state = entry.target.getAttribute("data-appear");

        if (state === "hide" && entry.isIntersecting) {
          // 從 hide 的狀態下進到畫面時...
          state = "show";
          entry.target.setAttribute("data-appear", state);
          callback(entry.target, state);
        } else if (state === "show" && !entry.isIntersecting) {
          // 從 show 的狀態下離開畫面時...
          state = "hide";
          entry.target.setAttribute("data-appear", state);
          callback(entry.target, state);
        }
      });
    };

    this.observer = new IntersectionObserver(obCallback, options);

    const container = options.root || document;
    const targetList = container.querySelectorAll("[data-appear]");
    targetList.forEach((el) => {
      this.observer.observe(el);
    });
  };
};
const appear = new Appear();
```

<br/>

#### # 自定義的函式參數

再來其實我覺得原本 IntersectionObserver 的 `options` 參數設定有點不是很容易懂，所以我們自己設計一個新的物件做為 `init` 的參數設定，以下是它的屬性名稱及預設值，順便也把 `callback` 一起放進去了：

```javascript
const defaultOptions = {
  container: null,
  offsetTop: 0,
  offsetRight: 0,
  offsetBottom: 0,
  offsetLeft: 0,
  threshold: 0,
  callback: function () {},
};
```

這樣在使用工具的人只要傳一個參數到 `init` 中就好，而且屬性名稱也比較好了解，傳進去後只要在 `init` 內部再轉換成原本 IntersectionObserver 接受的格式即可。

```javascript
const Appear = function () {
  this.init = function (userOptions) {
    const options = { ...defaultOptions, ...userOptions };
    const obOptions = {
      root: options.container,
      rootMargin: [
        `${options.offsetTop}px`,
        `${options.offsetRight}px`,
        `${options.offsetBottom}px`,
        `${options.offsetLeft}px`,
      ].join(" "),
      threshold: options.threshold,
    };
    //...其他省略
    this.observer = new IntersectionObserver(obCallback, obOptions);
  };
};
const appear = new Appear();
```

<br/>

#### # 防呆機制與註銷

最後為了避免有人重複執行 `init`，我們在最前面進行判斷來阻擋，額外也可以再做一個關閉 IntersectionObserver 的功能：

```javascript
const Appear = function () {
  this.init = function (userOptions) {
    if (this.observer) return;
    //...其他省略
  };
  // 註銷所有觀察元素並釋放 observer
  this.destroy = function () {
    if (!this.observer) return;
    this.observer.disconnect();
    this.observer = null;
  };
};
const appear = new Appear();
```

<br/>

## 實際使用

以上的 JS 程式碼我們可以包成一支 `appear.js` 檔案，只要未來有專案需要使用時直接引入並且呼叫 `init` 就可以了：

```html
<style>
  .box {
    width: 500px;
    height: 500px;
    margin: 30px auto;
    transition: 0.3s;
  }
  .box[data-appear="hide"] {
    background: white;
  }
  .box[data-appear="show"] {
    background: pink;
  }
</style>

<div class="box" data-appear="hide"></div>
<div class="box" data-appear="hide"></div>
<div class="box" data-appear="hide"></div>

<script src="appear.js"></script>
<script>
  appear.init({
    threshold: 0.5,
    callback: function (target, state) {
      console.log(target, state);
    },
  });
</script>
```

<img src="/img/content/webapi-23/result.gif" style="max-width: 800px;" />

<br/>

這樣的工具是不是非常實用呢？而且能夠自己做出一個以後也能夠不斷使用的小套件真的是非常有成就感，有興趣的小夥伴們也可以發揮自己的創新，把這個小工具不斷的擴充，增加新功能喔。完整原始碼，我就放在 CodePen，文章中如果有不清楚的，可以再去看看。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10279479) -
