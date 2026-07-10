import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_SITE_SETTINGS, type SiteContent } from "@/lib/site-content";
import { Container } from "./container";

export async function SiteFooter() {
  let content: SiteContent = DEFAULT_SITE_SETTINGS;
  try {
    content = await getSiteSettings();
  } catch {
    content = DEFAULT_SITE_SETTINGS;
  }

  const byline = [content.name, content.role, content.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="border-border/60 mt-32 border-t">
      <Container className="py-16 sm:py-24">
        <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Get in touch
        </p>
        {content.contactEmail ? (
          <a
            href={`mailto:${content.contactEmail}`}
            className="link-underline font-display mt-4 inline-block text-3xl tracking-tight sm:text-5xl"
          >
            Have a story that needs motion?
          </a>
        ) : (
          <p className="font-display mt-4 text-3xl tracking-tight sm:text-5xl">
            Have a story that needs motion?
          </p>
        )}

        {content.socialLinks.length > 0 ? (
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            {content.socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors duration-200"
              >
                {s.label}
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        ) : null}
      </Container>

      <div className="border-border/60 border-t">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {byline}
          </p>
          <Link
            href="/admin"
            className="text-muted-foreground/60 hover:text-foreground text-sm transition-colors"
          >
            Admin
          </Link>
        </Container>
      </div>
    </footer>
  );
}
