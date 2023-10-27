---
title: 那些被忽略但很好用的 Web API / RequestAnimationFrame
date: 2021/9/17 21:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 別再用 `setTimeOut`、`setInterval` 寫動畫啦！

如果你有用 js 寫過動畫，那通常你第一個想到的絕對會是 `setTimeOut` 或 `setInterval`，讓畫面元素可以在固定的時間間隔進行一點一點的變化，如此就可以形成動畫的效果。但其實這兩個計時器其實都有一些不為人知的小缺點，而今天要介紹的 RequestAnimationFrame 可以讓你不需要擔心這些。

---

## RequestAnimationFrame

在正式介紹 RequestAnimationFrame 之前我們要先來了解一些相關概念以及 `setTimeOut` 和 `setInterval` 到底有什麼缺點。

<br/>

#### # 螢幕更新頻率

大家應該知道，其實動畫就是一連串的靜態畫面以一定的頻率連續顯示，讓人的眼睛及大腦可以腦部成一個動態過程，而這個「一定的頻率」到底是多少呢？以現在這個影音世代來說，每秒六十張影格是一個可以讓動畫看起來最順暢的。

只也就是為什麼現代螢幕的畫面更新率至少都有 60Hz (每秒 60 幀)，當然了，不同的設備、網路環境等因素的影響，螢幕更新率不會都是 60Hz。

<br/>

#### # setTimeOut

如果依照每秒 60 幀的需求來使用 `setTimeOut` 來撰寫動畫的話，大致上都會是這樣寫的：

```javascript
let timerID;
const figure = document.querySelector("#figure");
function moveFigure() {
  figure.style.left = figure.offsetLeft + 5 + "px";
  timerID = setTimeout(moveFigure, 1000 / 60);
}
moveFigure(); // 動畫開始
clearTimeout(timerID); // 動畫停止
```

我們透過遞迴的方式不斷的呼叫 `setTimeout` 來幫我們移動元素，而 `1000 / 60` 就是用來模擬 60Hz 的頻率的。不過使用這樣的方法會有以下缺點。

**1. Callback 執行通常會晚一點**
由於 `setTimeout` 中的 callback 要等到計時完成後才會被放到佇列（queue）中等待執行，這時候如果堆疊中（stack）還有其他工作項目的話，就必須要等待一些額外的時間才會執行。如果想知道更多細節的話，可以去了解 Event Loop。

**2. 與螢幕更新頻率對應不上**
前面說過，很多因素都會影響螢幕更新率，所以他是一個浮動的頻率，但 `setTimeout` 只能設定固定頻率，這時候如果跟更新率對應不上，可能動畫就會掉幀的可能。

<br/>

#### # setInterval

相比 `setTimeOut` ，可能更多人會用 `setInterval`，因為它自己就可以不斷重複執行 callback，不用搞什麼遞迴：

```javascript
const figure = document.querySelector("#figure");
function moveFigure() {
  figure.style.left = figure.offsetLeft + 5 + "px";
}
let timerID = setInterval(moveFigure, 1000 / 60);
moveFigure(); // 動畫開始
clearInterval(timerID); // 動畫停止
```

其實除了第一次執行時也會延遲之外，與 `setTimeOut` 效果沒什麼太大差別，所以想當然的 `setTimeOut` 有的缺點它也都有，而且還額外多了幾個：

**1. 忽略錯誤**
非常可怕的缺點，儘管你的 Callback 已經發生壞掉了，`setInterval` 也會義無反顧地執行下去。

**2. Callback 有可能被取消**
前面有說過當計時完成後 callback 會被放進佇列中，當堆疊空閒時就會被抓出來執行，但要堆疊特別繁忙時，也是有可能連第一次的 callback 都還沒被執行，第二次的 callback 就又被放進佇列了，這時候等堆疊空閒時，兩次 callback 就會幾乎同時執行。

```javascript
// 堆疊再在處理其他函式
stack = ["其他工作項目"];
queue = [];
// 第一次的 setInterval 觸發
stack = ["其他工作項目"];
queue = ["第一次 callback"];
// 第二次的 setInterval 觸發
stack = ["其他工作項目"];
queue = ["第一次 callback", "第二次 callback"];
// 堆疊空閒了，這時候第一次 callback 會被執行，第二次則緊跟在後。
stack = ["第一次 callback"];
queue = ["第二次 callback"];
```

為了防止這樣的情發生，其實 JS 引擎會在佇列已經有該 SetInterval 的 Callback 的時候，把後面這一次的 Callback 給取消掉。

<br/>

#### # RequestAnimationFrame

但如果使用今天的主角 RequestAnimationFrame 來製作動畫，那上述缺點就通通沒有了，因為它會自動與螢幕的更新頻率同步，以此來避免掉幀的問題。

```javascript
let requestID;
const figure = document.querySelector("#figure");
function moveFigure() {
  figure.style.left = figure.offsetLeft + 5 + "px";
  requestID = requestAnimationFrame(moveFigure, 1000 / 60);
}
moveFigure(); // 動畫開始
cancelAnimationFrame(requestID); // 動畫停止
```

<br/>

如果大家有興趣的話，可以把我們今天的三段 code 拿去試試看，我個人是可以感受到非常明顯的滑順感落差，RequestAnimationFrame 所製作出來的動畫在視覺上會比較舒服。如果你也有同感的話，你可以開始考慮使用它了！

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10267420) -
