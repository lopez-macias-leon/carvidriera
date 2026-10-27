import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Consejos para comprar un auto usado en Catamarca",
  description: "Qué revisar, qué papeles pedir y cómo evitar estafas al comprar un auto usado o 0 km en Catamarca.",
};

const CONSEJOS = [
  {
    t: "Mirá el auto en persona",
    d: "Coordiná con la agencia para verlo de día. Si podés, andá con un mecánico de confianza y hacé una prueba de manejo.",
  },
  {
    t: "Pedí el informe de dominio",
    d: "El informe del Registro de la Propiedad Automotor muestra quién es el titular, si tiene prendas, embargos o inhibiciones.",
  },
  {
    t: "Revisá la documentación",
    d: "Cédula, título, formulario 08 firmado, VTV vigente y libre deuda de patentes e infracciones. En CarVidriera, el estado de los papeles lo informa la agencia: verificalo igual.",
  },
  {
    t: "Controlá los números",
    d: "Que los números de motor y chasis coincidan con los de la documentación.",
  },
  {
    t: "No pagues sin ver",
    d: "No hagas señas ni transferencias antes de ver el auto y sus papeles. Desconfiá de precios muy por debajo del mercado o de apuros para cerrar.",
  },
  {
    t: "Dejá todo por escrito",
    d: "Pedí un boleto de compraventa o recibo con los datos del auto, el precio, la forma de pago y la fecha de entrega.",
  },
];

export default function ConsejosPage() {
  return (
    <PageShell titulo="Consejos para comprar seguro" bajada="Lo que conviene revisar antes de comprar un auto, sea usado o 0 km.">
      <ol className="space-y-3">
        {CONSEJOS.map((c, i) => (
          <li key={c.t} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-light font-extrabold text-brand">{i + 1}</span>
            <span>
              <span className="block font-bold">{c.t}</span>
              <span className="mt-1 block text-muted">{c.d}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted">
        CarVidriera es una vidriera de agencias: no vende autos ni procesa pagos. La operación se hace directamente con la agencia.
      </p>
    </PageShell>
  );
}
