/**
 * Shared motion language — keep in sync with the CSS custom properties
 * (--ease-out-soft, --dur-*) defined in globals.css.
 */
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.65,
} as const;

export const STAGGER = 0.08;
