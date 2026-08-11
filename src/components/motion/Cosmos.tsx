import { useReducedMotion } from "motion/react";

/**
 * Fixed deep-space backdrop. Deliberately restrained: a faint starfield and a
 * very soft nebula wash that reads as atmosphere, not decoration.
 */
export function Cosmos() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      {/* Soft nebula wash — painted gradients, no filters */}
      <div className="nebula-field absolute inset-0 opacity-20" />

      {/* Far, dense star layer */}
      <div
        className={`starfield absolute inset-[-30%] opacity-20 ${reduced ? "" : "star-pan-slow"}`}
      />
      {/* Near, brighter star layer */}
      <div
        className={`starfield absolute inset-[-30%] opacity-30 ${reduced ? "" : "star-pan-fast"}`}
        style={{ backgroundSize: "680px 680px" }}
      />

      {!reduced && (
        <span className="shooting-star" style={{ top: "18%", left: "-10%" }} />
      )}
    </div>
  );
}
