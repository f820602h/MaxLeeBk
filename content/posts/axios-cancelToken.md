---
title: 透過 CancelToken 解析 Axios 原始碼
date: 2020/7/7 15:23:00
tags: [Vus.js,Axios]
description: 藉由設計「取消重複請求機制」來解析 Axios 的原始碼，看看 CancelToken 背後是如何實現取消請求的功能。
---
> 本篇會藉由設計「取消重複請求機制」來解析 axios 的原始碼，篇幅較長請耐心閱讀，如果要直接看實作可以點 [這裡](#實際運用)

其實要實踐取消請求的功能並不會很難，官方也有一目瞭然的 [教學](https://github.com/axios/axios#cancellation)，不過我自己在實作後一直對於 `cancelToken` 的原理耿耿於懷，就去研究了一下原始碼，所以在實際撰寫之前，想先分享一下我的理解。

接下來我們會直接看打包過的檔案： `axios/dist/axios.js`，所有 axios 的程式碼都在這。
你也可以一邊看 [github](https://github.com/axios/axios/blob/master/dist/axios.js) 一邊看文章。

---

## 為什麼需要取消請求

`cancelToken` 可以為我們取消多餘或不必要的 `http請求`，雖然在一般情況下可能感覺不到有取消請求的必要，不過在一些特殊情況中沒有好好處理的話，可能會導致一些問題發生。像是...

* 快速的頁面切換，使得上個頁面的請求在新頁面完成。
* `Pending` 時間較久的 `API` 若短時間內重複請求，會有舊蓋新的情況。
* 重復的 `post` 請求，有可能導致多次的資料操作，例如表單發送兩次。

---

## 發送請求與攔截器

#### # Class Axios
先從最主要的 `Axios類別` 看起，每一個 axios 應用都會創建一個 `Axios類別`，而當中最核心的就是 `request` 方法，不過我們先暫時跳過。
後面兩段則是在類別上又新增了好幾個方法，讓我們可以發起不同的http請求： `axios.get()`、`axios.post()`。
不過仔細一看會發現，最終我們呼叫的還是 `request`，所以才會說 `request` 是 axios 的核心。

```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

Axios.prototype.request = function request(config) {
  // ...先跳過
};

// 幫不同的請求方法創建別名，最終都是呼叫request
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
```
<br />

#### # Class InterceptorManager
在前面我們有看到，`Axios類別` 中有個 `interceptors` 屬性，其值為物件，並且有 `request` 和 `response` 的屬性。
這兩個屬性都是 `InterceptorManager類別`，而這個類別是用來管理攔截器的，我在 [上一篇](https://f820602h.github.io/Max-Blog/2020/05/27/axios-instance/) 有介紹過攔截器是什麼，忘記的人快去複習一下。

而今天我們就是要用Axios的攔截器來達到取消重複請求的功能，所以來看看 `InterceptorManager` 吧。
```javascript
function InterceptorManager() {
  // 儲存攔截器的方法，未來陣列裡會放入物件，每個物件會有兩個屬性分別對應成功和失敗後的函式
  this.handlers = [];
}

// 在攔截器裡新增一組函式，我們在上一篇有用過
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

// 註銷攔截器裡的某一組函式
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

// 原碼的寫法我覺得很容易看不懂，所以我改寫了一下
// 簡單來說就是拿handlers跑迴圈，把裡面的物件當作參數來給fn執行
InterceptorManager.prototype.forEach = function(fn) {
  this.handlers.forEach(obj => {
    fn(h);
  });
};
```
基本上這個類別還蠻單純的，主要就是三個操作 `handlers` 的方法，我們之前就是透過 `axios.interceptors.request.use` 和 `axios.interceptors.response.use` 來添加攔截器的。

但現在我們要再更深入了解Axios是怎麼在請求前後透過攔截器處理 `request` 和 `response` 的，這時候就要回去看 `Axios.prototype.request` 了。
<br />

#### # Axios.prototype.request
可以發現，每當我們發送請求 `Axios.prototype.request` 會宣告一個陣列以及一個Promise物件。
並且利用 `InterceptorManager.prototype.forEach` 把我們攔截器中新增的函式一一放進 `chain` 中。
至於 `dispatchRequest` 就是Axios主要發送 `XMLHttpRequest` 的函式，我們等等會提到。

當所有函式都放進 `chain` 後再兩兩一組拿出來作為 `promise.then()` 的參數，而且利用Promise的鏈式呼叫來串接。
最後我們的請求就可以依照 `request攔截器 -> dispatchRequest -> response攔截器` 的順序進行處理。


```javascript
Axios.prototype.request = function request(config) {
  //..省略
  var chain = [dispatchRequest, undefined];

  // 定義一個狀態是resolve的Promise; config是發出請求時帶的設定
  var promise = Promise.resolve(config);

  // InterceptorManager.prototype.forEach，把request攔截器的每一組函式「往前」加進chain裡
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  
  // InterceptorManager.prototype.forEach，把response攔截器的每一組函式「往後」加進chain裡
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // 全部加進去後，chain會長的像是這樣: [
  //   request.handlers[0].fulfilled, request.handlers[0].rejected, ..., 
  //   dispatchRequest, undefined,
  //   response.handlers[0].fulfilled, response.handlers[0].rejected, ...,
  // ]

  // 只要chain裡還有項目，就繼續執行
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```
最後把所有的函數串接起來後，`promise` 會像是下面這樣，並且 `Axios.prototype.request` 會把這個 `promise` 返回出來，所以我們才可以在呼叫 `axios.get()` 之後直接用 `then()`。
```javascript
Promise.resolve(config)
  .then(requestFulfilled, requestRejected)
  .then(dispatchRequest, undefined)
  .then(responseFulfilled, responseRejected)
```
<br />

* 這個 `Promise` 已經是 `resolve` 狀態，所以請求攔截器會拿到 `config` 來做前置處理。
* 官方文件有規定，添加請求攔截器的時候，fulfilled函式最後要返回 `config`，所以 `dispatchRequest` 才能拿到 `config` 來發送請求。
* `dispatchRequest` 在完成 `XMLHttpRequest` 後會返回請求的 `response` 給回應攔截器。
* 官方文件一樣有規定回應攔截器的fulfilled函式最後要返回 `response`，所以你最後才可以拿到API資料。

<br />

#### # Function dispatchRequest
現在知道了攔截器是如何串接的了，那 `dispatchRequest` 是如何發送http請求的呢？
我們只看重點部分，當中 `adapter` 會根據發送請求的環境對應到不同的適配器(建立請求的函式)，而 `dispatchRequest` 會再以 `then()` 串接，由http請求的成功或失敗來決定要進入回應攔截器的 `fulfilled` 函式或 `rejected` 函式。
```javascript
module.exports = function dispatchRequest(config) {
  // 檢查請求是否被取消的函式
  throwIfCancellationRequested(config);
	
  // axios會使用預設的http請求適配器，除非你有特別設定
  // 以瀏覽器發送請求會使用xhrAdapter，node環境則使用httpAdapter
  var adapter = config.adapter || defaults.adapter;

  // 適配器會把http請求包裝成Promise並返回，dispatchRequest再以then()串接
  return adapter(config).then(
    // 若請求成功dispatchRequest會返回response給回應攔截器的fulfilled函式
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      return response;
    },
    // 反之則將錯誤拋給回應攔截器的rejected函式
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) throwIfCancellationRequested(config);
      return Promise.reject(reason);
    }
  );
}
```
另外可以看到 `throwIfCancellationRequested` 不斷的出現，這個函式會檢查請求是否已經被「要求」取消，等我們進入到 CancelToken 時會再提到它。
<br />

#### # Function xhrAdapter
由於我們是以瀏覽器發送請求，所以這邊以 `xhrAdapter` 適配器為主，[完整程式碼](https://github.com/axios/axios/blob/master/dist/axios.js#L977-L1146)。
`xhrAdapter` 整段很長，但如果只看重點，其實就是在發送 `XMLHttpRequest`，並在過程中做一些判斷來決定要 `resolve` 或 `reject` 這個 `Promise`。
```javascript
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    // 建立一個新的XMLHttpRequest
    var request = new XMLHttpRequest();

    // 監聽readyState的變化
    request.onreadystatechange = function handleLoad() {
      // readyState === 4 代表請求完成
      if (!request || request.readyState !== 4) return;

      // 若請求完成，準備好回應的response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      // settle內部會做一些驗證，成功則resolve(response)，反之reject(error)
      settle(resolve, reject, response);
      request = null;
    };

    // 發送XMLHttpRequest
    request.send(requestData);
  });
};
```
到目前為止我們已經知道 axios 處理請求的流程，接下來就進入本文的重點 - CancelToken。

![我把整個架構圖像化，希望對各位有幫助。](/img/content/axios-cancelToken/flow.png)

---

## CancelToken

#### # 基本用法
在看原始碼前，我們先看看 `CancelToken` 是怎麼使用的。
這段程式做了什麼可以先不管，我們只要知道，如果要使用 `CancelToken` 就必須在 `request` 的 `config` 中新增一個 `cancelToken` 屬性。
```javascript
let cancel

axios.get('/user/12345', {
  cancelToken: new axios.CancelToken(c => { cancel = c; })
});

cancel()
```
<br/>

#### # Class CancelToken
再來就該看看我們在 `cancelToken` 屬性中建構的 `CancelToken類別` 是什麼。
* 首先，每一個 `CancelToken` 都會建立一個 `Promise`，並且將 `resolve` 主動權給拿了出來，定義給`resolvePromise`。
* 再者，當我們要建構一個 `CancelToken` 的時候必須傳入一個 `function`，它會直接被呼叫並且得到一個名為 `cancel` 的函式作為參數。

當要取消請求就是呼叫 `cancel`，而它做了兩件事情： 1. 賦值給屬性 `reason`　2. 將屬性 `promise` 給 `resolve`

```javascript
function CancelToken(executor) {
  // 判斷executor是否為function
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  // 建立一個新的Promise物件，並將其resolve函式賦予給變數resolvePromise
  // 此時Promise會是pending狀態，還未被resolve
  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  // 執行executor，並以函式「cancel」作為參數帶入
  var token = this;
  executor(function cancel(message) {
    // 確認reason是否存在，若存在代表cancel已被執行過
    if (token.reason) return;
    
    // 將reason賦值為一個Cancel類別
    token.reason = new Cancel(message);

    // resolve Promise
    resolvePromise(token.reason);
  });
}

// 確認reason是否存在，若存在代表此CancelToken的cancel已被執行過，便拋出錯誤
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) throw this.reason;
};

```
所以 axios 只要根據這兩個屬性，就能判斷此次請求是否已經被取消，而 `throwIfRequested` 就是利用 `reason` 來判斷是否要拋出錯誤。
<br/>

#### # throwIfCancellationRequested
還記得我們在 `dispatchRequest` 裡有看到 `throwIfCancellationRequested` 不斷的被呼叫嗎？[這裡](#Function-dispatchRequest)
它的作用就是判斷 `config` 是否有被加上 `cancelToken` 屬性，有的話就會呼叫 `CancelToken.prototype.throwIfRequested`，以此來判斷請求是否已被取消。
```javascript
function throwIfCancellationRequested(config) {
  if (config.cancelToken) config.cancelToken.throwIfRequested();
}
```
<br/>

#### # Function xhrAdapter
沒錯，又再次看到了 `xhrAdapter`，因為在前面我暫時省略了 `xhrAdapter` 內部的一個判斷。
當它發現 `config.cancelToken` 存在，便會為 `CancelToken.promise` 接上一個 `then()`，意味著當 `promise` 被 `resolve` 的那一刻，請求就會被 `abort`。

```javascript
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var request = new XMLHttpRequest();

    // ...省略....

    if (config.cancelToken) {
      // cancelToken.promise要被resolve才會執行then
      // onCanceled(cancel)中的cancel會是cancelToken.reason
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) return;

        // 取消XMLHttpRequest
        request.abort();
        reject(cancel);

        request = null;
      });
    }

    request.send(requestData);
  });
};
```

<br/>

#### # 重點整理
首先我們可以知道 CancelToken 的原理就是在 `request config` 中加上一個 `CancelToken類別`，並且利用其類別屬性來判斷 `cancel` 函式是否被呼叫執行，若已執行代表該請求被「要求」取消。

另外可以發現 axios 在以下三個時機點都有檢查請求的取消與否：
* 請求發送前 - [dispatchRequest開頭](#Function-dispatchRequest)
* 請求發送中 - [xhrAdapterq](#Function-xhrAdapter-1)
* 請求發送後 - [dispatchRequest.then](#Function-dispatchRequest)

---

## 實際運用

了解整個 axios 架構以及 CancelToken 後，終於可以來實踐取消請求的功能了，先來釐清我們的需求。

> 每次發送請求要判斷是否已經存在相同的請求，若存在就取消前一次請求，只保留最新的

根據這樣的需求我們歸納出幾個必要的關鍵，然後準備以下程式碼
1. 為了要能取消請求，必須設定 `config.cancelToken`
2. 為了要判斷重複的請求，要把每次請求記錄在暫存中
3. 在請求完成或被取消時從暫存中移除

```javascript
// 暫存：紀錄執行中的請求
const pending = new Map();

const addPending = config => {
  // 利用method和url來當作這次請求的key，一樣的請求就會有相同的key
  const key = [config.method, config.url].join("&");
  // 為config添加cancelToken屬性
  config.cancelToken = new axios.CancelToken(cancel => {
    // 確認暫存中沒有相同的key後，把這次請求的cancel函式存起來
    if (!pending.has(key)) pending.set(key, cancel);
  });
};

const removePending = config => {
  // 利用method和url來當作這次請求的key，一樣的請求就會有相同的key
  const key = [config.method, config.url].join("&");
  // 如果暫存中有相同的key，把先前存起來的cancel函式拿出來執行，並且從暫存中移除
  if (pending.has(key)) {
    const cancel = pending.get(key);
    cancel(key);
    pending.delete(key);
  }
};
```
準備就緒後，只要在請求攔截與回應攔截器中呼叫它們即可...
```javascript
// request 攔截器
instance.interceptors.request.use(
  config => {
    // 先判斷是否有重複的請求要取消
    removePending(config);
    // 把這次請求加入暫存
    addPending(config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// response 攔截器
instance.interceptors.response.use(
  response => {
    // 請求被完成，從暫存中移除
    removePending(response);
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
```
從此我們不必再擔心 API 在回應前被重複觸發導致錯誤，因為我們永遠只會保留最新一次的請求。