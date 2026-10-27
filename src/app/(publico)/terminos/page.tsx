import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components/markdown";
import { Borrador, PageShell } from "@/components/page-shell";
import { terminos } from "@/content/legales";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function TerminosPage() {
  return (
    <PageShell titulo="Términos y condiciones">
      <Borrador />
      <Markdown texto={terminos} />
      <p className="mt-6">
        Las agencias suscriptas se rigen además por las{" "}
        <Link href="/condiciones-agencias" className="font-bold text-brand underline">
          condiciones para agencias
        </Link>
        .
      </p>
    </PageShell>
  );
}
