"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const creating = mode === "signup";
  const requestedNext = searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/my-incidents";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creating ? { name, email, password } : { email, password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error ?? "Account request failed");
      router.push(next);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Account request failed");
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="panel p-6 sm:p-8" noValidate aria-busy={pending}>
    <p className="kicker">{creating ? "Create an account" : "Welcome back"}</p>
    <h1 className="display mt-3 text-[2rem] text-ink sm:text-[2.5rem]">{creating ? "Keep your cases together." : "Continue your recovery."}</h1>
    <p className="mt-3 text-sm leading-6 text-ink-soft">Sign in to save a private case record and return to it from another device.</p>
    <div className="mt-7 grid gap-4">
      {creating && <label className="grid gap-2 text-sm font-bold text-ink">Name <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={100} className="min-h-12 rounded-[8px] border border-line bg-paper px-3 font-normal outline-none focus:border-service" /></label>}
      <label className="grid gap-2 text-sm font-bold text-ink">Email <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={254} className="min-h-12 rounded-[8px] border border-line bg-paper px-3 font-normal outline-none focus:border-service" /></label>
      <label className="grid gap-2 text-sm font-bold text-ink">Password <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={creating ? "new-password" : "current-password"} required minLength={creating ? 12 : 1} maxLength={128} className="min-h-12 rounded-[8px] border border-line bg-paper px-3 font-normal outline-none focus:border-service" />{creating && <span className="text-xs font-normal text-ink-faint">Use at least 12 characters.</span>}</label>
    </div>
    {error && <p role="alert" className="mt-4 rounded-[8px] border border-danger/35 bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}
    <button type="submit" disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[8px] bg-service px-4 text-sm font-bold text-white disabled:opacity-60">{pending ? "Please wait…" : creating ? "Create account" : "Sign in"}</button>
    <p className="mt-5 text-center text-sm text-ink-soft">{creating ? "Already have an account?" : "Need an account?"} <Link href={`${creating ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`} className="font-bold text-service hover:underline">{creating ? "Sign in" : "Create one"}</Link></p>
  </form>;
}
