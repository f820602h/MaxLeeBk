import { defineConfig, presetUno } from "unocss";
import { presetIcons } from "@unocss/preset-icons";

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
