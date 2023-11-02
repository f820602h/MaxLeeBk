<script setup lang="ts">
const { hide } = useLoading();
onMounted(() => {
  window.setTimeout(hide, 500);
});

const route = useRoute();
const postPath = computed(() => {
  return typeof route.params.slug === "string"
    ? route.params.slug
    : route.params.slug.join("/");
});

const { data } = await useAsyncData(postPath.value, () =>
  queryContent(`/posts/${postPath.value}`).findOne(),
);
const postNav = await useAsyncData(`${postPath.value}-nav`, () =>
  queryContent()
    .sort({ date: 1, $numeric: true })
    .only(["_path", "title"])
    .findSurround(`/posts/${postPath.value}`),
);

useHead({
  title: `${data.value?.title} - Max Lee`,
  meta: [
    {
      property: "og:title",
      content: `${data.value?.title} - Max Lee`,
    },
    {
      name: "twitter:title",
      content: `${data.value?.title} - Max Lee`,
    },
  ],
});

function dateFormatter(date: string) {
  return new Date(date).toLocaleString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div class="max-w-1920px mx-auto py-60px px-24px md:px-48px">
    <div class="max-w-1000px mx-auto pb-60px">
      <NuxtLink
        to="/blog"
        class="inline-block p-1 text-gray-500 hover:text-black dark:hover:text-white duration-150"
      >
        <div class="i-iconoir:reply" />
      </NuxtLink>
      <ContentDoc :path="`/posts/${postPath}`">
        <template #default="{ doc }">
          <article id="max-post">
            <h1 class="!text-32px sm:!text-40px">{{ doc.title }}</h1>
            <span class="text-gray-500 text-sm font-medium">
              {{ dateFormatter(doc.date) }}
            </span>
            <span class="text-gray-500 text-sm font-medium ml-3">Max Lee</span>
            <hr />
            <ContentRenderer :value="doc" />
          </article>
        </template>

        <template #not-found>
          <div id="max-post">
            <h1
              class="flex gap-3 justify-end items-center !text-32px sm:!text-40px"
            >
              <div class="i-iconoir:warning-triangle" />
              Article Not Found
            </h1>
            <hr class="!my-1" />
            <p class="text-right text-xs">
              Oops! The article does not exist.<br />
              It might have been moved or deleted.
            </p>
          </div>
        </template>
      </ContentDoc>

      <div class="post-nav-group flex justify-between items-center mt-80px">
        <NuxtLink
          v-if="postNav.data.value?.[0]"
          :to="postNav.data.value[0]._path"
          class="post-nav w-1/2 p-3 rounded"
        >
          <hgroup class="flex items-center">
            <div class="i-iconoir:arrow-left-circle mr-3" />
            <h5 class="font-bold">{{ postNav.data.value[0].title }}</h5>
          </hgroup>
          <p class="text-xs text-left mt-1">
            https://maxlee.me{{ postNav.data.value[0]._path }}
          </p>
        </NuxtLink>
        <div v-else class="w-1/2" />

        <div class="line mx-3" />

        <NuxtLink
          v-if="postNav.data.value?.[1]"
          :to="postNav.data.value[1]._path"
          class="post-nav w-1/2 p-3 rounded"
        >
          <hgroup class="flex justify-end items-center">
            <h5 class="font-bold">{{ postNav.data.value[1].title }}</h5>
            <div class="i-iconoir:arrow-right-circle ml-3" />
          </hgroup>
          <p class="text-xs text-right mt-1">
            https://maxlee.me{{ postNav.data.value[1]._path }}
          </p>
        </NuxtLink>
        <div v-else class="w-1/2" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$code-font: "Fira Mono", monospace;

$highlight-color: black;
$highlight-color-invert: white;

$highlight-light-color: #292929;
$highlight-light-color-invert: #ddd;

$box-bg-color: #efefef;
$box-bg-color-invert: #1a1a1a;

$box-bg-light-color: #f6f6f6;
$box-bg-light-color-invert: #151515;

$box-border-color: #d9d9d9;
$box-border-color-invert: #333;

$img-bg-color: transparent;
$img-bg-color-invert: white;

%typography {
  letter-spacing: 1.2px;
  line-height: 26px;
}

%rounded {
  border-radius: 4px;
  overflow: hidden;
}

#max-post {
  * {
    transition:
      color 0.2s,
      background-color 0.2s,
      border 0.2s;
  }

  :is(h1, h2, h3, h4, h5, h6) {
    font-weight: 900;
    line-height: 1.5;
    color: $highlight-color;

    a {
      text-decoration: none !important;
    }
  }

  h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 28px;
    margin: 24px 0px;
  }
  h3 {
    font-size: 24px;
    margin: 16px 0px;
  }
  h4 {
    font-size: 20px;
    margin: 16px 0px;
  }
  h5 {
    font-size: 18px;
    margin: 12px 0px;
  }
  h6 {
    font-size: 16px;
    margin: 12px 0px;
  }

  p {
    margin: 16px 0 0 0;
    @extend %typography;
  }

  strong,
  em,
  b,
  i {
    color: $highlight-light-color;
  }

  a:not(.preview) {
    text-decoration: underline;
    text-underline-offset: 3px;
    word-break: break-all;
    transition: 0.3s;

    &:hover {
      color: $highlight-color;
    }
  }

  a.preview {
    border: 1px solid $box-border-color;
    background: transparent;
    transition: 0.3s;

    &:hover {
      color: $highlight-color;
      background: $highlight-color-invert;
    }
  }

  br {
    content: "." !important;
    display: block !important;
    height: 12px;
    margin: 0 !important;
  }

  code {
    font-family: $code-font;
    background: $box-bg-color;
    font-size: 14px;
    padding: 3px 4px;
    margin: 0 2px;
    word-break: keep-all;
    @extend %rounded;
    color: rgb(196, 127, 0);
  }

  pre {
    font-family: $code-font;
    background: $box-bg-color;
    margin: 12px 0;
    padding: 20px;
    @extend %rounded;

    code {
      display: block;
      margin: 0;
      border: none;
      background: none;
      color: unset;
      overflow: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  blockquote {
    margin: 16px 0 4px;
    padding: 16px;
    border: 1px solid $box-border-color;
    color: $highlight-color;
    background: $box-bg-color;
    @extend %rounded;

    p {
      margin: 0;
      font-size: 14px;
    }
  }

  hr {
    height: 0;
    margin: 24px 0;
    border-top-color: $box-border-color;
  }

  img {
    display: block;
    width: 100%;
    margin: 12px auto;
    background: $img-bg-color;
    @extend %rounded;
  }

  ul,
  ol {
    margin: 8px 0 24px;
    padding: 0 0 0 24px;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }
  li {
    margin: 8px 0;
    @extend %typography;
  }

  table {
    width: 100%;
    margin: 20px 0;
    box-shadow: 0 0 0 1px $box-border-color;
    @extend %rounded;

    th {
      padding: 8px 12px;
      font-weight: bold;
      color: $highlight-color;
      background: $box-bg-color;
      border-bottom: 1px solid $box-border-color;

      &:not(:last-child) {
        border-right: 1px solid $box-border-color;
      }
    }

    tr {
      background: $box-bg-light-color;

      &:not(:last-child) {
        border-bottom: 1px solid $box-border-color;
      }
    }

    td {
      padding: 12px;

      &:not(:last-child) {
        border-right: 1px solid $box-border-color;
      }
    }
  }
}

.dark-mode #max-post {
  :is(h1, h2, h3, h4, h5, h6) {
    color: $highlight-color-invert;
  }

  strong,
  em,
  b {
    color: $highlight-light-color-invert;
  }

  a {
    &:hover {
      color: $highlight-color-invert;
    }
  }

  a.preview {
    border: 1px solid $box-border-color-invert;
    background: transparent;

    &:hover {
      color: $highlight-color-invert;
      background: $highlight-color;
    }
  }

  code {
    background: $box-bg-color-invert;
  }

  pre {
    background: $box-bg-color-invert;

    code {
      background: none;
      color: unset;
    }
  }

  blockquote {
    border: 1px solid $box-border-color-invert;
    color: $highlight-color-invert;
    background: $box-bg-color-invert;
  }

  hr {
    border-top-color: $box-border-color-invert;
  }

  img {
    background: $img-bg-color-invert;
  }

  table {
    box-shadow: 0 0 0 1px $box-border-color-invert;

    th {
      color: $highlight-color-invert;
      background: $box-bg-color-invert;
      border-bottom: 1px solid $box-border-color-invert;

      &:not(:last-child) {
        border-right: 1px solid $box-border-color-invert;
      }
    }

    tr {
      background: $box-bg-light-color-invert;

      &:not(:last-child) {
        border-bottom: 1px solid $box-border-color-invert;
      }
    }

    td {
      &:not(:last-child) {
        border-right: 1px solid $box-border-color-invert;
      }
    }
  }
}

.post-nav-group {
  a {
    color: $box-border-color;
    transition: 0.2s;

    p {
      color: $box-border-color;
      transition: 0.2s;
    }

    &:hover {
      color: $highlight-color;

      p {
        color: #6b7280;
        transition: 0.2s;
      }
    }
  }

  .line {
    height: 28px;
    border-right: 1px solid $box-border-color;
  }
}

.dark-mode .post-nav-group {
  a {
    color: $box-border-color-invert;

    p {
      color: $box-border-color-invert;
    }

    &:hover {
      color: $highlight-color-invert;

      p {
        color: #6b7280;
      }
    }
  }

  .line {
    border-right: 1px solid $box-border-color-invert;
  }
}
</style>
