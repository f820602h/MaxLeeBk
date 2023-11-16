<script setup>
defineProps({
  hasPrevScene: {
    type: Boolean,
    required: true,
  },
  hasNextScene: {
    type: Boolean,
    required: true,
  },
  prevScene: {
    type: Function,
    required: true,
  },
  nextScene: {
    type: Function,
    required: true,
  },
  cut: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <div
    class="rounded p-4 m-3 text-#393939 dark:text-#c1c1c1 bg-white dark:bg-black shadow-lg"
  >
    <slot />

    <div class="flex justify-between gap-3 mt-5">
      <button
        :disabled="!hasPrevScene"
        class="px-3 py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 disabled:text-gray-700 dark:disabled:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed duration-300"
        @click="prevScene()"
      >
        <div class="flex items-center gap-1">
          <div class="i-iconoir:arrow-left-circle" />
          <div class="text-sm">Prev</div>
        </div>
      </button>

      <button
        v-if="hasNextScene"
        class="px-3 py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 disabled:text-gray-700 dark:disabled:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed duration-300"
        @click="nextScene()"
      >
        <div class="flex items-center gap-1">
          <div class="text-sm">Next</div>
          <div class="i-iconoir:arrow-right-circle" />
        </div>
      </button>
      <button
        v-else
        class="px-3 py-2 rounded text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 disabled:text-gray-700 dark:disabled:text-gray-300 disabled:bg-gray-200 dark:disabled:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed duration-300"
        @click="cut()"
      >
        <div class="flex items-center gap-1">
          <div class="text-sm">Done</div>
          <div class="i-iconoir:check-circle" />
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
