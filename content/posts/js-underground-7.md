---
title: JS地下城 - Canvas
date: 2019/11/01 20:46:25
tags: [JavaScript,Canvas,JS地下城]
description: 本篇為六角學院 - JS地下城攻略文，透過 Canvas 來實作一個簡易的繪圖板，讓使用者可以透過滑鼠在畫布上繪圖，並且可以進行基本設定(粗細、顏色)、清空、復原、重做、下載等功能。
---
> 本篇為六角學院 - JS地下城攻略文　[Github](https://github.com/f820602h/Canvas)｜[Demo](https://f820602h.github.io/Canvas/)

<br />

## 確認需求
* 讓使用者可以使用滑鼠在畫布上繪圖
* 畫筆要可以進行基本設定(粗細、顏色)
* 一些畫布的基本功能(清空、復原、重做)
* 能夠將畫作下載為圖檔

**另外還可以設計一些額外功能作為加分項目**

---
## 解題攻略

#### # 準備畫布
先查查 MDN，發現原來要先建構 `<canvas>` 的渲染環境，用 `getContext('2d')` 來取得2D的繪圖環境，這樣後面才能使用相關的繪圖方法。

```html
<canvas id="draw"></canvas>
```

```javascript
let canvas = document.querySelector("#draw");
let ctx = canvas.getContext("2d");
```

在來要決定畫布的大小，以供我們畫圖，官方建議用 `<canvas>` 的 `width` `height` 的屬性設定，避免用css修改，不然會有繪圖比例的問題。
這次的需求剛好是滿版的畫布，所以就這麼設定吧！

```javascript
function setSize() {
  let canvasWidth = window.innerWidth();
  let canvasHeight = window.innerHeight();
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);
}
```

準備好畫布後，就來簡單畫幾筆吧。

```javascript
// 開始繪圖
ctx.beginPath();
// 設定起始座標
ctx.mobeTo(x, y);
// 設定終點座標
ctx.lineTo(x, y);
// 繪製
ctx.stroke();
```

藉由上面四個步驟就可以兩點連唯一線，畫出一條直線囉。

![](https://cdn-images-1.medium.com/max/6240/1*Os7N1DpSdK-2o7IxTLERww.png)

<br />

#### # 畫筆設定

成功畫出第一筆後卻發現只有一條細細醜醜的黑線，來試著改變畫筆的顏色粗細吧。

```javascript
ctx.strokeStyle = "#FFA500";
ctx.lineWidth = 10;
ctx.lineCap = "round";
```
<br />

![](https://cdn-images-1.medium.com/max/6288/1*Mtx3i8B45xDlW3cqikDc2A.png)

<br />

#### # 繪畫互動

畫筆、畫布都有了，但為了讓使用者可以利用滑鼠來繪圖，必須要把上面的畫直線方法來跟滑鼠事件連動。

```javascript
let lastPointX, lastPointY;

let downHandler = function(e){
  // 滑鼠按下去時得到座標存在變數中作為等等畫圖的起點
  lastPointX = e.offsetX;
  lastPointY = e.offsetY;
  // 並且為Canvas綁定mousemove和mouseup的事件
  draw.addEventListener("mousemove", moveHandler);
  draw.addEventListener("mouseup", upHandler);
};

let moveHandler = function(e) {
  // 滑鼠在移動時我們把新的座標存下來作為終點
  let newPointX = e.offsetX;
  let newPointY = e.offsetY;

  // 畫圖四步驟
  ctx.beginPath();
  ctx.moveTo(lastPointX, lastPointY);
  ctx.lineTo(newPointX, newPointY);
  ctx.stroke();

  // 把終點改為新的起點
  lastPointX = newPointX;
  lastPointY = newPointY;
};

let upHandler = function(){
  // 滑鼠釋放後把剛剛綁定的事件移除
  draw.removeEventListener("mousemove", moveHandler);
  draw.removeEventListener("mouseup", upHandler);
};

draw.addEventListener("mousedown", downHandler)
```

透過鼠標的事件綁定，就可以做到類似小畫家的繪圖功能，而實際上畫出來的線條，其實是無數條 `１pixel` 的直線所串連起來的。
簡單來說就是利用滑鼠移動的事件來不斷取得新座標，並且把座標丟進 moveTo() 和 lineTo() 之中，而滑鼠按下和放開只是啟動和關閉的作用。

![](https://cdn-images-1.medium.com/max/5876/1*nh08sP6qPOrNvnRh-23sNg.png)

#### # 進階功能

有了基本的繪圖功能，來思考該如何達到「復原」和「重做」吧。
看了看文件，發現 `Path2D Object` 和 `save()` `restore()` 好像蠻符合我們要的概念的。

<br />

**不過仔細研究會發現：**
* Path2D Object 是利用 `MyPath = new Path2D()` 來建立一個路徑物件，可以事先存取路徑再利用 `ctx.stroke(MyPath)` 畫出來，但這個物件只能存取路徑卻無法存取畫筆顏色和樣式。
* 而 `save()` `restore()` 可以存取畫布狀態並重新呼叫，但一次只能存取一個狀態到 stack 中，看來也不是我們需要的。

<br />

後來找到 `toDataURL()`，它可以幫我們把畫布狀態編碼為 `base64` 的字串，這樣就可以存取了。
先來定義兩個變數 step 用來紀錄步數 history 用來紀錄每一步的筆畫。每畫一筆步數就 +1，並且把base64 存進 history 中。

```javascript
let step = -1;
let history = [];

let push = function(){
  step++;
  if (step <= history.length - 1) history.length = step
  history.push(canvas.toDataURL())
}

// 記得將push()加入upHandler中
```

但為何中間要有一個判斷式呢？我們來思考一下，下面是我們畫圖時的步驟：
```javascript
A -> B -> C -> D   step = 3
// 我們總共畫了四筆，分別都存進 history[A,B,C,D]

A -> B -> C   [D]  step = 2
// 我們發現Ｄ畫錯了，所以復原到Ｃ，但Ｄ仍然是 history 裡的第[3]步

A -> B -> C -> E  [D̶] step = 3
// 這時候我們重畫了一個Ｅ，它是新的第[3]步，而舊的Ｄ必須被我們覆蓋掉
// history[A,B,C,E]
```
這樣應該就很好理解了，而現在每一筆都被記錄下來了，那該怎麼把紀錄給呼叫回來呢？
```javascript
let undo = function(){
  // 創建一個新的圖像物件
  let lastDraw = new Image;

  // 確定有上一步我們才回到上一步
  if(step > 0) step--;

  // 把上一部的base64設定給圖像物件
  lastDraw.src = history[step];

  // 把圖片載入後用畫布渲染出來
  lastDraw.onload = function(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(lastDraw, 0, 0);
  };
};
```
這樣復原就完成了，而重做的概念剛好就是相反的囉。而其實裡面也藏了清除畫布的方法 `ctx.clearRect(0,0,canvasWidth,canvasHeight)`，這樣清除畫布的功能也一起做好了。

<br />

#### # 保存作品

實現復原重做後，保存其實也是一樣道理。
```javascript
let save = document.querySelector("#save");

save.addEventListener("click", function() {
  let link = canvas.toDataURL("image/png");
  this.setAttribute("href", link);
  this.setAttribute("download", "canvas.png");
})
```
在按下保存後，把畫布狀態利用 `toDataURL()` 編碼並設定在連結中，這樣可以下載了。

---

## 加分功能

另外也可以增加替換顏色的功能，先用陣列來管理顏色再利用 `forEach()` 來生成元素。

```javascript
let brushColor = ["#ffffff","#000000","#9BFFCD","#00CC99","#01936F"];
```

![](/img/content/js-underground-7/color1.png)

不過顏色有深有淺，若打勾圖示固定是黑色的，那在較深的顏色上就會不清楚，所以我們要來判斷目前所選的顏色是深是淺。

```javascript
let isDark = function(color) {
  let rgbArray = [color.substr(1,2), color.substr(3,2), color.substr(5,2)];

  let brightness =
  parseInt(`0x${rgbArray[0]}`) * 0.213 +
  parseInt(`0x${rgbArray[1]}`) * 0.715 +
  parseInt(`0x${rgbArray[2]}`) * 0.072

  return brightness < 255 / 2
}
```

先把16進位色碼拆開並轉為10進位數字，然後透過公式就能知道這個顏色是深是淺，也就能給予對應顏色的打勾圖示了。

![](/img/content/js-underground-7/color2.png)