<script setup lang="ts">
defineProps<{ from: string; url: string }>();
</script>

<template>
  <div
    class="p-4 bg-gray-2 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 italic mt-4"
  >
    <slot />
    <p v-if="from" class="from text-right px-3">
      -- <a :href="url || 'javascript:;'" class="text">{{ from }}</a>
    </p>
  </div>
</template>

<style scoped lang="scss">
div :deep(> *) {
  font-family: sans-serif;
  margin: 0 !important;
}

.from {
  font-size: 12px;
  margin-top: 12px !important;
}
</style>
