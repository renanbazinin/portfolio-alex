import Link from "next/link";
import {
  listFeaturedProjects,
  listPublishedProjects,
  type Project,
} from "@/lib/projects";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectCard } from "@/components/site/project-card";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/settings";
import { DEFAULT_SITE_SETTINGS, type SiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

/** Animated glow used behind both hero styles. Decorative only. */
function HeroGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <span className="glow-orb left-[8%] top-[12%] h-72 w-72 bg-[var(--accent-primary)]" />
      <span
        className="glow-orb bottom-[8%] right-[10%] h-96 w-96 bg-[var(--accent-secondary)]"
        style={{ animationDelay: "7s" }}
      />
      <span
        className="glow-orb left-[45%] top-[50%] h-56 w-56 bg-[var(--accent-primary)]"
        style={{ animationDelay: "14s" }}
      />
    </div>
  );
}

function HeroActions({ name }: { name: string }) {
  return (
    <>
      <Button asChild size="lg">
        <Link href="/projects">View work</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link href="/about">About {name}</Link>
      </Button>
    </>
  );
}

/** Minimal, centered hero — name + role + CTAs over the glow. */
function CenteredHero({ content }: { content: SiteContent }) {
  return (
    <section className="border-border/60 relative flex min-h-[82vh] items-center overflow-hidden border-b">
      <HeroGlow />
      <Container className="relative z-10 text-center">
        <p className="text-muted-foreground mb-6 text-xs font-medium tracking-[0.3em] uppercase">
          {content.role} · 3D &amp; Classic
        </p>
        <h1 className="gradient-text text-6xl font-bold tracking-tight sm:text-8xl">
          {content.name}
        </h1>
        <p className="text-foreground/90 mt-4 text-xl font-medium tracking-[0.35em] uppercase sm:text-2xl">
          {content.role}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <HeroActions name={content.name} />
        </div>
      </Container>
    </section>
  );
}

/** Headline hero — full title + subtitle, left-aligned. */
function HeadlineHero({ content }: { content: SiteContent }) {
  return (
    <section className="border-border/60 relative overflow-hidden border-b">
      <HeroGlow />
      <Container className="relative z-10 py-24 sm:py-32">
        <p className="text-muted-foreground mb-5 text-xs font-medium tracking-[0.25em] uppercase">
          {content.role} · 3D &amp; Classic
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {content.heroTitle}
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg">
          {content.heroSubtitle}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <HeroActions name={content.name} />
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage() {
  let featured: Project[] = [];
  let published: Project[] = [];
  let content: SiteContent = DEFAULT_SITE_SETTINGS;
  try {
    [featured, published, content] = await Promise.all([
      listFeaturedProjects(),
      listPublishedProjects(),
      getSiteSettings(),
    ]);
  } catch {
    featured = [];
    published = [];
    content = DEFAULT_SITE_SETTINGS;
  }

  const variant = content.homeVariant;
  const centered = variant === "minimal" || variant === "hero-work";
  const showProjects = variant !== "minimal";
  const showSpecialties = variant === "standard" || variant === "expanded";
  const showAbout = variant === "expanded";

  // Fall back to recent published projects when nothing is marked featured.
  const showcase = (featured.length > 0 ? featured : published).slice(0, 6);

  return (
    <>
      {centered ? (
        <CenteredHero content={content} />
      ) : (
        <HeadlineHero content={content} />
      )}

      {showProjects ? (
        <section>
          <Container className="py-20">
            <SectionHeading
              kicker={featured.length > 0 ? "Featured" : "Recent work"}
              title="Selected projects"
              action={
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  All projects →
                </Link>
              }
            />

            {showcase.length === 0 ? (
              <div className="border-border rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground text-sm">
                  Work is on its way. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {showcase.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Button asChild variant="outline">
                <Link href="/projects">See all projects</Link>
              </Button>
            </div>
          </Container>
        </section>
      ) : null}

      {showSpecialties && content.specialties.length > 0 ? (
        <section className="border-border/60 border-t">
          <Container className="py-20">
            <SectionHeading kicker="What I do" title="Specialties" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {content.specialties.map((s) => (
                <div
                  key={s.title}
                  className="border-border bg-card hover-lift rounded-xl border p-6"
                >
                  <h3 className="text-lg font-medium">{s.title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {showAbout && content.aboutIntro.length > 0 ? (
        <section className="border-border/60 border-t">
          <Container className="py-20">
            <div className="max-w-2xl">
              <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.2em] uppercase">
                About
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {content.aboutHeading}
              </h2>
              <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
                {content.aboutIntro[0]}
              </p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/about">Read more</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
