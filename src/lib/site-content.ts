import type {
  ApproachItem,
  ExpertiseGroup,
  SocialLink,
} from "@/lib/db/schema";

/** The editable shape of site content, independent of DB row metadata. */
export type SiteContent = {
  aboutHeading: string;
  aboutIntro: string[];
  expertise: ExpertiseGroup[];
  approach: ApproachItem[];
  name: string;
  role: string;
  location: string;
  contactEmail: string;
  socialLinks: SocialLink[];
};

/**
 * Built-in defaults, equal to the values previously hard-coded in
 * `about/page.tsx` and `site-footer.tsx`. Served whenever no settings row
 * exists, so the public site renders correctly before any edit is made.
 */
export const DEFAULT_SITE_SETTINGS: SiteContent = {
  aboutHeading: "Bringing imagination to life.",
  aboutIntro: [
    "With over 8 years of experience in the animation industry, I've had the privilege of working on a diverse range of projects spanning feature films, commercials, video games, and independent productions. My journey began with a fascination for both traditional hand-drawn animation and the emerging world of 3D computer graphics.",
    "This dual passion led me to master both classic frame-by-frame techniques and cutting-edge 3D animation workflows. I believe that understanding the fundamentals of traditional animation enhances my 3D work, bringing a level of artistry and timing that pure technical skill alone cannot achieve.",
    "I specialize in character animation, bringing personalities to life through subtle movements and expressions. Whether it's a hand-drawn character or a complex 3D rig, my focus is always on storytelling and creating believable, emotionally resonant performances.",
  ],
  expertise: [
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
  ],
  approach: [
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
  ],
  name: "Alex",
  role: "Animator",
  location: "Los Angeles, CA",
  contactEmail: "alex@example.com",
  socialLinks: [
    { label: "Vimeo", href: "https://vimeo.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};
