<script setup lang="ts">
import type { NuxtError } from "#app";
const { hide } = useLoading();

defineProps<{ error: NuxtError }>();

onMounted(() => {
  hide();
});
</script>

<template>
  <NuxtLayout>
    <main class="max-w-1920px mx-auto px-24px md:px-48px">
      <section class="flex justify-center max-w-900px mx-auto pb-60px">
        <div class="text-center relative">
          <div
            class="icon i-iconoir:warning-triangle absolute top-1/2 left-1/2 text-400px md:text-600px -translate-1/2"
          />

          <div class="relative z-1">
            <h2
              class="text-150px md:text-280px leading-150px md:leading-280px font-black pt-5"
            >
              {{ error.statusCode }}
            </h2>
            <p
              class="text-28px md:text-42px font-bold text-black dark:text-white mb-1"
            >
              Page Not Found
            </p>
            <p class="text-xs">
              Oops! The page you are looking for does not exist.<br />It might
              have been moved or deleted.
            </p>

            <div class="flex justify-center">
              <NuxtLink
                to="/"
                class="block mt-8 px-2 py-1 text-16px font-black bg-black dark:bg-white text-white dark:text-black hover:opacity-60 duration-350"
              >
                Back To Home
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  </NuxtLayout>
</template>

<style scoped lang="scss">
main {
  width: 100vw;
  height: calc(100dvh - 68px);
  padding-top: 12dvh;
}

.icon {
  opacity: 0.05;
}

h2 {
  -webkit-text-stroke: 1px black;
  color: transparent;
}

.dark-mode h2 {
  -webkit-text-stroke: 1px white;
}
</style>
