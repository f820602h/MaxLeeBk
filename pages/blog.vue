<script setup lang="ts">
import { useArticleStore } from "@/store/article";

definePageMeta({
  middleware: ["blog-posts"],
});

const articleStore = useArticleStore();
</script>

<template>
  <div>
    <ul>
      <li v-for="article in articleStore.articles" :key="article.title">
        <NuxtLink :to="`/posts/${article.id}`">
          {{ article.title }}, {{ article.date }}
          <div v-for="cate in article.categories" :key="cate">{{ cate }}</div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
