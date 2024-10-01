---
title: 那些被忽略但很好用的 Web API / ImageCapture
date: 2021/9/20 11:38:00
tags: [JavaScript, WebApi, 13th鐵人賽]
description: Web API 是一個很大的主題，它涵蓋了很多不同的功能，而這次的系列文章就是想要介紹那些深埋在 window 裡，你不曾發覺或是常常遺忘的 API，或許在你開發網頁的過程中有遇過一些特殊需求，當下雖然用了一些管用手法解決，但看完這次的系列文章，你可能會有新的靈感或發現。
---

> 疫情時代，視訊串流當頭，用視訊鏡頭來做個線上攝影吧！

自從疫情爆發後，各行各業也開始進行居家辦公，使得視訊軟體及相關技術開始受重視，身為前端，我們也可以拿視訊鏡頭來做些好玩有趣的東西，而 ImageCapture 就是其中一個可以運用在這裡的 API。

---

## MediaStream

在認識 ImageCapture 之前我們必須要先了解 MediaStream，瀏覽器將獲取的影音資訊稱之為「流」(Stream)，其中流又包含了「軌」(Track)，如影像軌、音訊軌，而我們可以透過向使用者獲取授權並透過裝置來取得這些影音資訊，進而達到我們想要的操作目的。

<br/>

#### # Navigator.mediaDevices.getUserMedia

而我們要取得 MediaStream 的手段就是要先向使用者獲取設備的授權，這時候就要使用 `getUserMedia`：

```javascript
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((mediaStream) => {
    /* use the stream */
  })
  .catch((err) => {
    /* handle the error */
  });
```

當我們呼叫 `getUserMedia` 時，必須傳入一個稱為 `constraints` 的參數，該參數為一個物件，當中需要表示你想取得的 Track，例如上面我們就是傳入 `{ video: true }`，來取得視訊軌。

而 `getUserMedia` 會回傳 Promise 給我們，當使用者同意授權後就可以在 `then` 的 Callback 中取得 MediaStream。

<br/>

#### # MediaStream.getVideoTracks

當我們取得 MediaStream 後，我們還需要再取得當中的 Track，之後才可以透過 ImageCapture 來操作，這時候就需要使用 MediaStream 自身的 method `getVideoTracks`。

```javascript
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((mediaStream) => {
    const videoTrack = mediaStream.getVideoTracks()[0];
  })
  .catch((err) => {
    console.log(err);
  });
```

要注意的是，由於一個 MediaStream 中未必只有一個 VideoTrack，所以 `getVideoTracks` 回傳的會是陣列，記得要透過 `index` 索引出來。

<br/>

## ImageCapture

知道如何取得 MediaStreamTrack 後，就可以來認識 ImageCapture 了，它可以讓我們建立一個圖像擷取器，只要提供一個有效的 VideoTrack 給 ImageCapture 就可以進行圖像的擷取：

```javascript
const imageCapture = new ImageCapture(videoTrack);
```

<br/>

#### # ImageCapture.takePhoto

當我們為一個 ImageCapture 綁定了 VideoTrack 後，我們就可以透過 ImageCapture 底下的 methods 來進行圖像擷取了：

```javascript
let imageCapture;
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((mediaStream) => {
    const videoTrack = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(videoTrack);
  })
  .catch((err) => {
    console.log(err);
  });

document.querySelector("button").addEventListener("click", function () {
  imageCapture.takePhoto().then((blob) => {
    console.log(blob);
  });
});
```

呼叫 `takePhoto` 後，它會回傳 Promise，並且我們能在 `then` 的 Callback 中取得截圖的 Blob 物件。

<br/>

#### # ImageCapture.grabFrame

再來要介紹的則是 `grabFrame`，它和 `takePhoto` 一樣是擷取 videoTrack 的影像，差別在於它回傳的是 ImageBitmap 物件，而這種物件的好處是可以直接拿來畫在 Canvas 上。

```javascript
imageCapture.takePhoto().then((blob) => {
  console.log(blob);
});

imageCapture.grabFrame().then((imageBitmap) => {
  console.log(imageBitmap);
});
```

> Blob 物件可以夠過 `createImageBitmap(blob)` 來轉換成 ImageBitmap 物件

<br/>

## 實際運用

那最後我們就透過今天認識的 API 來實際做個視訊截圖攝影吧，首先先準備幾個按鈕以及 `video` 和 `canvas`。

```html
<div>
  <button onclick="openCamera()">開啟鏡頭</button>
  <button onclick="capture()">擷取畫面</button>
</div>
<video></video>
<canvas></canvas>
```

再來是在 `openCamera` 的時候使用 `getUserMedia` 及 `getVideoTracks` 來取得 MediaStreamTrack 並建立 ImageCapture。處此之外，我們還設定了 `video.srcObject`，如此一來我們就可以夠過 `<video>` 標籤來預覽視訊畫面。

```javascript
var video = document.querySelector("video");
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var videoTrack;
var imageCapture;

// 開啟鏡頭
function openCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      // 取得視訊軌並建立 imageCapture
      videoTrack = stream.getVideoTracks()[0];
      imageCapture = new ImageCapture(videoTrack);
      // 將媒體流設定到 <video> 中顯示播放
      video.srcObject = stream;
      video.play();
    })
    .catch((err) => {
      console.log(err);
    });
}

//擷取畫面
function capture() {
  imageCapture
    .takePhoto()
    .then((blob) => {
      // 將 Blob 轉成 ImageBitmap
      return createImageBitmap(blob);
    })
    .then((imageBitmap) => {
      // 繪製在 canvas 上
      const { width, height } = imageBitmap;
      const ratio = video.videoWidth / width;
      canvas.setAttribute("width", width * ratio);
      canvas.setAttribute("height", height * ratio);
      context.drawImage(imageBitmap, 0, 0, width * ratio, height * ratio);
    });
}
```

最後只要在 `capture` 的時候透過 `takePhoto` 進行截圖，並將 Blob 轉成 ImageBitmap 後丟到 `<canvas>` 裡，就大功告成囉。

完整的 code 我就放在 **[這裡](https://codepen.io/max-lee/pen/RwgJmJp)**，大家可以看看實際效果。

<br/>

其實視訊的操作沒有大家想像的那麼困難，簡單幾個 API 就可以做到，今天做的鏡頭截圖其實就可以做在會員的大頭照設定，讓使用者可以直接利用視訊鏡頭拍攝大頭照，相當便利。

---

\- 此篇文章為「iT 邦幫忙鐵人賽」參賽文章，同步發表於 [iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10270021) -
