---
title: JS地下城 - 幸運輪盤
date: 2020/01/14 20:46:25
tags: [JavaScript,JS地下城]
description: 本篇為六角學院 - JS地下城攻略文，透過 JavaScript 製作一個簡易的幸運輪盤，讓使用者可以透過按鈕抽獎，並且可以設定獎品的數量、機率、獎品圖示等。
---
> 本篇為六角學院 - JS地下城攻略文　[Github](https://github.com/f820602h/Lucky-Wheel/)｜[Demo](https://f820602h.github.io/Lucky-Wheel/)

<br />

## 確認需求

* 根據資料產生畫面
* 抽獎機率需考慮獎項數量而非種類
* 輪盤指針的旋轉角度
* 抽中的獎品減少並不再被抽到

**這次比較需要思考的應該會是機率的計算以及指針旋轉的度數計算。**

---

## 解題攻略

### # 扇形切版

純 CSS 要做出扇型一直都是蠻麻煩的，網上其實都查得到很多作法，這邊提供我的結構以及樣式。
```html
<div class="fan"><div class="inner"></div></div>
```

```css
.fan {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)
}
.inner {
  width: 50%;
  height: 100%;
  background: #5858B9;
  transform-origin: right center;
  transform: rotate(60deg);
}
```

![](https://cdn-images-1.medium.com/max/2598/1*Ax_ixX4Hrwu2373gUrTgAw.jpeg)

我是使用 `clip-path` 搭配 `rotate` 來做到這樣的效果，旋轉幾度這個扇形就會是幾度，最後只要根據需求來跑相對應的迴圈次數，為 `.fan` 也加上 `rotate` 就可以將扇形拼成一個圓了。

<br />

### # 資料管理

網站其實就是一堆的資料的顯示與互動。以本題目為例，每年老闆都會提供一份「尾牙獎品清單」這樣的資料，而我們的工作便是確保畫面與資料的一致性，所以每當有獎品增減，我們都要去改動畫面並且確認功能沒有因此而壞掉，這樣其實是非常繁複沒有效率的，所以我們要設計成由「資料驅動畫面」，未來就算資料更動了，我們也不用特地去調整畫面。

首先要做的第一步就是資料管理，而一般網頁上最常見的資料格式就是 `JSON`，我們可以把獎品清單整理成以下格式：

```json
[
  {
    "text": "Movie",
    "icon": "<i class='material.icons'>movie_filter</i>",
    "num": 0
  },
  {
    "text": "Wish",
    "icon": "<i class='material.icons'>cake</i>",
    "num": 5
  },
  {
    "text": "Anything",
    "icon": "<i class='material.icons'>star</i>",
    "num": 5
  },
  {
    "text": "Child",
    "icon": "<i class='material.icons'>child_care</i>",
    "num": 4
  },
  {
    "text": "Flight",
    "icon": "<i class='material.icons'>flight</i>",
    "num": 1
  },
  {
    "text": "wifi",
    "icon": "<i class='material.icons'>wifi</i>",
    "num": 5
  },
]
```

接著把 `JSON` 資料存成 `.json` 檔，然後再用 `AJAX` 去取得資料。

```javascript
let data;
$.get('db.json', function(res) { 
  data = res 
};
```

`JSON` 資料會是一個陣列，所以我們可以使用一些陣列的方法來處理它，像是用 `forEach` 迴圈來新增元素：

```javascript
// 根據資料長度計算每個扇型要占多少度數
let preAngle = 360 / data.length;
let wheel = $('.wheel');

// 跑forEach迴圈
data.forEach((item, index) => {
  let fan = $('<div class="fan"></div>');
  let inner = $('<div class="inner"></div>');

  fan.css('transform', `rotate(${preAngle * index}deg)`);
  inner.css('transform', `rotate(${preAngle}deg)`);

  fan.append(inner);
  wheel.append(fan);
});
```
現在程式就會根據資料來製作輪盤了，不管資料是多是少都能自動計算並產生畫面，當然我裡面省略的很多，例如文字和圖示的顯示以及扇型起始角度的調整，不過相信各位勇者都能舉一反三的 !

<br />

### # 機率處理

再來是處理機率的問題，我們要先知道「抽獎機率需考慮獎項數量而非種類」是甚麼意思，假設獎項種共有 6 種，但是數量是 25 個，那每個獎品被抽到的機率應該是 1/25 而不是 1/6，所以數量越多的獎品應該要越容易被抽中。

為了有一個符合自然機率的抽獎系統，我們需要製作一個虛擬的抽獎箱，把所有的獎項給放進去。

```javascript
let preAngle = 360 / data.length;
let wheel = $('.wheel');
// 宣告一個陣列
let giftBox = []

data.forEach((item, index) => {
  // 在forEach中加上迴圈，讓每個獎品根據其數量往giftBox添加
  for (let i = 0; i < item.num; i++) {
  　giftBox.push(index)
  }

  let fan = $('<div class="fan"></div>');
  let inner = $('<div class="inner"></div>');

  fan.css('transform', `rotate(${preAngle * index}deg)`);
  inner.css('transform', `rotate(${preAngle}deg)`);

  fan.append(inner);
  wheel.append(fan);
});
```

迴圈跑完後的 `giftBox` 應該會長這個樣子...

```javascript
console.log(giftBox)
// [1,1,1,1,1,2,2,2,2,2,3,3,3,3,4,5,5,5,5,5]
```
之後我們可以設計成，按下按鈕後就從陣列 `pop` 出一個獎品就可以了。
不過現在的獎項排列太整齊了，沒有隨機性，所以我們可以在每次抽獎前先打亂順序，就像是把抽獎箱搖一搖：
```javascript
let shuffle = function(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
};
$("button").click(function(){
  let giftIndex = giftBox.sort(shuffle).pop();
});
```
這樣抽獎功能就符合自然機率了，而且因為 `pop` 會實際改動陣列本身，所以被抽走的獎品自然就從陣列裡移除不會再被抽到囉。

<br />

### # 指針旋轉

抽出獎項後我們要讓指針轉動，沒錯，先抽獎再轉指針，畫面只是一種氣氛啦！

還記得我們剛剛亂數抽出的 `giftIndex` 嗎？它代表的是 `JSON` 資料裡的索引，只要拿去陣列裡查詢就可以知道抽到的是什麼獎品，而且 `giftIndex` 乘以先前計算的 `preAngle` 就可以知道指針要轉多少角度了。

```javascript
let gift;
let startAngle;
$("button").click(function(){
  // 舉個例子:假如我們亂數抽出的gift是2
  // 那可以知道抽出的是data[2]的獎品，也就是Anything
  let giftIndex = giftBox.sort(shuffle).pop();
  gift = data[giftIndex];

  // 計算指針要旋轉多少角度才會指到Anything
  let goAngle = giftIndex * preAngle;
  // 為了讓使用者有臨場感，刻意多加幾圈
  goAngle = goAngle + 360 * 5;
  // 為了讓指針不必每次都歸零才旋轉，所以我們加上前一次旋轉的度數
  goAngle = goAngle + startAngle

  // 把這次的角度給記下來，
  startAngle = giftIndex * preAngle;

  // 最後為指針設定樣式
  $('.hand').css({transform: `rotate(${goAngle}deg)`})
});
```
這樣主要的幾個重點需求就都完成了，過程中我有省略了一些部分，如果有問題的話再可以看看完整的 [程式碼](https://github.com/f820602h/Lucky-Wheel/)。
相信各位勇者都是非常聰慧的！加油！
