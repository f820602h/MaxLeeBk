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
  <ClientOnly>
    <div class="fixed top-80% left-0 w-full">
      <VueSurf
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
</template>

<style scoped lang="scss"></style>
