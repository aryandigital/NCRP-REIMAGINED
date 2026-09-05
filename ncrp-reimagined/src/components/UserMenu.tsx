"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FolderOpen, LogOut, User } from "lucide-react";

type UserInfo = { userId: string; email: string; name: string | null };

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null | "loading">("loading");
  const [open, setOpen] = useState(false);
  useEffect(() => { fetch("/api/auth/me", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then(setUser).catch(() => setUser(null)); }, []);
  async function signOut() { await fetch("/api/auth/signout", { method: "POST" }); setOpen(false); setUser(null); router.push("/"); router.refresh(); }
  if (user === "loading") return null;
  if (!user) return <Link href="/login" className="flex min-h-9 items-center px-2 text-[13px] font-semibold text-[rgba(254,252,248,.72)] hover:text-white sm:px-3 sm:text-sm">Sign in</Link>;
  const label = user.name || user.email.split("@")[0];
  return <div className="relative"><button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={`Account menu for ${label}`} className="flex min-h-9 items-center gap-2 px-2 text-[13px] font-semibold text-[rgba(254,252,248,.85)] hover:text-white sm:px-3 sm:text-sm"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-service text-white"><User size={15} aria-hidden="true" /></span><span className="hidden max-w-24 truncate sm:block">{label}</span></button>{open && <><button className="fixed inset-0 z-40 cursor-default" aria-label="Close account menu" onClick={() => setOpen(false)} /><div className="absolute right-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-[8px] border border-line bg-paper py-1 shadow-lg"><div className="border-b border-line px-4 py-3"><p className="truncate text-xs font-bold text-ink">{label}</p><p className="mt-1 truncate text-xs text-ink-faint">{user.email}</p></div><Link href="/my-incidents" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 px-4 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-ink"><FolderOpen size={15} aria-hidden="true" />My incidents</Link><button type="button" onClick={signOut} className="flex min-h-11 w-full items-center gap-3 border-t border-line px-4 text-sm font-semibold text-danger hover:bg-danger-soft"><LogOut size={15} aria-hidden="true" />Sign out</button></div></>}</div>;
}
