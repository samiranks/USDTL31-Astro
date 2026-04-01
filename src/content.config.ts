import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const activites = defineCollection({
  // Use the glob loader for local Markdown files in src/content/activites
  loader: glob({ pattern: "**/*.md", base: "./src/content/activites" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    image: z.string().optional(),
    summary: z.string(),
  }),
});

export const collections = {
  activites: activites,
};
