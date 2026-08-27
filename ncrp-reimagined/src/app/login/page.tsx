"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/check";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign in failed");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel p-8 sm:p-10">
      <div className="mb-8">
        <p className="kicker">Sign in to continue</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in to report a cybercrime and track your cases.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[6px] border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-[var(--color-service)] focus:outline-none focus:ring-2 focus:ring-[var(--color-service-soft)]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[6px] border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-[var(--color-service)] focus:outline-none focus:ring-2 focus:ring-[var(--color-service-soft)]"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-[6px] bg-[var(--color-danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-danger)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[6px] bg-[var(--color-command)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-command-2)] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-[var(--color-service)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[100dvh] bg-paper">
      <SiteHeader />
      <main id="main-content" className="public-shell py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <Suspense fallback={<div className="panel p-8 sm:p-10 text-sm text-ink-faint">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
