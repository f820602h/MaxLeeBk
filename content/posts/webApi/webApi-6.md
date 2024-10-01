---
title: 那些被忽略但很好用的 Web API / Battery
date: 2021/9/19 14:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 低電量～低～低～電量～ 呂士軒-低電量

今天要分享的也是一個使用情境偏少的 API，但如果你有想要做移動端的應用的話，或許可以嘗試使用看看。

---

## Battery

Battery API 是一個與使用者的裝置電池相關的 API，我們可以透過它來得知電池的相關資訊，也可以監聽電量的變化，以此來做到一些提示或警告的功能效果。

<br/>

#### # Navigator.getBattery

裝置電池的資訊會被包裹在一個叫做 BatteryManager 的物件中，要取得該物件的話，我們必須要透過呼叫 `navigator.getBattery` 來取得：

```javascript
navigator.getBattery().then((battery) => {
  console.log(battery); // BatteryManager
});
```

可以看到，呼叫後 `getBattery` 回傳的是 Promise，其被 `resolve` 後才會傳遞 BatteryManager 給我們，所以我們要用 `then` 去串接取得。

<br/>

#### # BatteryManager

取得 BatteryManager 後，我們就可以看到裡面會有四個比較重要的屬性：

```javascript
{
  charging: true,             // 是否正在充電
  chargingTime: 2940,         // 多少時間會滿電（單位：秒）
  dischargingTime: Infinity,  // 多少時間會沒電（單位：秒）
  level: 0.86                 // 目前的電量 （乘上100，即為百分比）
}
```

其中比較特別的是 `chargingTime` 和 `dischargingTime`，若是目前裝置正在充電，那 `dischargingTime` 必為 `Infinity`，反之為充電時 `chargingTime` 必為 `Infinity`。

而除了上面這四個屬性之外呢，你還會看到四個事件屬性，讓你可以監聽不同的電量事件：

```javascript
{
  onchargingchange: null,         // 監聽充電狀態
  onchargingtimechange: null,     // 監聽滿電時間
  ondischargingtimechange: null,  // 監聽沒電時間
  onlevelchange: null             // 監聽電量
}
```

只要像下面這樣撰寫的話就可以在電池狀態有變更的時候觸發 Callback:

```javascript
navigator.getBattery().then(battery =>  {
  battery.onchargingchange = function() {
    console.log(this.level)
  }
  // 或是這樣寫也可以
  battery.addEventListener("chargingchange", function {
    console.log(this.level)
  })
});
```

<br/>

接下來我們只要透過以上這些屬性就可以做到這樣的一個小應用：

```html
<div class="battery-level"></div>
<div class="battery-wrap"></div>
```

```javascript
const batteryLevel = document.querySelector(".battery-level");
const batteryWrap = document.querySelector(".battery-wrap");

navigator.getBattery().then((battery) => {
  const count = Math.floor(battery.level / 0.2);
  const callback = function () {
    batteryLevel.textContent = battery.level * 100 + "%";
    batteryWrap.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const batteryLevel = document.createElement("div");
      batteryLevel.setAttribute("class", "battery");
      batteryWrap.appendChild(batteryLevel);
    }
  };
  battery.onlevelchange = callback;
  callback();
});
```

<img src="/img/content/webApi-6/battery.png" style="margin: 24px auto;" />

<br/>

雖然 Battery API 並不是非常重要的功能，但其實瀏覽器能夠實作出來讓我們使用也是蠻方便的，畢竟要如何應用就要看大家的創意發揮，總比我們有想法卻沒有工具實踐來得好。習得 Battery API 後，你有什麼應用它的 idea 嗎？

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10269328) -
