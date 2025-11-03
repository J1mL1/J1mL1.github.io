import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
    thumbnail: image(),
    id: z.string(),
    links: z.array(z.object({
      label: z.string(),
      href: z.string().url(),
      badge: z.string().url(),
    })).optional(),
  })
});

export const collections = {
  'projects': projectsCollection
}; 
