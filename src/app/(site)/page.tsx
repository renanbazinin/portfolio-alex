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

  // Fall back to recent published projects when nothing is marked featured.
  const showcase = (featured.length > 0 ? featured : published).slice(0, 6);

  return (
    <>
      <section className="border-border/60 relative overflow-hidden border-b">
        {/* Decorative animated glow behind the hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <span className="glow-orb left-[5%] top-[8%] h-72 w-72 bg-[var(--accent-primary)]" />
          <span
            className="glow-orb bottom-[5%] right-[8%] h-96 w-96 bg-[var(--accent-secondary)]"
            style={{ animationDelay: "7s" }}
          />
          <span
            className="glow-orb right-[22%] top-[40%] h-56 w-56 bg-[var(--accent-primary)]"
            style={{ animationDelay: "14s" }}
          />
        </div>

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
            <Button asChild size="lg">
              <Link href="/projects">View work</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">About {content.name}</Link>
            </Button>
          </div>
        </Container>
      </section>

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

      {content.specialties.length > 0 ? (
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
    </>
  );
}
