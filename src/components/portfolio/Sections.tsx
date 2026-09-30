import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Award, FileText, Github, GraduationCap, Linkedin, Mail } from "lucide-react";
import { Reveal } from "../motion/Reveal";
import { TiltCard } from "./TiltCard";
import { MagneticLink } from "../motion/MagneticLink";
import { useSiteData } from "@/lib/site-data";
import type { Certification, Skill } from "@/lib/content";

function SectionHeading({
  eyebrow,
  title,
  index,
}: {
  eyebrow: string;
  title: string;
  index?: string;
}) {
  return (
    <Reveal className="mb-12">
      <p className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
        <span className="text-cyan">{index ?? "//"}</span>
        <span className="h-px w-8 bg-border" aria-hidden="true" />
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
  const { content } = useSiteData();
  const edu = content.education;
  return (
    <Shell id="about">
      <SectionHeading index="01" eyebrow="About" title="Starting at the fundamentals" />
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.about_paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <TiltCard className="p-7">
            <dl className="space-y-5">
              {[
                ["Program", edu.program],
                ["University", edu.university],
                ["Period", edu.period],
                ["Focus", content.skills.map((s) => s.name).join(" · ")],
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

function SkillRing({ skill, index }: { skill: Skill; index: number }) {
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
  const { content } = useSiteData();
  return (
    <Shell id="skills">
      <SectionHeading index="02" eyebrow="Skills" title="An honest snapshot" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {content.skills.map((skill, i) => (
          <SkillRing key={`${skill.name}-${i}`} skill={skill} index={i} />
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

export function Projects() {
  const { projects } = useSiteData();
  return (
    <Shell id="projects">
      <SectionHeading index="03" eyebrow="Projects" title="Things I've built" />
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.12}>
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
              {project.href ? (
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
              ) : null}
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Shell>
  );
}

export function Education() {
  const { content } = useSiteData();
  const edu = content.education;
  return (
    <Shell id="education">
      <SectionHeading index="04" eyebrow="Education" title="Where I'm studying" />
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
              {edu.period}
            </p>
            <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold">
              <GraduationCap className="size-5 text-cyan" />
              {edu.program}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{edu.note}</p>
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

function certImageSrc(url: string) {
  if (/\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(url)) return url;
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=900`;
}

function CertPreview({ cert }: { cert: Certification }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const url = cert.credential_url?.trim();

  if (url && !failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open certificate: ${cert.title}`}
        className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted/30"
      >
        {!loaded ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Loading preview…
          </div>
        ) : null}
        <img
          src={certImageSrc(url)}
          alt={`${cert.title} certificate`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </a>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-border px-6 py-8">
      <div className="pointer-events-none absolute -top-12 -right-8 size-40 rounded-full border border-violet/15" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 size-32 rounded-full border border-cyan/15" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] tracking-[0.2em] text-cyan uppercase">Iconic Classy · Learning record</p>
        <Award className="size-5 shrink-0 text-amber" strokeWidth={1.25} aria-hidden="true" />
      </div>
      <p className="relative mt-8 font-display text-xl font-semibold sm:text-2xl">{cert.title}</p>
    </div>
  );
}

export function Certifications() {
  const { certifications } = useSiteData();
  return (
    <Shell id="certifications">
      <SectionHeading
        index="05"
        eyebrow="Certifications"
        title={certifications.length ? "Earned so far" : "The next milestone"}
      />
      {certifications.length === 0 ? (
        <Reveal>
          <div className="max-w-2xl">
            <TiltCard className="relative overflow-hidden border border-border p-6 sm:p-10">
              <div className="pointer-events-none absolute -right-10 -bottom-16 size-56 rounded-full border border-violet/15" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-2 -bottom-8 size-40 rounded-full border border-cyan/15" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-4 border-b border-border pb-7">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-cyan uppercase">Iconic Classy / Learning record</p>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Certificate preview</p>
                </div>
                <Award className="size-8 shrink-0 text-amber" strokeWidth={1.25} aria-hidden="true" />
              </div>
              <div className="relative py-10 sm:py-14">
                <p className="font-mono text-[11px] tracking-[0.2em] text-amber uppercase">Sample · Not earned</p>
                <h3 className="mt-4 max-w-md font-display text-2xl font-semibold sm:text-4xl">A milestone in the making.</h3>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                  A preview of how certificates will appear here. Real credentials will be listed when earned.
                </p>
              </div>
              <div className="relative flex items-center justify-between gap-4 border-t border-border pt-5 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                <span>Portfolio preview</span>
                <span>Not a credential</span>
              </div>
            </TiltCard>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {certifications.map((cert, i) => (
            <Reveal key={cert.id} delay={i * 0.1}>
              <TiltCard className="flex h-full flex-col p-7">
                <CertPreview cert={cert} />
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold">{cert.title}</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                      {[cert.issuer, cert.year].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-cyan"
                    >
                      Verify
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}
    </Shell>
  );
}

export function Resume() {
  return (
    <Shell id="resume">
      <SectionHeading index="06" eyebrow="Resume" title="Still being written" />
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
  const { posts } = useSiteData();
  return (
    <Shell id="blog">
      <SectionHeading index="07" eyebrow="Blog" title="Learning notes" />
      {posts.length === 0 ? (
        <EmptyState
          title="Nothing published yet — check back soon"
          body="I plan to write up what I learn as I go: Python notes, small builds, and mistakes worth documenting."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.1}>
              <TiltCard className="flex h-full flex-col p-8">
                <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold">{post.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                  {post.body}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      )}
    </Shell>
  );
}

export function Contact() {
  const { content } = useSiteData();
  return (
    <Shell id="contact">
      <SectionHeading index="08" eyebrow="Contact" title="Let's talk" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <TiltCard className="p-9">
            <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Email
            </p>
            <a
              href={`mailto:${content.contact_email}`}
              className="mt-3 inline-flex items-center gap-3 font-display text-xl break-all sm:text-3xl"
            >
              <Mail className="size-5 shrink-0 text-cyan" />
              <span className="text-gradient font-semibold">{content.contact_email}</span>
            </a>
            <p className="mt-5 text-sm text-muted-foreground">
              Open to study groups, beginner-friendly collaborations, and feedback on anything I
              build.
            </p>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="grid h-full gap-4">
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
        </Reveal>
      </div>
    </Shell>
  );
}
