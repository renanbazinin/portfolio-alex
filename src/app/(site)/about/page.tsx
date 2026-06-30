import Link from "next/link";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";
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
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.2em] uppercase">
          About
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {content.aboutHeading}
        </h1>

        <div className="text-foreground/80 mt-6 space-y-4 text-lg leading-relaxed">
          {content.aboutIntro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {content.expertise.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-muted-foreground mb-6 text-xs font-medium tracking-[0.2em] uppercase">
            Expertise
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {content.expertise.map((group) => (
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
      ) : null}

      {content.approach.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-muted-foreground mb-6 text-xs font-medium tracking-[0.2em] uppercase">
            My Approach
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {content.approach.map((a) => (
              <div key={a.title}>
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
      ) : null}

      <div className="mt-16">
        <Button asChild>
          <Link href="/projects">See the work →</Link>
        </Button>
      </div>
    </Container>
  );
}
