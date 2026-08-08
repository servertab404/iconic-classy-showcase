import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
};

/** Button-styled link that pulls toward the cursor and springs back. */
export function MagneticLink({ href, children, variant = "primary", external, className }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 15, mass: 0.4 });

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-shadow duration-300";
  const styles =
    variant === "primary"
      ? "bg-gradient-accent text-primary-foreground font-semibold hover:shadow-[var(--glow-violet)]"
      : "glass gradient-border text-foreground hover:shadow-[var(--glow-cyan)]";

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.45);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`${base} ${styles} ${className ?? ""}`}
    >
      {children}
    </motion.a>
  );
}
