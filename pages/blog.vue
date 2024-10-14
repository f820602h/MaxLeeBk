<script setup lang="ts">
const title = "Blog - Max Lee";
const description = "Articles written by Max Lee";
const url = "https://maxlee.me/blog";

useHead({
  link: [{ rel: "canonical", href: url }],
  title,
  meta: [
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image:alt", content: title },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image:alt", content: title },
  ],
});

const { data } = await useAsyncData("blog", () =>
  queryContent("/posts")
    .sort({ date: -1, $numeric: true })
    .only(["_path", "title", "date"])
    .find(),
);

const single = computed(() => {
  if (!data.value) return [];
  const regex = /^\/posts\/[\w\W][^/]+$/;
  return data.value.filter((article) => regex.test(article._path || ""));
});

type Series = {
  title: string;
  year: string;
  hidden: boolean;
  articles: any[];
};

const seeMoreGroup = ref<string[]>([]);
const seriesList = computed(() => {
  if (!data.value) return [];
  const regex = /^\/posts\/[\w\W]+\/[\w\W]+$/;
  const result = data.value
    .filter((article) => regex.test(article._path || ""))
    .reduce((acc, article) => {
      const seriesTitle = article.title?.split("/")[0].trim() || "";
      const seriesYear = article.date.slice(0, 4);
      const seriesIndex = acc.findIndex(
        (series) => series.title === seriesTitle,
      );
      if (seriesIndex === -1) {
        acc.push({
          title: seriesTitle,
          year: seriesYear,
          articles: [article],
          hidden: !seeMoreGroup.value.includes(seriesTitle),
        });
      } else {
        acc[seriesIndex].articles.push(article);
      }
      return acc;
    }, [] as Series[]);
  result.forEach((series) => {
    series.articles.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });
  return result;
});

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
      articles: (single.value || []).filter((article) =>
        article.date.includes(year),
      ),
      seriesList: (seriesList.value || []).filter((series) =>
        series.year.includes(year),
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
            v-for="item in [...yearDate.seriesList, ...yearDate.articles]"
            v-show="true"
            :key="item.title"
            class=""
          >
            <component
              :is="'_path' in item ? 'NuxtLink' : 'div'"
              :to="'_path' in item ? item?._path : undefined"
              class="flex items-center pt-3 text-truncate"
              :class="'_path' in item ? 'clickable pb-3' : 'pb-1'"
            >
              <div class="flex items-center">
                <span
                  v-if="'articles' in item"
                  class="i-iconoir:folder mr-2 text-gray-500"
                ></span>
                <span
                  v-else
                  class="i-iconoir:page-edit mr-2 text-gray-500"
                ></span>
                <h3 class="mr-2" v-text="item.title" />
              </div>
              <span
                v-if="'date' in item"
                class="hidden sm:block text-sm text-gray-500"
                v-text="dateFormatter(item.date)"
              />
            </component>

            <template v-if="'articles' in item">
              <template
                v-for="(article, a_index) in item.articles"
                :key="article.title"
              >
                <NuxtLink
                  v-if="a_index < 5 || !item.hidden"
                  :to="article._path"
                  class="clickable block sm:flex items-center py-2 pl-6 last:mb-3 text-sm text-gray-500 text-truncate"
                >
                  {{ article.title }}
                </NuxtLink>
              </template>

              <a
                v-if="item.articles.length > 5 && item.hidden"
                href="#"
                class="clickable block py-2 pl-6 text-sm text-gray-500"
                @click.prevent="seeMoreGroup.push(item.title)"
              >
                see more ...
              </a>
            </template>
          </li>
        </TransitionGroup>
      </ul>
    </section>
  </main>
</template>

<style scoped lang="scss">
ul {
  li {
    &.list-enter-active {
      @for $i from 1 through 50 {
        &:nth-child(#{$i}) {
          transition-delay: #{$i * 0.05}s;
        }
      }
    }
  }
}

.clickable {
  @apply hover:text-black dark:hover:text-white hover:scale-[1.05] cursor-pointer transform-origin-center-left duration-200;
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

.list-enter-active {
  pointer-events: none;
  transition: all 0.5s;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
</style>
