import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";

export const metadata = {
  title: "About",
  description:
    "Learn more about Alex's journey in animation and experience in 3D and classic animation.",
};

const EXPERTISE = [
  {
    heading: "3D Animation",
    items: [
      "Character Animation",
      "Rigging & Setup",
      "Motion Capture",
      "Dynamics & Simulation",
      "Lighting & Rendering",
    ],
  },
  {
    heading: "Classic Animation",
    items: [
      "Frame-by-Frame Animation",
      "Character Design",
      "Storyboarding",
      "Traditional Techniques",
      "Digital Ink & Paint",
    ],
  },
  {
    heading: "Software",
    items: [
      "Autodesk Maya",
      "Blender",
      "Houdini",
      "Toon Boom Harmony",
      "Adobe Creative Suite",
    ],
  },
];

const APPROACH = [
  {
    title: "Story First",
    body: "Every animation decision serves the narrative. Technical excellence means nothing without emotional truth.",
  },
  {
    title: "Attention to Detail",
    body: "The magic is in the subtleties — secondary motion, timing variations, and nuanced expressions that bring characters to life.",
  },
  {
    title: "Collaborative Spirit",
    body: "Great animation is a team effort. I thrive on feedback and love working with directors, artists, and technicians to achieve a shared vision.",
  },
];

export default function AboutPage() {
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
          Bringing imagination to life.
        </h1>

        <div className="anim-rise anim-delay-2 text-foreground/80 mt-8 space-y-4 text-lg leading-relaxed">
          <p>
            With over 8 years of experience in the animation industry, I&apos;ve
            had the privilege of working on a diverse range of projects spanning
            feature films, commercials, video games, and independent
            productions. My journey began with a fascination for both
            traditional hand-drawn animation and the emerging world of 3D
            computer graphics.
          </p>
          <p>
            This dual passion led me to master both classic frame-by-frame
            techniques and cutting-edge 3D animation workflows. I believe that
            understanding the fundamentals of traditional animation enhances my
            3D work, bringing a level of artistry and timing that pure technical
            skill alone cannot achieve.
          </p>
          <p>
            I specialize in character animation, bringing personalities to life
            through subtle movements and expressions. Whether it&apos;s a
            hand-drawn character or a complex 3D rig, my focus is always on
            storytelling and creating believable, emotionally resonant
            performances.
          </p>
        </div>
      </div>

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
          {EXPERTISE.map((group) => (
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
          {APPROACH.map((a, i) => (
            <Reveal
              key={a.title}
              className="border-border/60 grid grid-cols-1 gap-x-10 gap-y-3 border-t py-8 first:border-t-0 sm:grid-cols-[6rem_1fr_2fr] sm:items-baseline"
            >
              <span
                aria-hidden
                className="text-accent-brand font-mono text-sm tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
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

      <Reveal className="mt-20">
        <Button asChild size="lg" className="rounded-full px-7">
          <Link href="/projects">See the work →</Link>
        </Button>
      </Reveal>
    </Container>
  );
}
