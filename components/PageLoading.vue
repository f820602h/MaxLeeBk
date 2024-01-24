<script setup lang="ts">
const { show, hide, isLoadingShow } = useLoading();

const nuxtApp = useNuxtApp();
const unsubPageStart = nuxtApp.hook("page:start", show);
const unsubPageFinish = nuxtApp.hook("page:finish", hide);

onBeforeUnmount(() => {
  unsubPageStart();
  unsubPageFinish();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="loading">
      <div
        v-show="isLoadingShow"
        class="loading fixed top-0 z-1000 w-screen h-screen bg-white dark:bg-black flex items-center justify-center"
      >
        <div class="loading-circle w-150px h-150px">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path
                id="MyPath"
                fill="none"
                stroke="red"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
              />
            </defs>

            <text>
              <textPath href="#MyPath" startOffset="50%" text-anchor="middle">
                ~~~ L O A D I N G ~~~~~ L O A D I N G ~~~~~ L O A D I N G ~~~
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.loading {
  perspective: 100px;
  perspective-origin: center center;
}

.loading-circle {
  font-family: sans-serif;
  font-weight: bold;
  transform: rotateX(30deg);

  svg {
    animation: spine 20s infinite linear;
  }
}

text {
  fill: black;
}

.dark-mode text {
  fill: white;
}

@keyframes spine {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(720deg);
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.5s;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
</style>
