import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        publishedAt: z.date(),
        tags: z.array(z.string()),
        excerpt: z.string().optional(),
    }),
});

export const collections = {
    'posts': postsCollection,
};
