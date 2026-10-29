import * as React from "react";

/*
 * Since Next.js 16.4 the App Router's React includes <ViewTransition> with no
 * config flag, but it isn't in the stable type definitions yet. Resolve it at
 * runtime and no-op when unavailable so navigation keeps working in older
 * browsers.
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
