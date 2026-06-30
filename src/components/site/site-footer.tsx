import Link from "next/link";
import { Container } from "./container";
import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_SITE_SETTINGS, type SiteContent } from "@/lib/site-content";

export async function SiteFooter() {
  let content: SiteContent = DEFAULT_SITE_SETTINGS;
  try {
    content = await getSiteSettings();
  } catch {
    content = DEFAULT_SITE_SETTINGS;
  }

  const identity = [content.name, content.role, content.location]
    .filter(Boolean)
    .join(" · ");

  const links = [
    ...(content.contactEmail
      ? [{ href: `mailto:${content.contactEmail}`, label: "Email" }]
      : []),
    ...content.socialLinks,
  ];

  return (
    <footer className="border-border/60 mt-24 border-t py-10">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {identity}
        </p>
        <div className="flex items-center gap-6">
          {links.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {c.label}
            </a>
          ))}
          <Link
            href="/admin"
            className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors"
          >
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
