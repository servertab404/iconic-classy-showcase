import { useReducedMotion } from "motion/react";

/**
 * Fixed deep-space backdrop: parallax starfields, drifting nebula clouds and
 * occasional shooting stars. Purely decorative.
 */
export function Cosmos() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
      {/* Far, dense star layer */}
      <div
        className={`starfield absolute inset-[-20%] opacity-40 ${reduced ? "" : "star-drift-slow twinkle"}`}
        style={{ backgroundSize: "300px 300px" }}
      />
      {/* Near, brighter star layer */}
      <div
        className={`starfield absolute inset-[-20%] opacity-70 ${reduced ? "" : "star-drift-fast"}`}
        style={{ backgroundSize: "680px 680px" }}
      />

      {/* Nebula clouds */}
      <div className="nebula absolute top-[-10%] left-[-15%] size-[46rem] opacity-30 blur-[130px]" />
      <div className="absolute right-[-12%] bottom-[-15%] size-[40rem] rounded-full bg-cyan opacity-15 blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet opacity-15 blur-[160px]" />

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
