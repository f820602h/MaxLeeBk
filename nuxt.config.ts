export default {
  content: {
    contentHead: false,
    highlight: {
      theme: "vitesse-dark",
    },
  },
  runtimeConfig: {
    public: {
      linkApiKay: process.env.NUXT_LINK_API_KEY,
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.ico",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: true,
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Mono:wght@400;700&family=Roboto:ital,wght@0,400;0,700;1,900&display=swap",
          rel: "stylesheet",
        },
      ],
      title: "Max Lee",
      meta: [
        {
          name: "description",
          content: "Max Lee's Portfolio",
        },
        {
          property: "og:title",
          content: "Max Lee",
        },
        {
          property: "og:description",
          content: "Max Lee's Portfolio",
        },
        {
          property: "og:site_name",
          content: "Max Lee",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:url",
          content: "https://maxlee.me",
        },
        {
          property: "og:image",
          content: "https://maxlee.me/og.png",
        },
        {
          property: "og:image:alt",
          content: "Max Lee's Portfolio",
        },
        {
          name: "twitter:title",
          content: "Max Lee",
        },
        {
          name: "twitter:description",
          content: "Max Lee's Portfolio",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:image",
          content: "https://maxlee.me/og.png",
        },
        {
          name: "twitter:image:alt",
          content: "Max Lee",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  nitro: {
    typescript: {
      typeCheck: true,
    },
    prerender: {
      routes: ["/sitemap.xml"],
    },
  },
  modules: ["@nuxt/content", "@unocss/nuxt", "@vueuse/nuxt"],
  css: ["@unocss/reset/tailwind.css"],
};
