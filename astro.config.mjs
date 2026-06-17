// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://ethan.partin.io",
  integrations: [react(), sitemap()],
  markdown: {
    // Give every heading an id (rehypeSlug), then make the whole heading a
    // self-link to that id (rehypeAutolinkHeadings, behavior: "wrap"). Order
    // matters: slug must run first so the ids exist to link to.
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: { className: "heading-anchor" },
          },
        ],
      ],
    }),
  },
});
