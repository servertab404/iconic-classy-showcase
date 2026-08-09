import { Component, type ReactNode } from "react";

/**
 * Isolates optional visual enhancements (WebGL, canvas effects) so a failure in
 * an unsupported browser degrades to nothing instead of crashing the whole page.
 */
export class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    console.warn("Optional visual effect disabled:", error);
  }

  override render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
