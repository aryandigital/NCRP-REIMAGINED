"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <div className="min-h-[100dvh] bg-paper">
    <SiteHeader current="track" />
    <main id="main-content" className="public-shell py-12">
      <section className="panel mx-auto max-w-xl p-6 sm:p-8">
        <p className="kicker">Page temporarily unavailable</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">We could not open this page.</h1>
        <p className="mt-4 text-sm leading-6 text-ink-soft">Try loading it again, or return to tracking with your Raksha case ID. You do not need to create another record to retry. This message does not confirm any official submission or action.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => retry()} className="inline-flex min-h-11 items-center rounded-[8px] bg-service px-4 text-sm font-bold text-white">Try again</button>
          <Link href="/track" className="inline-flex min-h-11 items-center px-4 text-sm font-bold text-service">Find my Raksha case</Link>
          <Link href="/" className="inline-flex min-h-11 items-center px-4 text-sm font-bold text-service">Back to response desk</Link>
        </div>
      </section>
    </main>
  </div>;
}
