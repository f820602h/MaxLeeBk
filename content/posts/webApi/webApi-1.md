---
title: 那些被忽略但很好用的 Web API / 前言
date: 2021/9/14 09:29:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> Web API -- Application Programming Interface for The Web，翻譯成中文就是「給網頁使用的應用程序介面」

相信對於開發網頁的前端工程師來說，Web API 是在熟悉不過，就算你沒聽過或不曉得 Web API 是什麼，你也絕對使用過它。

舉幾個例子：`console.log`、`setTimeOut`、`setInterval`，這些其實都是所謂的 Web API，它們並非是 JavaScript 的原生 method。

---

## Web API 到底是什麼？

剛剛上面提到的常用 method，它們其實來自於 `window` 這個全域物件，實際上你使用的是 `window.console.log`，只不過 `window` 是被允許省略的。而這個神奇的 `window` 其實是由瀏覽器提供給我們的，連平常我們常常使用的 `document` 物件也是所屬於 `window` 底下，如果你有寫過 Node.js 的話，就可以確認我說的是真的，因為在 Node.js 的環境下是找不到 `window`，取而代之的是 `global` 物件。

而這次的系列文章就是想要介紹那些深埋在 `window` 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。

<img src="/img/content/webApi-1/web-api.png" style="max-width: 500px;" />

#### # 尷尬的痛點

由於 `window` 是瀏覽器提供給我們的，所以當中的內容完全取決於使用者所使用的瀏覽器。不幸的是，Web API 其實必沒有被統一標準化，有些甚至還在實踐階段，或是有一些還有裝置的限制，也因為如此，並非所有瀏覽器都會把全部的 Web API 實踐出來，所以在我們使用之前可以先去看看 **[瀏覽器的支援度](https://caniuse.com/)** 。

---

## 系列內容

如果要細數的話 Web API 其實以上千個，不過我們常用的卻不多，因為其實有一大部分的 API 並沒有什麼實際功能性，不過呢，這次想跟各位分享的是一些非常實用但使用度缺相對較低的 Web API。

另外想要聲明的事，有些 Web API 比較龐大複雜，大到可以單獨寫成一個新的系列文章了，像是 Canvas、WebSocket..等等，而這些就不會是我們系列文章的範疇，這次會分享的是一些比較間單，大家可以快速上手使用的內容。

<br/>

1. Console
2. CreateDocumentFragment
3. RequestAnimationFrame
4. FullScreen
5. Battery
6. ImageCapture
7. DesignMode
8. Selection
9. Clipboard
10. History
11. SessionStorage
12. CustomEvent
13. PostMessage
14. MessageChannel
15. BroadcastChannel
16. RequestIdleCallback
17. MutationObserver
18. ResizeObserver
19. GetBoundingClientRect
20. IntersectionObserver
21. ScrollIntoView
22. Drag & Drop
23. Share
24. Notification
25. Geolocation

<br/>

以上這些 Web API 就會在我們這次的系列文章中介紹到，部分 API 也還會再額外拉一個篇章來示範一些實際應用，讓大家可以更了解到它們的實際作用與功能。那接下來的三十天就期待與大家一起挖掘 「那些被忽略但很好用的 Web API」囉～

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10265151) -
