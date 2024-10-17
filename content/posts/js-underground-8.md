---
title: JS地下城 - 井字遊戲
date: 2019/12/01 20:46:25
tags: [JavaScript,JS地下城]
description: 本篇為六角學院 - JS地下城攻略文，透過 JavaScript 製作一個簡易的井字遊戲，讓使用者可以透過點擊格子來進行遊戲，並且判定勝負，並且可以保留遊戲歷史戰績。
---
> 本篇為六角學院 - JS地下城攻略文　[Github](https://github.com/f820602h/OXGame/)｜[Demo](https://f820602h.github.io/OXGame/)

<br />

## 確認需求
* 先手為 O，後手為 X，某方獲勝時，上方會紀錄各方的獲勝戰績
* 每回合結束後，會判定結果頁(平手、Ｏ 獲勝、X 獲勝)
* 需符合 RWD，能在低螢幕解析度也能遊玩，介面不能超出 x 軸。
* 請使用瀏覽器離線儲存技術，將戰績保留起來，重新打開遊戲也仍可觀看到歷史戰績。技術請任選以下幾種
  
**基本上都不是太複雜的需求，唯有判斷勝負可能需要花點時間來思考。**

---

## 解題攻略

### # 畫面處理

秉持專業原則：「設計稿給什麼，畫面就出什麼」，叉叉中間可以利用偽元素蓋掉多餘的線條，製造出中空的效果。
文字部分用 text-shadow 或 -webkit-text-stroke 就可以搞定。
```css
.text{
  text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;
  -webkit-text-stroke: 2px white;
}
```
![](https://cdn-images-1.medium.com/max/5208/1*3uprjW3Qc2fTBbzFDeH3KA.png) ![](https://cdn-images-1.medium.com/max/4268/1*JlxlNuoF5OPvRfsv7Rpr2g.png)


<br />

### # 初始化遊戲

畫面完成後，來處理遊戲流程吧，我們可以使用陣列來儲存每個格子中的圈叉。
* 事先為每個格子加一個 `data-num` 屬性，`value` 從 `0~8` 剛好對應九宮格位置，也對應陣列 `gamePlay` 的 `index`。
* `circleTurn` 是表示玩家回合的變數，如果為 `true` 就是圈圈的回合，反之為叉叉的回合。
* 每次點擊空格都會由 `circleTurn` 告訴我們該將 `1 (圈)` 或 `-1 (叉)` 加入 `gamePlay` 陣列中，並且切換回合。

陣列成功存進資料後，剩下就是判定啦！

```javascript
let gamePlay = [];
let circleTurn = true;
let boxes = document.querySelectorAll(".box");

boxes.forEach( box => {
  box.addEventListener("click", function() {
    let index = this.getAttribute("data-num");
    // 如果格子已經被佔領過，不作動
    if (gamePlay[index] != undefined) return;
    // 反之根據回合填入1或-1
    gamePlay[index] = circleTurn ? 1 : -1;
    // 切換回合
    circleTurn = !circleTurn;
  });
});
```

<br />

### # 勝負判斷

![](/img/content/js-underground-8/ooxx.png)

我們前面已經利用 `data-num` 屬性爲格子加上編號了，現在來看看成功連線有什麼規律：
1. **橫排：012、345、678 - 可以歸類為 3n、3n+1、3n+2。**
2. **直排：036、147、258 - 可以歸類為 n、n+3、n+6。**
3. **斜角：048、246**

我們按照找到的規律去把格子裡的 `±1` 給相加，如果絕對值等於 `3`，就代表分出勝負了，那我們就返回其中一個格子的值 `(1 或 -1)`。
如果是 `1` 代表圈圈獲勝，如果是 `-1` 代表叉叉獲勝，知道誰獲勝後就可以處理勝負的畫面跟計分了。
```javascript
let whoWin = function() {
  // 左上至右下的斜角
  let lrCross = Math.abs(gamePlay[0] + gamePlay[4] + gamePlay[8]); 
  if (lrCross === 3) return gamePlay[0]

  // 右上至左下的斜角
  let rlCross = Math.abs(gamePlay[2] + gamePlay[4] + gamePlay[6]); 
  if (rlCross === 3) return gamePlay[2]

  // 橫排
  for (let i =0; i < 3; i++) {
    let row = Math.abs(gamePlay[3*i] + gamePlay[3*i+1] + gamePlay[3*i+2]);
    if (row === 3) return gamePlay[3*i]
  }

  // 直排
  for (let i =0; i < 3; i++) {
    let row = Math.abs(gamePlay[i] + gamePlay[i+3] + gamePlay[i+6]);
    if (row === 3) return gamePlay[i]
  }

  // 平手
  return null
};
```

<br />

### # 平手狀況

不過我們還有平手的狀況要處理，先利用變數幫我們紀錄目前的回合數，如果已經達到 `9`，`whoWin()` 回傳的卻還是 `null` 那就表示沒有分出勝負。

```javascript
let step = 1
let gameover = function(){
  step++
  if (whoWin() === null && step === 9) {
    // 平手要做的事情
  } else if (whoWin() === 1) {
    // 圈圈贏了要做的事
  } else if (whoWin() === -1) {
    // 叉叉贏了要做的事
  } else {
    // 還沒結束的話，切換回合
    circleTurn = !circleTurn;
  }
}
```

這樣遊戲架構就完成了，畫面的切換以及分數的顯示再稍微處理一下就可以開始和朋友來場圈叉遊戲了。