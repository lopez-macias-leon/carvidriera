import type { Metadata } from "next";
import { Markdown } from "@/components/markdown";
import { Borrador, PageShell } from "@/components/page-shell";
import { privacidad } from "@/content/legales";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <PageShell titulo="Política de privacidad">
      <Borrador />
      <Markdown texto={privacidad} />
    </PageShell>
  );
}
