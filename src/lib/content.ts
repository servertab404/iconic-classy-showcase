export type Skill = { name: string; status: string; value: number };

export type Education = {
  program: string;
  university: string;
  period: string;
  note: string;
};

export type Project = {
  id: string;
  title: string;
  year: string;
  summary: string;
  tags: string[];
  href: string;
  sort_order: number;
  published: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  published: boolean;
  created_at: string;
};

export type SiteContent = {
  hero_tagline: string;
  about_paragraphs: string[];
  contact_email: string;
  skills: Skill[];
  education: Education;
};

export const FALLBACK_CONTENT: SiteContent = {
  hero_tagline:
    "BCA AI/ML student (1st semester) and aspiring machine learning engineer — learning in public, building carefully, one fundamental at a time.",
  about_paragraphs: [
    "I'm a first-semester BCA (AI/ML) student at Galgotia University. Right now my focus is simple and deliberate: get genuinely good at programming and web development before reaching for the hard machine learning material.",
    "That means writing a lot of Python, understanding how the web actually renders, and shipping small things end to end instead of collecting tutorials. The long-term goal is machine learning engineering — the short-term goal is a solid foundation.",
  ],
  contact_email: "severtab404@gmail.com",
  skills: [
    { name: "Python", status: "In progress", value: 35 },
    { name: "HTML / CSS", status: "Practising", value: 55 },
    { name: "AI/ML Foundations", status: "Planned", value: 10 },
  ],
  education: {
    program: "BCA — Artificial Intelligence & Machine Learning",
    university: "Galgotia University",
    period: "2026 — Present",
    note: "Galgotia University · 1st semester, currently ongoing. Coursework in programming fundamentals, computing basics and web development.",
  },
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-aethergrid",
    title: "Aethergrid",
    year: "2026",
    summary:
      "A real-time 3D globe intelligence concept that fuses live aircraft tracking, satellite orbits and environmental data into one interactive view. Built as a live prototype using an AI-assisted no-code builder to test the idea quickly.",
    tags: ["3D Globe", "Live Data", "Concept Prototype", "No-code + AI"],
    href: "https://athergrid.base44.app",
    sort_order: 0,
    published: true,
  },
  {
    id: "fallback-portfolio",
    title: "Personal Portfolio Site",
    year: "2026",
    summary:
      "This website. A dark, motion-led portfolio with a WebGL neural-network hero, a custom cursor, magnetic buttons and scroll-driven reveals — designed as a study in interaction craft and performance budgets.",
    tags: ["Three.js", "Motion", "Design System", "Accessibility"],
    href: "#hero",
    sort_order: 1,
    published: true,
  },
];
