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
  <div class="max-w-1920px mx-auto my-60px px-24px md:px-48px">
    <div class="max-w-1000px mx-auto pb-60px">
      <NuxtLink
        to="/blog"
        class="inline-block p-1 text-gray-500 hover:text-white duration-150"
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
#max-post {
  :is(h1, h2, h3, h4, h5, h6) {
    font-weight: bold;
    line-height: 1.5;
    color: white;

    a {
      text-decoration: none;
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
    margin: 20px 0px;
  }
  h4 {
    font-size: 20px;
    margin: 20px 0px;
  }
  h5 {
    font-size: 16px;
    margin: 12px 0px;
  }
  h6 {
    font-size: 14px;
    margin: 12px 0px;
  }

  p {
    margin: 12px 0px;
    letter-spacing: 2px;
    line-height: 1.8;
  }

  strong,
  em,
  b,
  i {
    color: white;
  }

  a {
    text-decoration: underline;
    text-underline-offset: 3px;
    word-break: break-all;
    transition: 0.3s;

    &:hover {
      color: white;
    }
  }

  a.preview {
    justify-content: space-between;
    border-radius: 4px;
    overflow: hidden;
    background: white;
    text-decoration: none;

    &:hover {
      background: #ccc;
    }

    h6 {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      line-height: unset;
    }

    p {
      line-height: unset;
      font-size: 14px;
      letter-spacing: normal;
      color: #666;
      min-height: 42px;
      margin: 4px 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    span {
      font-size: 12px;
      color: #888;
      margin: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      margin: 0 !important;
      border-radius: 0;
    }
  }

  pre {
    font-family: "Fira Mono", monospace;
    background: #222;
    margin: 12px 0;
    padding: 20px;
    border-radius: 8px;

    code {
      display: block;
      margin: 0;
      border: none;
      background: none;
      color: unset;
      background: unset;
      overflow: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  code {
    font-family: "Fira Mono", monospace;
    border-radius: 4px;
    color: #ddd;
    background: #333;
    font-size: 14px;
    padding: 3px;
    margin: 0 2px;
    word-break: keep-all;
  }

  blockquote {
    position: relative;
    margin: 20px 0;
    padding: 0px 16px;
    border: 1px solid #666;
    border-radius: 4px;
    color: #ddd;
    background: #333;

    p {
      font-size: 14px;
    }
  }

  hr {
    height: 0;
    margin: 24px 0;
    border-top-color: #333;
  }

  img {
    display: block;
    width: 100%;
    margin: 16px auto !important;
    // padding: 12px;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    // background: rgba(255, 255, 255, 0.6);
  }

  ul,
  ol {
    margin: 12px 0;
    padding: 0 0 0 24px;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }

  li {
    margin: 12px 0;
  }

  table {
    width: 100%;
    margin: 12px 0;
    border-radius: 4px;
    overflow: hidden;

    th {
      padding: 8px 12px;
      font-weight: bold;
      color: white;
      background: #333;

      &:not(:last-child) {
        border-right: 1px solid #444;
      }
    }

    tr {
      &:not(:last-child) {
        border-bottom: 1px solid #444;
      }
    }

    td {
      padding: 12px;

      &:not(:last-child) {
        border-right: 1px solid #444;
      }
    }
  }
}
</style>
