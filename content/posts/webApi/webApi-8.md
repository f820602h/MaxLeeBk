---
title: 那些被忽略但很好用的 Web API / DesignMode
date: 2021/9/21 21:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> DesignMode 讓整個網站都是你的 textarea。

今天要介紹的 API 非常簡單明瞭，簡單到有點偷懶的嫌疑了，但其實等我們連同後面兩天的內容介紹完後，今天的 DesignMode 才可以發揮它的真正實力，今天我們就先簡單暸解一下它的效果就好。

---

## DesignMode

DesignMode 翻譯成中文就是設計模式，但要設計什麼呢？設計整個網頁。你沒聽錯，DesignMode 的設定可以讓整個網頁變成一個網頁編輯器，使用者便可以隨心所欲的修改網站中的文字。

<br/>

#### # Document.designMode

今天最主要的 API 就這麼一個，也沒有什麼技巧可言，就是這麼一行簡單的 code：

```javascript
document.designMode = "on"; // 關閉則設定成 "off"
```

你可以試著打開 devTool 的 Console 面板並執行上面這段指令，你就會發現你能夠自由編輯目前畫面中的所有東西，剪下、貼上、刪除、新增等等都不是問題。但你可能會想：「這到底可以幹嘛？」。

其實 DesignMode 有一個最直覺的作用，那就是讓你在開發時可以進行更即時性的文案測試，你可以直接在網頁上進行文字編輯，而不是在開發環境中修改後再到頁面上確認。或許身為前端工程師的你會覺得這項功能有點雞肋，但如果你要跟設計師溝通，或設計師想要進行調整測試時，直接打開 DesignMode 就會非常方便。

<br/>

#### # iframe & designMode

另外，DesignMode 也不是只能運用在目前的頁面，你也可以針對頁面中的 iframe 來設定：

**◾ iframe.html**

```html
<h1>I am Max.</h1>
<p>DesignMode is very fun.</p>
```

<br/>

**◾ index.html**

```html
<iframe src="./iframe.html"></iframe>
<button onClick="getHtml()">Get HTML</button>
<script>
  window.onload = function () {
    const iframeDocument = document.querySelector("iframe").contentDocument;
    iframeDocument.designMode = "on";
  };

  function getHtml() {
    const iframeDocument = document.querySelector("iframe").contentDocument;
    console.log(iframeDocument.body.innerHTML);
  }
</script>
```

<img src="/img/content/webApi-8/design-mode.gif" style="margin: 24px auto;" />

當然了，你可能還是會問說這樣的效果可以做些什麼？但其實許多部落格或筆記網站能夠讓你在網頁中進行文字編輯，靠的就是 DesignMode，只不過它們通常都會搭配一些編輯工具，讓你可以將文字放大縮小、粗體斜體或設定顏色等等。

<br/>

## Contenteditable

既然剛剛講到了部落格和筆記網站，那我們就必須再額外介紹 Contenteditable，它擁有與 DesignMode 非常相像的功能，且比起 DesignMode，剛剛提到的網站可能更常用的是 Contenteditable，像是目前最火紅的 Notion 就是使用 Contenteditable。

不過 Contenteditable 其實並不是 Web API，它是 HTML5 中的一個全域屬性，只要在任何元素標籤中加上這個屬性，該元素中的內文就會變成可編輯的狀態。

```html
<div contenteditable="true">這裡的文字可以編輯</div>
```

<br/>

> textarea 本身就是一個可編輯文本的區域沒錯，但如果你想做到像部落格一樣有文字美編功能的話，textarea 是沒辦法達成的。

<br/>

其實我們已經在文章中點出了 DesignMode 的真實實力該如何發揮了，那就是透過一些手法，讓我們可以對編輯中的文字進行一些樣式的設定，如此以來 DesignMode 就會是名副其實的設計模式了。而這樣的工具，我們會在認識 Selection 與 Clipboard 之後，再來動手寫寫看。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10270710) -
