import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_SITE_SETTINGS, type SiteContent } from "@/lib/site-content";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: SiteContent = DEFAULT_SITE_SETTINGS;
  let loadError: string | null = null;
  try {
    settings = await getSiteSettings();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load settings";
  }

  return <SettingsForm initial={settings} loadError={loadError} />;
}
