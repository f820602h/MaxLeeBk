<script setup lang="ts">
const props = withDefaults(defineProps<{ show: boolean }>(), { show: false });
</script>

<template>
  <Transition name="loading">
    <div
      v-if="props.show"
      class="fixed top-0 left-0 z-1000 w-screen h-screen bg-black flex items-center justify-center"
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

          <text fill="white">
            <textPath href="#MyPath" startOffset="50%" text-anchor="middle">
              ~~~ L O A D I N G ~~~~~ L O A D I N G ~~~~~ L O A D I N G ~~~
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.loading-circle {
  font-family: sans-serif;
  font-weight: bold;
  animation: spine 100s infinite linear;
}

@keyframes spine {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(3600deg);
  }
}

.loading-leave-active {
  transition: opacity 0.5s;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
</style>
