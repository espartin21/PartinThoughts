import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { META } from "../types";
import { getVisiblePosts } from "../utils";

export async function GET(context: APIContext) {
  const posts = await getVisiblePosts();

  return rss({
    title: META.name,
    description: META.bio,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/p/${post.id}/`,
    })),
  });
}
