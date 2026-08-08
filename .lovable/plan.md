# Iconic Classy — Premium AI/ML Portfolio

A single-page, motion-led portfolio with a living neural-network hero, custom cursor, magnetic buttons, scroll-driven reveals, and glass 3D-tilt project cards. Content stays honest to a 1st-semester BCA student.

## Visual system

- Background: subtle vertical gradient #0A0A0F → #12121A, plus a slow hue-shifting radial mesh tied to scroll depth.
- Accents: violet #7C6CFF → cyan #00D9FF gradient; amber #FFB454 used sparingly (tags, dots, small icons).
- Gradient text on headlines; gradient-fill primary buttons with glow on hover; ambient blurred radial glow behind hero heading and behind cards on hover.
- Type: Sora (headings), Inter (body), JetBrains Mono (tags/labels), loaded via `<link>` in the root route head and registered as theme tokens.
- All colors/gradients/shadows defined as tokens in `src/styles.css`; no hardcoded color utilities in components.

## Motion

- Hero: animated particle/node network in WebGL — drifting nodes, thin gradient connection lines, gentle mouse parallax/repulsion.
- Loader: "IC" monogram SVG stroke draws itself on first visit, then reveals the page.
- Headline: one-time scramble/decode on load, then a periodic gradient shimmer sweep.
- Custom cursor: glowing dot that expands into a trailing ring over clickable elements (pointer-fine devices only).
- Magnetic primary buttons using spring physics.
- Scroll: smooth inertial scrolling (Lenis), section fade/slide/scale reveals, SVG gradient divider lines that draw on entry.
- Project cards: 3D tilt toward cursor, frosted glass surface, animated gradient border on hover.
- Skills: rings/bars animate from 0 with count-up when scrolled into view.
- `prefers-reduced-motion`: cursor, tilt, magnetics, smooth scroll and the network animation degrade to static/simple fades. Particle count and effects scale down on mobile/touch.

## Sections (single page at `/`, anchor nav)

1. Hero — "Iconic Classy", tagline, network background, CTAs "View Projects" + "Get In Touch".
2. About — 1st-semester BCA AI/ML at Galgotia University, building programming and web fundamentals toward ML.
3. Skills — Python (in progress), HTML/CSS, AI/ML Foundations (planned) with animated indicators and honest status labels.
4. Projects — Aethergrid (3D globe intelligence concept; live prototype via AI-assisted no-code builder; links to https://athergrid.base44.app) and Personal Portfolio Site (this build, design/process notes).
5. Education — animated vertical timeline: BCA AI/ML, Galgotia University, 1st semester — present.
6. Certifications — empty state: "First certification coming soon".
7. Resume — placeholder card with "Contact Instead" CTA scrolling to contact.
8. Blog — empty state: "Nothing published yet — check back soon".
9. Contact — mailto severtab404@gmail.com, disabled/placeholder LinkedIn and GitHub slots.

Footer with monogram and copyright.

## Technical notes

- Packages to add: `three`, `@react-three/fiber`, `motion` (Framer Motion), `lenis`.
- The WebGL hero is client-only: lazy-loaded behind a hydration gate with a static gradient fallback for SSR, so nothing browser-only is imported during server render.
- Structure: `src/routes/index.tsx` (placeholder replaced) composing section components under `src/components/portfolio/`, shared motion helpers in `src/components/motion/`.
- Route `head()` gets a real title, description, og/twitter metadata for the portfolio.
- Accessibility: visible focus rings on all interactive elements, single `<main>` and one `<h1>`, semantic section headings, aria-labels on icon-only links, real anchor links so keyboard/scroll nav works without JS motion.
