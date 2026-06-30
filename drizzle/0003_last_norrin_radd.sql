ALTER TABLE "site_settings" ADD COLUMN "hero_title" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "hero_subtitle" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "specialties" jsonb DEFAULT '[]'::jsonb NOT NULL;