import {
  defineConfig,
  presetUno,
  presetIcons,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  presets: [
    presetUno({
      dark: {
        dark: ".dark-mode",
      },
    }),
    presetIcons(),
  ],
  transformers: [transformerDirectives()],
});
