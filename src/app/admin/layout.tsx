import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: { default: "Administración", template: "%s · Administración" }, robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-bg pb-16">
      <div className="bg-ink px-4 py-1.5 text-center text-xs font-semibold text-white">DEMO de administración · Sin login: en el portal real solo entra el administrador</div>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
          <Link href="/" aria-label="Ir al portal">
            <Logo />
          </Link>
          <span className="rounded-md bg-soft px-2 py-1 text-xs font-bold text-muted">Administración</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pt-5">{children}</main>
    </div>
  );
}
