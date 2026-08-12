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

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Iconic Classy",
  url: "https://iconic-classy-showcase.lovable.app",
  jobTitle: "BCA AI/ML Student",
  worksFor: {
    "@type": "EducationalOrganization",
    name: "Galgotia University",
  },
  description:
    "Portfolio of Iconic Classy, a first-semester BCA AI/ML student at Galgotia University.",
  sameAs: [],
};

function Index() {
  const { scrollYProgress } = useScroll();
  const meshY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div>
      <SmoothScroll />
      <CustomCursor />
      <Cosmos />
      <SiteNav />

      <motion.div
        aria-hidden="true"
        style={{ y: meshY }}
        className="pointer-events-none fixed inset-0 -z-20 opacity-50 [contain:strict]"
      >
        <div className="absolute top-[18%] -left-40 size-[38rem] rounded-full bg-magenta opacity-20 blur-[90px]" />
        <div className="absolute right-[-10%] bottom-[8%] size-[34rem] rounded-full bg-cyan opacity-15 blur-[90px]" />
      </motion.div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
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
