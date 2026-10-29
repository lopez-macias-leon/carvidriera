import type { Metadata } from "next";
import Link from "next/link";
import { Faq, PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

const COMPRADORES = [
  { p: "¿Tengo que registrarme para usar CarVidriera?", r: "No. Buscar, ver avisos, guardar favoritos y consultar a las agencias es gratis y sin registro." },
  { p: "¿Cómo consulto por un auto?", r: "Desde la ficha del auto tocá \"Consultar por WhatsApp\". Se abre una conversación con la agencia con el auto y su link ya escritos." },
  { p: "¿CarVidriera vende los autos?", r: "No. CarVidriera es una vidriera de agencias de Catamarca. La compra, el pago y la entrega se arreglan directamente con la agencia." },
  { p: "¿Qué significa \"Agencia verificada\"?", r: "Que comprobamos el CUIT de la agencia. No es una garantía sobre los autos: revisá siempre el auto y sus papeles antes de comprar." },
  { p: "¿Dónde quedan mis favoritos?", r: "En tu teléfono. No los guardamos en ningún servidor; si cambiás de teléfono o borrás los datos del navegador, se pierden." },
  { p: "Vi un aviso raro, ¿qué hago?", r: "Tocá \"Denunciar este aviso\" en la ficha. Lo revisamos y, si no cumple las reglas, lo pausamos." },
];

export default function FaqPage() {
  return (
    <PageShell titulo="Preguntas frecuentes">
      <Faq items={COMPRADORES} />
      <p className="mt-6">
        ¿Tenés una agencia? Mirá las{" "}
        <Link href="/para-concesionarias#preguntas" className="font-bold text-brand underline">
          preguntas de agencias
        </Link>
        .
      </p>
    </PageShell>
  );
}
