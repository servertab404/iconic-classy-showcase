import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Tab = {
  id: string;
  file: string;
  lang: string;
  lines: { text: string; tone?: "kw" | "str" | "fn" | "dim" }[];
};

const TABS: Tab[] = [
  {
    id: "profile",
    file: "profile.py",
    lang: "Python",
    lines: [
      { text: "class Engineer:", tone: "kw" },
      { text: '    name = "Iconic Classy"', tone: "str" },
      { text: '    role = "BCA AI/ML · Semester 1"', tone: "str" },
      { text: '    stack = ["Python", "HTML", "CSS"]', tone: "str" },
      { text: "" },
      { text: "    def today(self):", tone: "fn" },
      { text: '        return "fundamentals > shortcuts"', tone: "str" },
    ],
  },
  {
    id: "skills",
    file: "skills.json",
    lang: "JSON",
    lines: [
      { text: "{" },
      { text: '  "python": "in progress",', tone: "str" },
      { text: '  "html_css": "comfortable",', tone: "str" },
      { text: '  "ml_foundations": "planned",', tone: "str" },
      { text: '  "curiosity": "maxed"', tone: "str" },
      { text: "}" },
    ],
  },
  {
    id: "now",
    file: "now.md",
    lang: "Markdown",
    lines: [
      { text: "# Currently", tone: "kw" },
      { text: "" },
      { text: "- Semester 1 at Galgotia University", tone: "dim" },
      { text: "- Writing small Python programs daily", tone: "dim" },
      { text: "- Shipping Aethergrid + this site", tone: "dim" },
      { text: "- Next: math for machine learning", tone: "dim" },
    ],
  },
];

const TONE: Record<string, string> = {
  kw: "text-primary",
  str: "text-amber",
  fn: "text-cyan",
  dim: "text-muted-foreground",
};

export function CodeCard() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);

  const tab = TABS[active]!;
  const total = tab.lines.length;

  useEffect(() => {
    if (reduced || !inView) {
      setCount(total);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= total) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 130);
    return () => window.clearInterval(id);
  }, [active, inView, reduced, total]);

  const done = count >= total;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      whileHover={reduced ? undefined : { y: -6 }}
      className="glass gradient-border group hidden overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-[0_24px_80px_-30px_hsl(var(--primary)/0.6)] lg:block"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-amber/80" />
        <span className="size-2.5 rounded-full bg-cyan/70" />
        <div className="ml-3 flex items-center gap-1">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                i === active
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.file}
            </button>
          ))}
        </div>
      </div>

      <pre className="h-[15.5rem] overflow-hidden p-5 font-mono text-[12.5px] leading-relaxed">
        <code>
          {tab.lines.slice(0, count).map((l, i) => (
            <span key={`${tab.id}-${i}`} className={`block ${TONE[l.tone ?? ""] ?? ""}`}>
              {l.text || "\u00a0"}
              {!done && i === count - 1 ? (
                <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-cyan" />
              ) : null}
            </span>
          ))}
          {done && !reduced ? (
            <span className="inline-block h-[1em] w-[0.5em] translate-y-[0.12em] animate-pulse bg-cyan" />
          ) : null}
        </code>
      </pre>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        <span className="flex items-center gap-2">
          <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
          Learning in public
        </span>
        <span>UTF-8 · {tab.lang}</span>
      </div>
    </motion.div>
  );
}
