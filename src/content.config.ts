import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).optional().default([]),
  date: z.coerce.date(),
});

export const collections = {
  fogging: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/fogging' }),
    schema: blogSchema,
  }),
  exploreing: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/exploreing' }),
    schema: blogSchema,
  }),
  creating: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/creating' }),
    schema: blogSchema,
  }),
  thinking: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/thinking' }),
    schema: blogSchema,
  }),
};
