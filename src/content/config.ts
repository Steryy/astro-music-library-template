import { defineCollection, z } from "astro:content";

const songs = defineCollection({
  type: "data",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string().optional(),
    track: z
      .object({
        no: z.number().optional().nullable(),
        of: z.number().optional().nullable(),
      })
      .optional(),

    duration: z.number(),
    artists: z.string().array().optional(),
    comment: z.string().array().optional(),
    date: z.string().date(). optional(),
    cover: z.string().optional(),
    filepath: z.string(),
    album: z.string().optional(),
    lyrics: z.string().array().optional(),
  }),
});

export const collections = { songs };
