import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return <div className="min-h-[100dvh] bg-paper"><SiteHeader /><main id="main-content" className="public-shell py-12 sm:py-20"><div className="mx-auto max-w-md"><Suspense fallback={null}><AuthForm mode="signin" /></Suspense></div></main></div>;
}
