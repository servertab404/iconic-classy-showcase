import { motion, useReducedMotion } from "motion/react";

/** Thin gradient rule that draws itself as it enters the viewport. */
export function GradientDivider() {
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-6xl px-6" aria-hidden="true">
      <svg className="h-px w-full overflow-visible" viewBox="0 0 1000 1" preserveAspectRatio="none">
        <defs>
          <linearGradient id="divider-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--violet)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--violet)" />
            <stop offset="70%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1="0"
          y1="0.5"
          x2="1000"
          y2="0.5"
          stroke="url(#divider-gradient)"
          strokeWidth="1"
          initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduced ? 0.2 : 1.2, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
