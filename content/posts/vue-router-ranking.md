---
title: Vue Router 可能跟你想的不一樣
date: 2024/9/20 16:00:00
tags: [Vus.js,Vue Router]
---

> 文章撰寫當下，Vue Router 版本為 v4.4.5。

Vue Router 對於 Vue 開發者來說應該是再熟悉不過的了，但最近在產品中搞出了一個 Bug 後才發現原來我對 Vue Router 匹配路由的方有很深的誤解。所以這篇文章希望可以透過解析原始碼來與大家一起重新認識 Vue Router，避免犯了和我相同的錯誤。

## 產生誤會

以下是一個非常基礎與常見的路由設定，我們會在 `routes` 陣列中定義每個路由的名稱、路徑與對應的元件，在這樣的設定下，當使用者在網址列輸入 `/about` 時，就會導向 `About` 頁面。這是非常理所當然又符合直覺的結果。

```js
const routes = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
]
```

儘管不小心把不同路由設定成相同的 `path`，Vue Router 也不會報錯，而是會導向第一個符合網址匹配的 `About` 頁面，不過這樣的結果讓我們產生了 **「Vue Router 會根據路由順序來決定最終導向頁面」** 的誤會。

```js
const routes = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Error", path: "/about" },
]
```

## 發生衝突

實際上 Vue Router 的運作方式要再複雜一些，這裡實際用一個例子來打破前面建立的既定印象。請問以下面的路由設定來說，當使用者在進入網址 `/page` 時，Vue Router 會導向 `PageA` 還是 `PageB` 呢？

```js
const routes = [
  { name: "PageA", path: "/page" },
  { name: "PageB", path: "/page/" },
]
```

> 答案是會導向 `PageB` 頁面，而這裡面其實有兩件事情需要釐清。

<br/>

#### 1. Strict options

首先是 `strict` 設定，在預設情況下 Vue Router 並不會特別區分末端是否有斜線。也就是 `/page` 其實可以同時匹配 `PageA` 及 `PageB`，除非特地設定 `strict: true` 才會去嚴格比對到 `PageA`。

```js
const routes = [
  { name: "PageA", path: "/page" },
  { name: "PageB", path: "/page/" },
]
const router = createRouter({ routes, strict: true })
```

<br/>

#### 2. Ranking of routes

這時候腦筋動比較快的人應該就會發現第二個問題，那就是既然 `/page` 可以同時匹配 `PageA` 及 `PageB`，那為何 Vue Router 卻是匹配了排序比較後面的 `PageB`？

那就是因為「路由順序」並不是決定路由匹配的主要因素，反而 Vue Router 會先依照路由分數進行排序，當有路由的分數一樣時，才會根據順序來決定。

以上述的例子來說 `PageA` 的路由分數會是 `80`，而 `PageB` 的路由分數會是 `80 | 90`，所以就會先匹配 `PageB`。

```js
const routes = [
  { name: "PageA", path: "/page" }, // 80
  { name: "PageB", path: "/page/" }, // 80 | 90
]
```

## 解開誤會

相信看了上面的解釋後大家反而更困惑了，路由分數是什麼？何時計算的？為什麼分數會有兩個數字？計算方式？比較方式？其實我當時也和大家一樣困惑，因為官方文件幾乎沒有提到這塊，只有 [隱晦的幾句話](https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html#%E8%B0%83%E8%AF%95) 帶到一下。

既然文件沒說，那我們就去看看 Vue Router 的原始碼是怎麼寫的，將這些問題一個個破解吧。

> 以下說明會直接用筆者自己研究完的成果來說明，會省略很多與主題無關的部分，如對完整邏輯有興趣可自行查看 Vue Router 的[原始碼](https://github.com/vuejs/router)。

<br/>

#### # createRouterMatcher & RouteRecordMatcher

其實路由分數在使用 `createRouter` 進行初始化路由時就已經計算了，函式中的第一行是透過 `createRouterMatcher` 建立 `matcher`，不過這個 `matcher` 並沒有直接暴露出來給開發者，所以平時可能並不會注意到有這個東西。

::advance-code{file-name="router/src/router.ts" :line='[2]'}
```ts
export function createRouter(options: RouterOptions): Router {
  const matcher = createRouterMatcher(options.routes, options);
  // ...省略
}
```
::

不過 `createRouterMatcher` 這個函式是有釋出的，根據 [API 文件](https://router.vuejs.org/api/#createRouterMatcher) 的說明，原來它會返回一個 [RouterMatcher 實體](https://router.vuejs.org/api/interfaces/RouterMatcher.html)，而這個實體就會是我們這次的關鍵。

實體中有很多方法，不過我們先把注意力放在 `getRoutes`， [文件](https://router.vuejs.org/api/interfaces/RouterMatcher.html#getRoutes) 中指出這個方法會返回一個 `RouteRecordMatcher` 的陣列，不過並沒有詳細說明它是什麼，只好由我們自己嘗試印出結果看看。

::advance-code{file-name="router.js" :line='[6]'}
```js
import { createRouterMatcher } from "vue-router";
const routes = [
  { name: "PageA", path: "/page" },
  { name: "PageB", path: "/page/" }
]
console.log(createRouterMatcher(routes).getRoutes())
```
::

![](/img/content/vue-router-ranking/matcher.png)

將結果陣列中的 `RouteRecordMatcher` 個別展開後，會發現 `record.name` 屬性表明了這些物件就是我們設定的路由，而物件中的 `score` 屬性也和前面說明的一樣，分別是 `[[80]]` 和 `[[80], [90]]`。而且路由順序已經以分數高低被排列了。

<br/>

#### # PathScore

既然已經發現了 `RouteRecordMatcher` 物件中有 `score` 屬性，索性用它作為關鍵字在原始碼中搜尋一番，這時可以在 [這裡](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/pathParserRanker.ts#L100-L114) 找到名為 `PathScore` 的列舉，透過其中的註解就可以猜到這個列舉是在定義不同情況的路由路徑所能得到的分數。

::advance-code{file-name="router/src/matcher/pathParserRanker.ts"}
```ts
const enum PathScore {
  _multiplier = 10,
  Root = 9 * _multiplier, // just /
  Segment = 4 * _multiplier, // /a-segment
  SubSegment = 3 * _multiplier, // /multiple-:things-in-one-:segment
  Static = 4 * _multiplier, // /static
  Dynamic = 2 * _multiplier, // /:someId
  BonusCustomRegExp = 1 * _multiplier, // /:someId(\\d+)
  BonusWildcard = -4 * _multiplier - BonusCustomRegExp, // /:namedWildcard(.*) we remove the bonus added by the custom regexp
  BonusRepeatable = -2 * _multiplier, // /:w+ or /:w*
  BonusOptional = -0.8 * _multiplier, // /:w? or /:w*
  // these two have to be under 0.1 so a strict /:page is still lower than /:a-:b
  BonusStrict = 0.07 * _multiplier, // when options strict: true is passed, as the regex omits \/?
  BonusCaseSensitive = 0.025 * _multiplier, // when options strict: true is passed, as the regex omits \/?
}
```
::

> 分數不用特別記，只要記得一個大方向是靜態路由分數會比動態路由高，因為詳細分數與排序可以靠 `createRouterMatcher` 印出來查看。

<br/>

#### # tokensToParser

而就在 `PathScore` 的底下剛好就有一個 [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/pathParserRanker.ts#L126-L291) `tokensToParser`，當中大量的使用了 `PathScore` 列舉，並且明顯有分數計算邏輯，並且最終返回了帶有 `score` 屬性的物件。

::advance-code{file-name="router/src/matcher/pathParserRanker.ts" :line='[5,8]'}
```ts
export function tokensToParser(
  segments: Array<Token[]>,
  extraOptions?: _PathParserOptions
): PathParser {
  // the amount of scores is the same as the length of segments except for the root segment "/"
  const score: Array<number[]> = []
  // ...
  return { re, score, keys, parse, stringify }
}
```
::

其中在宣告 `score` 的位置上方有一行註解，它說明 `score` 的長度會和 `segments` 的長度一樣，雖然目前還不知道 `segments` 是什麼，不過可以猜測不同的路由路徑應該會有不同的 `segments` 長度，也就是為什麼我們會看到有複數分數的原因。

<br/>

#### # 先綜觀全局

為了知道 `segments` 是什麼，我們必須要找到 `tokensToParser` 是在哪裡被呼叫並且被傳入什麼樣的參數，並且一步步往源頭追朔，才能知道 Vue Router 是如何計算路由分數的。經過一番搜尋後，我將整個流程整理成以下的關係圖。

![](/img/content/vue-router-ranking/flow.png)

可以看到最初的起點肯定是 `createRouter`，接著是前面提到的 `createRouterMatcher`，它內部定義了 `addRoute` 的方法，並且會將個別路由都丟進去執行，也就是橘色矩形框起來的部分。

<br/>

#### # normalizeRouteRecord

在 `addRoute` 內部首先會使用 `normalizeRouteRecord` 這個 [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/index.ts#L383)，它會使用別路由的設定來為新物件屬性賦值，並添加一些新的屬性，最終將其返回並稱為 `record`。

::advance-code{file-name="router/src/matcher/index.ts" :line='[5,6,7]'}
```ts
export function normalizeRouteRecord(
  record: RouteRecordRaw & { aliasOf?: RouteRecordNormalized }
): RouteRecordNormalized {
  const normalized: Omit<RouteRecordNormalized, 'mods'> = {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    leaveGuards: new Set(),
    updateGuards: new Set(),
    // ...
  }
  return normalized as RouteRecordNormalized
}
```
::

<br/>

#### # createRouteRecordMatcher

路由在轉變成 `record` 後，就會再被丟進 `createRouteRecordMatcher` 這個 [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/pathMatcher.ts#L19) 處理，當中創建了一個新物件並將他返回，`record` 會是它的屬性之一，而被 `assign` 的 `parser` 就是透過前面提到的 `tokensToParser` 回傳出來的。

::advance-code{file-name="router/src/matcher/pathMatcher.ts" :line='[6]'}
```ts
export function createRouteRecordMatcher(
  record: Readonly<RouteRecord>,
  parent: RouteRecordMatcher | undefined,
  options?: PathParserOptions
): RouteRecordMatcher {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher: RouteRecordMatcher = assign(parser, { record, parent, children: [], alias: [] });
  // ...
  return matcher;
}
```
::

<br/>

#### # tokenizePath

現在知道 `tokensToParser` 是在 `createRouteRecordMatcher` 中被呼叫的，並且將 `tokenizePath` 所回傳的結果做為參數傳入。那就接著看看 `tokenizePath` 內部到底做了什麼事情。

::advance-code{file-name="router/src/matcher/pathTokenizer.ts" :line='[1]'}
```ts
export function tokenizePath(path: string): Array<Token[]> {
  // ...
  return tokens
}
```
::

找到了 `tokenizePath` 的 [位置](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/pathTokenizer.ts#L46) 後發現當中的邏輯又長又複雜，所以我們用比較偷懶的方式。`tokenizePath` 在回傳型別的部分是 `Array<Token[]>`，並且在同一隻檔案的開頭可以看到以下的型別定義。

::advance-code{file-name="router/src/matcher/pathTokenizer.ts"}
```ts
export const enum TokenType {
  Static,
  Param,
  Group,
}

interface TokenStatic {
  type: TokenType.Static
  value: string
}

interface TokenParam {
  type: TokenType.Param
  regexp?: string
  value: string
  optional: boolean
  repeatable: boolean
}

interface TokenGroup {
  type: TokenType.Group
  value: Exclude<Token, TokenGroup>[]
}

export type Token = TokenStatic | TokenParam | TokenGroup
```
::

另外也偷偷修改一下原始碼，把 `Token` 們印出來看看。

::advance-code{file-name="router/src/matcher/pathMatcher.ts" :line='[6]'}
```ts
export function createRouteRecordMatcher(
  record: Readonly<RouteRecord>,
  parent: RouteRecordMatcher | undefined,
  options?: PathParserOptions
): RouteRecordMatcher {
  console.log(record.path, tokenizePath(record.path))
  const parser = tokensToParser(tokenizePath(record.path), options);
  // ...
}
```
::

![](/img/content/vue-router-ranking/token.png)

有了以上這些線索就可以推測 `tokenizePath` 會以 `/` 將路徑分段，並根據分段的內容來指定 `type`。最後這樣的陣列會被作為 `segments` 參數傳入 `tokensToParser`。這也就是為什麼 `PageB` 的分數會有兩個了。

<br/>

#### # insertMatcher

等待 `tokensToParser` 計算完分數後，`matcher` 就會被返回並被傳入 `insertMatcher` [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/index.ts#L227)之中，來使它根據分數大小插入 `matchers` 陣列之中。也就是前面用 `getRoutes` 取得的 `RouteRecordMatcher` 陣列。

::advance-code{file-name="router/src/matcher/index.ts" :line='[2, 3]'}
```ts
function insertMatcher(matcher: RouteRecordMatcher) {
  const index = findInsertionIndex(matcher, matchers)
  matchers.splice(index, 0, matcher)
  // only add the original record to the name map
  if (matcher.record.name && !isAliasRecord(matcher)) {
    matcherMap.set(matcher.record.name, matcher)
  }
}
```
::

而在 `insertMatcher` 內部的 `findInsertionIndex` 則是會再透過 `comparePathParserScore` [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/pathParserRanker.ts#L302) 來比較分數大小並找到正確的陣列位置。

為了不花時間去細究分數比較的邏輯，下面我直接用一個直觀的結果來表示 Vue Router 是怎麼排序這些長度不同的路由分數的，下面每一行都是一個路由的分數，每個數字都代表了一段 `Token` 的分數。

```js
const matcherScore = [
  [[80], [90]],
  [[80], [80], [80], [80]],
  [[80], [80], [80]],
  [[80], [80]],
  [[80], [80]],
  [[80], [62], [80], [80], [60], [60]],
  [[80], [62], [80], [80], [60]],
  [[80], [62], [80], [80]],
  [[80], [62], [80], [60], [60]],
  [[80], [62], [80]],
  [[80], [62]],
  [[80]],
  [[20]],
]
```

從結果可以看出來 Vue Router 會先比較第一個 `Token` 分數，所以你會看到 `[[20]]` 被排到了最後面，當順位第一的分數排序完畢，就會再比較第二個 `Token` 分數，所以你會看到 `[[80], [90]]` 被排在了最前面的位置。如果遇到分數完全一樣的情況才會用路由設定的順序來決定。

> 到這邊其實我們就把前面所以疑惑的地方給解答了，再幫大家總結一下：
> 1. 路由分數是在呼叫 `createRouter` 時就在 `createRouterMatcher` 中完成計算及排序的。
> 2. 計算的方式是將每個路由的完整路徑拆分成一段段的 `Token`，根據其類型計分，因此分數有可能會是複數個。
> 3. 排序的方式是依次比較每個路由的分數陣列，如果分數完全一樣才會根據路由設定的順序來決定。

<br/>

#### # resolve

有了路由排序後，只要使用 `router.push` 或是在網址列輸入網址時，背後都會藉由 `router.resolve` 這個 [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/router.ts#L459)，來操作 `matcher` 的 `resolve` [方法](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/index.ts#L235) 來找到符合的路由。

::advance-code{file-name="router/src/router.ts" :line='[6]'}
```ts
function resolve(
  rawLocation: RouteLocationRaw,
  currentLocation?: RouteLocationNormalizedLoaded
): RouteLocationResolved {
  // ...
  const matchedRoute = matcher.resolve(matcherLocation, currentLocation)
  // ...
}
```
::

只要目標路由是以路徑的形式指定的，`matcher.resolve` 就會在已經完成分數計算及排序的路由陣列 `matchers` 中尋找第一個符合的路由。

::advance-code{file-name="router/src/matcher/index.ts" :line='[8]'}
```ts
function resolve(
  location: Readonly<MatcherLocationRaw>,
  currentLocation: Readonly<MatcherLocation>
): MatcherLocation {
  // ...
  else if (location.path != null) {
    path = location.path
    matcher = matchers.find(m => m.re.test(path))
  }
  // ...
}
```
::

> 如果路由是透過 `{ name: "PageA" }` 的方式指定，則會跳過 `matchers` 的搜尋，直接根據名稱找到對應的路由。

## 回顧錯誤

既然現在對 Vue Router 有了全新的認識，就來回頭看看我當初遇到了什麼問題，以及最後是如何解決的。下面的路由設定是出現問題之前的狀態，分別是管理「登入前」頁面的 `PreLoginPage` 和管理「登入後」頁面的 `LoginPage` 的兩組路由。

儘管它們的 `path` 是一樣的，但由於在「未登」與「已登」下會有不同的排版設計與路由守衛，所以才分開來設定。

```js
const routes = [
  {
    path: "/my-website/",
    name: "PreLoginPage"
    component: PreLoginLayout,
    children: [
      { path: "", name: "PageLanding", component: PageLanding }, // 未登首頁
      { path: "contact", name: "PageContact", component: PageContact } // 聯繫我們
    ]
  },
  {
    path: "/my-website/",
    name: "LoginPage"
    component: LoginLayout,
    beforeEnter: () => {},
    children: [
      { path: "page-a", name: "PageA", component: PageA }, // 已登頁面 A
      { path: "page-b", name: "PageB", component: PageB } // 已登頁面 B
    ]
  },
]
```

我們可以先將目前狀態下的路由排序與分數印出來看看。

```js
console.table(
  createRouterMatcher(routes, {})
    .getRoutes()
    .reduce((acc, m) => {
      acc[m.record.name] = {
        path: m.record.path,
        score: m.score.flat().join(' | ')
      }
      return acc
    }, {})
)
```

![](/img/content/vue-router-ranking/problem.png)

首先要先知道，由於 `PageLanding` 的 `path` 被設為空字串，所以它的完整路徑其實是與它的父層路由相同的，但比較疑惑的是為什麼它的排序是在第一位，而不是按照路由設定的順序排在 `PreLoginPage` 之後？

<br/>

#### # getInsertionAncestor

原來，前面提到 `insertMatcher` 會呼叫 `findInsertionIndex` 來進行分數的比較，並將 `matcher` 插入對應的順位中，如果分數完全相同才會依照路由設定的順序來決定。但這中間其實還藏了另一個判斷，那就是利用 `getInsertionAncestor` 這個 [函式](https://github.com/vuejs/router/blob/14219b01bee142423265a3aaacd1eac0dcc95071/packages/router/src/matcher/index.ts#L589) 來判斷當下這個路由是否有分數相同的父層路由。

::advance-code{file-name="router/src/matcher/index.ts" :line='[8, 9, 10, 11]'}
```js
function findInsertionIndex(
  matcher: RouteRecordMatcher,
  matchers: RouteRecordMatcher[]
) {
  // ...

  // Second phase: check for an ancestor with the same score
  const insertionAncestor = getInsertionAncestor(matcher)
  if (insertionAncestor) {
    upper = matchers.lastIndexOf(insertionAncestor, upper - 1)
  }

  // ...
}
```
::

::advance-code{file-name="router/src/matcher/index.ts" :line='[6]'}
```js
function getInsertionAncestor(matcher: RouteRecordMatcher) {
  let ancestor: RouteRecordMatcher | undefined = matcher
  while ((ancestor = ancestor.parent)) {
    if (
      isMatchable(ancestor) &&
      comparePathParserScore(matcher, ancestor) === 0 // 同分的意思
    ) {
      return ancestor
    }
  }
  return
}
```
::

如果有找到同分的父層路由，那就會將這個路由的順位排在它的父層路由前面。這就是為什麼 `PageLanding` 會被排在 `PreLoginPage` 之前的原因。而也正是這樣的特性，讓使用者進入 `/my-website/` 時可以正確地看見未登首頁。

> 在搞懂 Vue Router 邏輯之前，我一直以為 `/my-website/` 是先配對到了 `PreLoginPage`，然後再找到子路由 `PageLanding`。

<br/>

#### # 問題發生

本來正常運作的路由設定，直到遇到了這次的新需求後就發生了變故，其中需求是這樣的：

::quote-box
「網站 ABC 的使用者可以透過 `/my-website/abc/` 來到未登首頁，後續在其登入前，都希望使用帶有 `/abc/` 字段的網址」
::

簡單來說就是不管 `/my-website/` 還是 `/my-website/abc/` 都應該要能正常看到 `PageLanding`，同理 `/my-website/contact` 或 `/my-website/abc/contact` 都應該要能正常看到 `PageContact`。因此我根據這樣的需求將路由設定改成以下。

::advance-code{:line='[3]'}
```js
const routes = [
  {
    path: "/my-website/:ABC(abc)?/",
    name: "PreLoginPage"
    component: PreLoginLayout,
    children: [
      { path: "", name: "PageLanding", component: PageLanding }, // 未登首頁
      { path: "contact", name: "PageContact", component: PageContact } // 聯繫我們
    ]
  },
  {
    path: "/my-website/",
    name: "LoginPage"
    component: LoginLayout,
    beforeEnter: () => {},
    children: [
      { path: "page-a", name: "PageA", component: PageA }, // 已登頁面 A
      { path: "page-b", name: "PageB", component: PageB } // 已登頁面 B
    ]
  },
]
```
::

用一個可選的、自定義正則的參數 `:ABC(abc)?` 來讓未登頁面可以接受 `/my-website/` 與 `/my-website/abc/`，但沒想到這個調整卻讓前往 `/my-website/` 的使用者看不到正常的頁面。而這時候只要重新將路由排序與分數印出來就能看到問題所在。

![](/img/content/vue-router-ranking/resolve.png)

原來是原本分數為 `80 | 90` 的 `PageLanding` 因為加上這個動態參數的關係分數變成了 `80 | 62 | 90`，也就使它被排在了 `LoginPage` 之後。而由於 `LoginPage` 本身只作為 `Layout` 層，並沒有實際的頁面內容，所以當使用者進入 `/my-website/` 時就會看到不完整的頁面。

<br/>

#### # 解決方法

最後的解決方向是，既然 `LoginPage` 本身不是一個實際的頁面，那就應該在它被 Vue Router 配對到時導轉出來，所以最後是在 `LoginPage` 裡增加 `redirect` 設定來解決此次問題。

::advance-code{:line='[5]'}
```js
{
  path: "/my-website/",
  name: "LoginPage"
  component: LoginLayout,
  redirect: { name: "PageLanding" },
  beforeEnter: () => {},
  children: [
    { path: "page-a", name: "PageA", component: PageA }, // 已登頁面 A
    { path: "page-b", name: "PageB", component: PageB } // 已登頁面 B
  ]
},
```
::

## 總結

會遇到這次的問題只能先檢討自己才疏學淺，沒有好好理解 Vue Router 的實際運作方式。不過也正好是因為有遇到這樣的需求才能讓我有機會從錯誤中學習，花費時間研究原始碼，最終也才能透徹的理解 Vue Router 背後巧妙的設計，並且將自己的經驗分享給大家。

最後的最後，如果你好奇自己網站的路由分數長什麼樣子，其實官方有推出一個 [工具](https://paths.esm.dev/?p=AAMeJVyAwBAUbHbAAJcKuAkgKAGeAlgA4AS8OxgBQAk4P5sALcD2gEABAkOlyYaeUpEmvTlsScKIHeMosLrNAoQz0PAq1CVbHTnCGwCy&t=/talent/) 來幫助你快速查看。或是也可以打開 Vue DevTool 的 Router 面板來查找。


<br/><br/>

##### 參考資料
- [Vue Router Documentation](https://router.vuejs.org/guide/essentials/route-matching-syntax.html)
- [Vue Router Source Code](https://github.com/vuejs/router/)