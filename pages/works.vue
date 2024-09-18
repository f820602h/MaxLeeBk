<script setup lang="ts">
useHead({
  title: "Works - Max Lee",
  meta: [
    {
      property: "og:title",
      content: "Works - Max Lee",
    },
    {
      name: "twitter:title",
      content: "Works - Max Lee",
    },
  ],
});

const mainWorks = [
  {
    title: "Vue Stage Play",
    description:
      "A component-based package designed to assist you in implementing step-by-step guided tour function within your application.",
    image: "/img/works/stage.png",
    gif: "/img/works/stage.gif",
    link: "https://f820602h.github.io/vue-stage-play/",
    github: "https://github.com/f820602h/vue-stage-play/",
  },
  {
    title: "Vue Surf",
    description:
      "A very customized animated SVG wave Vue component. Adding cool waves to your websites.",
    image: "/img/works/surf.png",
    gif: "/img/works/surf.gif",
    link: "https://f820602h.github.io/vue-surf/",
    github: "https://github.com/f820602h/vue-surf/",
  },
];

const littleWorks = [
  {
    title: "Translate Review Extension",
    description:
      "A browser extension for instant translation, with a reviewable history in a new tab.",
    image: "/img/works/translate.png",
    gif: "",
    link: "https://github.com/f820602h/Translate-Review-Extension",
    github: "https://github.com/f820602h/Translate-Review-Extension",
  },
  {
    title: "Max Blog",
    description:
      "My first blog website was developed using the Hexo framework.",
    image: "/img/works/blog.png",
    gif: "",
    link: "https://maxleebk.com/",
    github: "https://github.com/f820602h/Max-Blog",
  },
  {
    title: "Snaaaaaaake",
    description: "A classic Snake game, developed using Vue 2.",
    image: "/img/works/snake.png",
    gif: "/img/works/snake.gif",
    link: "https://f820602h.github.io/Snaaaaaaake/",
    github: "https://github.com/f820602h/Snaaaaaaake",
  },
  {
    title: "Max-2048",
    description: "A replica of the 2048 game, developed using Vue 3.",
    image: "/img/works/2048.png",
    gif: "/img/works/2048.gif",
    link: "https://f820602h.github.io/Max-2048/",
    github: "https://github.com/f820602h/Max-2048",
  },
  {
    title: "OXGame",
    description: "A Tic-Tac-Toe game developed with vanilla JavaScript.",
    image: "/img/works/ox.png",
    gif: "/img/works/ox.gif",
    link: "https://f820602h.github.io/OXGame/",
    github: "https://github.com/f820602h/OXGame",
  },
  {
    title: "Max Persona",
    description:
      "My first portfolio site was built with jQuery while I was learning front-end development.",
    image: "/img/works/persona.png",
    gif: "/img/works/persona.gif",
    link: "https://f820602h.github.io/Max-Persona/",
    github: "https://github.com/f820602h/Max-Persona",
  },
];

const works = {
  "Main Project": mainWorks,
  "Little Project": littleWorks,
};
</script>

<template>
  <main class="max-w-1920px mx-auto py-60px px-24px md:px-48px">
    <div class="max-w-900px mx-auto">
      <section v-for="(list, name) in works" :key="name">
        <h2
          class="min-h-48px mb-5 text-32px font-black italic text-center text-black dark:text-white"
        >
          <p class="slide">{{ name }}</p>
        </h2>

        <ul class="flex justify-between flex-wrap -mx-12px mb-48px">
          <li
            v-for="work in list"
            :key="work.title"
            :class="{ 'lg:w-1/3': name === 'Little Project' }"
            class="works slide relative w-full md:w-1/2 px-12px mb-24px cursor-pointer group hover:-translate-y-5px"
          >
            <a :href="work.link" target="_blank" class="block">
              <figure
                class="relative w-full rounded overflow-hidden mb-1 bg-gray-300 dark:bg-gray-800"
              >
                <img
                  class="absolute top-0 left-0 block w-full"
                  :src="work.gif"
                />
                <img
                  class="image relative z-10 block w-full duration-550"
                  :class="{ freeze: !work.gif }"
                  :src="work.image"
                />
              </figure>

              <div class="p-1">
                <h4
                  class="font-bold mb-1 group-hover:text-black dark:group-hover:text-white duration-200"
                  v-text="work.title"
                />
                <p
                  class="min-h-40px text-sm text-gray-500 group-hover:text-black dark:group-hover:text-white duration-200"
                  v-text="work.description"
                />
              </div>
            </a>

            <a
              :href="work.github"
              target="_blank"
              class="github p-4px text-lg hover:text-black dark:hover:text-white duration-200"
            >
              <div class="i-iconoir:github" />
            </a>
          </li>
        </ul>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.works {
  transition: transform 0.55s;

  figure {
    filter: grayscale(50%);
    aspect-ratio: 2/1;

    .image {
      opacity: 1;
    }
  }

  .github {
    display: block;
    position: absolute;
    bottom: 50px;
    right: 12px;
    z-index: 15;
  }

  p {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &:hover {
    figure {
      filter: grayscale(0%);

      .image:not(.freeze) {
        opacity: 0;
      }
    }
  }
}

.slide {
  animation: slide 0.75s;
}

@keyframes slide {
  0% {
    pointer-events: none;
    opacity: 0;
    transform: translateX(30px) skewX(-6deg);
  }
  100% {
    pointer-events: unset;
    opacity: 1;
    transform: translateX(0) skewX(0);
  }
}
</style>
