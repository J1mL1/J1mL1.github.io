import type { ImageMetadata } from 'astro';

const thumbnailModules = import.meta.glob('../content/projects/**/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, ImageMetadata>;

export function resolveProjectThumbnail(
  thumbnail: ImageMetadata | string | undefined,
): ImageMetadata | undefined {
  if (!thumbnail) return undefined;
  if (typeof thumbnail !== 'string') return thumbnail;
  const key = `../content/projects/${thumbnail.replace(/^\.\//, '')}`;
  return thumbnailModules[key];
}
