import { Suspense, lazy } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Mail } from "lucide-react";
import { ScrambleText } from "./ScrambleText";
import { MagneticLink } from "../motion/MagneticLink";
import { SafeBoundary } from "../motion/SafeBoundary";

const NeuralNetwork = lazy(() => import("./NeuralNetwork"));

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {reduced ? null : (
          <ClientOnly fallback={null}>
            <SafeBoundary>
              <Suspense fallback={null}>
                <NeuralNetwork />
              </Suspense>
            </SafeBoundary>
          </ClientOnly>
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-accent opacity-20 blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-32 pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase"
        >
          <span className="inline-block size-1.5 rounded-full bg-amber" />
          Galgotia University · BCA AI/ML
        </motion.p>

        <h1 className="font-display text-5xl leading-[0.95] font-bold sm:text-7xl lg:text-8xl">
          <ScrambleText text="Iconic Classy" className="shimmer-text block" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          BCA AI/ML student (1st semester) and aspiring machine learning engineer — learning in
          public, building carefully, one fundamental at a time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticLink href="#projects">
            View Projects <ArrowDown className="size-4" />
          </MagneticLink>
          <MagneticLink href="#contact" variant="ghost">
            <Mail className="size-4" /> Get In Touch
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
}
