import type { Metadata } from "next";
import Link from "next/link";
import { TalleresList } from "@/components/talleres-list";
import { especialidades } from "@/data/catalogos";
import { getTalleres } from "@/lib/catalog";
import type { Especialidad } from "@/lib/types";

export const metadata: Metadata = {
  title: "Mecánicos y talleres en Catamarca",
  description: "Talleres mecánicos de Catamarca: mecánica general, electricidad, diésel, chapa y pintura, gomería y revisión antes de comprar un usado. Consultá por WhatsApp.",
};

export default async function MecanicosPage({ searchParams }: PageProps<"/mecanicos">) {
  const { especialidad } = await searchParams;
  const inicial = especialidades.find((e) => e.value === especialidad)?.value as Especialidad | undefined;
  const talleres = await getTalleres();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Mecánicos de Catamarca</h1>
      <p className="mt-1 text-muted">Talleres para el service, una reparación o revisar un usado antes de comprarlo.</p>
      <div className="mt-5">
        <TalleresList talleres={talleres} inicial={inicial} />
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        ¿Tenés un taller?{" "}
        <Link href="/para-talleres" className="font-bold text-brand underline">
          Sumalo a CarVidriera
        </Link>
      </p>
    </div>
  );
}
