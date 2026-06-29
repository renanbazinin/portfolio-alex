import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const publishStatusEnum = pgEnum("publish_status", [
  "draft",
  "published",
]);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default(""),
  year: integer("year"),
  role: text("role").notNull().default(""),
  tools: jsonb("tools").$type<string[]>().notNull().default([]),
  description: text("description").notNull().default(""),
  thumbnail: text("thumbnail").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  videoUrl: text("video_url").notNull().default(""),
  publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
