---
title: Test Doubles in Vitest
date: 2023/11/28 16:00:00
tags: [Vus.js,Vitest,Testing]
---

> Test Double - 測試替身 是一種讓 SUT 可以不依靠 DOC 而單獨被測試的作法，在實作上分為 Stub 和 Mock。


## Stub vs. Mock

#### # Stub （Stub、Dummy、Fake）
- **目的：** Stub 用於提供預定義的響應。它們不關心外部行為，只是在被呼叫時返回特定的值或行為。
- **使用場景：** 當你需要測試的代碼部分依賴於某個組件，且這個組件的響應是已知且固定的，或是該組件已被測試過，你就可以使用 Stub。
- **行為：** 通常是被動的，只在被直接呼叫時才響應。

<br/>

#### # Mock（Mock、Spy）
- **目的：** Mock不僅提供響應，還能檢查交互行為是否符合預期。它們用於驗證 DOC 與SUT 之間的交互。
- **使用場景：** 當你需要驗證代碼是否以正確的方式與外部系統交互時，你應該使用 Mock。
- **行為：** 更加主動，不僅返回響應，還檢查呼叫的次數、參數等。

> 粗暴的分辨就是你有沒有想要測試與 DOC 之間的互動行為，有就用 Mock，沒有則用 Stub。

<br/>

```js
function fetchData(api) {
    return api.getData();
}

describe('fetchData', () => {
  it('should call API and return data', () => {
    // Stub
    const stubApi = {
      getData: () => "stubbed data"
    };
    expect(fetchData(stubApi)).toEqual("stubbed data");

    // Mock
    const mockApi = vi.fn().mockReturnValue("mocked data");
    fetchData(mockApi);
    expect(mockApi).toHaveBeenCalled();
  });
});
```

<br/>

## Stub vs. Dummy vs. Fake

#### # Stub
當測試的功能依賴於一些外部系統或複雜的組件時，可以使用 Stub 來模擬這些依賴，提供固定的輸出。

```js
function getUserData(userId, database) {
  return database.fetchUser(userId);
}

const databaseStub = {
  fetchUser: (id) => ({ id: id, name: 'John Doe' })
};

const result = getUserData(1, databaseStub);
console.log(result); // { id: 1, name: 'John Doe' }
```

<br/>

#### # Dummy
當函數或方法需要一個參數，但在這個特定的測試案例中該參數不重要時，可以使用 Dummy。

```js
function performAction(action, logger) {
  // ...
  logger.log('Action performed');
}

const dummyLogger = {
  log: () => {}
};

performAction('save', dummyLogger); // logger不會執行任何有意義的操作
```

<br/>

#### # Fake
當需要模擬一個具有實際功能的組件，但又不想引入複雜性或外部依賴時，可以使用Fake。

```js
class FakeDatabase {
  constructor() {
    this.users = [{ id: 1, name: 'John Doe' }];
  }

  fetchUser(id) {
    return this.users.find(user => user.id === id);
  }
}

const fakeDatabase = new FakeDatabase();
const result = getUserData(1, fakeDatabase);
console.log(result); // { id: 1, name: 'John Doe' }
```

<br/>

## Mock vs. Spy

#### # Mock
是一種完全模擬的對象，用於模擬外部系統或復雜行為，並且允許進行徹底的行為驗證。

::advance-code{file-name="math.js" :line='[]'}
```js
export function add(a, b) {
  return a + b;
}
```
::

::advance-code{file-name="math.spec.js" :line='[]'}
```js
import math from "./math";

describe("add function" ,() => {
  it('使用 Mock 測試 add 函數', () => {
    math.add = vi.fn(() => 5)
    expect(math.add(1, 2)).toBe(5); // 測試這個 Mock 函數
    expect(math.add).toHaveBeenCalledWith(1, 2); // 確認這個 Mock 函數是否被以特定的參數調用
  });
})
```
::

<br/>

#### # Spy
用於監控已存在的對象或函數的行為，而不改變它們的原有行為。它適用於需要確保函數被調用，且調用方式正確的情境。

::advance-code{file-name="math.js" :line='[]'}
```js
export function add(a, b) {
  return a + b;
}
```
::

::advance-code{file-name="math.spec.js" :line='[]'}
```js
import math from "./math";

describe("add function" ,() => {
  it('使用 Spy 測試 add 函數', () => {
    const spy = vi.spyOn(math, 'add');
    math.add(1, 2);
    expect(math.add(1, 2)).toBe(3); // 確認實際的返回值
    expect(spy).toHaveBeenCalledWith(1, 2); // 檢查 add 方法是否被以特定的參數調用
  });
})
```
::

> Spy 比較特殊，會根據你的使用方法，時而為 Mock 時而為 Stub

<br/>

## 使用 Vitest API 實例

#### # vi.stubEnv

::advance-code{file-name="categoryTool.js" :line='[3]'}
```js
export const categoryToolMiddleWare = async (store, to, from, next, done) => {
  const link = document.createElement("link");
  link.href = `${import.meta.env.VITE_CDN_URL}category-picker-2.0.0.css`;
  // ... 插入 script 的邏輯
};
```
::

::advance-code{file-name="categoryTool.spec.js" :line='[2]'}
```js
const domain = "https://cdn.104-dev.com.tw/";
vi.stubEnv("VITE_CDN_URL", domain);

describe("categoryToolMiddleWare", () => {
  it("should append link and script tag when window.categoryPicker is falsy", async () => {
    await categoryToolMiddleWare(store, to, from, next, done);
    expect(document.head.innerHTML).toContain(
      `${domain}category-picker-2.0.0.css`
    );
  });
});
```
::

#### # vi.stubGlobal

::advance-code{file-name="utmInherit.js" :line='[3]'}
```js
export const utmInheritMiddleWare = async (store, to, from, next, done) => {
  // 取得 window.opener
  const openerHost = window?.opener?.window?.location?.host;

  const newQuery = {
    // ...用 openerHost 計算最終 query
  };
  
  next({ ...to, query: newQuery });
};
```
::

::advance-code{file-name="utmInherit.spec.js" :line='[6,7,8,9,10,11,12]'}
```js
const utm_source = "source";
const utm_medium = "medium";
const utm_campaign = "campaign";
const utm = `?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}`;

vi.stubGlobal("window", {
  opener: {
    window: { 
      location: { host: domain, search: utm }
    }
  }
});

describe("categoryToolMiddleWare", () => {
  it("isNewTab, opener has utm query", async () => {
    await utmInheritMiddleWare(store, to, from, next, done);
    expect(next).toHaveBeenCalledWith({
      ...to,
      query: { utm_source, utm_medium, utm_campaign }
    });
  });
});
```
::

#### # vi.useFakeTimers

::advance-code{file-name="windowFocus.js" :line='[9]'}
```js
const checkStateOnFocus = () => {
  window.addEventListener("focus", checkComebackStatus);
};

const checkComebackStatus = async () => {
  await getUserInfoFocus(); // call api 取得使用者資料 ...

  window.removeEventListener("focus", checkComebackStatus);
  window.setTimeout(checkStateOnFocus, 15000);   // 過 15 秒後會再次註冊 focus 事件
};

export const windowFocusMiddleWare = (store, to, from, next, done) => {
  window.removeEventListener("focus", checkComebackStatus);
  checkStateOnFocus();
  done();
};
```
::

::advance-code{file-name="windowFocus.spec.js" :line='[4,12]'}
```js
describe("windowFocusMiddleWare", () => {
  beforeEach(() => {
    // 攔截並替換了 js 環境中 setTimeout、setinterval、Date 等時間相關方法的實踐
    vi.useFakeTimers(); 
  });

  it("should call getUserInfoFocus when focus event is triggered twice over 15 sec", async () => {
    await windowFocusMiddleWare(null, to, from, null, done);
    window.dispatchEvent(new Event("focus"));
    expect(mockedMethod).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(15000);

    window.dispatchEvent(new Event("focus"));
    expect(mockedMethod).toHaveBeenCalledTimes(2);
  });
});
```
::

#### # vi.mock & vi.fn

::advance-code{file-name="windowFocus.js" :line='[1,4]'}
```js
import { getUserInfoFocus } from "@/apis/user";

const checkComebackStatus = async () => {
  await getUserInfoFocus(); // call api 取得使用者資料 ...

  // 其他邏輯...
};
```
::

::advance-code{file-name="windowFocus.spec.js" :line='[3,4,5,11]'}
```js
const { mockedMethod } = vi.hoisted(() => ({ mockedMethod: vi.fn() }));

vi.mock("@/apis/user", () => {
  return { getUserInfoFocus: mockedMethod };
});

describe("windowFocusMiddleWare", () => {
  it("should call getUserInfoFocus when to.name is not in excludePages", async () => {
    await windowFocusMiddleWare(null, to, from, null, done);
    window.dispatchEvent(new Event("focus"));
    expect(mockedMethod).toHaveBeenCalledTimes(1);
  });
});
```
::

#### # vi.spyOn

::advance-code{file-name="nccLogViewPage.js" :line='[2]'}
```js
export const viewPageMiddleWare = async (store, to, from, done) => {
  if (document.hasFocus()) {
    // 一些邏輯...
    done()
  }
};
```
::

::advance-code{file-name="nccLogViewPage.spec.js" :line='[1,6]'}
```js
const mySpy = vi.spyOn(document, "hasFocus").mockImplementation(() => true);

describe("viewPageMiddleWare", () => {
  it("should not push data when to.name is in excludePages", async () => {
    await viewPageMiddleWare(store, to, from, done);
    expect(mySpy).toHaveBeenCalled(); // 有沒有這行決定了 mySpy 是 Mock 還是 Stub 
    expect(done).toHaveBeenCalled();
  });
});
```
::