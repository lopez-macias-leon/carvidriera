import type { Metadata } from "next";
import Link from "next/link";
import { StoreIcon, UserIcon, WrenchIcon } from "@/components/icons";
import { TOPE_PARTICULAR } from "@/config/planes";

export const metadata: Metadata = {
  title: "Publicá gratis",
  description: "Vendé tu auto gratis en CarVidriera, o sumá tu concesionaria o tu taller.",
};

const OPCIONES = [
  {
    href: "/mi-cuenta/publicar",
    Icon: UserIcon,
    titulo: "Soy particular",
    texto: `Vendé tu auto gratis. Hasta ${TOPE_PARTICULAR} autos a la vez, desde el celular y en pocos minutos.`,
    cta: "Publicar mi auto gratis",
    principal: true,
  },
  {
    href: "/para-concesionarias",
    Icon: StoreIcon,
    titulo: "Tengo una concesionaria",
    texto: "Publicá todo tu stock, con catálogo propio, QR y estadísticas.",
    cta: "Ver planes",
  },
  {
    href: "/para-talleres",
    Icon: WrenchIcon,
    titulo: "Tengo un taller",
    texto: "Aparecé en el apartado de mecánicos y en las fichas de autos usados.",
    cta: "Ver el plan",
  },
];

export default function PublicarPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">¿Qué querés publicar?</h1>
      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {OPCIONES.map(({ href, Icon, titulo, texto, cta, principal }) => (
          <li key={href}>
            <Link href={href} className={`flex h-full flex-col rounded-2xl border p-5 transition hover:shadow-md ${principal ? "border-brand bg-surface ring-2 ring-brand" : "border-line bg-surface hover:border-brand"}`}>
              <span className="grid size-12 place-items-center rounded-xl bg-brand-light text-brand">
                <Icon className="size-6" />
              </span>
              <span className="mt-3 text-lg font-bold">{titulo}</span>
              <span className="mt-1 flex-1 text-sm text-muted">{texto}</span>
              <span className={`btn mt-4 ${principal ? "btn-brand" : "btn-ghost"}`}>{cta}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya publicaste?{" "}
        <Link href="/mi-cuenta" className="font-bold text-brand underline">
          Ir a mis avisos
        </Link>
      </p>
    </div>
  );
}
