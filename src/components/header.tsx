"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFavoritos } from "@/lib/favoritos";
import { CloseIcon, HeartIcon, MenuIcon } from "./icons";
import { Logo } from "./logo";

export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/autos", label: "Autos" },
  { href: "/concesionarias", label: "Concesionarias" },
  { href: "/mecanicos", label: "Mecánicos" },
  { href: "/mi-cuenta", label: "Mis avisos" },
];

export function Header() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const favoritos = useFavoritos();

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const activo = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" aria-label="Inicio" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Principal" className="ml-6 hidden flex-1 md:block">
          <ul className="flex gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={activo(n.href) ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold hover:bg-soft ${activo(n.href) ? "text-brand" : "text-ink"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/favoritos" className="relative grid size-11 place-items-center rounded-full hover:bg-soft" aria-label={`Favoritos (${favoritos.length})`}>
            <HeartIcon className="size-6" />
            {favoritos.length > 0 && (
              <span className="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">
                {favoritos.length}
              </span>
            )}
          </Link>
          <Link href="/publicar" className="btn btn-brand hidden text-sm sm:inline-flex">
            Publicá gratis
          </Link>
          <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-soft md:hidden" aria-label="Abrir menú" aria-expanded={abierto} onClick={() => setAbierto(true)}>
            <MenuIcon className="size-6" />
          </button>
        </div>
      </div>

      {abierto && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <button type="button" aria-label="Cerrar menú" className="absolute inset-0 bg-ink/40" onClick={() => setAbierto(false)} />
          <nav className="absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col bg-surface p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" className="grid size-11 place-items-center rounded-full hover:bg-soft" aria-label="Cerrar menú" onClick={() => setAbierto(false)} autoFocus>
                <CloseIcon className="size-6" />
              </button>
            </div>
            <ul className="mt-6 flex flex-col">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setAbierto(false)}
                    aria-current={activo(n.href) ? "page" : undefined}
                    className={`block rounded-xl px-3 py-3.5 text-lg font-bold hover:bg-soft ${activo(n.href) ? "text-brand" : ""}`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/favoritos" onClick={() => setAbierto(false)} className="block rounded-xl px-3 py-3.5 text-lg font-bold hover:bg-soft">
                  Favoritos ({favoritos.length})
                </Link>
              </li>
            </ul>
            <div className="mt-auto rounded-2xl bg-soft p-4">
              <p className="font-bold">¿Vendés tu auto?</p>
              <p className="mt-1 text-sm text-muted">Publicalo gratis y recibí consultas por WhatsApp.</p>
              <Link href="/publicar" onClick={() => setAbierto(false)} className="btn btn-brand mt-3 w-full">
                Publicá gratis
              </Link>
              <Link href="/panel" onClick={() => setAbierto(false)} className="mt-2 block py-2 text-center text-sm font-semibold text-brand">
                Ingresar al panel de concesionaria
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
