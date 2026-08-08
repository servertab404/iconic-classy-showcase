import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\[]{}#$%&*01";

/** Decodes text into place once on mount. */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(reduced ? text : "");

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    const total = text.length * 3 + 24;

    const tick = () => {
      frame += 1;
      const revealed = Math.floor((frame / total) * text.length * 1.35);
      const next = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealed) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char;
        })
        .join("");
      setOutput(next);
      if (frame < total) raf = requestAnimationFrame(tick);
      else setOutput(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduced]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{output || text}</span>
    </span>
  );
}
