import { useEffect, useRef, useState, type ReactNode } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0 },
    );
    io.observe(el);

    // Safety net: if the element is already on screen at mount, reveal it.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) setShown(true);

    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        shown
          ? { opacity: 1, y: 0, scale: 1 }
          : reduced
            ? { opacity: 0 }
            : { opacity: 0, y, scale }
      }
      transition={{ duration: reduced ? 0.3 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
