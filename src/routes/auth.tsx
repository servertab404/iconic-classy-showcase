import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Iconic Classy" },
      { name: "description", content: "Admin sign-in for the Iconic Classy portfolio." },
      { property: "og:title", content: "Sign In — Iconic Classy" },
      { property: "og:description", content: "Admin sign-in for the Iconic Classy portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }
      navigate({ to: "/admin" });
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    setMessage(
      error
        ? error.message
        : "Account created. Check your email to confirm, then sign in.",
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        onSubmit={submit}
        className="glass gradient-border w-full max-w-sm space-y-5 rounded-2xl p-8"
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            Iconic Classy
          </p>
          <h1 className="font-display mt-2 text-2xl font-bold">
            {mode === "signin" ? "Admin sign in" : "Create admin account"}
          </h1>
        </div>
        <label className="block">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>
        {message ? <p className="text-sm text-amber">{message}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="bg-gradient-accent w-full rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "First time? Create your account" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
