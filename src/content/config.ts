import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
    thumbnail: z.string(),
    id: z.string(),
  })
});

export const collections = {
  'projects': projectsCollection
}; 