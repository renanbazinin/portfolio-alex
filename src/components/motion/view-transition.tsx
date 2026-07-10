import * as React from "react";

/*
 * React's <ViewTransition> ships in the experimental channel Next.js swaps in
 * when `experimental.viewTransition` is enabled, but it isn't in the stable
 * type definitions yet. Resolve it at runtime and no-op when unavailable so
 * navigation keeps working with the flag off or in older browsers.
 */
type ViewTransitionComponent = React.ComponentType<{
  name?: string;
  children: React.ReactNode;
}>;

const ViewTransition = (
  React as unknown as { ViewTransition?: ViewTransitionComponent }
).ViewTransition;

export function SharedElement({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  if (!ViewTransition) return <>{children}</>;
  return <ViewTransition name={name}>{children}</ViewTransition>;
}
