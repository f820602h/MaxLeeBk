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
  <div class="my-12px">
    <a
      v-if="data.title"
      :href="props.url"
      class="preview flex justify-between"
      target="_blank"
    >
      <div class="flex gap-2 px-2 py-2">
        <div class="i-iconoir:link relative top-1 -rotate-45 text-sm" />
        <div>
          <h6 class="!m-0 !text-base !font-bold">{{ data.title }}</h6>
          <p
            class="!min-h-40px !my-2px !text-sm !leading-20px !text-gray-500 !dark:text-gray-400"
          >
            {{ data.description }}
          </p>
          <span class="!m-0 !text-xs !text-gray-400 !dark:text-gray-600">{{
            props.url
          }}</span>
        </div>
      </div>
      <div class="hidden md:block w-1/4 flex-shrink-0 h-102px">
        <img :src="data.image" :alt="data.title" class="!m-0 !bg-transparent" />
      </div>
    </a>

    <a v-else :href="props.url">{{ props.url }}</a>
  </div>
</template>

<style scoped lang="scss">
@mixin text-overflow($line: 1) {
  display: -webkit-box !important;
  -webkit-box-orient: vertical !important;
  -webkit-line-clamp: $line !important;
  overflow: hidden !important;
}

.preview {
  text-decoration: none !important;
  border-radius: 4px !important;
  overflow: hidden !important;
}

h6 {
  @include text-overflow(1);
}

p {
  letter-spacing: normal !important;
  word-break: normal !important;
  @include text-overflow(2);
}

span {
  @include text-overflow(1);
}

img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  border: 0 !important;
  border-radius: 0 !important;
}
</style>
