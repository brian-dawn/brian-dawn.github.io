import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";

import customTheme from "./catpuccin-compiled/mocha.json";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  markdown: {
    shikiConfig: {
      theme: customTheme,
      //theme: "monokai",
      // theme: "dracula-soft",
    },
  },
  integrations: [mdx(), sitemap(), tailwind()],
});
