---
title: 那些被忽略但很好用的 Web API / Console
date: 2021/9/15 09:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 雖然一招 `console.log` 就能打遍天下無敵手，但你其實有更好的選擇。

我知道我知道，這次的主題是「被忽略」的 Web API，Console 顯然不會是那個被大家忽略的，它可是各位 debug 的好夥伴，但你知道 Console 底下其實可不是只有 `console.log` 而已，還有很多更方便的 API 可以使用。

---

## Console

Console 這個物件提供了我們操作瀏覽器中除錯控制台（debugging console）的使用權，當按下 F12 後開啟瀏覽器的 Developers Tools，就可以看到 Console 面板，那就是除錯控制台啦。

而大家熟知的 `console.log` 就是在這個面板中打印出一筆紀錄訊息（log），但每當 Console 面板中的訊息五花八門越來越多時，就會常常眼花撩亂，反而阻礙我們進行除錯或開發，所以下面就介紹一些其實很好用但被使用度卻偏低的幾個 API。

<br/>

#### # console.count

顧名思義，`count` 當然是拿來計數的，每當我們呼叫一次 `console.count` 就會進行一次計數。

```javascript
console.count(); // default: 1
console.count(); // default: 2
console.count(); // default: 3
```

這樣的功能我偶爾會在開發 Vue 專案的時候，用在元件的 update 的生命週期裡，可以觀察看看元件在實際操作前是否有過多的異常更新。

另外可以發現上面印出的內容除了數字不斷增加之外，還多了一個 `default` 的字串，這是因為 `console.count` 可以傳入一個參數來區隔不同的計數器，而這個參數預設值為 `default`。

```javascript
console.count(); // default: 1
console.count("foo"); // foo: 1
console.count(); // default: 2
console.count("bar"); // bar: 1
console.count("foo"); // foo: 2
```

需要的話你還可以這麼做...

```javascript
let zoo = ["lion", "tiger", "zebra", "lion", "zebra"];
for (let i = 0; i < zoo.length; i++) {
  console.count(zoo[i]);
}
// lion: 1
// tiger: 1
// zebra: 1
// lion: 2
// zebra: 2
```

<br/>

#### # console.time / console.timeEnd

這一組 API 主要可以讓你得知一段程式片段執行的時間，當你呼叫 `console.time` 時，瀏覽器會開始幫我們計時，直到你呼叫 `console.timeEnd`，Console 面板便會打印出這兩個 API 被呼叫的的期間所花費的毫秒數。

```javascript
console.time();
setTimeout(() => {
  console.timeEnd();
}, 500);
// default: 505.10107421875 ms
```

其實透過上面這段程式碼就可以發現，`setTimeout` 其實並不是非常精準，只不過這樣的誤差可以省略不計，除此之外，`default` 字串又再次出現了，可想而知 `console.time` 是可以透過傳參來區隔計時器的。

```javascript
console.time("bar");
console.time("foo");
setTimeout(() => {
  console.timeEnd("bar");
}, 500);
setTimeout(() => {
  console.timeEnd("foo");
}, 1000);
// bar: 501.56689453125 ms
// foo: 1004.574951171875 ms
```

偶爾你可能會遇到同個問題有不同作法，也許你可以考慮看看用 `console.time` 和 `console.timeEnd` 來測試哪一種解決方案比較省時。

<br/>

#### # console.group / console.groupEnd

偶爾我們 `log` 出的訊息或資訊非常的多，一不小心就會迷失在 Console 面板中，尤其是在 `function` 層級很複雜的時候，一時半刻的也分辨不出哪些訊息是哪邊印出來的，那這組 API 就可以派上用場了。

```javascript
console.group("level_1"); // 開啟 group level_1
console.log("1-1"); // 在 level_1 中打印  1-1
console.group("level_2"); // 在 level_1 中開啟 group level_2
console.log("2-1"); // 在 level_2 中打印  2-1
console.group("level_3"); // 在 level_2 中開啟 group level_3
console.log("3-1"); // 在 level_3 中打印  3-1
console.groupEnd(); // 關閉 level_3
console.log("2-2"); // 在 level_2 中打印  2-2
console.groupEnd(); // 關閉 level_2
console.log("1-2"); // 在 level_1 中打印  1-2
```

<img src="/img/content/webapi-2/console-group.png" style="margin: 24px auto;" />

透過上面的程式碼打印出的結果就會像是這樣，當你開啟了一個 `group` 後，之後的打印內容都會歸類在該 `group` 底下，並且你可以進行收合，讓 Console 面板的訊息可以更乾淨更有系統。例如下面這段程式碼，相比直接印出來，在前後進行 `group` 的操作，應該是更能看出程式順序。

```javascript
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 3; j++) {
    console.log(j);
  }
}
// this is better
for (let i = 1; i <= 3; i++) {
  console.group("level" + i);
  for (let j = 1; j <= 3; j++) {
    console.log(j);
  }
  console.groupEnd();
}
```

<img src="/img/content/webapi-2/console-group2.png" style="margin: 24px auto;" />

<br/>

#### # console.table

`table` 這個 API 好不好用可能要看情境或因人而異，它主要的功能是可以將陣列或物件打印成一個表格，讓你在觀看時可以更一目了然。

```javascript
let badminton_scoring = {
  taiwan: 21,
  china: 12,
};
console.table(badminton_scoring);
```

<img src="/img/content/webapi-2/console-table.png" style="margin: 24px auto;" />

```javascript
let olympics = [
  ["gold", 2],
  ["silver", 4],
  ["copper", 6],
];
console.table(olympics);
```

<img src="/img/content/webapi-2/console-table2.png" style="margin: 24px auto;" />

可以看到，利用 `console.table` 把陣列或物件打印就會是上面這樣的效果，另外要提的是，如果你打印的不是陣列或物件，那 `console.table` 就跟 `console.log` 沒有什麼不同。

我個人認為，這個 API 比較適合剛接觸程式語言的朋友，如果你對陣列或物件還不太了解，利用 `console.table` 把他們印出來，說不定能讓你更好理解。

<br/>

不曉得各位是否有使用過這些 API 的經驗呢？如果還沒有，或許之後當你想要 `console.log` 的時候，可以再多想幾秒鐘，上面這些 API 說不定是你更好的選擇。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10265898) -
