---
title: 用 Axios Instance 管理 API
date: 2020/5/27 20:46:25
tags: [Vus.js,Axios]
---
> 自從用前端框架開始開發後，就沒在用 JQuery Ajax 了，取而代之的是 Axios

 Axios 不僅輕量，而且直接幫我們把非同步操作包裝成 Promise 物件，所以我們可以直接使用 Promise API 像 `then()`、`catch()`。

雖然自己在用 Axios 的時候，都是直接 `improt` 進來就開始 `axios.get`、`axios.post`，不過後來在工作中接觸到了更好管理 API 的方式 Axios - Instance （Axios實體）。

---

## 為什麼要用 Axios Instance ?

* 集中設定 Request Config
* 支援攔截器，可在 then/catch 前做額外處理
* 封裝 API 易於管理
* 
---

## 建立實體

#### # Custom Config
我們可以建立一支檔案 api.js ，先用 axios.create 創造一個實體，裡面放進 Request 的相關設定屬性。

```javascript
// api.js
import axios from "axios";

// baseURL是你API的主要Domain，只後發請求時只要填相對路徑就可以了
const instance = axios.create({
  baseURL: 'https://your.api.domain.tw/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000
});
```
Request Config 其實有不少屬性可以設定，但一般常見的是上面這些，詳細的說明 [官方](https://github.com/axios/axios#request-config) 都有介紹，這邊就不再贅述。

<br />

#### # 攔截器

攔截器的設置可以讓我們在發出 `request` 或接到 `response` 之前做一些事情，例如改變 `response` 回來的資料格式，或是根據不同 `request` 來添加不同的 config 等等。

* Request Interceptors
用 `axios.interceptors.request.use()` 就可以設置 `request` 的攔截器，放入兩個函式做為參數。
   - Fulfilled Function: 第一個函式會在 request 送出前攔截到此次的 config，讓你可以做一些前置處理。
   - Rejected Function: 第二個函式可以讓你在 request 發生錯誤時做一些額外的處理。

```javascript
// 此處的instance為我們create的實體
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
```
<br />

* Response Interceptors
`response` 攔截器大同小異，用 `axios.interceptors.response.use()` 就可以設置。
而這邊要著墨的部分就在於攔截到 `response` 發生錯誤時的 `error` 處理。

```javascript
// 此處的instance為我們create的實體
instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response){
      switch (error.response.status) {
        case 404:
          console.log("你要找的頁面不存在")
          break;

        case 500:
          console.log("程式發生問題")
          break;

        default
          console.log(error.message)
      }
    } 
    if (!window.navigator.onLine) {
      alert("網路出了點問題，請重新連線後重整網頁");
      return;
    }
    return Promise.reject(error);
  }
);
```
這樣設定後，就可以在 `response` 回應錯誤時做相關的處理，例如導頁就是常見的處理方式。
以上就是攔截器的主要用途和應用，預計之後會再寫一篇說明該如何用攔截器來取消 `request`。

<br />

#### # 封裝請求

有了主設定以及攔截器，`axios instance` 就設計得差不多了，一般來說你已經可以把實體 `export` 出去使用了，但為了更有系統性的管理後端提供的 API，我們可以設計成 `function` 再 `export` 出去。
```javascript
// 此處的instance為我們create的實體
export default function(method, url, data = null, config) {
  method = method.toLowerCase();
  switch (method) {
    case "post":
      return instance.post(url, data, config);
    case "get":
      return instance.get(url, { params: data });
    case "delete":
      return instance.delete(url, { params: data });
    case "put":
      return instance.put(url, data);
    case "patch":
      return instance.patch(url, data);
    default:
      console.log(`未知的 method: ${method}`);
      return false;
  }
}
```
這樣就可以透過判斷參數來回傳相對應的 `method`，而且我們也已經把發送請求的格式寫好了。
今天假設我們有一些與使用者相關的 API 好了，我們就可以把這個函式 `import` 進來，把 API 一支支地列出。
```javascript
// user.js
import req from "./api";

export const userSignUp = (signUpData) => {
  return req("post", "/user/sign-in", signUpData)
}

export const userLogIn = (logInData) => {
  return req("post", "/user/log-in", logInData)
}

export const userLogOut = () => {
  return req("get", "/user/log-out")
}

export const userDelete = (userNo) => {
  return req("delete", "/user/delete", userNo)
}
```

而實際要呼叫API的時候，只要把它 `import` 進來就可以用囉～
```javascript
import { userLogIn } from "./user";

userLogIn()
  .than(res => {
    console.log("登入成功");
  })
  .catch(error => {
    // response攔截器會先執行，除非你漏接了，才會進到catch
  })
```

這樣統一、集中且有條理地管理API是不是很清爽呢！
