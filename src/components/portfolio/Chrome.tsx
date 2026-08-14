import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },

      { rootMargin: "-45% 0px -50% 0px" },
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
      style={{
        backgroundColor: scrolled
          ? "color-mix(in oklab, var(--background-deep) 72%, transparent)"
          : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <a href="#hero" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg border border-border font-display text-sm font-bold">
            <span className="text-gradient">IC</span>
          </span>
          <span className="hidden font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase sm:inline">
            iconic·classy
          </span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link, i) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={`flex items-baseline gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
                  active === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={active === link.id ? "text-cyan" : "text-muted-foreground/60"}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="mailto:severtab404@gmail.com"
          className="glass gradient-border flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs tracking-wide"
        >
          <span className="size-1.5 rounded-full bg-cyan" />
          Say hello
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="font-display text-sm font-bold">
          <span className="text-gradient">Iconic Classy</span>
        </span>
        <p className="font-mono text-xs text-muted-foreground">
          Designed &amp; built in 2026 · Galgotia University
        </p>
      </div>
      <div className="mx-auto mt-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-cyan" />
          Status: building
        </span>
        <span>Stack: React · TypeScript · WebGL</span>
        <span className="hidden sm:inline">Region: IN · UTC+5:30</span>
      </div>
    </footer>
  );
}
