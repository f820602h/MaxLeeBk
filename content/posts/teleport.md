---
title: Vue3 Teleport 應用
date: 2023/10/20 12:00:00
tags: [Vue, Teleport]
description: Vue3 的 Teleport 是一個內建的元件，可以將子元件移動到指定的 DOM 元素下，這樣可以避免父層的樣式影響，或是實現一些特殊的動畫效果。
---

> 官方文件：[https://vuejs.org/guide/built-ins/teleport.html](https://vuejs.org/guide/built-ins/teleport.html)

<br/>

- 父子元件的層級不會受影響
- 資料會 keep alive

## Component Props

```typescript
interface TeleportProps {
  to: string | RendererElement | null | undefined;
  disabled?: boolean;
}
```

---

## Use Case

### # 避開父層的樣式影響

因為 `position: fixed` 與 `transform`、`perspective`、`filter` 衝突。將 Modal 移至 body 底下可以避開這樣的樣式衝突。

```vue
<template>
  <button @click="open = true">Open Modal</button>

  <Teleport to="body">
    <div v-if="open" class="modal">
      <p>Hello from the modal!</p>
      <button @click="open = false">Close</button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

<br/>

### # FB & YT 的迷你浮動播放器

![](/img/content/teleport/youtube.png)

<br/>

### # 共用的 Layout 區塊 & 共用的 Modal / Toast

減少「重複的功能實踐」、「重複的元件使用」或「分散的設定」


::advance-code{file-name="Layout.vue" :line='[8,9,10,12,18]'}
```vue
<template>
  <div class="root">
    <header></header>
    <main>
      <aside></aside>
      <section>
        <div class="view-header">
          <h2 id="view-header__title"></h2>
          <p id="view-header__subtitle"></p>
          <div id="view-header__extra"></div>
        </div>
        <router-view></router-view>
      </section>
    </main>
    <footer></footer>

    <div v-if="currentModalContent" class="modal">
      <p id="modal__content"></p>
      <button @click="open = false">Close</button>
    </div>
  </div>
</template>

<script setup>
// some logic for view-header
// maybe show/hide, dynamic width/height, event handler....

const currentModalContent = ref("")
provide("modal", {
  current: readonly(currentModalContent),
  set: (id) => currentModalContent.value = id,
  remove: () => currentModalContent.value = ""
})
</script>
```
::

::advance-code{file-name="SomeRouterPage.vue"}
```vue
<template>
  <div class="route-1">
    <Teleport to="#view-header__title">{{ viewTitle }}</Teleport>
    <Teleport to="#view-header__subtitle">{{ viewSubtitle }}</Teleport>
    <Teleport to="#view-header__extra">
      <button>Click Me</button>
    </Teleport>

    <section>
      <div>.....</div>
    </section>

    <Teleport v-if="current === A" to="#modal__content">
      {{ modalContentA }}
    </Teleport>
    <Teleport v-if="current === B" to="#modal__content">
      {{ modalContentB }}
    </Teleport>
  </div>
</template>

<script setup>
const { current, set, remove } = inject("modal")
</script>
```
::

<br/>
    
### # 特殊的動畫實現

[Vue Starport Demo](https://vue-starport.netlify.app/)

![](/img/content/teleport/teleport.png)
    