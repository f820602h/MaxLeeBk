import { useArticleStore } from "@/store/article";

export default defineNuxtRouteMiddleware(async () => {
  const articleStore = useArticleStore();
  await articleStore._actArticles();
});
