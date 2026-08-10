# Neural Canvas

Build a premium, highly polished portfolio website for an AI/ML engineering student — the kind of site that looks like it was built by a senior creative developer, awwwards-style, not a template.

BRAND
- Name: Iconic Classy
- Tagline: BCA AI/ML Student (1st Semester) | Aspiring ML Engineer
- University: Galgotia University
- Email: severtab404@gmail.com

VISUAL DIRECTION
- Dark base (#0A0A0F to #12121A subtle gradient background, not flat black).
- Two-color accent gradient: electric violet (#7C6CFF) blending into cyan (#00D9FF), plus a sparing warm amber (#FFB454) for small highlight pops (tags, dots, icons).
- Soft ambient glow (blurred radial gradient) behind the hero heading and behind cards on hover, like light emitting from the element.
- Gradient text on key headlines, gradient-fill primary buttons with glow on hover.
- Typography: Space Grotesk or Sora for headings, Inter for body, JetBrains Mono for tags/labels/code accents.
- Neutral white/gray for body text and base UI so the gradient accents pop instead of competing.

ANIMATION & INTERACTION (signature-heavy — this is the centerpiece)
- Full hero background: an animated particle/node network (WebGL via Three.js or React Three Fiber) — nodes drift and connect with thin gradient lines, gently reacting to mouse movement, like a living neural network.
- Custom cursor: a small glowing dot that expands into a ring with a trailing blur when hovering any clickable element.
- Magnetic buttons: primary buttons pull slightly toward the cursor on hover, spring back on release (Framer Motion spring physics).
- Hero headline: letters scramble/decode into place on load (one-time), then a gradient shimmer sweeps across the text every few seconds.
- Scroll-driven storytelling: use GSAP ScrollTrigger or Framer Motion's useScroll — sections fade/slide/scale in as they enter viewport, background gradient mesh subtly shifts hue as the user scrolls deeper into the page.
- Project cards: 3D tilt-on-hover (card rotates slightly toward cursor position, like react-parallax-tilt), glassmorphic surface (frosted blur + gradient border that animates around the edge on hover).
- Skills section: circular progress rings or animated bars that fill from 0 on scroll-into-view, with a count-up number.
- Smooth scrolling across the whole page (Lenis or similar) so scroll feels weighty and cinematic, not default-jumpy.
- Section dividers: thin gradient line that draws itself (SVG path animation) as it scrolls into view.
- Optional: a brief animated intro/loader on first visit — the "IC" monogram draws itself with an SVG stroke animation before the page reveals.
- Keep it dense with motion, but every animation should trigger for a reason (load, hover, scroll-into-view) — nothing looping/distracting infinitely in the background except the hero network.
- Respect prefers-reduced-motion (fall back to simple fades) and keep animations performant on mobile — this matters for actual usability, not just the wow factor.

SECTIONS
1. Hero — name, tagline, animated network background, two CTA buttons ("View Projects", "Get In Touch")
2. About — first-semester BCA AI/ML student at Galgotia University, building fundamentals in programming and web development toward a future in machine learning
3. Skills — Python (in progress), HTML/CSS, AI/ML Foundations (Planned) — animated progress indicators
4. Projects —
   - "Aethergrid": real-time 3D globe intelligence concept fusing live aircraft tracking, satellite orbits, and environmental data. Built as a live prototype using an AI-assisted no-code builder. Link: https://athergrid.base44.app
   - "Personal Portfolio Site": this website itself, describing the design/build process
5. Education — animated timeline: BCA AI/ML at Galgotia University, 1st semester, present
6. Certifications — empty state: "First certification coming soon"
7. Resume — placeholder card, "Contact Instead" button linking to contact section
8. Blog — empty state: "Nothing published yet — check back soon"
9. Contact — email (severtab404@gmail.com) as clickable mailto, placeholder LinkedIn/GitHub slots

TONE
Confident, premium, technical — but content stays honest: this is a student just starting out, not claiming years of experience. The craft of the site should impress; the copy shouldn't overclaim. Fully responsive, visible focus states for accessibility.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://iconic-classy-showcase.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/90de836b-11f5-4999-a1fc-b332fcce4d93).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
