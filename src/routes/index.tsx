import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { SiteNav, SiteFooter } from "@/components/portfolio/Chrome";
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
import { GradientDivider } from "@/components/motion/GradientDivider";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { IntroLoader } from "@/components/portfolio/IntroLoader";
import { Cosmos } from "@/components/motion/Cosmos";

const TITLE = "Iconic Classy — BCA AI/ML Student & Aspiring ML Engineer";
const DESCRIPTION =
  "Portfolio of Iconic Classy, a first-semester BCA AI/ML student at Galgotia University building fundamentals in Python and web development toward machine learning engineering.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { scrollYProgress } = useScroll();
  // Transform-only parallax: no filters, no huge blurs — keeps scrolling at 60fps.
  const meshY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const meshScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const meshOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.26, 0.16]);

  return (
    <div>
      <IntroLoader />
      <SmoothScroll />
      <CustomCursor />
      <Cosmos />
      <SiteNav />

      <motion.div
        aria-hidden="true"
        style={{ y: meshY, scale: meshScale, opacity: meshOpacity }}
        className="nebula-veil pointer-events-none fixed inset-[-20%] -z-20"
      />



      <main>
        <Hero />
        <GradientDivider />
        <About />
        <GradientDivider />
        <Skills />
        <GradientDivider />
        <Projects />
        <GradientDivider />
        <Education />
        <GradientDivider />
        <Certifications />
        <Resume />
        <Blog />
        <GradientDivider />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}
