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

const adhesions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/adhesions" }),
  schema: z.object({
    nom: z.string(),
    prenom: z.string(),
    email: z.string().email(),
    tel: z.string(),
    entreprise: z.string(),
    fonction: z.string(),
    contrat: z.string(),
    temps: z.string(),
    cotisation: z.string().optional(),
    frequence: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

export const collections = {
  activites: activites,
  adhesions: adhesions,
};
