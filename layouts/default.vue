<script setup lang="ts">
import { VueSurf } from "vue-surf";
const colorMode = useColorMode();

const waveColor = computed<string>(() => {
  return colorMode.value === "dark" ? "#fff" : "#000";
});

const color1 = computed(() => ({
  name: "myGradient1",
  rotate: 90,
  steps: [
    { offset: 0, color: waveColor.value, opacity: 0.07 },
    { offset: 1, color: waveColor.value, opacity: 0 },
  ],
}));

const color2 = computed(() => ({
  name: "myGradient2",
  rotate: 90,
  steps: [
    { offset: 0, color: waveColor.value, opacity: 0.05 },
    { offset: 1, color: waveColor.value, opacity: 0 },
  ],
}));
</script>

<template>
  <div>
    <ClientOnly>
      <div class="fixed top-80% left-0 w-full">
        <VueSurf
          v-if="$route.path !== '/' && !$route.path.includes('/posts')"
          class="top-50px"
          width="100%"
          :marquee-speed="5"
          :apexes-series="[
            [
              [0, 60],
              [500, 30],
              [500, 50],
            ],
          ]"
          :color="color1"
        />
        <VueSurf
          v-if="$route.path !== '/' && !$route.path.includes('/posts')"
          width="100%"
          :marquee-speed="3"
          :apexes-series="[
            [
              [0, 20],
              [500, 80],
              [500, 40],
              [500, 60],
              [500, 20],
            ],
          ]"
          :color="color2"
        />
      </div>
    </ClientOnly>

    <header class="fixed top-0 z-500 w-full">
      <div
        class="flex items-center justify-between max-w-1920px mx-auto h-68px px-24px md:px-48px"
      >
        <hgroup class="pt-1">
          <NuxtLink href="/" class="flex items-center" focusable="false">
            <div
              class="w-32px h-32px sm:w-50px sm:h-50px brightness-55 dark:brightness-100"
            >
              <img src="/img/logo.svg" alt="max.lee" />
            </div>
            <h2 class="hidden sm:block ml-2 pb-2px">
              <p class="text-black dark:text-white font-black text-sm">
                Max Lee
              </p>
              <p class="text-gray-600 dark:text-gray-400 text-xs">
                Max Your Mind
              </p>
            </h2>
          </NuxtLink>
        </hgroup>

        <nav>
          <ul class="flex items-center gap-5">
            <li
              class="text-gray-700 hover:text-black dark:text-#bbb hover:dark:text-white duration-150"
            >
              <NuxtLink
                to="/about"
                class="p-2px text-sm font-bold"
                title="About"
              >
                About
              </NuxtLink>
            </li>
            <li
              class="text-gray-700 hover:text-black dark:text-#bbb hover:dark:text-white duration-150"
            >
              <NuxtLink to="/blog" class="p-2px text-sm font-bold" title="Blog">
                Blog
              </NuxtLink>
            </li>
            <li
              class="text-gray-700 hover:text-black dark:text-#bbb hover:dark:text-white duration-150"
            >
              <NuxtLink
                to="/works"
                class="p-2px text-sm font-bold"
                title="Works"
              >
                Works
              </NuxtLink>
            </li>
            <li
              class="flex items-center text-gray-700 hover:text-black dark:text-#bbb hover:dark:text-white duration-150"
            >
              <a
                href="https://github.com/f820602h"
                class="p-2px text-lg font-bold"
                target="_blank"
                title="Github"
              >
                <div class="i-iconoir:github" />
              </a>
            </li>
            <li
              class="flex items-center text-gray-700 hover:text-black dark:text-#bbb hover:dark:text-white duration-150"
            >
              <button
                class="p-2px text-lg font-bold"
                @click="
                  $colorMode.preference =
                    $colorMode.value === 'dark' ? 'light' : 'dark'
                "
              >
                <div class="i-iconoir:sun-light dark:hidden" />
                <div class="i-iconoir:half-moon hidden dark:block" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <div class="relative pt-68px">
      <slot />
    </div>

    <PageLoading />
  </div>
</template>

<style scoped lang="scss">
header {
  backdrop-filter: blur(3px);
  transition: background 0.2s linear;
}
</style>
