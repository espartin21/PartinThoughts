# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on localhost:4321
npm run build        # Build static site to dist/
npm run preview      # Preview the built site
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier auto-format
npm run format:check # Prettier check only
npx astro check      # TypeScript type checking
```

**Pre-commit hooks (husky):** ESLint, Prettier check, and `astro check` run automatically. Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) — enforced by commitlint.

## Architecture

This is an Astro 6 static blog with React islands. It builds to pure static HTML — no server runtime.

**Content system:** Posts are Markdown files in `src/content/posts/` with typed frontmatter (title, date, tag, excerpt). The schema is defined in `src/content.config.ts` using Zod. Tags are constrained to "work", "living", "personal". Adding a post means creating a `.md` file — no other files need updating.

**Layout hierarchy:** `Base.astro` wraps every page (head, fonts, masthead, footer, global components). `Post.astro` extends Base for article pages, adding reading progress and prev/next navigation.

**Interactivity model:** Almost everything ships zero client JS. Interactive features use two approaches:

- **Vanilla JS** via `<script>` in Astro components: ThemeToggle, ReadingProgress, HoverPreview
- **React island** with `client:load`: CommandPalette (the only React component that hydrates)

The `CommandPaletteIsland.astro` wrapper fetches all posts at build time and passes them as props to the React `CommandPalette.tsx`, which handles keyboard shortcuts (Cmd+K, `/`), filtering, and navigation.

**Theme system:** CSS variables with `[data-theme="dark"]` in `global.css`. An inline script in `Base.astro`'s `<head>` applies the saved theme before render to prevent flash. ThemeToggle persists to `localStorage` key `pt-theme`.

**Routing:** File-based. Dynamic routes (`p/[slug].astro`, `tags/[tag].astro`) use `getStaticPaths()` to generate all pages at build time. Post prev/next links are computed by sorting all posts by date in the slug page's `getStaticPaths`.

**CSS:** Single global stylesheet (`src/styles/global.css`) using CSS custom properties and oklch colors. No component-scoped styles or CSS framework.

**Shared constants:** `src/types.ts` exports `TAGS`, `META`, and the `Tag` type — the single source of truth for site metadata and valid tag values.
