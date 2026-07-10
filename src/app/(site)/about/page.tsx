import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_SITE_SETTINGS, type SiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description:
    "Learn more about Alex's journey in animation and experience in 3D and classic animation.",
};

export default async function AboutPage() {
  let content: SiteContent = DEFAULT_SITE_SETTINGS;
  try {
    content = await getSiteSettings();
  } catch {
    content = DEFAULT_SITE_SETTINGS;
  }

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="anim-rise text-muted-foreground mb-3 font-mono text-xs font-medium tracking-[0.25em] uppercase">
          <span aria-hidden className="text-accent-brand">
            /{" "}
          </span>
          About
        </p>
        <h1 className="anim-rise anim-delay-1 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {content.aboutHeading}
        </h1>

        <div className="anim-rise anim-delay-2 text-foreground/80 mt-8 space-y-4 text-lg leading-relaxed">
          {content.aboutIntro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {content.expertise.length > 0 ? (
        <section className="mt-24">
          <Reveal>
            <h2 className="text-muted-foreground mb-8 font-mono text-xs font-medium tracking-[0.25em] uppercase">
              <span aria-hidden className="text-accent-brand">
                /{" "}
              </span>
              Expertise
            </h2>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {content.expertise.map((group) => (
              <StaggerItem key={group.heading}>
                <h3 className="font-display mb-4 text-xl tracking-tight">
                  {group.heading}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-muted-foreground text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      ) : null}

      {content.approach.length > 0 ? (
        <section className="mt-24">
          <Reveal>
            <h2 className="text-muted-foreground mb-2 font-mono text-xs font-medium tracking-[0.25em] uppercase">
              <span aria-hidden className="text-accent-brand">
                /{" "}
              </span>
              My Approach
            </h2>
          </Reveal>
          <div>
            {content.approach.map((a) => (
              <Reveal
                key={a.title}
                className="border-border/60 grid grid-cols-1 gap-x-10 gap-y-3 border-t py-8 first:border-t-0 sm:grid-cols-[6rem_1fr_2fr] sm:items-baseline"
              >
                <span
                  aria-hidden
                  className="text-accent-brand font-mono text-sm tabular-nums"
                >
                  {a.n}
                </span>
                <h3 className="font-display text-2xl tracking-tight">
                  {a.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {a.body}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <Reveal className="mt-20">
        <Button asChild size="lg" className="rounded-full px-7">
          <Link href="/projects">See the work →</Link>
        </Button>
      </Reveal>
    </Container>
  );
}
