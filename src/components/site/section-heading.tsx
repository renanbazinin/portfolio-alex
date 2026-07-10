export function SectionHeading({
  kicker,
  title,
  action,
}: {
  kicker?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        {kicker ? (
          <p className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-[0.25em] uppercase">
            <span aria-hidden className="text-accent-brand">
              /{" "}
            </span>
            {kicker}
          </p>
        ) : null}
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0 pb-1">{action}</div> : null}
    </div>
  );
}
