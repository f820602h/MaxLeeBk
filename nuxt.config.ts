export default {
  site: { url: "https://maxlee.me" },
  content: {
    contentHead: false,
    highlight: {
      langs: [
        "json",
        "js",
        "jsx",
        "ts",
        "html",
        "css",
        "scss",
        "vue",
        "shell",
        "mdc",
        "md",
        "yaml",
      ],
      theme: {
        default: "vitesse-light",
        "light-mode": "vitesse-light",
        "dark-mode": "vitesse-dark",
      },
    },
  },
  build: { transpile: ["shiki"] },
  runtimeConfig: { public: { linkApi: process.env.NUXT_LINK_API } },
  devtools: { enabled: false },
  devServer: { port: 3030 },
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-Hant",
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" },
        { rel: "canonical", href: "https://maxlee.me" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Mono:wght@400;700&family=Roboto:ital,wght@0,400;0,700;0,900;1,900&display=swap",
          rel: "stylesheet",
        },
      ],
      title: "Max Lee",
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "description", content: "Max Lee's Portfolio" },
        { property: "og:title", content: "Max Lee" },
        { property: "og:description", content: "Max Lee's Portfolio" },
        { property: "og:site_name", content: "Max Lee" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://maxlee.me" },
        { property: "og:image", content: "https://maxlee.me/og.png" },
        { property: "og:image:alt", content: "Max Lee's Portfolio" },
        { name: "twitter:title", content: "Max Lee" },
        { name: "twitter:description", content: "Max Lee's Portfolio" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: "https://maxlee.me/og.png" },
        { name: "twitter:image:alt", content: "Max Lee" },
      ],
    },
  },
  ogImage: {
    fonts: ["Noto+Sans+TC:700"],
  },
  nitro: {
    typescript: { typeCheck: true },
    prerender: { routes: ["/sitemap.xml"] },
  },
  modules: [
    "@nuxt/content",
    "@unocss/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-og-image",
    "@nuxtjs/robots",
  ],
  css: ["@unocss/reset/tailwind.css"],
};
