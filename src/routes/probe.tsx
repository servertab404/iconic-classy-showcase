import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
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

const ORDER: React.ComponentType[] = [
  IntroLoader,
  SmoothScroll,
  CustomCursor,
  Cosmos,
  SiteNav,
  Hero,
  GradientDivider,
  About,
  Skills,
  Projects,
  Education,
  Certifications,
  Resume,
  Blog,
  Contact,
  SiteFooter,
];

function Probe() {
  const [n, setN] = useState(0);
  useEffect(() => setN(1), []);
  const count =
    typeof window === "undefined"
      ? ORDER.length
      : Number(new URLSearchParams(location.search).get("n") ?? ORDER.length);
  return (
    <div>
      <div id="probe">hydrated:{n}</div>
      {ORDER.slice(0, count).map((Part, i) => (
        <Part key={i} />
      ))}
    </div>
  );
}
