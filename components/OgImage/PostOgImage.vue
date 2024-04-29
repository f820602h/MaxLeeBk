<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: "title" });
</script>

<template>
  <div
    class="relative h-full w-full flex items-start justify-start border-solid text-white"
    style="background-color: #171717"
  >
    <div
      class="absolute top-0 left-0 w-full h-full"
      style="
        background: radial-gradient(ellipse at -200% 80%, #9578f7, transparent);
      "
    />

    <div
      class="relative flex flex-col justify-between items-center w-full h-full"
    >
      <div class="flex flex-col items-center px-20 pt-[80px]">
        <img width="80" src="/img/logo.svg" alt="max.lee" class="mb-[-20px]" />
        <h1 class="text-[72px] font-black text-center">
          {{ title }}
        </h1>
      </div>
      <p class="text-xl pb-10 px-20 font-bold mb-0 text-white/25">
        https://maxlee.me
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
