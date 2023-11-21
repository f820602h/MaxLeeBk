---
title: 面試官最愛考的 JS 原型鏈
date: 2020/7/25 16:55:00
tags: [JavaScript,原型鏈]
---
> JavaScript 是一種基於原型，而不是基於類的物件導向語言。由於這個根本的區別，使它在如何創建物件的層級結構，以及如何繼承屬性和它的值上，顯得有點模糊。 -- *MDN*

JavaScript 的原型鏈一直都是大家比較懼怕的一部分，但其實並不是因為它過於艱深，而是因為它的概念很抽象，且初期的前端開發中也不是常常遇到，導致要學習起來會比較困難。

我自己也是花了不少時間在理解，而今天希望可以透過我的思考方式來和大家一起認識原型鏈。

---

## 背景觀念

在正式開始之前，想先問問大家有沒有聽過 **物件導向(Object-oriented programming；OOP)**？
物件導向是一種程式設計模式，在其概念中，軟體是由無數個物件交互合作所組成的，換句話說「物件」就是程式的基本單位。

可能不是每個人都能理解它的意思，但沒關係，我們今天不會深入這個主題，會提到物件導向是因為 JavaScript 是一個支援物件導向設計的程式語言，而能夠支援的秘密就藏在原型鏈裡面。

<br/>

雖然說 JavaScript 支援物件導向，但它的設計方式和一些常見的程式語言不太一樣，程式語言可以簡單分為下面兩種：
* **基於類別(Class-Based)**：
擁有「類別」與「實例」的概念，類別定義了某種物件的屬性，而實例是由類別產生的物件。比如 Java 和 C++。
* **基於原型(Prototype-Based)**：
沒有類別與實體的概念，它只有物件，新物件在初始化時以原型物件為範本獲得屬性，比如 JavaScript。

<br/>

<p style="font-size:12px; line-height:1.5;">透過上面的描述我們知道了 JavaScript 並沒有類別與實體，但你可能聽過有人會在 JavaScript 的領域提到過類別，或是看過 ES6 的 Class，這是怎麼回事呢？這件事情其實常常被誤會，或許是因為基於類別的程式語言比較廣為使用，所以大家就以習慣的「類別」和「實例」來稱呼 JavaScript 的建構函式和物件了，而 ES6 的 Class，僅僅只是簡化原型鏈操作的語法糖。</p>

---

## 何謂原型?

> 指某種新技術在投入量產之前所作的模型，未來將以其作為核心並在此基礎上進行製作、改造或重組。

舉個簡單的例子，貨車可以說是依照汽車的原型製造的，它和汽車有共通的屬性，像是有車門、車輪，需要燃料等等。若是用程式碼來體現這個概念呢？

下面是一個叫做 `Car` 的物件，若現在將它作為一個「原型」，並請你以此原型製作出 **六輪雙門柴油貨卡**，你會怎麼做呢？

```javascript
const Car = {
  wheel: 2,
  door: 4,
  fuel: "汽油"
};
```

若你不曾接觸過原型鏈或建構函式，你可能會定義一個 `Truck` 物件，然後調整一下屬性的值。
這個方法可以得到正確的結果，但它其實在意義上是錯的，因為你是「重新」製造了一個新的物件，而不是「基於」原型建立的。

```javascript
const Truck = {
  wheel: 6,
  door: 2,
  fuel: "柴油"
};
```

這時候你可能會改成將 `Truck` 賦值為 `Car` 然後修改屬性的值。
但這個方法不只沒有新物件被建立，連 `Car` 的屬性都會一起被改掉，因為 `Truck` 其實是指向了 `Car` 的參考。

```javascript
const Truck = Car;
Truck.wheel = 6;
Truck.door = 2;
Truck.fuel = "柴油";
console.log(Car.wheel);  // 6
```

可見平時的基礎觀念沒辦法實現「原型」的概念，這會使物件導向沒辦法實踐，因此我們該來認識「建構函式」了。

---

## 建構函式與實例 Constructor & Instance

前面有提到 Java 是基於類別的程式語言，會利用類別來建立實例，而在類別裡會有個很特別的函式叫做「建構函式」，他會進行實例的初始化，用來設定一些實例的基礎屬性。

我們先來看看 Java 在建立實例時的語法：

```javascript
Foo foo = new Foo();
// 以Foo這個類別來建立一個實例foo
```

在 Java、C++ 中都會使用 `new` 這個關鍵字來產生新的實例，而 JavaScript 就也把 `new` 拿來用了，不過 JavaScript 並沒有「類別」，`new` 後面該接什麼呢？ JavaScript 的設計者就想到了，既然類別裡都一定要有建構函式，那乾脆 `new` 後面就接一個函式吧。

```javascript
function Car(wheel, door, fuel) {
  this.wheel = wheel,
  this.door = door,
  this.fuel = fuel
};
let truck = new Car(6, 2, "柴油");
```

可以看到 `Car` 其實只是一個普通的函式，但如果你用 `new` 運算子來呼叫它的話，JavaScript 就會將它視為建構函式。
而 `truck` 就是透過 `Car` 新建出來的實例，印出來會長這樣：

```javascript
// console.log(truck)
Car {
  door: 2
  fuel: "柴油"
  wheel: 6
  __proto__: Object
}
```

你會發現 `Car` 確實依據我們傳入的參數把 `truck` 的相關屬性給設定好了，而且在前面標註了 `Car`，以此說明 `truck` 是 `Car` 的實例。

---

## 原型與繼承 Prototype & Inheritance

當然實體與建構函式之間的連結不僅僅只是一個標記那麼簡單，它們各自有著特別的屬性，讓 JavaScript 能夠實踐所謂的「繼承」，而現在我們就要來深入認識這些屬性。

#### # prototype
在 JavaScript 裡，每個函式都擁有 `prototype` 這個訪問器屬性，而建構函式也是函式，當然就也有 `prototype`。

<p style="font-size:12px; line-height:1.5; margin-top: 4px">＊ 訪問器屬性 - 你可以把它當成一種隱藏的內建屬性，所以平常不會注意到。</p>

```javascript
// console.log(Car.prototype)
{
  constructor: Car(wheel, door, fuel),
  __proto__: Object
}
```

`Car.prototype` 我們可以稱之為 `Car` 的原型，在原型中會有兩個固定的訪問器屬性：
- **\_\_proto\_\_：**後面會再介紹，這裡暫時先跳過。
- **constructor：**中文翻譯就是建構函式，有趣的是它的值就是原本的 `Car`，所以會造成一個很特別的現象。

```javascript
console.log(Car === Car.prototype.constructor); // true
console.log(Car === Car.prototype.constructor.prototype.constructor); // true
console.log(Car === Car.prototype.constructor.prototype.constructor.prototype.constructor); // true
...
```

<br />

#### # \_\_proto\_\_

在 JavaScript 裡，每個物件型別的變數都有 `__proto__` 這個訪問器屬性，而實例就是物件，當然就也有 `__proto__`。
<p style="font-size:12px; line-height:1.5; margin-top: 4px">＊ 物件型別(Object) - 例如：物件、陣列、函式、日期等。</p>

```javascript
// console.log(truck.__proto__)
{
  constructor: Car(wheel, door, fuel),
  __proto__: Object
}
```

把 `truck.__proto__` 印出來後就會發現它跟 `Car.prototype` 長得一模一樣，所以我們可以來做個大膽的假設：

> 身為一個實例，`truck` 應該繼承 `Car` 類別的屬性，但 `Car` 只是建構函式而不是真的類別，所以 JavaScrip 為函式設計了 `prototype` 屬性，讓實例被創建時，可以繼承建構函式的原型。

要證明這個假設也很簡單：
```javascript
console.log(truck.__proto__ === Car.prototype); // true
```
`truck.__proto__` 和 `Car.prototype` 不只是長得一樣，它們指向的就是同一個物件，所以 `truck` 確實繼承了 `Car` 的屬性。

---

## new 運算子

現在知道當我們在創建實例時，主要會有兩件事情發生：
- **實例會被初始化，並透過建構函式新增屬性**
- **實例的 `__proto__` 會被指向建構函式的 `prototype`**

但這些事情怎麼發生的？而且為什麼在 `Car` 裡面使用 `this` 會是幫實例加上屬性呢？
正常來說函式中的 `this` 指向的應該會是 `window`，所以要是你直接執行 `Car` 的話，應該是 `window` 會被設定屬性才對：

```javascript
Car(1, 1, "空氣");
console.log(window.door); // 1
```

其實一切的關鍵都在於 `new`，我們可以用函式來模擬 `new` 做的事情：

```javascript
function newObject(Constructor, arguments) {
  var o = new Object();  // 1. 建立新物件
  o.__proto__ = Constructor.prototype;  // 2. 重新指向原型
  Constructor.apply(o, arguments);  // 3. 初始化物件
  return o; // 4. 回傳新物件
};
let truck = newObject(Car, [6, 2, "柴油"]);
```

<br />

1. **建立新物件：** 建立一個新物件，起初這個物件的 `__proto__` 指向的會是 `Object.prototype`
2. **重新指向原型：** 重新將 `__proto__` 指向建構函式的原型，使物件成為建構函式的實例
3. **初始化物件：** 執行建構函式，但利用 `apply` 將 `this` 指定給實例，這樣才能為它新增屬性
4. **回傳新物件：** 最後回傳這個處理完成的實例

`new` 背後做的事情不是很複雜但卻很重要，它將實例以及原型之間建立了連結。

---

## 原型鏈 prototype chain

`new` 負責將實例的 `__proto__` 指向建構函式的原型，但 `Car.prototype` 中卻又看到另一個 `__proto__`，它會指向誰呢？

```javascript
// console.log(Car.prototype.__proto__)
{
  constructor: Object(),
  // ...其餘省略
}
```
我們把 `Car.prototype.__proto__` 印出來後發現裡面一樣有 `constructor`，指向的是 `Object` 這個建構函式。
而這個線索告訴了我們，原來 `Car.prototype.__proto__` 指向的是 `Object` 的原型，驗證了一下也確實如此：
```javascript
console.log(Car.prototype.__proto__ === Object.prototype); // true
```
更重要的是物件之間的繼承關係，原來是一個接著一個不斷延續的，看起來就像條鎖鏈一樣。
```javascript
truck.__proto__ // Car.prototype
truck.__proto__.__proto__ // Object.prototype
truck.__proto__.__proto__.__proto__  // null
```
不過原型鏈也是有終點的，`Object.prototype.__proto__` 指向的是 `null`，代表 `Object` 是原型鏈的最頂端，這也是為什麼會說 **JavaScript 中一切都是物件**的原因了。用圖像表示應該可以更容易理解：
![](/img/content/prototype/chain.png)

---

## 原理的實際體現

<br />

到目前為止似乎還沒有感受到 `prototype` 帶來什麼特別的益處，因為我們還沒有開始利用它，這也是為什麼 `Car.prototype` 裡面除了訪問器屬性外什麼都沒有的原因。
```javascript
// console.log(Car.prototype)
{
  constructor: Car(wheel, door, fuel),
  __proto__: Object
}
```

<br />

假設要為 `Car` 的實例加上一個 `drive` 的函式，我們已經知道在建構函式裡多寫行程式碼就可以辦到：

```javascript
function Car(wheel, door, fuel) {
  this.wheel = wheel,
  this.door = door,
  this.fuel = fuel
  this.drive = function() {
    console.log(`消耗${this.fuel}前進`)
  }
};
let truck = new Car(6, 2, "柴油");
let gogoro = new Car(2, 0, "電力");

truck.drive(); // 消耗柴油前進
gogoro.drive(); // 消耗電力前進
```

不過 `drive` 其實在每個實例中都是做同樣的事情，應該是可以抽出來共享的，如果用上面這種方式寫的話，反而會造成記憶體空間的浪費：

```javascript
console.log(truck.drive === gogoro.drive); // false
```

上面的等式不成立表示兩個實例中的 `drive` 雖然長得一樣，卻是兩個不同的函式，為了解決這個缺點可以這樣做：

```javascript
function Car(wheel, door, fuel) {
  this.wheel = wheel,
  this.door = door,
  this.fuel = fuel
};

Car.prototype.drive = function() {
  console.log(`消耗${this.fuel}前進`);
};

let truck = new Car(6, 2, "柴油");
let gogoro = new Car(2, 0, "電力");

truck.drive(); // 消耗柴油前進
gogoro.drive(); // 消耗電力前進

console.log(truck.drive === gogoro.drive); // true
```

我們把 `drive` 抽出來放進 `Car` 的原型裡，這樣就算是不同的實體，操作的還是同一個函式，因為它們呼叫的都是 `Car.prototype.drive`。

不過你可能會驚訝 `drive` 其實不是 `truck` 的屬性之一，而你能夠呼叫它是因為 JavaScript 如果在物件中找不到某個屬性時就會去 `__proto__` 裡面找，一路找到 `Object.prototype`。

```javascript
truck.hasOwnProperty("drive"); // true
console.log(truck.drive === truck.__proto__.drive); // true
```

而這也是為什麼當你在 `let today = new Date()` 後可以使用 `getMonth()` 或 `getDate()` 等方法的原因，這些 methods 實際上是在 `Date.prototype` 裡，甚至下面這些你平常在寫語法背後也是同樣的道理：

```javascript
let obj = {}; // new Object()
let arr = []; // new Array()
let fn = function(){}; // new Function()
```

---

## 結語

過了今天會發現其實平常我們就已經在「原型鏈」的架構下撰寫 JavaScript 了，或許目前還用不到 JavaScript 的類別(當然不是真的類別)，不過你現在已經知道箇中玄機了，所以假使未來有使用的需要或甚至在面試時被面試官問到，相信你已經可以應付得宜了。

<br />

參考資料：
- [該來理解 JavaScript 的原型鏈了 - huli](https://blog.techbridge.cc/2017/04/22/javascript-prototype/)
- [你懂 JavaScript 嗎？#19 原型（Prototype）- Summer](https://cythilya.github.io/2018/10/26/prototype/)
