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
  // Astro 7 defaults to JSX whitespace rules ("jsx"), which drop the spaces
  // between inline elements our templates rely on (e.g. masthead, post meta).
  // `true` is Astro 6's lossless compression and keeps the rendered output.
  compressHTML: true,
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
