export default {
  content: {
    highlight: {
      // Theme used in all color schemes.
      theme: "vitesse-dark",
    },
  },
  app: {
    head: {
      link: [
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
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fira+Mono:wght@400;700&family=Roboto:wght@400;700&display=swap",
          rel: "stylesheet",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  nitro: {
    preset: "vercel-edge",
    typescript: {
      typeCheck: true,
    },
  },
  modules: ["@nuxt/content", "@unocss/nuxt", "@vueuse/nuxt"],
  css: ["@unocss/reset/tailwind.css"],
};
