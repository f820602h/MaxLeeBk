---
title: 那些被忽略但很好用的 Web API / Geolocation
date: 2021/10/13 19:19:00
tags: [JavaScript, WebApi, 13th鐵人賽]
---

> 我的字典裡沒有放棄，因為已鎖定你

現在有不少網站都有地圖相關的功能，而為了解決地圖繪製、路線運算、區域標示...等等複雜的功能，通常大家都會選用第三方的套件或服務，例如 Google Map API、Leaflet、MapBox 之類的，也因為有了這些好用的地圖套件，所以瀏覽器本身的 Geolocation API 可能就容易被遺忘。

---

## Geolocation

當然，Geolocation API 並沒有上述那些套件的強大功能，它能做的就是取得使用者目前的地理座標位置，不過，要是你的功能並沒有那麼複雜，單單只是想知道用戶位置的話，其他大可不用殺雞焉用牛刀，Geolocation API 就可以滿足你了。

<br/>

#### # Navigator.geolocation

Geolocation 的支援度是非常高的，電腦、手機，各家瀏覽器基本上都是可以使用的，不過在使用前你依然可以先進行檢查，若瀏覽器支援的話，只要透過 `navigator.geolocation` 就能取得 Geolocation 實體。

```javascript
if ("geolocation" in navigator) {
  console.log(navigator.geolocation);
} else {
  alert("你的裝置或瀏覽器不支援定位功能");
}
```

<br/>

#### # Geolocation.getCurrentPosition

有了 Geolocation 實體後，就可以用 `getCurrentPosition` method 來取得座標位置了，該方法有三個參數，其中第一個為必傳，後兩個為選填：

- **success**： 一個回呼函式，會在成功取得位置資訊時觸發，該函式會接到一個 Position 物件。
- **error**： 一個回呼函式，會在方法發生錯誤時觸發，該函式則會接到 PositionError 物件。
- **options**： 一個物件，其中的屬性可以用來設定獲取位置時的規則。

<br/>

參數 options 的詳細屬性：

- **enableHighAccuracy**： 一個布林值，決定是否要以最高精準度來取得座標位置，預設為 `false`。
- **timeout**： 一個代表毫秒數的正數，規定設備必須要在多少時間內回應位置資訊，預設為 `Infinity`。
- **maximumAge**： 一個代表毫秒數的正數，表示可以接受多少毫秒以前的暫存位置，預設為 `0`。

<br/>

> **注意**： 若將 `enableHighAccuracy` 打開，位置資訊的回傳時間將會變長，且可能會使裝置消耗更多電量。

```javascript
function successHandler(position) {
  console.log(position);
}

function errorHandler(err) {
  console.log(err);
}

navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
});
```

由於定位資訊屬於隱私範圍，所以在呼叫 `getCurrentPosition` 時，它會先確認裝置的授權狀態，若使用者不接受則會發生錯誤，若使用者未表明授權與否，則會出現詢問對話框。

<img src="/img/content/webapi-29/check.png" style="max-width: 500px;" />

<br/>

#### # Geolocation.watchPosition

除了 `getCurrentPosition` 可以拿到執行當下的使用者定位之外，還有另外一個 method 是 `watchPosition`，它的功能與參數都與 `getCurrentPosition` 相同，差別是它會在使用者的位置發生改變時主動觸發 Success CallBack，等於是在監聽使用者的定位。

```javascript
function successHandler(position) {
  console.log(position);
}

function errorHandler(err) {
  console.log(err);
}

// watchPosition 執行後會回傳一個獨一的 ID
const geoId = navigator.geolocation.watchPosition(successHandler, errorHandler);
```

<br/>

#### # Geolocation.clearWatch

在上方 `watchPosition` 的範例中，我們用 `geoId` 來接它丟出來 ID 編號，我們可以將編號傳入 `clearWatch` method 中，便可以使對應的 `watchPosition` 停止監聽使用者定位。

```javascript
const geoId = navigator.geolocation.watchPosition(successHandler, errorHandler);
navigator.geolocation.clearWatch(geoId);
```

<br/>

#### # Position 物件

就如前面所說，Success CallBack 在成功獲取位置資訊時會被觸發，並且可以拿到 Position 物件，其中就包含了許多與地理位置相關的屬性可以使用：

- **position.coords.longitude**： 使用者所在位置的經度。
- **position.coords.latitude**： 使用者所在位置的緯度。
- **position.coords.accuracy**： 回傳經緯度的水平誤差(平面距離)，單位為公尺。
- **position.coords.altitude**： 使用者所在位置的海拔高度，單位為公尺。
- **position.coords.altitudeAccuracy**： 回傳高度的垂直誤差(垂直高度)，單位為公尺。
- **position.coords.heading**： 使用者面向的方位，會以順時針相對於正北方的夾角角度呈現。
- **position.coords.speed**： 使用者面對的數度，單位為公尺/秒。

<br/>

> **注意**： 以上屬性均為浮點數，部分屬性會在裝置無法提供時回傳 `null`。

<br/>

#### # PositionError 物件

另一方面，Error CallBack 則會在發生錯誤時觸發，並取得 PositionError 物件，該物件中的 `code` 屬性將會告知我們目前的錯誤是何種類型及原因：

| 錯誤代號 |       錯誤名稱       |            解釋             |
| :------: | :------------------: | :-------------------------: |
|    1     |  PERMISSION_DENIED   |   沒有獲取裝置定位的權限    |
|    2     | POSITION_UNAVAILABLE |      位置資訊獲取錯誤       |
|    3     |       TIMEOUT        | 在 Timeout 前未取得定位資訊 |

<br/>

#### # 簡單的小範例

有了 Geolocation API 之後，我們就可以製作一些與位置有關的簡單小功能，像下方的範例就是取得使用者位置後，將經緯度丟給後端來計算距離最近的門市，然後將門市資訊提供給用戶。

```html
<button onclick="getPosition()">搜尋最近的門市</button>
<div id="result"></div>

<script>
  const result = document.querySelector("#result");
  function successHandler(position) {
    const { longitude, latitude } = position.coords;

    // 取得經緯度後傳給後端進行門市的搜尋
    axios.get("https://backend/store", { longitude, latitude }).then((res) => {
      const store = res.data;
      result.innerHTML = "離你最近的門市是" + store.name + "地址： " store.address;
    });
  }

  function errorHandler(err) {
    alert("暫時無法取得您的所在位置，請稍後再試");
  }

  function getPosition() {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }
</script>
```

<br/>

每每說到裝置定位、座標時，大家第一個想到的可能都是 Google Map 或其他地圖套件，但其實瀏覽器本身就有 Geolocation API 可以幫我們處理簡單的定位功能。所以要是你的功能未必要顯示地圖的話，其實你可以選擇使用它喔。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10281557) -
