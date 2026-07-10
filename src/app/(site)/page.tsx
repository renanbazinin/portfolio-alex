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
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Project[] = [];
  let published: Project[] = [];
  try {
    [featured, published] = await Promise.all([
      listFeaturedProjects(),
      listPublishedProjects(),
    ]);
  } catch {
    featured = [];
    published = [];
  }

  // Fall back to recent published projects when nothing is marked featured.
  const showcase = (featured.length > 0 ? featured : published).slice(0, 5);
  const [lead, ...rest] = showcase;

  return (
    <>
      <section>
        <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-24">
          <p className="anim-rise text-muted-foreground font-mono text-xs font-medium tracking-[0.3em] uppercase">
            <span aria-hidden className="text-accent-brand">
              /{" "}
            </span>
            {siteConfig.tagline}
          </p>
          <h1 className="anim-rise anim-delay-1 font-display mt-6 max-w-4xl text-5xl leading-[1.05] tracking-tight text-balance sm:text-7xl lg:text-8xl">
            Bringing stories to <em className="text-accent-brand">life</em>,
            one frame at a time.
          </h1>
          <p className="anim-rise anim-delay-2 text-muted-foreground mt-8 max-w-xl text-lg leading-relaxed">
            Character animation, 3D, and classic frame-by-frame work — visual
            narratives crafted with precision and artistic vision.
          </p>
          <div className="anim-rise anim-delay-3 mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/projects">View the work</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7"
            >
              <Link href="/about">About {siteConfig.name}</Link>
            </Button>
          </div>
        </Container>
      </section>

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

      <section className="border-border/60 border-t">
        <Container className="py-24">
          <Reveal>
            <SectionHeading kicker="What I do" title="Specialties" />
          </Reveal>
          <div>
            {SPECIALTIES.map((s, i) => (
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
    </>
  );
}

const SPECIALTIES = [
  {
    title: "3D Animation",
    description:
      "Character rigging, motion capture, and dynamic simulations using industry-standard tools like Maya, Blender, and Houdini.",
  },
  {
    title: "Classic Animation",
    description:
      "Traditional frame-by-frame animation with hand-drawn artistry, bringing timeless techniques to modern storytelling.",
  },
  {
    title: "Motion Design",
    description:
      "Fluid transitions, dynamic typography, and visual effects that enhance narrative impact and viewer engagement.",
  },
];
