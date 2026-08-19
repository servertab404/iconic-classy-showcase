import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const WORDS = ["tomorrow.", "at scale.", "for real."];

export function KineticHeadline() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const line = (delay: number, children: React.ReactNode, className = "") => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: "100%" }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: "0%" }}
        transition={{ delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );

  return (
    <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl">
      {line(0.15, "Learning today.")}
      {line(
        0.3,
        <span className="shimmer-text">Engineering</span>,
      )}
      {line(
        0.45,
        <span className="relative inline-flex overflow-hidden align-bottom">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={reduced ? "static" : WORDS[index]}
              initial={reduced ? false : { y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { y: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="shimmer-text block"
            >
              {reduced ? WORDS[0] : WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </span>,
      )}
    </h1>
  );
}
