---
title: 差點被當塑膠的 Web API / BroadcastChannel
date: 2021/9/30 22:32:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 里長辦公室廣播：張君雅小妹妹，恁兜欸泡麵已經煮好了！

前兩天已經認識了 PostMessage 和建立專屬頻道的 MessageChannel，它們都是進行點對點的溝通，但如果想要一次跟多個頁面溝通時怎麼辦了，這時 BroadcastChannel 就能派上用場了。

---

## BroadcastChannel

BroadcastChannel 就如同一個無線對講機系統，訊息是播放在一個廣播頻道中，任何頁面只要取得頻道的頻率就可以在無線電中發送／接收訊息。

<br/>

#### # 建立頻道

和 `MessageChannel` 一樣，`BroadcastChannel` 本身也是一個 `Class`，只要透過關鍵字 `new` 就能建立一個廣播頻道，不過這次我們要傳入一個字串來當作廣播頻道的名稱，未來其他頁面才能藉由同樣的字串來進入頻道。

```javascript
const channel = new BroadcastChannel("max_channel");
```

接著只要透過我們建立的廣播頻道送出訊息即可：

```javascript
const channel = new BroadcastChannel("max_channel");
channel.postMessage("你已成功加入頻道!", location.origin);
```

要收到訊息的話就用 BroadcastChannel 監聽 `message` 即可：

```javascript
const channel = new BroadcastChannel("max_channel");
channel.onmessage = function (event) {
  console.log(event.data);
};
```

<br/>

#### # 頻道溝通

這時候其他頁面只要使用同樣的頻道名稱建立一個 BroadcastChannel，並且一樣透過該頻道來傳送／接收訊息，這樣所有頻道中的頁面就都可以相互溝通了。

```html
<!-- 這裡是 main.html -->
<button onclick="sendMessage()">send message</button>
<iframe src="pageA.html" width="480" height="120"></iframe>
<iframe src="pageB.html" width="480" height="120"></iframe>
<script>
  const channel = new BroadcastChannel("max_channel");
  channel.onmessage = function (event) {
    console.log(event.data);
  };
  function sendMessage() {
    channel.postMessage("你已成功加入頻道!", location.origin);
  }
</script>
```

```html
<!-- 這裡是 pageA.html -->
<button onclick="sendMessage()">send message</button>
<div class="output">pageA content</div>
<script>
  const output = document.querySelector(".output");
  const channel = new BroadcastChannel("max_channel");
  channel.onmessage = function (event) {
    const output = document.querySelector(".output");
    output.innerHTML = event.data;
  };
  function sendMessage() {
    channel.postMessage("pageA 發送訊息！", location.origin);
  }
</script>
```

```html
<!-- 這裡是 pageB.html -->
<button onclick="sendMessage()">send message</button>
<div class="output">pageB content</div>
<script>
  const channel = new BroadcastChannel("max_channel");
  channel.onmessage = function (event) {
    const output = document.querySelector(".output");
    output.innerHTML = event.data;
  };
  function sendMessage() {
    channel.postMessage("pageB 發送訊息！", location.origin);
  }
</script>
```

<img src="/img/content/webApi-17/broadcast.gif" style="margin: 24px auto;" />

<br/>

#### # 頻道名稱

不過上面這樣的範例，會有一個令人詬病的地方，就是「頻道名稱」的同步問題，要是有其中某個頁面打錯頻道名稱，那就會連不上頻道。或是如果想要更換頻道名稱的時候，就必須大家一起改，似乎是又點不太方便。

所以在主頁面建立頻道後，其實可以先用一般的 `postMessage` 將頻道名稱傳給需要的頁面：

```html
<iframe src="pageA.html" width="480" height="120"></iframe>
<iframe src="pageB.html" width="480" height="120"></iframe>
<script>
  const allIframe = document.querySelectorAll("iframe");
  const channel = new BroadcastChannel("max_channel");

  // 發送頻道名稱
  allIframe.forEach((iframe) => {
    iframe.addEventListener("load", function () {
      this.contentWindow.postMessage(channel.name, location.origin);
    });
  });

  channel.onmessage = function (event) {
    console.log(event.data);
  };
</script>
```

```html
<!-- 這裡是 pageA.html -->
<div class="output">pageA content</div>
<script>
  let channel;
  window.addEventListener("message", function (event) {
    if (event.origin !== location.origin) return;
    channel = new BroadcastChannel(event.data);

    channel.onmessage = function (bc_event) {
      const output = document.querySelector(".output");
      output.innerHTML = event.data;
    };

    channel.postMessage("pageA 加入頻道", location.origin);
  });
</script>
```

```html
<!-- 這裡是 pageB.html -->
<div class="output">pageB content</div>
<script>
  let channel;
  window.addEventListener("message", function (event) {
    if (event.origin !== location.origin) return;
    channel = new BroadcastChannel(event.data);

    channel.onmessage = function (bc_event) {
      const output = document.querySelector(".output");
      output.innerHTML = event.data;
    };

    channel.postMessage("pageB 加入頻道", location.origin);
  });
</script>
```

> 補充：如果有頁面想要與廣播頻道斷開連結的話，只要拿建立的頻道執行 `close()` 即可，關閉後頻道還是存在，只是該頁面不再接收頻道的訊息。

<br/>

這三天我們已經完全認識了 PostMessage，了解到它不但可以傳送訊息，還可以建立私訊或群組的通訊模式，而這項技術其實時常會用在 [Web Worker](https://developer.mozilla.org/zh-TW/docs/Web/API/Web_Workers_API/Using_web_workers) 中，但因為它的範疇有點龐大，所以這次的系列文章不會介紹到，有興趣的朋友可以再自行研究～

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10276437) -
