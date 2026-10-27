import Link from "next/link";
import { portal } from "@/config/portal";
import { localidades, tipos } from "@/data/catalogos";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted">
            {portal.tagline}. Buscá gratis, sin registrarte, y consultá directo con la agencia por WhatsApp.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold">Buscar</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {tipos.map((t) => (
              <li key={t.value}>
                <Link href={`/autos?tipo=${t.value}`} className="hover:text-brand hover:underline">
                  {t.plural} en Catamarca
                </Link>
              </li>
            ))}
            <li>
              <Link href="/autos?condicion=0km" className="hover:text-brand hover:underline">
                0 km en Catamarca
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold">Localidades</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {localidades.map((l) => (
              <li key={l.slug}>
                <Link href={`/autos?localidad=${l.slug}`} className="hover:text-brand hover:underline">
                  Autos en {l.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold">{portal.name}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/agencias" className="hover:text-brand hover:underline">Agencias</Link></li>
            <li><Link href="/para-agencias" className="hover:text-brand hover:underline">Para agencias</Link></li>
            <li><Link href="/consejos-de-compra" className="hover:text-brand hover:underline">Consejos de compra segura</Link></li>
            <li><Link href="/preguntas-frecuentes" className="hover:text-brand hover:underline">Preguntas frecuentes</Link></li>
            <li><Link href="/contacto" className="hover:text-brand hover:underline">Contacto</Link></li>
            <li><Link href="/terminos" className="hover:text-brand hover:underline">Términos y condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-brand hover:underline">Política de privacidad</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted">
          {portal.name} es una vidriera de agencias: no vende vehículos ni procesa pagos. La información de cada aviso la publica la agencia.
        </p>
      </div>
    </footer>
  );
}
