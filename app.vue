<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
html,
body {
  min-width: 360px;
  font-family: "Roboto", sans-serif;
  color: #393939;
  background: #f9f9f9;
  transition:
    color 0.2s,
    background 0.2s;
}

main {
  min-width: 360px;
  overflow: hidden;
}

.dark-mode,
.dark-mode body {
  color: #c1c1c1;
  background: #111;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.5s;
  transition-delay: 0.5s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
