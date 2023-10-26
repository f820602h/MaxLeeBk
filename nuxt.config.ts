export default {
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
          href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
          rel: "stylesheet",
        },
      ],
    },
  },
  nitro: {
    preset: "vercel-edge",
    typescript: {
      typeCheck: true,
    },
  },
  modules: ["@pinia/nuxt", "@unocss/nuxt", "@vueuse/nuxt"],
  css: ["@unocss/reset/tailwind.css"],
};
