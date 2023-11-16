<script setup lang="ts">
const { isAnimationEnd, hide } = useLoading();
onMounted(() => {
  window.setTimeout(hide, 1000);
});

useHead({
  title: "Blog - Max Lee",
  meta: [
    {
      property: "og:title",
      content: "Blog - Max Lee",
    },
    {
      name: "twitter:title",
      content: "Blog - Max Lee",
    },
  ],
});

const { data } = await useAsyncData("blog", () =>
  queryContent("/posts")
    .sort({ date: -1, $numeric: true })
    .only(["_path", "title", "date"])
    .find(),
);

const seeMoreYear = ref<string[]>([]);

function dateFormatter(date: string) {
  return new Date(date).toLocaleString("en-us", {
    month: "short",
    day: "numeric",
  });
}

const groupingByYear = computed(() => {
  if (!data.value) return [];
  const years = data.value.map((article) => article.date.slice(0, 4));
  const uniqueYears = [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  const groupedArticles = uniqueYears.map((year) => {
    return {
      year,
      hidden: !seeMoreYear.value.includes(year),
      articles: (data.value || []).filter((article) =>
        article.date.includes(year),
      ),
    };
  });
  return groupedArticles;
});
</script>

<template>
  <main class="max-w-1920px mx-auto py-60px px-24px md:px-48px">
    <section
      v-for="yearDate in groupingByYear"
      :key="yearDate.year"
      class="relative max-w-650px min-h-300px mx-auto pb-60px"
    >
      <h2 class="year absolute top-30px right-0 w-250px sm:w-400px">
        <Transition v-for="i in 10" :key="i" name="fade" appear>
          <div v-show="isAnimationEnd" class="text-100px sm:text-150px">
            {{ yearDate.year }}
          </div>
        </Transition>
      </h2>

      <ul>
        <TransitionGroup name="list" appear>
          <li
            v-for="(article, index) in yearDate.articles"
            v-show="isAnimationEnd && (!yearDate.hidden || index < 5)"
            :key="article.title"
            :data-index="index"
            class="group py-3 cursor-pointer"
          >
            <NuxtLink
              :to="article._path"
              class="block sm:flex items-center duration-200"
            >
              <h3
                class="mr-2 text-base sm:text-lg text-gray-700 dark:text-#bbb group-hover:text-black dark:group-hover:text-white group-hover:font-bold duration-200"
                v-text="article.title"
              />
              <span
                class="text-sm text-gray-500"
                v-text="dateFormatter(article.date)"
              />
            </NuxtLink>
          </li>
        </TransitionGroup>
      </ul>

      <Transition name="fade" appear>
        <button
          v-show="
            isAnimationEnd && yearDate.articles.length > 5 && yearDate.hidden
          "
          class="text-gray-400 hover:text-black dark:hover:text-white duration-200"
          @click="seeMoreYear.push(yearDate.year)"
        >
          see more ...
        </button>
      </Transition>
    </section>
  </main>
</template>

<style scoped lang="scss">
ul {
  li {
    perspective: 100px;
    perspective-origin: left center;

    &.list-enter-active {
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          @if $i < 6 {
            transition-delay: #{$i * 0.05}s;
          } @else {
            transition-delay: #{($i - 5) * 0.05}s;
          }
        }
      }
    }

    &:hover {
      a {
        transform: translateZ(8px);
      }
    }
  }
}

.year {
  perspective: 100px;
  perspective-origin: center center;

  div {
    position: absolute;
    top: 0;
    left: 0;
    font-weight: bold;
    color: transparent;
    transition: 0.2s;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        -webkit-text-stroke: 1px rgba(200, 200, 200, 1 - $i * 0.1);
        transform: translateX(-#{$i * 2}px) rotateZ(-#{$i * 2}deg);
      }
    }

    &.fade-enter-active {
      @for $i from 1 through 10 {
        &:nth-child(#{$i}) {
          transition-delay: #{1 - $i * 0.05}s;
        }
      }
    }
  }
}

.dark-mode .year div {
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      -webkit-text-stroke: 1px rgba(50, 50, 50, 1 - $i * 0.1);
      transform: translateX(-#{$i * 2}px) rotateZ(-#{$i * 2}deg);
    }
  }
}

.fade-enter-active {
  transition: all 0.5s;
  transition-delay: 0.8s;
}
.fade-enter-from {
  opacity: 0;
}

.list-enter-active {
  pointer-events: none;
  transition: all 0.5s;
  transition-delay: 0.5s;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>
