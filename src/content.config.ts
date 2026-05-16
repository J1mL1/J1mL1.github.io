import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      date: z.string(),
      thumbnail: image(),
      id: z.string(),
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.string().url(),
            badge: z.string().url(),
          }),
        )
        .optional(),
    }),
});

export const collections = { projects };
