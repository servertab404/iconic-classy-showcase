import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
};

/** Fades / slides / scales content in when it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, scale = 1, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0.3 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
