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
  --global-font: "Roboto", sans-serif;
  --global-color: #393939;
  --global-bg-color: #f9f9f9;
  --global-bg-color-rgb: 249 249 249;

  --highlight-color: black;
  --highlight-color-hover: white;
  --highlight-light-color: #292929;

  --box-bg-color: #e9e9e9;
  --box-bg-light-color: #f6f6f6;
  --box-border-color: #d9d9d9;

  --sp-box-bg-color: rgb(149 120 247 / 10%);
  --sp-box-border-color: #9578f7;

  --code-font: "Fira Mono", monospace;
  --code-bg-color: white;
  --code-border-color: #dfdfdf;
  --code-highlight-bg-color: #f4f4fa;

  --img-bg-color: transparent;
  --link-hover-color: #9578f7;

  --nav-color: #bbb;
  --nav-hover-color: #6b7280;
}

.dark-mode,
.dark-mode body {
  --global-color: #ccc;
  --global-bg-color: #0e0e0e;
  --global-bg-color-rgb: 14 14 14;

  --highlight-color: white;
  --highlight-color-hover: black;
  --highlight-light-color: #ddd;

  --sp-box-bg-color: rgb(149 120 247 / 10%);
  --sp-box-border-color: #9578f7;

  --box-bg-color: #303030;
  --box-bg-light-color: #151515;
  --box-border-color: #444;

  --code-font: "Fira Mono", monospace;
  --code-bg-color: #050505;
  --code-border-color: #303030;
  --code-highlight-bg-color: #222;

  --img-bg-color: white;
  --link-hover-color: #9578f7;

  --nav-color: #777;
  --nav-hover-color: #6b7280;
}

html,
body {
  min-width: 360px;
  min-height: 100dvh;
  font-family: var(--global-font);
  color: var(--global-color);
  background-color: var(--global-bg-color);
  transition:
    border 0.2s,
    color 0.2s,
    background-color 0.2s;
}

main {
  position: relative;
  min-width: 360px;
}
</style>
