<script setup lang="ts">
const props = defineProps<{ fileName?: string; line?: number[] }>();

const code = ref<HTMLElement | null>(null);

onMounted(() => {
  nextTick(() => {
    if (!code.value) return;
    const lines = code.value.querySelectorAll("span");
    lines.forEach((line) => {
      if (
        line.getAttribute("line") &&
        props.line?.includes(Number(line.getAttribute("line")))
      ) {
        line.classList.add("hl");
      }
    });
  });
});
</script>

<template>
  <div ref="code" class="advance-code flex flex-col mt-16px">
    <div
      v-if="fileName"
      class="flex items-center -mb-4px pl-1 text-gray-400 dark:text-gray-400 text-xs"
    >
      <div class="i-iconoir:multiple-pages-empty mt-1px" />
      <div class="ml-1 leading-14px">{{ fileName }}</div>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.advance-code {
  font-family: "Fira Mono", monospace;

  :deep(pre) {
    flex-grow: 1;
  }
}
</style>
