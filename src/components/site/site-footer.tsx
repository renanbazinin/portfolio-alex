import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-32 border-t">
      <Container className="py-16 sm:py-24">
        <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.25em] uppercase">
          Get in touch
        </p>
        <a
          href={`mailto:${siteConfig.email}`}
          className="link-underline font-display mt-4 inline-block text-3xl tracking-tight sm:text-5xl"
        >
          Have a story that needs motion?
        </a>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          {siteConfig.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
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
      </Container>

      <div className="border-border/60 border-t">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.role} ·{" "}
            {siteConfig.location}
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
