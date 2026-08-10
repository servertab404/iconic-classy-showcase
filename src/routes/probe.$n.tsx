import { createFileRoute } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";
import { useScroll, useTransform } from "motion/react";
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

export const Route = createFileRoute("/probe/$n")({
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
  const { n } = Route.useParams();
  const { scrollYProgress } = useScroll();
  const sy = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  void sy;
  const [h, setH] = useState(0);
  useEffect(() => setH(1), []);
  return (
    <div>
      <div id="probe">hydrated:{h}</div>
      {ORDER.slice(0, Number(n)).map((Part, i) => (
        <Part key={i} />
      ))}
    </div>
  );
}
