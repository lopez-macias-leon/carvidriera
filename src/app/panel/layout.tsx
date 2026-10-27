import type { Metadata } from "next";
import Link from "next/link";
import { AgencyAvatar } from "@/components/agency-avatar";
import { Logo } from "@/components/logo";
import { PanelNav } from "@/components/panel-nav";
import { agenciasDemo } from "@/data/demo";

export const metadata: Metadata = { title: { default: "Panel de agencia", template: "%s · Panel de agencia" }, robots: { index: false } };

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  const agencia = agenciasDemo[0];
  return (
    <div className="min-h-dvh bg-bg pb-24 md:pb-10">
      <div className="bg-ink px-4 py-1.5 text-center text-xs font-semibold text-white">DEMO del panel · Lo que cargues queda solo en este teléfono</div>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Link href="/" aria-label="Ir al portal" className="hidden sm:block">
            <Logo />
          </Link>
          <span className="hidden h-6 w-px bg-line sm:block" />
          <AgencyAvatar agencia={agencia} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-bold leading-tight">{agencia.nombre}</p>
            <p className="text-xs font-semibold text-brand">Plan Pro</p>
          </div>
          <Link href={`/agencia/${agencia.slug}`} className="ml-auto text-sm font-bold text-brand hover:underline">
            Ver mi catálogo
          </Link>
        </div>
      </header>
      <PanelNav />
      <main className="mx-auto max-w-5xl px-4 pt-5">{children}</main>
    </div>
  );
}
