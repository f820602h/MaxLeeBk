<script setup lang="ts">
import { type Article, useArticleStore } from "../../store/article";

const route = useRoute();
const articleStore = useArticleStore();

const article = computed<Article | undefined>(() => {
  return articleStore.articles.find(
    (article) => article.id === route.params.id,
  );
});
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div v-html="article?.content"></div>
</template>
