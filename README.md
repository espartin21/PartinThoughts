# Partin Thoughts

A place to share my parting thoughts. A personal blog built with [Astro](https://astro.build) — personal essays, borrowed wisdom, and observations from the ordinary.

## Getting started

```bash
npm install
npm run dev       # http://localhost:4321
```

## Scripts

```bash
npm run build        # Build static site to dist/
npm run preview      # Preview the built site
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier auto-format
npm run format:check # Prettier check only
npx astro check      # TypeScript type checking
```

## Adding a post

Create a markdown file in `src/content/posts/`:

```markdown
---
title: "Your post title"
date: 2026-04-19
tag: work # work | living | personal
excerpt: "A short description."
---

Your content here.
```

No other files need updating.

## Pages

- `/` — homepage with featured post and recent feed
- `/p/<slug>/` — individual post
- `/archive/` — all posts
- `/tags/` — browse by tag
- `/about/` — about the author
- `/colophon/` — how the site is built
- `/rss.xml` — RSS feed
- `/sitemap-index.xml` — sitemap for search engines
- `/404.html` — custom not-found page

## Tech stack

- **Astro 6** — static site generation
- **React** — command palette (single interactive island)
- **TypeScript** — strict mode
- **CSS** — custom properties, oklch colors, no framework
