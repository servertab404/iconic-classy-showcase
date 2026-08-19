# Hero: kinetic headline + living code card

Bring back the big three-line statement from the screenshot and make the terminal card feel alive.

## 1. Kinetic headline

Replace the single scrambled "Iconic Classy" line with a stacked, oversized statement:

```text
Learning today.
Engineering tomorrow.
```

- Line 1 in neutral white, line 2 in the violet-to-cyan gradient with the existing shimmer sweep.
- Lines rise into place on load (staggered mask reveal, per-line clip + y offset), not a full letter scramble — cleaner and cheaper.
- The last word rotates through a short set on a slow cycle: `tomorrow.` / `at scale.` / `for real.` — one word swapping with a vertical roll, everything else static, so it reads as a deliberate skit rather than background noise.
- Name moves up into the small mono eyebrow line above ("Iconic Classy // Galgotia University · BCA AI/ML") so nothing is lost.
- With `prefers-reduced-motion`: lines simply fade in and the rotating word stays fixed on "tomorrow."

## 2. Living code card

Keep the window chrome, tabs and status bar, add behaviour:

- Code types itself out line by line on first view (fast, ~1.2s total) with a blinking caret, then stops.
- Small tab strip in the title bar: `profile.py` · `skills.json` · `now.md` — clicking swaps content with a short cross-fade; each tab has its own short, honest snippet.
- Status bar shows the active tab's language and a live-looking pulse dot.
- Card lifts slightly and its gradient border brightens on hover.
- Reduced motion: full text renders instantly, tabs still switch, no caret blink.

## Technical notes

- Work stays in `src/components/portfolio/Hero.tsx` plus two small new components: `KineticHeadline.tsx` (line reveal + word rotator) and `CodeCard.tsx` (tabs + typewriter).
- Uses the already-installed `motion/react`; no new dependencies.
- Typewriter driven by a single interval that clears on unmount and skips entirely under reduced motion; card animation starts only when it enters the viewport so it doesn't compete with the WebGL hero on load.
- Existing neural-network background, magnetic CTAs and layout grid are untouched.
