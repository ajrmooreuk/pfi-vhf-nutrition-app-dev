"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthMode = "password" | "magic_link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setMessage("Check your email for the login link.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">
            VHF Nutrition
          </h1>
          <p className="mt-2 text-muted-foreground">
            Viridian Health &amp; Fitness Coaching Platform
          </p>
        </div>

        {/* Auth form */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          {/* Mode toggle */}
          <div className="mb-6 flex rounded-md border border-border">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex-1 rounded-l-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === "password"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMode("magic_link")}
              className={`flex-1 rounded-r-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === "magic_link"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              Magic Link
            </button>
          </div>

          <form
            onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="coach@example.com"
              />
            </div>

            {mode === "password" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter your password"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {message && (
              <p className="text-sm text-primary">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : mode === "password"
                  ? "Sign In"
                  : "Send Magic Link"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Powered by Viridian Health &amp; Fitness
        </p>
      </div>
    </div>
  );
}
