import { z } from "zod";

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]*$/, "Slug may only contain lowercase letters, numbers, and hyphens")
    .optional()
    .default(""),
  category: z.string().trim().default(""),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2200)
    .optional()
    .nullable(),
  role: z.string().trim().default(""),
  tools: z.array(z.string().trim().min(1)).default([]),
  description: z.string().trim().default(""),
  thumbnail: z.string().trim().default(""),
  images: z.array(z.string().trim()).default([]),
  videoUrl: z.string().trim().default(""),
  publishStatus: z.enum(["draft", "published"]).default("draft"),
  featured: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

export const reorderSchema = z.object({
  order: z.array(z.number().int()).min(1),
});

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
