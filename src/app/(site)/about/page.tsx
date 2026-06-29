import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

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
    n: "01",
    title: "Story First",
    body: "Every animation decision serves the narrative. Technical excellence means nothing without emotional truth.",
  },
  {
    n: "02",
    title: "Attention to Detail",
    body: "The magic is in the subtleties — secondary motion, timing variations, and nuanced expressions that bring characters to life.",
  },
  {
    n: "03",
    title: "Collaborative Spirit",
    body: "Great animation is a team effort. I thrive on feedback and love working with directors, artists, and technicians to achieve a shared vision.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.2em] uppercase">
          About
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Bringing imagination to life.
        </h1>

        <div className="text-foreground/80 mt-6 space-y-4 text-lg leading-relaxed">
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

      <section className="mt-16">
        <h2 className="text-muted-foreground mb-6 text-xs font-medium tracking-[0.2em] uppercase">
          Expertise
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {EXPERTISE.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-3 font-medium">{group.heading}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-muted-foreground text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-muted-foreground mb-6 text-xs font-medium tracking-[0.2em] uppercase">
          My Approach
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {APPROACH.map((a) => (
            <div key={a.n}>
              <div className="text-muted-foreground/50 text-2xl font-semibold tabular-nums">
                {a.n}
              </div>
              <h3 className="mt-2 font-medium">{a.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <Button asChild>
          <Link href="/projects">See the work →</Link>
        </Button>
      </div>
    </Container>
  );
}
