import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Estimates reading time in minutes based on a 250-words-per-minute pace.
 * Returns at least 1 minute, even for empty or very short bodies.
 *
 * @param body - The raw markdown body of a post.
 * @returns Whole minutes, rounded up.
 */
export function readTime(body: string | undefined): number {
  return Math.max(1, Math.ceil((body?.split(/\s+/).length ?? 0) / 250));
}

/**
 * Loads posts from the `posts` collection, filters out drafts and archived
 * posts, and returns them sorted newest-first by date.
 *
 * Filtering rules:
 * - `archived: true` posts are excluded in both dev and production.
 * - `draft: true` posts are excluded only in production builds, so they
 *   remain previewable via `npm run dev`.
 *
 * Every page that surfaces posts (homepage, archive, tags, RSS, sitemap,
 * command palette, hover preview, `/p/[slug]`) should call this rather than
 * `getCollection("posts")` directly to keep drafts and archived posts off
 * the live site.
 *
 * @returns Visible posts, sorted by `data.date` descending.
 */
export async function getVisiblePosts(): Promise<CollectionEntry<"posts">[]> {
  const posts = await getCollection("posts");
  return posts
    .filter((p) => {
      if (p.data.archived) {
        return false;
      }
      if (p.data.draft && import.meta.env.PROD) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Computes the user's whole-year age from a birth date, accounting for
 * whether the birthday has occurred yet this calendar year.
 *
 * @param birthDate - The birth date to measure from.
 * @returns Age in completed years.
 */
export function age(birthDate: Date): number {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }
  return years;
}
