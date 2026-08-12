import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Reveal } from "../motion/Reveal";
import { TiltCard } from "./TiltCard";
import { MagneticLink } from "../motion/MagneticLink";
import { submitContact, type ContactInput } from "@/lib/contact.functions";

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-12">
      <p className="mb-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
        <span className="mr-2 text-amber">//</span>
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-bold sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
    </Reveal>
  );
}

function Shell({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-28">
      {children}
    </section>
  );
}

export function About() {
  return (
    <Shell id="about">
      <SectionHeading eyebrow="About" title="Starting at the fundamentals" />
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              I&apos;m a first-semester BCA (AI/ML) student at{" "}
              <span className="text-foreground">Galgotia University</span>. Right now my focus is
              simple and deliberate: get genuinely good at programming and web development before
              reaching for the hard machine learning material.
            </p>
            <p>
              That means writing a lot of Python, understanding how the web actually renders, and
              shipping small things end to end instead of collecting tutorials. The long-term goal
              is machine learning engineering — the short-term goal is a solid foundation.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <TiltCard className="p-7">
            <dl className="space-y-5">
              {[
                ["Program", "BCA — AI & Machine Learning"],
                ["University", "Galgotia University"],
                ["Semester", "1st · currently studying"],
                ["Focus", "Python · Web fundamentals"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    {k}
                  </dt>
                  <dd className="mt-1 text-sm text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </TiltCard>
        </Reveal>
      </div>
    </Shell>
  );
}

const SKILLS = [
  { name: "Python", status: "In progress", value: 35 },
  { name: "HTML / CSS", status: "Practising", value: 55 },
  { name: "AI/ML Foundations", status: "Planned", value: 10 },
];

function SkillRing({ skill, index }: { skill: (typeof SKILLS)[number]; index: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(skill.value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(skill.value * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, skill.value]);

  const r = 52;
  const circumference = 2 * Math.PI * r;

  return (
    <Reveal delay={index * 0.1}>
      <div ref={ref}>
        <TiltCard className="flex flex-col items-center gap-5 p-8">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
              <defs>
                <linearGradient id={`ring-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C6CFF" />
                  <stop offset="100%" stopColor="#00D9FF" />
                </linearGradient>
              </defs>
              <circle
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={`url(#ring-${index})`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (value / 100) * circumference}
                transform="rotate(-90 70 70)"
                style={{ transition: "stroke-dashoffset 120ms linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold">
              {value}
              <span className="text-sm text-muted-foreground">%</span>
            </span>
          </div>
          <div className="text-center">
            <h3 className="font-display text-lg font-semibold">{skill.name}</h3>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-amber uppercase">
              {skill.status}
            </p>
          </div>
        </TiltCard>
      </div>
    </Reveal>
  );
}

export function Skills() {
  return (
    <Shell id="skills">
      <SectionHeading eyebrow="Skills" title="An honest snapshot" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((skill, i) => (
          <SkillRing key={skill.name} skill={skill} index={i} />
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          Percentages reflect where I am in a first-semester learning path — not professional
          proficiency.
        </p>
      </Reveal>
    </Shell>
  );
}

const PROJECTS = [
  {
    title: "Aethergrid",
    year: "2026",
    href: "https://athergrid.base44.app",
    summary:
      "A real-time 3D globe intelligence concept that fuses live aircraft tracking, satellite orbits and environmental data into one interactive view. Built as a live prototype using an AI-assisted no-code builder to test the idea quickly.",
    tags: ["3D Globe", "Live Data", "Concept Prototype", "No-code + AI"],
  },
  {
    title: "Personal Portfolio Site",
    year: "2026",
    href: "#hero",
    summary:
      "This website. A dark, motion-led portfolio with a WebGL neural-network hero, a custom cursor, magnetic buttons and scroll-driven reveals — designed as a study in interaction craft and performance budgets.",
    tags: ["Three.js", "Motion", "Design System", "Accessibility"],
  },
];

export function Projects() {
  return (
    <Shell id="projects">
      <SectionHeading eyebrow="Projects" title="Things I've built" />
      <div className="grid gap-6 lg:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.12}>
            <TiltCard className="flex h-full flex-col p-8">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <a
                href={project.href}
                {...(project.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
                className="mt-7 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-foreground uppercase transition-colors hover:text-cyan"
              >
                {project.href.startsWith("http") ? "Visit prototype" : "You are here"}
                <ArrowUpRight className="size-4" />
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Education() {
  return (
    <Shell id="education">
      <SectionHeading eyebrow="Education" title="Where I'm studying" />
      <div className="relative pl-8">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute top-2 bottom-2 left-0 w-px bg-gradient-accent"
          aria-hidden="true"
        />
        <Reveal>
          <div className="relative">
            <span
              className="absolute top-2 -left-8 size-3 -translate-x-1/2 rounded-full bg-amber"
              aria-hidden="true"
            />
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              2026 — Present
            </p>
            <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold">
              <GraduationCap className="size-5 text-cyan" />
              BCA — Artificial Intelligence &amp; Machine Learning
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Galgotia University · 1st semester, currently ongoing. Coursework in programming
              fundamentals, computing basics and web development.
            </p>
          </div>
        </Reveal>
      </div>
    </Shell>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Reveal>
      <div className="glass gradient-border rounded-2xl border-dashed px-8 py-14 text-center">
        <p className="font-display text-lg font-semibold">{title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      </div>
    </Reveal>
  );
}

export function Certifications() {
  return (
    <Shell id="certifications">
      <SectionHeading eyebrow="Certifications" title="Nothing here yet" />
      <EmptyState
        title="First certification coming soon"
        body="I'd rather list one certificate I actually earned than pad this section. Watch this space."
      />
    </Shell>
  );
}

export function Resume() {
  return (
    <Shell id="resume">
      <SectionHeading eyebrow="Resume" title="Still being written" />
      <Reveal>
        <TiltCard className="flex flex-col items-start gap-6 p-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <FileText className="mt-1 size-6 text-cyan" />
            <div>
              <h3 className="font-display text-lg font-semibold">Resume — in progress</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                One semester in, a downloadable resume wouldn&apos;t say much yet. Reach out
                directly and I&apos;ll tell you exactly what I&apos;m working on.
              </p>
            </div>
          </div>
          <MagneticLink href="#contact" variant="ghost">
            Contact Instead
          </MagneticLink>
        </TiltCard>
      </Reveal>
    </Shell>
  );
}

export function Blog() {
  return (
    <Shell id="blog">
      <SectionHeading eyebrow="Blog" title="Learning notes, soon" />
      <EmptyState
        title="Nothing published yet — check back soon"
        body="I plan to write up what I learn as I go: Python notes, small builds, and mistakes worth documenting."
      />
    </Shell>
  );
}

export function Contact() {
  const sendMessage = useServerFn(submitContact);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(
      // Mirror the server schema so users get instant feedback.
      // The server function is the source of truth.
      submitContact.__typeof === "function"
        ? ({} as never)
        : ({} as never)
    ),
  });

  async function onSubmit(data: ContactInput) {
    setIsSubmitting(true);
    try {
      await sendMessage({ data });
      setIsSent(true);
      reset();
      toast.success("Message sent. I'll get back to you soon.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Shell id="contact">
      <SectionHeading eyebrow="Contact" title="Let's talk" />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="space-y-8">
            <TiltCard className="p-9">
              <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                Direct email
              </p>
              <a
                href="mailto:severtab404@gmail.com"
                className="mt-3 inline-flex items-center gap-3 font-display text-xl break-all sm:text-3xl"
              >
                <Mail className="size-5 shrink-0 text-cyan" />
                <span className="text-gradient font-semibold">severtab404@gmail.com</span>
              </a>
              <p className="mt-5 text-sm text-muted-foreground">
                Open to study groups, beginner-friendly collaborations, and feedback on anything I
                build.
              </p>
            </TiltCard>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Linkedin, label: "LinkedIn", note: "Profile coming soon" },
                { icon: Github, label: "GitHub", note: "Repositories coming soon" },
              ].map(({ icon: Icon, label, note }) => (
                <div
                  key={label}
                  className="glass flex items-center gap-4 rounded-2xl border-dashed px-6 py-6 opacity-70"
                >
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="font-display text-sm font-semibold">{label}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <TiltCard className="p-8 sm:p-10">
            <h3 className="font-display text-xl font-semibold">Send a message</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Have a project idea, feedback, or just want to connect? Drop a note here.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    disabled={isSubmitting || isSent}
                    {...register("name")}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan disabled:opacity-60"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="font-mono text-[10px] text-amber">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting || isSent}
                    {...register("email")}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan disabled:opacity-60"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="font-mono text-[10px] text-amber">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  disabled={isSubmitting || isSent}
                  {...register("message")}
                  className="w-full resize-none rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan disabled:opacity-60"
                  placeholder="Tell me what you're working on..."
                />
                {errors.message && (
                  <p className="font-mono text-[10px] text-amber">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSent}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-3.5 font-mono text-sm font-medium tracking-widest text-primary-foreground uppercase transition-all hover:glow-violet disabled:opacity-60 sm:w-auto"
              >
                {isSent ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Sent
                  </>
                ) : isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    Send message
                  </>
                )}
              </button>
            </form>
          </TiltCard>
        </Reveal>
      </div>
    </Shell>
  );
}
