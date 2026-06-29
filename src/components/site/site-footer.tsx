import Link from "next/link";
import { Container } from "./container";

const CONTACT = [
  { href: "mailto:alex@example.com", label: "Email" },
  { href: "https://vimeo.com", label: "Vimeo" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
];

export function SiteFooter() {
  return (
    <footer className="border-border/60 mt-24 border-t py-10">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Alex · Animator · Los Angeles, CA
        </p>
        <div className="flex items-center gap-6">
          {CONTACT.map((c) => (
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
