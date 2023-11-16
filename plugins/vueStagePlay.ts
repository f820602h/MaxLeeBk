import { stagePlayPlugin } from "vue-stage-play";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(stagePlayPlugin());
});
