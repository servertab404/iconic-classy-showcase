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

      <div className="relative mx-auto grid w-full max-w-6xl gap-14 px-6 pt-32 pb-24 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase"
          >
            <span className="inline-block size-1.5 rounded-full bg-amber" />
            Galgotia University · BCA AI/ML
          </motion.p>

          <h1 className="font-display text-5xl leading-[0.95] font-bold sm:text-7xl">
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="glass gradient-border hidden overflow-hidden rounded-2xl lg:block"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-amber/80" />
            <span className="size-2.5 rounded-full bg-cyan/70" />
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              ~/iconic-classy/profile.py
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed">
            <code>
              <span className="text-muted-foreground">class</span>{" "}
              <span className="text-cyan">Engineer</span>:{"\n"}
              {"    "}name = <span className="text-amber">&quot;Iconic Classy&quot;</span>
              {"\n"}
              {"    "}role = <span className="text-amber">&quot;BCA AI/ML · Semester 1&quot;</span>
              {"\n"}
              {"    "}stack = [<span className="text-amber">&quot;Python&quot;</span>,{" "}
              <span className="text-amber">&quot;HTML&quot;</span>,{" "}
              <span className="text-amber">&quot;CSS&quot;</span>]{"\n"}
              {"\n"}
              {"    "}
              <span className="text-muted-foreground">def</span>{" "}
              <span className="text-cyan">today</span>(self):{"\n"}
              {"        "}
              <span className="text-muted-foreground">return</span>{" "}
              <span className="text-amber">&quot;fundamentals &gt; shortcuts&quot;</span>
            </code>
          </pre>
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            <span className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
              Learning in public
            </span>
            <span>UTF-8 · Python</span>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
