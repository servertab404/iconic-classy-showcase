import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** First-visit intro: the "IC" monogram draws itself, then reveals the page. */
export function IntroLoader() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (sessionStorage.getItem("ic-intro-seen")) return;
    sessionStorage.setItem("ic-intro-seen", "1");
    setShow(true);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setShow(false), 2200);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [reduced]);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background-deep"
          aria-hidden="true"
        >
          <svg width="150" height="110" viewBox="0 0 150 110" fill="none">
            <defs>
              <linearGradient id="intro-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF5FD1" />
                <stop offset="55%" stopColor="#7C6CFF" />
                <stop offset="100%" stopColor="#22E1FF" />
              </linearGradient>
            </defs>
            <motion.path
              d="M32 20 V90"
              stroke="url(#intro-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <motion.path
              d="M122 34 A34 34 0 1 0 122 76"
              stroke="url(#intro-gradient)"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
