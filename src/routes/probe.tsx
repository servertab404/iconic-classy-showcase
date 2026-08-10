import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hero } from "@/components/portfolio/Hero";
import {
  About,
  Blog,
  Certifications,
  Contact,
  Education,
  Projects,
  Resume,
  Skills,
} from "@/components/portfolio/Sections";
import { SiteNav, SiteFooter } from "@/components/portfolio/Chrome";
import { Cosmos } from "@/components/motion/Cosmos";
import { IntroLoader } from "@/components/portfolio/IntroLoader";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { GradientDivider } from "@/components/motion/GradientDivider";

export const Route = createFileRoute("/probe")({
  component: Probe,
});

const PARTS: Record<string, React.ComponentType> = {
  hero: Hero,
  about: About,
  skills: Skills,
  projects: Projects,
  education: Education,
  certs: Certifications,
  resume: Resume,
  blog: Blog,
  contact: Contact,
  nav: SiteNav,
  footer: SiteFooter,
  cosmos: Cosmos,
  intro: IntroLoader,
  cursor: CustomCursor,
  smooth: SmoothScroll,
  divider: GradientDivider,
};

function Probe() {
  const [n, setN] = useState(0);
  useEffect(() => setN(1), []);
  const key = typeof window === "undefined" ? "" : new URLSearchParams(location.search).get("p") || "";
  const Part = PARTS[key];
  return (
    <div>
      <div id="probe">hydrated:{n}</div>
      {Part ? <Part /> : null}
    </div>
  );
}
