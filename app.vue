<script setup lang="ts">
const { isLoadingShow } = useLoading();
</script>

<template>
  <div>
    <header class="sticky top-0 z-500">
      <div
        class="flex items-center justify-between max-w-1920px mx-auto h-68px px-24px md:px-48px"
      >
        <h1 class="pt-1">
          <NuxtLink href="/" class="flex items-center" focusable="false">
            <div
              class="w-32px h-32px sm:w-50px sm:h-50px brightness-55 dark:brightness-100"
            >
              <img src="/img/logo.svg" alt="max.lee" />
            </div>
            <div class="hidden sm:block ml-2 pb-2px">
              <p class="text-black dark:text-white font-bold text-sm">
                Max Lee
              </p>
              <p class="text-gray-600 dark:text-gray-400 text-xs">
                Max Your Mind
              </p>
            </div>
          </NuxtLink>
        </h1>

        <nav>
          <ul class="flex items-center gap-5">
            <li
              class="text-gray-700 hover:text-black dark:text-#bbb hover:dark:text-white duration-150"
            >
              <NuxtLink
                to="/blog"
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

    <NuxtPage />

    <PageLoading :show="isLoadingShow" />
  </div>
</template>

<style lang="scss">
html,
body {
  min-width: 360px;
  font-family: "Roboto", sans-serif;
  color: #393939;
  background: #f1f1f1;
  transition:
    color 0.2s,
    background 0.2s;
}

.dark-mode,
.dark-mode body {
  color: #c1c1c1;
  background: #111;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

<style scoped lang="scss">
header {
  background: rgba(241, 241, 241, 0.5);
  backdrop-filter: blur(5px);
  transition: background 0.2s;
}

.dark-mode header {
  background: rgba(17, 17, 17, 0.5);
}
</style>
