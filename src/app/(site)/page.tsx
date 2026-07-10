import Link from "next/link";
import {
  listFeaturedProjects,
  listPublishedProjects,
  type Project,
} from "@/lib/projects";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/settings";
import {
  DEFAULT_SITE_SETTINGS,
  HOME_VARIANTS,
  type HomeVariant,
  type SiteContent,
} from "@/lib/site-content";
import { isAuthenticated } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

function HeroActions({ name }: { name: string }) {
  return (
    <>
      <Button asChild size="lg" className="rounded-full px-7">
        <Link href="/projects">View the work</Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="rounded-full px-7">
        <Link href="/about">About {name}</Link>
      </Button>
    </>
  );
}

function Kicker({ content }: { content: SiteContent }) {
  return (
    <p className="anim-rise text-muted-foreground font-mono text-xs font-medium tracking-[0.3em] uppercase">
      <span aria-hidden className="text-accent-brand">
        /{" "}
      </span>
      {content.role} · 3D &amp; Classic
    </p>
  );
}

/** Minimal, centered hero — name + role + CTAs in display type. */
function CenteredHero({ content }: { content: SiteContent }) {
  return (
    <section>
      <Container className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-24 text-center">
        <Kicker content={content} />
        <h1 className="anim-rise anim-delay-1 font-display mt-8 text-6xl leading-none tracking-tight sm:text-8xl lg:text-9xl">
          {content.name}
          <span aria-hidden className="text-accent-brand">
            .
          </span>
        </h1>
        <p className="anim-rise anim-delay-2 text-muted-foreground mt-6 font-mono text-sm font-medium tracking-[0.35em] uppercase sm:text-base">
          {content.role}
        </p>
        <div className="anim-rise anim-delay-3 mt-10 flex flex-wrap justify-center gap-3">
          <HeroActions name={content.name} />
        </div>
      </Container>
    </section>
  );
}

/** Headline hero — full title + subtitle, left-aligned editorial. */
function HeadlineHero({ content }: { content: SiteContent }) {
  return (
    <section>
      <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-24">
        <Kicker content={content} />
        <h1 className="anim-rise anim-delay-1 font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight text-balance sm:text-7xl">
          {content.heroTitle}
        </h1>
        <p className="anim-rise anim-delay-2 text-muted-foreground mt-8 max-w-xl text-lg leading-relaxed">
          {content.heroSubtitle}
        </p>
        <div className="anim-rise anim-delay-3 mt-10 flex flex-wrap gap-3">
          <HeroActions name={content.name} />
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ previewVariant?: string }>;
}) {
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

  // Authenticated admins can preview a layout via ?previewVariant without
  // persisting it; the override is render-only and ignored for visitors.
  const { previewVariant } = await searchParams;
  const isKnownVariant = HOME_VARIANTS.some((v) => v.value === previewVariant);
  const variant: HomeVariant =
    isKnownVariant && (await isAuthenticated())
      ? (previewVariant as HomeVariant)
      : content.homeVariant;

  const centered = variant === "minimal" || variant === "hero-work";
  const showProjects = variant !== "minimal";
  const showSpecialties = variant === "standard" || variant === "expanded";
  const showAbout = variant === "expanded";

  // Fall back to recent published projects when nothing is marked featured.
  const showcase = (featured.length > 0 ? featured : published).slice(0, 5);
  const [lead, ...rest] = showcase;

  return (
    <>
      {centered ? (
        <CenteredHero content={content} />
      ) : (
        <HeadlineHero content={content} />
      )}

      {showProjects ? (
        <section className="border-border/60 border-t">
          <Container className="py-24">
            <Reveal>
              <SectionHeading
                kicker={featured.length > 0 ? "Featured" : "Recent work"}
                title="Selected projects"
                action={
                  <Link
                    href="/projects"
                    className="link-underline text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    All projects →
                  </Link>
                }
              />
            </Reveal>

            {showcase.length === 0 ? (
              <div className="border-border rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground text-sm">
                  Work is on its way. Check back soon.
                </p>
              </div>
            ) : (
              <>
                {lead ? (
                  <Reveal className="mb-10">
                    <ProjectCard
                      project={lead}
                      featured
                      preload
                      sizes="(min-width: 1024px) 960px, 100vw"
                    />
                  </Reveal>
                ) : null}
                {rest.length > 0 ? (
                  <StaggerGroup className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
                    {rest.map((p) => (
                      <StaggerItem key={p.id}>
                        <ProjectCard
                          project={p}
                          sizes="(min-width: 640px) 50vw, 100vw"
                        />
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                ) : null}
              </>
            )}

            <Reveal className="mt-14 flex justify-center">
              <Button asChild variant="outline" className="rounded-full px-7">
                <Link href="/projects">See all projects</Link>
              </Button>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {showSpecialties && content.specialties.length > 0 ? (
        <section className="border-border/60 border-t">
          <Container className="py-24">
            <Reveal>
              <SectionHeading kicker="What I do" title="Specialties" />
            </Reveal>
            <div>
              {content.specialties.map((s, i) => (
                <Reveal
                  key={s.title}
                  className="border-border/60 grid grid-cols-1 gap-x-10 gap-y-3 border-t py-8 sm:grid-cols-[6rem_1fr_2fr] sm:items-baseline"
                >
                  <span
                    aria-hidden
                    className="text-accent-brand font-mono text-sm tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {s.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {showAbout && content.aboutIntro.length > 0 ? (
        <section className="border-border/60 border-t">
          <Container className="py-24">
            <Reveal className="max-w-2xl">
              <p className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-[0.25em] uppercase">
                <span aria-hidden className="text-accent-brand">
                  /{" "}
                </span>
                About
              </p>
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                {content.aboutHeading}
              </h2>
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                {content.aboutIntro[0]}
              </p>
              <div className="mt-8">
                <Button asChild variant="outline" className="rounded-full px-7">
                  <Link href="/about">Read more</Link>
                </Button>
              </div>
            </Reveal>
          </Container>
        </section>
      ) : null}
    </>
  );
}
