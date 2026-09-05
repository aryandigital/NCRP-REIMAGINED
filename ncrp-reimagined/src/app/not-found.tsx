import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return <div className="min-h-[100dvh] bg-paper">
    <SiteHeader current="track" />
    <main id="main-content" className="public-shell py-12">
      <section className="panel mx-auto max-w-xl p-6 sm:p-8">
        <p className="kicker">Page or case not found</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Let us help you find your record.</h1>
        <p className="mt-4 text-sm leading-6 text-ink-soft">This link may be incomplete, or the record may not be available in this environment. Use the complete Raksha case ID from your saved record, not an official complaint acknowledgement.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/track" className="inline-flex min-h-11 items-center rounded-[8px] bg-service px-4 text-sm font-bold text-white">Find my Raksha case</Link>
          <Link href="/" className="inline-flex min-h-11 items-center px-4 text-sm font-bold text-service">Back to response desk</Link>
        </div>
        <Link href="/recover/DEMO0001" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-service">View a read-only synthetic example</Link>
      </section>
    </main>
  </div>;
}
