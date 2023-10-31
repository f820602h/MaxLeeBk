<script setup lang="ts">
import type { StyleValue } from "vue";
import { useParallax } from "@vueuse/core";
const container = ref<HTMLElement | null>(null);
const parallax = reactive(useParallax(container));

const { hide } = useLoading();
onMounted(() => {
  window.setTimeout(hide, 500);
});

const cardStyle = computed<StyleValue>(() => ({
  transform: `rotateX(${parallax.roll * 5}deg) rotateY(${
    parallax.tilt * 5
  }deg)`,
  perspective: "100px",
  perspectiveOrigin: "center center",
}));

const layerHead = computed<StyleValue>(() => ({
  transition: ".3s ease-out all",
  transform: `translateX(${parallax.tilt * 3}px) translateY(${
    parallax.roll * 3
  }px)`,
}));

const layerBlow = computed<StyleValue>(() => ({
  transition: ".3s ease-out all",
  transform: `translateX(${parallax.tilt * 8}px) translateY(${
    parallax.roll * 8
  }px)`,
}));

const layerGreeting = computed<StyleValue>(() => ({
  transition: ".3s ease-out all",
  transform: `translateX(${parallax.tilt * 15}px) translateY(${
    parallax.roll * 15
  }px)`,
}));

const layerFragmentsB = computed<StyleValue>(() => ({
  transition: ".3s ease-out all",
  transform: `translateX(${parallax.tilt * 40}px) translateY(${
    parallax.roll * 40
  }px)`,
}));

const layerFragmentsM = computed<StyleValue>(() => ({
  transition: ".2s ease-out all",
  transform: `translateX(${parallax.tilt * 80}px) translateY(${
    parallax.roll * 80
  }px)`,
}));

const layerFragmentsF = computed<StyleValue>(() => ({
  transition: ".1s ease-out all",
  transform: `translateX(${parallax.tilt * 120}px) translateY(${
    parallax.roll * 120
  }px)`,
}));
</script>

<template>
  <div ref="container" class="main flex items-center overflow-hidden">
    <div class="relative z-15 flex items-center w-50% h-full rotate-y-60">
      <div class="line left relative overflow-hidden">
        <div class="text-back-shadow flex items-center h-full">
          <div class="flex items-center h-full">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>

        <div class="text absolute top-0 -left-0 flex items-center h-full">
          <div class="flex items-center h-full">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-15 flex items-center w-50% h-full -rotate-y-60">
      <div class="line right relative overflow-hidden">
        <div class="text-back-shadow flex items-center h-full">
          <div class="flex items-center h-full">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>

        <div class="text absolute top-0 -left-0 flex items-center h-full">
          <div class="flex items-center h-full">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute top-0 left-0 z-20 w-full h-full flex items-center justify-center"
      :style="cardStyle"
    >
      <div class="mind relative">
        <img class="w-full" src="/img/back.png" :style="layerHead" />
        <img
          class="absolute top-0 left-0 w-full"
          src="/img/blow.png"
          :style="layerBlow"
        />
        <img
          class="absolute top-0 left-0 w-full"
          src="/img/face.png"
          :style="layerHead"
        />
        <div
          class="greeting absolute top-50% left-0 w-full h-50px sm:h-55px flex items-center justify-center pt-4px bg-black text-white font-bold"
          :style="layerGreeting"
        >
          <span class="text-25px sm:text-35px">Hello! I'm</span>
          <span class="text-purple-600 ml-3 text-35px sm:text-45px">Max</span>
        </div>
      </div>
    </div>

    <div
      class="absolute top-50% left-50% z-30 -translate-x-50% -translate-y-50% w-full h-full min-w-1200px"
    >
      <div class="fragments-b absolute inset-0" :style="layerFragmentsB"></div>
      <div class="fragments-m absolute inset-0" :style="layerFragmentsM"></div>
      <div class="fragments-f absolute inset-0" :style="layerFragmentsF"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: calc(100dvh - 68px);
  perspective: 100px;
  perspective-origin: center center;
}

.fragments-b {
  background-image: url(/img/fragments-b.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 30%;
  filter: blur(2px);
}

.fragments-m {
  background-image: url(/img/fragments-m.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
  filter: blur(4px);
}

.fragments-f {
  background-image: url(/img/fragments-f.svg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 65%;
  filter: blur(8px);
}

.line {
  width: 100%;
  height: 140px;
  font-family: "Bebas Neue", sans-serif;
  font-size: 60px;
  font-weight: bold;
  line-height: 1;
  white-space: nowrap;
  color: #111;
  box-sizing: border-box;
  perspective: 300px;

  &.right {
    perspective-origin: right center;
    background: linear-gradient(
      to left,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0.3)
    );
  }

  &.left {
    perspective-origin: left center;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0.3)
    );
  }

  .text {
    transform: translateZ(3px);

    // > div {
    //   animation: marquee 5s linear infinite;
    // }
  }

  .text-back-shadow {
    color: rgba(0, 0, 0, 0.25) !important;
    transform: scaleY(1.3);
    filter: blur(2px);

    // > div {
    //   animation: marquee 5s linear infinite;
    // }
  }
}

.dark-mode .line {
  color: #bbb;

  &.right {
    background: linear-gradient(
      to left,
      rgba(36, 36, 36, 1) 50%,
      rgba(36, 36, 36, 0.3)
    );
  }

  &.left {
    background: linear-gradient(
      to right,
      rgba(36, 36, 36, 1) 50%,
      rgba(36, 36, 36, 0.3)
    );
  }

  .text-back-shadow {
    color: rgba(0, 0, 0, 0.5) !important;
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.mind {
  width: 50%;
  max-width: 300px;
  min-width: 200px;
  transform: translateZ(20px);

  img {
    filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.2));
  }

  .greeting {
    font-family: "Bebas Neue", sans-serif;
    letter-spacing: 3px;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.5) 0px 3px 7px -3px;
  }
}

.dark-mode .mind img {
  filter: drop-shadow(0 0 20px #000);
}
</style>
