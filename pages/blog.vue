<script setup lang="ts">
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
  <main class="max-w-1920px mx-auto py-60px px-24px md:px-48px overflow-hidden">
    <section
      v-for="yearDate in groupingByYear"
      :key="yearDate.year"
      class="relative max-w-650px min-h-300px mx-auto pb-60px"
    >
      <h2
        class="year absolute top-30px right-0 z-1 w-250px sm:w-400px pointer-events-none"
      >
        <div
          v-for="i in 10"
          :key="i"
          class="absolute top-0 lef-0 text-100px text-transparent font-bold sm:text-150px"
        >
          {{ yearDate.year }}
        </div>
      </h2>

      <ul class="relative z-2">
        <TransitionGroup name="list" appear>
          <li
            v-for="(article, index) in yearDate.articles"
            v-show="!yearDate.hidden || index < 5"
            :key="article.title"
            :data-index="index"
            class="py-3 hover:text-black dark:hover:text-white hover:scale-[1.05] cursor-pointer transform-origin-center-left duration-200"
          >
            <NuxtLink :to="article._path" class="block sm:flex items-center">
              <h3 class="mr-2" v-text="article.title" />
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
          v-show="yearDate.articles.length > 5 && yearDate.hidden"
          class="text-gray-500 hover:text-black dark:hover:text-white duration-200"
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
  }
}

.year div {
  transition: 0.2s;

  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      -webkit-text-stroke: 1px rgba(200, 200, 200, 1 - $i * 0.1);
      transform: translateX(-#{$i * 2}px) rotateZ(-#{$i * 2}deg);
    }
  }
}

.dark-mode .year div {
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      -webkit-text-stroke: 1px rgba(65, 65, 65, 1 - $i * 0.1);
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
