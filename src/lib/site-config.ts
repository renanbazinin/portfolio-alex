/** Single source of truth for site identity and outbound links. */
export const siteConfig = {
  name: "Alex",
  role: "Animator",
  tagline: "Animator · 3D & Classic",
  location: "Los Angeles, CA",
  email: "alex@example.com",
  socials: [
    { label: "Vimeo", href: "https://vimeo.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
} as const;
