<script setup lang="ts">
import type { StyleValue } from "vue";
import { useParallax } from "@vueuse/core";
const container = ref<HTMLElement | null>(null);
const parallax = reactive(useParallax(container));

const cardStyle = computed<StyleValue>(() => ({
  transform: `translateZ(20px) rotateX(${parallax.roll * 10}deg) rotateY(${
    parallax.tilt * 10
  }deg)`,
}));

const layerHead = computed<StyleValue>(() => ({
  transition: ".3s ease-out all",
  transform: `translateX(${parallax.tilt * 30}px) translateY(${
    parallax.roll * 30
  }px)`,
}));

const layerBlow = computed<StyleValue>(() => ({
  transition: ".3s ease-out all",
  transform: `translateX(${parallax.tilt * 30}px) translateY(${
    parallax.roll * 50
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
  transform: `translateX(${parallax.tilt * 60}px) translateY(${
    parallax.roll * 60
  }px)`,
}));

const layerFragmentsF = computed<StyleValue>(() => ({
  transition: ".1s ease-out all",
  transform: `translateX(${parallax.tilt * 80}px) translateY(${
    parallax.roll * 80
  }px)`,
}));
</script>

<template>
  <div
    ref="container"
    class="main flex items-center w-screen h-screen overflow-hidden"
  >
    <div class="relative z-15 flex items-center w-50% h-full rotate-y-60">
      <div class="line left relative overflow-hidden">
        <div class="text-shadow flex items-center h-full">
          <div v-for="i in 3" :key="i" class="flex items-center h-full blur-2">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>

        <div class="text absolute top-0 -left-0 flex items-center h-full">
          <div v-for="i in 3" :key="i" class="flex items-center h-full">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-15 flex items-center w-50% h-full -rotate-y-60">
      <div class="line right relative overflow-hidden">
        <div class="text-shadow flex items-center h-full">
          <div v-for="i in 3" :key="i" class="flex items-center h-full blur-2">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>

        <div class="text absolute top-0 -left-0 flex items-center h-full">
          <div v-for="i in 3" :key="i" class="flex items-center h-full">
            <span v-for="j in 3" :key="j" class="mx-4">MAX YOUR MIND</span>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute inset-70px z-10 border-[0.5px]"></div>

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
          class="greeting flex items-center justify-center"
          :style="layerBlow"
        >
          Hello! I'm <span class="text-purple-600 font-bold ml-3">Max</span>
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
  color: #d2d5dc;
  box-sizing: border-box;
  perspective: 300px;

  &.right {
    perspective-origin: right center;
    background: linear-gradient(
      to left,
      rgba(36, 36, 36, 1) 50%,
      rgba(36, 36, 36, 0.3)
    );
  }

  &.left {
    perspective-origin: left center;
    background: linear-gradient(
      to right,
      rgba(36, 36, 36, 1) 50%,
      rgba(36, 36, 36, 0.3)
    );
  }

  .text {
    transform: translateZ(4px);

    > div {
      animation: marquee 20s linear infinite;
    }
  }

  .text-shadow {
    color: rgba(0, 0, 0, 0.1);
    transform: scaleY(1.5);

    > div {
      animation: marquee 20s linear infinite;
    }
  }
}

@keyframes marquee {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(-200%);
  }
}

.mind {
  width: 70%;
  max-width: 300px;
  min-width: 200px;

  img {
    filter: drop-shadow(0 0 20px #000);
  }

  .greeting {
    position: absolute;
    z-index: 5;
    top: 49%;
    left: 0;
    width: 100%;
    height: 55px;
    padding-top: 4px;
    box-shadow: rgb(0, 0, 0) 0px 20px 30px -10px;
    font-family: "Bebas Neue", sans-serif;
    font-size: 35px;
    letter-spacing: 3px;
    background: black;
    color: white;

    span {
      font-size: 45px;
    }
  }
}
</style>
