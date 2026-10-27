"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CarIcon, HomeIcon, PlusIcon, StoreIcon } from "./icons";

const ITEMS = [
  { href: "/panel", label: "Inicio", Icon: HomeIcon },
  { href: "/panel/autos", label: "Mis autos", Icon: CarIcon },
  { href: "/panel/autos/nuevo", label: "Cargar", Icon: PlusIcon, principal: true },
  { href: "/panel/catalogo", label: "Catálogo", Icon: StoreIcon },
];

export function PanelNav() {
  const pathname = usePathname();
  const activo = (href: string) => (href === "/panel" ? pathname === "/panel" : href === "/panel/autos" ? pathname === "/panel/autos" : pathname.startsWith(href));
  return (
    <>
      <nav aria-label="Panel" className="hidden border-b border-line bg-surface md:block">
        <ul className="mx-auto flex max-w-5xl gap-1 px-4">
          {ITEMS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} aria-current={activo(href) ? "page" : undefined} className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-bold ${activo(href) ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}>
                <Icon className="size-5" />
                {label === "Cargar" ? "Cargar auto" : label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Panel" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-4">
          {ITEMS.map(({ href, label, Icon, principal }) => (
            <li key={href}>
              <Link href={href} aria-current={activo(href) ? "page" : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-bold ${activo(href) ? "text-brand" : "text-muted"}`}>
                {principal ? (
                  <span className="grid size-10 place-items-center rounded-full bg-brand text-white shadow">
                    <Icon className="size-6" />
                  </span>
                ) : (
                  <Icon className="size-6" />
                )}
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
