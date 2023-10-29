<script setup lang="ts">
const props = defineProps<{ url: string }>();

const config = useRuntimeConfig();

const { data } = await useAsyncData(props.url, () =>
  fetch("https://api.linkpreview.net/", {
    method: "POST",
    headers: { "X-Linkpreview-Api-Key": config.public.linkApiKay },
    mode: "cors",
    body: JSON.stringify({ q: props.url }),
  }).then((res) => res.json()),
);
</script>

<template>
  <a :href="data.url" class="preview block !md:flex" target="_blank">
    <div class="px-3 py-2">
      <div class="flex items-center gap-1 text-#333">
        <div class="i-iconoir:link -rotate-45" />
        <h6>{{ data.title }}</h6>
      </div>
      <p>{{ data.description }}</p>
      <span>{{ props.url }}</span>
    </div>
    <div class="w-1/4 flex-shrink-0 h-116px p-2 hidden md:block bg-white">
      <div class="w-full h-full">
        <img :src="data.image" :alt="data.title" />
      </div>
    </div>
  </a>
</template>

<style scoped></style>
