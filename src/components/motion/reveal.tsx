"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { DURATION, EASE_OUT_SOFT, STAGGER } from "./constants";

/*
 * All reveal components use `initial={false}` so server-rendered HTML is
 * fully visible: without JavaScript nothing is ever hidden, and content
 * already in the viewport on load never animates from hidden.
 */

const IN_VIEW_MARGIN = "0px 0px -80px 0px";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={
        inView
          ? { duration: DURATION.slow, ease: EASE_OUT_SOFT, delay }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = STAGGER,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: IN_VIEW_MARGIN });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: stagger } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, transition: { duration: 0 } },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.slow, ease: EASE_OUT_SOFT },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
