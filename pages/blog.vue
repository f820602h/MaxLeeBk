<script setup lang="ts">
const { hide } = useLoading();
onMounted(() => {
  window.setTimeout(hide, 500);
});

const { data } = await useAsyncData("blog", () =>
  queryContent("/posts").sort({ date: -1, $numeric: true }).find(),
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
  <div class="max-w-1920px mx-auto my-60px px-24px md:px-48px">
    <div
      v-for="yearDate in groupingByYear"
      :key="yearDate.year"
      class="relative max-w-650px min-h-300px mx-auto pb-60px"
    >
      <div class="year absolute top-50px right-0 w-250px sm:w-400px">
        <h3 v-for="i in 10" :key="i" class="text-100px sm:text-150px">
          {{ yearDate.year }}
        </h3>
      </div>

      <ul>
        <TransitionGroup name="list">
          <template
            v-for="(article, index) in yearDate.articles"
            :key="article.title"
          >
            <li
              v-if="!yearDate.hidden || index < 5"
              :data-index="index"
              class="py-3"
            >
              <NuxtLink
                :to="article._path"
                class="group block sm:flex items-center duration-300"
              >
                <h3
                  class="mr-2 text-base sm:text-lg group-hover:text-white duration-150"
                  v-text="article.title"
                />
                <span
                  class="text-sm text-gray-600 group-hover:text-gray-400 duration-150"
                  v-text="dateFormatter(article.date)"
                />
              </NuxtLink>
            </li>
          </template>
        </TransitionGroup>
      </ul>

      <a
        v-if="yearDate.articles.length > 5 && yearDate.hidden"
        href="javascript:;"
        class="text-gray-500"
        @click="seeMoreYear.push(yearDate.year)"
      >
        see more ...
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  li {
    perspective: 100px;
    perspective-origin: left center;

    &:hover {
      a {
        transform: translateZ(10px);
      }
    }
  }
}

.year {
  perspective: 100px;
  perspective-origin: center center;

  h3 {
    position: absolute;
    top: 0;
    left: 0;
    font-weight: bold;
    color: transparent;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        -webkit-text-stroke: 1px rgba(50, 50, 50, 1 - $i * 0.1);
        transform: translateX(-#{$i * 2}px) rotateZ(-#{$i * 2}deg);
      }
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
