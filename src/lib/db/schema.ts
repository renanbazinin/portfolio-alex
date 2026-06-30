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

export type ExpertiseGroup = { heading: string; items: string[] };
export type ApproachItem = { n: string; title: string; body: string };
export type SocialLink = { label: string; href: string };

/**
 * Singleton row (id = 1) holding admin-editable site content: About copy,
 * contact/identity info, and the managed list of social links. A missing row
 * is tolerated — the data layer falls back to built-in defaults.
 */
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  aboutHeading: text("about_heading").notNull().default(""),
  aboutIntro: jsonb("about_intro").$type<string[]>().notNull().default([]),
  expertise: jsonb("expertise").$type<ExpertiseGroup[]>().notNull().default([]),
  approach: jsonb("approach").$type<ApproachItem[]>().notNull().default([]),
  name: text("name").notNull().default(""),
  role: text("role").notNull().default(""),
  location: text("location").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  socialLinks: jsonb("social_links").$type<SocialLink[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;
