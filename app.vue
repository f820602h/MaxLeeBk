<script setup lang="ts"></script>

<template>
  <StagePlaySpotlight>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </StagePlaySpotlight>
</template>

<style lang="scss">
html,
body {
  min-width: 360px;
  min-height: 100dvh;
  font-family: "Roboto", sans-serif;
  color: #393939;
  background-color: #f9f9f9;
  transition:
    border 0.2s,
    color 0.2s,
    background-color 0.2s;
}

.dark-mode,
.dark-mode body {
  color: #ccc;
  background-color: #1a1a1a;
}

main {
  position: relative;
  min-width: 360px;
}
</style>
