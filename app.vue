<script setup lang="ts">
const { isLoadingShow } = useLoading();
</script>

<template>
  <div>
    <header class="sticky top-0 z-500">
      <div
        class="flex items-center justify-between max-w-1920px h-68px mx-auto px-24px md:px-48px"
      >
        <h1>
          <NuxtLink href="/" class="flex items-center" focusable="false">
            <div class="w-30px h-30px sm:w-50px sm:h-50px">
              <img src="/img/logo.svg" alt="max.lee" />
            </div>
            <div class="hidden sm:block ml-2 pb-2px">
              <p class="text-white font-bold text-sm">Max Lee BK</p>
              <p class="text-gray-500 font-bold text-xs">Front End Developer</p>
            </div>
          </NuxtLink>
        </h1>

        <nav>
          <ul class="flex items-center gap-5 text-gray-300 text-sm font-bold">
            <li>
              <NuxtLink
                to="/blog"
                class="p-2px hover:text-white duration-150"
                title="About"
              >
                About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="p-2px hover:text-white duration-150"
                title="Blog"
              >
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="p-2px hover:text-white duration-150"
                title="Works"
              >
                Works
              </NuxtLink>
            </li>
            <li class="flex items-center">
              <a
                href="https://github.com/f820602h"
                class="p-2px hover:text-white duration-150 !text-lg"
                target="_blank"
                title="Github"
              >
                <div class="i-iconoir:github" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <NuxtPage />

    <PageLoading :show="isLoadingShow" />
  </div>
</template>

<style>
html,
body {
  min-width: 360px;
  font-family: "Roboto", sans-serif;
  color: #bbb;
  background: #171717;
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
  background: rgba(23, 23, 23, 0.9);
  box-shadow: 0 5px 20px rgba(23, 23, 23, 1);
  backdrop-filter: blur(5px);
}
</style>
