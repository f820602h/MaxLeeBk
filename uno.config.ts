import { defineConfig, presetUno, presetIcons } from "unocss";

export default defineConfig({
  presets: [
    presetUno({
      dark: {
        dark: ".dark-mode",
      },
    }),
    presetIcons(),
  ],
});
