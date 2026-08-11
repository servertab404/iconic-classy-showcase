import { useReducedMotion } from "motion/react";

/**
 * Fixed deep-space backdrop: parallax starfields, painted nebula clouds and
 * occasional shooting stars. Purely decorative.
 *
 * Performance: every moving layer animates only `transform`/`opacity` (compositor
 * friendly). Nebulae are pre-painted soft radial gradients instead of huge
 * `blur()` filters, which are what made scrolling expensive.
 */
export function Cosmos() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      {/* Painted nebula clouds — no filters, pure gradients */}
      <div className="nebula-field absolute inset-0" />
      <div
        className={`nebula-veil absolute inset-[-25%] opacity-70 ${reduced ? "" : "nebula-drift"}`}
      />

      {/* Far, dense star layer */}
      <div className={`starfield absolute inset-[-30%] opacity-40 ${reduced ? "" : "star-pan-slow"}`} />
      {/* Near, brighter star layer */}
      <div
        className={`starfield absolute inset-[-30%] opacity-70 ${reduced ? "" : "star-pan-fast"}`}
        style={{ backgroundSize: "680px 680px" }}
      />

      {!reduced && (
        <>
          <span className="shooting-star" style={{ top: "12%", left: "-10%" }} />
          <span
            className="shooting-star"
            style={{ top: "38%", left: "-20%", animationDelay: "3.5s" }}
          />
          <span
            className="shooting-star"
            style={{ top: "64%", left: "-15%", animationDelay: "6.5s" }}
          />
        </>
      )}
    </div>
  );
}
