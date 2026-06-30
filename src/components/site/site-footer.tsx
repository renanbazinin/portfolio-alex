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

  const subtitle = [content.role, content.location].filter(Boolean).join(" · ");

  const links = [
    ...(content.contactEmail
      ? [{ href: `mailto:${content.contactEmail}`, label: "Email" }]
      : []),
    ...content.socialLinks,
  ];

  return (
    <footer className="border-border/60 bg-card/40 mt-24 border-t">
      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <p className="gradient-text text-xl font-bold tracking-[0.12em]">
              {content.name || "Alex"}
            </p>
            {subtitle ? (
              <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
            ) : null}
          </div>

          <div className="sm:justify-self-end">
            <h4 className="mb-3 text-sm font-semibold">Connect</h4>
            <div className="flex flex-col gap-2.5">
              {links.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-[var(--accent-primary)] text-sm transition-colors"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-border/60 mt-10 flex items-center justify-between border-t pt-6">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {content.name || "Alex"}. All rights
            reserved.
          </p>
          <Link
            href="/admin"
            className="text-muted-foreground/60 hover:text-foreground text-xs transition-colors"
          >
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
