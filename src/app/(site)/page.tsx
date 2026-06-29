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
  const showcase = (featured.length > 0 ? featured : published).slice(0, 6);

  return (
    <>
      <section className="border-border/60 border-b">
        <Container className="py-24 sm:py-32">
          <p className="text-muted-foreground mb-5 text-xs font-medium tracking-[0.25em] uppercase">
            Animator · 3D &amp; Classic
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Alex — bringing stories to life through animation.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg">
            With expertise spanning both 3D and classic animation techniques, I
            create compelling visual narratives — from character animation to
            complex motion design, crafted with precision and artistic vision.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects">View work</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">About Alex</Link>
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

      <section className="border-border/60 border-t">
        <Container className="py-20">
          <SectionHeading kicker="What I do" title="Specialties" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {SPECIALTIES.map((s) => (
              <div key={s.title}>
                <h3 className="text-lg font-medium">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
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
