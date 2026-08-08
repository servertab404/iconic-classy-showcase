import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/** Glowing dot cursor that expands into a ring over interactive elements. */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.4 });
  const tx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 });
  const ty = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("no-native-cursor");

    const interactive = "a, button, [role='button'], input, textarea, select, [data-cursor='hover']";
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setActive(Boolean((e.target as Element | null)?.closest?.(interactive)));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("no-native-cursor");
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        style={{ x: tx, y: ty, opacity: visible ? 0.5 : 0 }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ width: active ? 56 : 26, height: active ? 56 : 26 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="rounded-full bg-gradient-accent blur-md"
        />
      </motion.div>
      <motion.div
        style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: active ? 40 : 8,
            height: active ? 40 : 8,
            borderWidth: active ? 1.5 : 4,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="rounded-full border-cyan"
          style={{ borderStyle: "solid" }}
        />
      </motion.div>
    </div>
  );
}
