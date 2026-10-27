import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";
import { Borrador, PageShell } from "@/components/page-shell";
import { condicionesAgencias } from "@/content/legales";

export const metadata: Metadata = { title: "Condiciones para agencias" };

export default function CondicionesAgenciasPage() {
  return (
    <PageShell titulo="Condiciones para agencias">
      <Borrador />
      <Markdown texto={condicionesAgencias} />
    </PageShell>
  );
}
