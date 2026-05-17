# MyBlog

Personal site built with **Astro 5**, **React**, and **Tailwind**, including project showcases (Markdown + content collections), photography (plog), and SEO metadata.

## Tech stack

- Astro 5 (static output, sitemap)
- React islands (photo stream, lightbox, color bar)
- Tailwind CSS
- Content collections with `src/content.config.ts` and local images under `src/content/projects/`

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/blog` | Blog placeholder |
| `/projects` | Project list |
| `/projects/[id]` | Project detail (from Markdown frontmatter `id`) |
| `/plog` | Photography landing |
| `/plog/content` | Photo grid |
| `/contact` | Contact |

Production site URL is configured in `astro.config.mjs` as `site` (used by the sitemap).

## Getting started

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Images

- **Public URLs** (e.g. `/images/avatar.jpg`, plog assets): place files under `public/` so they are served as-is.
- **Project thumbnails** referenced in Markdown (e.g. `thumbnail: "./docmmir_illustrate.png"`): store image files next to the `.md` in `src/content/projects/`; Astro will validate them via the collection schema and optimize them with `astro:assets` where used.

## License

MIT
