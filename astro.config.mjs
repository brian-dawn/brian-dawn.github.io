import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  markdown: {
    shikiConfig: {
      // theme: "rose-pine",
      // theme: "dracula-soft",
      // defaultColor: false,
      // theme: "laserwave",

      themes: {
        light: "github-light-high-contrast",
        dark: "github-dark-high-contrast",
      },

      // themes: {
      //   light: "rose-pine-dawn",
      //   dark: "rose-pine-moon",
      // },
    },
  },
  integrations: [mdx(), sitemap()],
});
