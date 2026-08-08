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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
        <a href="#hero" className="font-display text-lg font-bold tracking-tight">
          <span className="text-gradient">IC</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="mailto:severtab404@gmail.com"
          className="glass gradient-border rounded-full px-4 py-2 font-mono text-xs tracking-wide"
        >
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
    </footer>
  );
}
