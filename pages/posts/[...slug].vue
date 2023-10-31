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
      <ContentDoc v-slot="{ doc }" :path="`/posts/${postPath}`">
        <article id="max-post">
          <h1 class="!text-32px sm:!text-40px">{{ doc.title }}</h1>
          <span class="text-gray-500 text-sm font-medium">
            {{ dateFormatter(doc.date) }}
          </span>
          <span class="text-gray-500 text-sm font-medium ml-3">Max Lee</span>
          <hr />
          <ContentRenderer :value="doc" />
        </article>
      </ContentDoc>
    </div>
  </div>
</template>

<style lang="scss">
$code-font: "Fira Mono", monospace;

$highlight-color: black;
$highlight-color-invert: white;

$highlight-light-color: #292929;
$highlight-light-color-invert: #ddd;

$box-bg-color: #e3e3e3;
$box-bg-color-invert: #222;

$box-bg-light-color: #eee;
$box-bg-light-color-invert: #1d1d1d;

$box-border-color: #ccc;
$box-border-color-invert: #444;

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
    background: $box-bg-light-color;
    transition: 0.3s;

    &:hover {
      color: $highlight-color;
      background: $highlight-color-invert;
    }
  }

  code {
    font-family: $code-font;
    background: $box-bg-color;
    font-size: 14px;
    padding: 3px 4px;
    margin: 0 2px;
    word-break: keep-all;
    @extend %rounded;
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
    margin: 20px 0;
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
    background: $box-bg-light-color-invert;

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
</style>
