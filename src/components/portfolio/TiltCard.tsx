import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/** Glass card that tilts in 3D toward the cursor and glows on hover. */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * 12);
        rx.set(-py * 12);
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`glass gradient-border relative rounded-2xl transition-shadow duration-500 ${
        hovered ? "shadow-[var(--glow-violet)]" : ""
      } ${className ?? ""}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-accent opacity-0 blur-3xl transition-opacity duration-500"
        style={{ opacity: hovered && !reduced ? 0.18 : 0 }}
      />
      {children}
    </motion.div>
  );
}
