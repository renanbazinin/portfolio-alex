import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings, type SiteSettings } from "@/lib/db/schema";
import { DEFAULT_SITE_SETTINGS, type SiteContent } from "@/lib/site-content";
import type { SiteSettingsInput } from "@/lib/validation";

const SETTINGS_ID = 1;

/** Merge a stored row over the defaults, falling back per-field when null. */
function mergeWithDefaults(row: SiteSettings | undefined): SiteContent {
  if (!row) return DEFAULT_SITE_SETTINGS;
  return {
    homeVariant: row.homeVariant || DEFAULT_SITE_SETTINGS.homeVariant,
    heroTitle: row.heroTitle || DEFAULT_SITE_SETTINGS.heroTitle,
    heroSubtitle: row.heroSubtitle || DEFAULT_SITE_SETTINGS.heroSubtitle,
    specialties: row.specialties ?? DEFAULT_SITE_SETTINGS.specialties,
    aboutHeading: row.aboutHeading || DEFAULT_SITE_SETTINGS.aboutHeading,
    aboutIntro: row.aboutIntro ?? DEFAULT_SITE_SETTINGS.aboutIntro,
    expertise: row.expertise ?? DEFAULT_SITE_SETTINGS.expertise,
    approach: row.approach ?? DEFAULT_SITE_SETTINGS.approach,
    name: row.name || DEFAULT_SITE_SETTINGS.name,
    role: row.role || DEFAULT_SITE_SETTINGS.role,
    location: row.location || DEFAULT_SITE_SETTINGS.location,
    contactEmail: row.contactEmail || DEFAULT_SITE_SETTINGS.contactEmail,
    socialLinks: row.socialLinks ?? DEFAULT_SITE_SETTINGS.socialLinks,
  };
}

/**
 * Current site content for public rendering and the admin form. Returns
 * built-in defaults when no row exists yet, so the site never renders empty.
 * Note: an intentionally-saved empty array is respected (only a missing row
 * falls back to defaults wholesale).
 */
export async function getSiteSettings(): Promise<SiteContent> {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SETTINGS_ID))
    .limit(1);
  return mergeWithDefaults(rows[0]);
}

/** Upsert the singleton settings row (id = 1) and return the saved content. */
export async function updateSiteSettings(
  input: SiteSettingsInput,
): Promise<SiteContent> {
  const rows = await db
    .insert(siteSettings)
    .values({ id: SETTINGS_ID, ...input })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { ...input, updatedAt: sql`now()` },
    })
    .returning();
  return mergeWithDefaults(rows[0]);
}
