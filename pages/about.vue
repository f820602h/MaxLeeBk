<script setup lang="ts">
import { useStagePlay } from "vue-stage-play";
const { action } = useStagePlay();

// const { hide } = useLoading();
// onMounted(() => {
//   window.setTimeout(hide, 1000);
// });

useHead({
  title: "About - Max Lee",
  meta: [
    {
      property: "og:title",
      content: "About - Max Lee",
    },
    {
      name: "twitter:title",
      content: "About - Max Lee",
    },
  ],
});
</script>

<template>
  <main class="max-w-1920px mx-auto py-60px px-24px md:px-48px">
    <div class="relative max-w-650px min-h-300px mx-auto">
      <StagePlayScene :act-name="'max'" :scene="1">
        <hgroup class="mb-10">
          <h1
            class="text-32px leading-tight font-black text-black dark:text-white"
          >
            Max Lee
          </h1>
          <p class="text-gray-500 text-sm">Front-End Developer</p>
        </hgroup>

        <template #voiceOver="slotProps">
          <VoiceOver v-bind="slotProps">
            <div class="w-300px h-225px rounded overflow-hidden">
              <img
                src="/img/about/me.jpg"
                alt="max.lee"
                class="block w-full h-full"
                style="object-fit: cover"
              />
            </div>
            <div class="mt-3">Hey, that's me!</div>
          </VoiceOver>
        </template>
      </StagePlayScene>

      <article>
        Hello! After graduating from the tourism department, I worked in the
        advertising industry before finding my way to become a frontend engineer
        in software development. Currently, I am responsible for product
        development at
        <a
          href="https://corp.104.com.tw/zh/about104/brand-story/"
          target="_blank"
          class="text-black dark:text-white font-bold duration-300 hover:border-black dark:hover:border-white"
          >104 Corp</a
        >.
        <br />
        <br />
        In my passion for programming, "sharing" is perhaps one of the major
        contributing factors.
        <StagePlayScene :act-name="'max'" :scene="2" class="inline-block">
          <span>Writing</span>

          <template #voiceOver="slotProps">
            <VoiceOver v-bind="slotProps">
              <div class="w-300px h-225px rounded overflow-hidden">
                <img
                  src="/img/about/it.jpg"
                  alt="max.lee"
                  class="block w-full h-full"
                  style="object-fit: cover"
                />
              </div>
              <div class="mt-3">
                I received this medal for participating in the "iT邦幫忙鐵人賽"
                technical article competition.
              </div>
              <div class="text-center">
                <a
                  href="https://ithelp.ithome.com.tw/users/20125431/ironman/3458"
                  target="_balnk"
                  class="text-black dark:text-white font-bold duration-300 hover:border-black dark:hover:border-white"
                  >Read Articles</a
                >
              </div>
            </VoiceOver>
          </template> </StagePlayScene
        >,
        <StagePlayScene :act-name="'max'" :scene="3" class="inline-block">
          <span>organizing book clubs</span>

          <template #voiceOver="slotProps">
            <VoiceOver v-bind="slotProps">
              <div class="w-300px h-225px rounded overflow-hidden">
                <img
                  src="/img/about/study.jpg"
                  alt="max.lee"
                  class="block w-full h-full"
                  style="object-fit: cover"
                />
              </div>
              <div class="mt-3">
                I organized a monthly book club with friends and kept it going
                for a year.
              </div>
            </VoiceOver>
          </template> </StagePlayScene
        >,
        <StagePlayScene :act-name="'max'" :scene="4" class="inline-block">
          <span>participating in community events</span>

          <template #voiceOver="slotProps">
            <VoiceOver v-bind="slotProps">
              <div class="w-300px h-225px rounded overflow-hidden">
                <img
                  src="/img/about/yu.jpg"
                  alt="max.lee"
                  class="block w-full"
                />
              </div>
              <div class="mt-3">
                Here's a picture of me with Evan You, Vue's creator, from
                Laravel x Vue Conf Taiwan.
              </div>
            </VoiceOver>
          </template> </StagePlayScene
        >, and departmental sharing are all things I have tried and continue to
        engage in. It's also a source of fulfillment for me.
        <br />
        <br />
        I also enjoy exploring open-source projects and have made contributions
        to a few. Although they may be minor modifications, I am committed to
        continuous improvement.
        <br />
        <br />
        In 2023, I released two open-source packages: first, the wave animation
        you see in the current background, achieved with
        <a
          href="https://github.com/f820602h/vue-surf"
          target="_balnk"
          class="text-black dark:text-white font-bold duration-300 hover:border-black dark:hover:border-white"
          >Vue Surf</a
        >, and second, the website step-by-step navigation development kit,
        <a
          href="https://github.com/f820602h/vue-surf"
          target="_balnk"
          class="text-black dark:text-white font-bold duration-300 hover:border-black dark:hover:border-white"
          >Vue Stage Play</a
        >. And you can press
        <a
          href="javascript:;"
          class="text-black dark:text-white font-bold duration-300 hover:border-black dark:hover:border-white"
          @click="action('max')"
          >HERE</a
        >
        to see the effect.
      </article>
    </div>
  </main>
</template>

<style scoped lang="scss">
a {
  text-wrap: nowrap;
  border-bottom: 1px dashed transparent;
}

article {
  line-height: 32px;
}
</style>
