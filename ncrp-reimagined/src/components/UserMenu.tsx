"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, FolderOpen } from "lucide-react";

interface UserInfo {
  userId: string;
  email: string;
  name: string | null;
}

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null | "loading">("loading");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  if (user === "loading") return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex min-h-9 items-center px-2 text-[13px] font-semibold text-[rgba(254,252,248,.7)] hover:text-[#fefcf8] sm:px-3 sm:text-sm"
      >
        Sign in
      </Link>
    );
  }

  const displayName = user.name ?? user.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={`User menu for ${displayName}`}
        className="flex min-h-9 items-center gap-2 rounded-[4px] px-2 text-[13px] font-semibold text-[rgba(254,252,248,.85)] hover:text-[#fefcf8] sm:px-3 sm:text-sm"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--saffron)] text-[11px] font-bold text-white">
          {initials}
        </span>
        <span className="hidden sm:block">{displayName}</span>
      </button>

      {menuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-[8px] border border-line bg-paper shadow-lg">
            <div className="border-b border-line px-4 py-3">
              <p className="text-xs font-bold text-ink">{user.name ?? "Account"}</p>
              <p className="mt-0.5 truncate text-xs text-ink-faint">{user.email}</p>
            </div>
            <div className="py-1">
              <Link
                href="/my-incidents"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-10 items-center gap-3 px-4 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-ink"
              >
                <FolderOpen size={15} aria-hidden="true" />
                My incidents
              </Link>
              <Link
                href="/operator"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-10 items-center gap-3 px-4 text-sm font-semibold text-ink-soft hover:bg-surface hover:text-ink"
              >
                <User size={15} aria-hidden="true" />
                Operator console
              </Link>
            </div>
            <div className="border-t border-line py-1">
              <button
                onClick={signOut}
                className="flex min-h-10 w-full items-center gap-3 px-4 text-sm font-semibold text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)]"
              >
                <LogOut size={15} aria-hidden="true" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
