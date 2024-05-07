<script setup lang="ts">
import Giscus from "@giscus/vue";

const colorMode = useColorMode();
const theme = computed(() => `${colorMode.value}_protanopia`);
</script>

<template>
  <Giscus
    id="comments"
    repo="f820602h/maxlee.me"
    repo-id="R_kgDOKiukNw"
    category="Announcements"
    category-id="DIC_kwDOKiukN84CfMBI"
    mapping="title"
    strict="1"
    reactions-enabled="0"
    emit-metadata="0"
    input-position="top"
    lang="zh-TW"
    loading="lazy"
    :theme="theme"
  />
</template>
