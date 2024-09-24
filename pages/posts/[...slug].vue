<script setup lang="ts">
const route = useRoute();
const postPath = computed(() => {
  return typeof route.params.slug === "string"
    ? route.params.slug
    : route.params.slug.join("/");
});

const { data } = await useAsyncData(postPath.value, () =>
  queryContent(`/posts/${postPath.value}`).findOne(),
);
const postNav = await useAsyncData(
  `${postPath.value}-nav`,
  () =>
    queryContent()
      .sort({ date: 1, $numeric: true })
      .only(["_path", "title"])
      .findSurround(`/posts/${postPath.value}`),
  { watch: [postPath] },
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

defineOgImageComponent("PostOgImage", { title: data.value?.title });

function dateFormatter(date: string) {
  return new Date(date).toLocaleString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <main class="max-w-1920px mx-auto py-60px px-24px md:px-48px">
    <div class="max-w-1000px mx-auto">
      <NuxtLink
        to="/blog"
        class="inline-block p-1 text-gray-500 hover:text-black dark:hover:text-white duration-200"
      >
        <div class="i-iconoir:reply" />
      </NuxtLink>

      <ContentDoc :path="`/posts/${postPath}`">
        <template #default="{ doc }">
          <article id="max-post" class="pb-120px">
            <hgroup>
              <h1 class="!text-32px sm:!text-40px">{{ doc.title }}</h1>
              <div class="text-gray-500 text-sm font-medium">
                <span>{{ dateFormatter(doc.date) }}</span>
                <span class="ml-3"> Max Lee </span>
              </div>
            </hgroup>
            <hr />
            <ContentRenderer :value="doc" />
          </article>

          <div class="post-nav-group flex justify-between items-center gap-4">
            <NuxtLink
              v-if="postNav.data.value?.[0]"
              :to="postNav.data.value[0]._path"
              class="post-nav md:w-1/2 p-3 rounded duration-200"
            >
              <div class="hidden md:block">
                <hgroup class="flex items-center">
                  <div class="i-iconoir:arrow-left-circle flex-shrink-0" />
                  <h5 class="font-bold truncate ml-1">
                    {{ postNav.data.value[0].title }}
                  </h5>
                </hgroup>
                <p class="text-xs mt-1 duration-200">
                  https://maxlee.me{{ postNav.data.value[0]._path }}
                </p>
              </div>

              <div class="flex items-center gap-1 md:hidden">
                <div class="i-iconoir:arrow-left-circle" />
                <div class="text-sm">Prev Post</div>
              </div>
            </NuxtLink>
            <div v-else class="w-1/2" />

            <NuxtLink
              v-if="postNav.data.value?.[1]"
              :to="postNav.data.value[1]._path"
              class="post-nav group md:w-1/2 p-3 rounded duration-200"
            >
              <div class="hidden md:block">
                <hgroup class="flex items-center justify-end">
                  <h5 class="font-bold truncate mr-1">
                    {{ postNav.data.value[1].title }}
                  </h5>
                  <div class="i-iconoir:arrow-right-circle flex-shrink-0" />
                </hgroup>
                <p class="text-xs text-right mt-1 duration-200">
                  https://maxlee.me{{ postNav.data.value[1]._path }}
                </p>
              </div>

              <div class="flex items-center gap-1 md:hidden">
                <div class="text-sm">Next Post</div>
                <div class="i-iconoir:arrow-right-circle" />
              </div>
            </NuxtLink>
            <div v-else class="w-1/2" />
          </div>
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

      <ClientOnly>
        <PostMessageBoard class="mt-10" />
      </ClientOnly>
    </div>
  </main>
</template>

<style lang="scss">
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
    color: var(--highlight-color);

    a {
      text-decoration: none !important;
    }
  }

  h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 32px;
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
    color: var(--highlight-light-color);
  }

  a:not(.preview) {
    text-decoration: underline;
    text-underline-offset: 3px;
    word-break: break-all;
    transition: 0.2s;

    &:hover {
      color: var(--highlight-color);
    }
  }

  a.preview {
    border: 1px solid var(--box-border-color);
    background-color: transparent;
    transition: 0.3s;

    &:hover {
      color: var(--highlight-color);
      background-color: var(--highlight-color-hover);
    }
  }

  br {
    content: "." !important;
    display: block !important;
    height: 12px;
    margin: 0 !important;
  }

  code {
    font-family: var(--code-font);
    background-color: var(--box-bg-color);
    font-size: 14px;
    padding: 3px 4px;
    margin: 0 2px;
    color: rgb(196, 127, 0);
    @extend %rounded;
  }

  pre {
    font-family: var(--code-font);
    box-shadow: 0px 0px 3px var(--box-border-color);
    background-color: var(--code-bg-color);
    margin: 12px 0;
    padding: 20px 0;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    @extend %rounded;

    &::-webkit-scrollbar {
      display: none;
    }

    code {
      min-width: 100%;
      display: inline-block;
      margin: 0;
      padding: 0;
      background-color: unset;
      color: unset;
      overflow: visible;

      .line {
        padding: 2px 20px;

        &.hl {
          background-color: var(--code-highlight-bg-color);
        }
      }
    }
  }

  blockquote {
    margin: 16px 0 8px;
    padding: 16px;
    border: 1px solid var(--sp-box-border-color);
    color: var(--highlight-color);
    background-color: var(--sp-box-bg-color);
    @extend %rounded;

    p {
      margin: 0;
      font-size: 14px;
    }

    ol,
    ul {
      margin: 8px 0;
      font-size: 14px;
    }
  }

  hr {
    height: 0;
    margin: 24px 0;
    border-top-color: var(--box-border-color);
  }

  img {
    display: block;
    width: 100%;
    margin: 12px auto;
    background-color: var(--img-bg-color);
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
    box-shadow: 0 0 0 1px var(--box-border-color);
    @extend %rounded;

    th {
      padding: 8px 12px;
      font-weight: bold;
      color: var(--highlight-color);
      background: var(--box-bg-color);
      border-bottom: 1px solid var(--box-border-color);

      &:not(:last-child) {
        border-right: 1px solid var(--box-border-color);
      }
    }

    tr {
      background-color: var(--box-bg-light-color);

      &:not(:last-child) {
        border-bottom: 1px solid var(--box-border-color);
      }
    }

    td {
      padding: 12px;

      &:not(:last-child) {
        border-right: 1px solid var(--box-border-color);
      }
    }
  }
}

.post-nav-group {
  a {
    flex-shrink: 1;
    flex-grow: 0;
    color: var(--nav-color);
    border: 1px solid var(--box-border-color);

    p {
      color: var(--box-border-color);
    }

    &:hover {
      color: var(--highlight-color);
      background-color: var(--box-bg-color);

      p {
        color: var(--nav-hover-color);
      }
    }
  }
}
</style>
