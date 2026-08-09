import { Component, type ReactNode } from "react";

/**
 * Isolates optional visual enhancements (WebGL, canvas effects) so a failure in
 * an unsupported browser degrades to nothing instead of crashing the whole page.
 */
export class SafeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Optional visual effect disabled:", error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
