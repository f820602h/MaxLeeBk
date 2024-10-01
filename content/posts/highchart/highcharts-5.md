---
title: 資視就是力量 - Highcharts / 說明文字設定
date: 2020/9/19 11:00:00
tags: [JavaScript,Highcharts,12th鐵人賽]
description: Highcharts 是一套純 JavaScript 的圖表庫，採用 SVG 渲染。不過似乎是使用人數較少的關係，國內的相關文章寥寥可數，加上官方文件的中翻文本也是較舊的版號，所以這次希望能以一個使用過 Highcharts 的開發者角度來跟各位介紹它，希望以我的使用經驗可以讓大家認識 Highcharts 的強大功能與應用，那就先來看看它的優點與特性吧！
---

> 本章節範例：**https://codepen.io/max-lee/pen/BaKwdyN**
> 避免文章篇幅過長，沒辦法每個屬性都利用圖片示意，所以記得善用範例來測試不太了解的屬性。

雖然大家可能都會把圖表的重點放在「圖」上，但有時候文字可以讓觀看者更快速抓的到圖表主題或是引導觀看者發覺背後含義，而今天要介紹的就是這些文字性的圖表元素。

---

## 主標題設定

主標題可以點出圖表所呈現的資料主題，甚至有些圖表如果沒有標題，你都未必知道它在呈現什麼資料，所以主標題算是圖表中非常重要的說明文字。

```javascript
var myChart = Highcharts.chart(container, {
  title: {} // 主標題設定
});
```

<br/>

#### # title.text

`型別: String|null` `預設: "Chart title"`

標題內容是由 `text` 屬性做設定的，要注意的是，就算沒有設定還是會有 `Chart title` 這樣的預設文字，所以要是不想用 Highcharts 提供的標題，記得把它設為 `null`。

:exclamation: **提醒：**在字串裡是可以加上 `<a>`、`<span>`、`<em>`、`<strong>`、`<br/>` 等..行內標籤的。

<br/>

#### # title.style

`型別: Object` `預設: { "color": "#333333", "fontSize": "18px" }`

標題的樣式可以透過這個屬性來調整，設定方式其實跟 CSS 差不多，只不過是物件的形式，並且樣式的屬性名稱要用小駝峰的方式撰寫，再者是並非所有的 CSS 屬性都支援，下面我就示意幾個比較常見的。

如果要知道所有屬性的話可以到 **https://api.highcharts.com/class-reference/Highcharts.CSSObject**

```javascript
title: {
  style: {
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "right",
    color: "#292929",
    padding: "8px"
  }
}
```

<br/>

#### # title.useHTML

`型別: Boolean` `預設: false`

這個屬性比較特殊，由於 Highcharts 是採用 SVG 進行圖表繪製，標題這種文字元素會用 SVG 的 `text` 標籤去包裹，所以你在 `title.text` 撰寫的行內標籤以及 `title.style` 的設定最後都是以 SVG 呈現的。

這本身並沒有什麼問題，但有時候 SVG 的呈現效果未必是你要的，所以如果你希望 Highcharts 幫你把標題部分換成你熟悉的 HTML 標籤的話，你可以開啟這個選項。

![](/img/content/highcharts-5/useHTML.png)

<br/>

#### # title.align

`型別: String` `預設: "center"`

此屬性可以調整標題的水平位置，合法的值有 `left`、`center`、`right`，預設則是置中。

:exclamation: **提醒：**`align` 調整的是「在圖表上的位置」，與 `style.textAlign` 是不同的。

<br/>

#### # title.verticalAlign

`型別: String` `預設: undefined`

與 `align` 相對的是 `verticalAlign`，你可以用 `top`、`middle`、`bottom` 決定標題的垂直位置。

<br/>

#### # title.floating

`型別: Boolean` `預設: false`

這個屬性會讓標題文字浮動在圖表之上，當你開啟這個設定時，`chart.margin` 的預設值會自動忽略標題，這會使標題蓋在圖表上。

同時你依然可以用 `align` 或 `verticalAlign` 調整位置，雖然很有可能會跟其他圖表元素重疊就是了。

![](/img/content/highcharts-5/float.png)

<br/>

#### # title.x / title.y

`型別: Number` `預設: 0`

如果前面的 `floating` 效果不如預期，讓你覺得很雞肋的話，那是因為我們還沒提到 `x` 和 `y`，這兩個屬性可以讓你微調標題的水平與垂直偏移，這樣你就可以隨心所欲的調整標題位置了。

:exclamation: **提醒：**`x` 和 `y` 不一定要跟 `floating` 一起使用。

<br/>

#### # title.margin

`型別: Number` `預設: 15`

這個屬性可以調整標題與繪圖區 (plot) 的間距，如果圖表有副標題的話則是標題與副標題的間距，有趣的是它只有在 `verticalAlign` 是 `top` 的時候才有效。

---

## 副標題設定

<br/>

副標題可以用來補充說明主標題的主旨，預設是沒有副標題的，而它的屬性幾乎跟主標題一樣，只有以下設定只有預設值不同而已。

```javascript
var myChart = Highcharts.chart(container, {
  subtitle: {} // 副標題設定
});
```

<br/>

#### # subtitle.style
`型別: Object` `預設: { "color": "#666666" }`

<br/>

#### ~~# subtitle.margin~~
副標題沒有 `margin` 屬性。


---

## 圖表說明設定

圖表說明可以詳細說明圖表的內容或是資料來源等等內容，它的屬性也是預設值跟主標題稍微不一樣而已。

```javascript
var myChart = Highcharts.chart(container, {
  caption: {} // 圖表說明設定
});
```

<br/>

#### # caption.style
`型別: Object` `預設: { "color": "#666666" }`

<br/>

#### # caption.align
`型別: String` `預設: "left"`

<br/>

#### # caption.verticalAlign
`型別: String` `預設: "bottom"`

---

## 版權標籤設定

版權標籤預設是在圖表的右下角，主要用意是要展現 Highcharts 的版權所有，不過因為 Highcharts 是可以非商業免費使用的，所以如果你的網站沒有營利，拿掉是沒有關係的。

或是有需要的話你也可以利用這個位置來說明圖表的資料來源、呈現自己網站的網址名稱等等。

```javascript
var myChart = Highcharts.chart(container, {
  credits: {} // 版權標籤設定
});
```
<br/>

#### # credits.enabled

`型別: Boolean` `預設: true`

你可透過這個屬性簡單的開/關版權標籤．預設是打開的。

<br/>

#### # credits.text

`型別: String|null` `預設: "Highcharts.com"`

用法與前面的主標題、副標題都一樣，也是支援行內標籤的。

<br/>

#### # credits.href

`型別: String|null` `預設: "https://www.highcharts.com?credits"`

這個屬性可以讓版權標籤設定連結，等同一個 `<a>` 標籤，如果不想要連結就設為 `null`。

<br/>

#### # credits.style

`型別: Object` `預設: { color: "#999999", cursor: "pointer", fontSize: "9px" }`

用法與前面都一樣，唯有預設值不同。

<br/>

#### # credits.position

`型別: Object` `預設: 如下顯示`

```javascript
credits: {
  position: {
    align: "right",
    verticalAlign: "bottom",
    x: -10,
    y: -5
  }
}
```

其實可以發現 `credits.position` 只是將前面看過的 `align`、`verticalAlign`、`x`、`y` 包裝成一個物件而已，而它們分別的用法也都跟前面介紹的一模一樣。

<br/>

<img src="/img/content/highcharts-5/textOption.png" style="max-width: 600px;" />

那今天的最後就附上一個有標題、說明、版權標籤的 **[案例](https://codepen.io/max-lee/pen/NWNwZoZ)** 來做 Ending，而明天要介紹的圖表元素是「圖例」。



---

\- 此篇文章為「iT邦幫忙鐵人賽」參賽文章，同步發表於 [iT邦幫忙](https://ithelp.ithome.com.tw/articles/10239473) -
