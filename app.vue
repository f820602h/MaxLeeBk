<script setup lang="ts">
const { show, hide } = useLoading();
</script>

<template>
  <StagePlaySpotlight>
    <NuxtLayout>
      <NuxtPage
        :transition="{
          name: 'page',
          mode: 'out-in',
          appear: true,
          onEnter: (el, done) => {
            hide();
            done();
          },
          onBeforeLeave(el) {
            show();
          },
        }"
      />
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
    color 0.2s linear,
    background-color 0.2s linear !important;
}

main {
  position: relative;
  min-width: 360px;
}

.dark-mode,
.dark-mode body {
  color: #aaa;
  background-color: #202020;
}

.page-enter-active,
.page-leave-active {
  transition: all 1s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
