import type { Metadata } from "next";
import Link from "next/link";
import { ResultadosConLocales } from "@/components/con-locales";
import { ActiveChips, Filters, SortSelect } from "@/components/filters";
import { SearchBox } from "@/components/search-box";
import { tipos } from "@/data/catalogos";
import { buscarVehiculos, getAgencias } from "@/lib/catalog";
import { cantidadFiltrosActivos, filtrosAQuery, leerFiltros, type Filtros } from "@/lib/filtros";
import { localidadCorta } from "@/lib/format";

/** Título según los filtros principales: "Camionetas 0 km Toyota en Valle Viejo". */
function titulo(f: Filtros) {
  const tipo = f.tipo ? tipos.find((t) => t.value === f.tipo)!.plural : "Autos";
  const cond = f.condicion === "0km" ? " 0 km" : f.condicion === "usado" ? " usados" : "";
  const marca = f.marca ? ` ${f.marca}${f.modelo ? ` ${f.modelo}` : ""}` : "";
  const lugar = f.localidad?.length === 1 ? localidadCorta(f.localidad[0]) : "Catamarca";
  const quien = f.vendedor === "agencia" ? " de concesionarias" : f.vendedor === "particular" ? " de particulares" : "";
  return `${tipo}${marca}${cond}${quien} en ${lugar}`;
}

export async function generateMetadata({ searchParams }: PageProps<"/autos">): Promise<Metadata> {
  const f = leerFiltros(await searchParams);
  const t = titulo(f);
  // Combinaciones arbitrarias de filtros no se indexan: se apunta a la versión simple.
  const simple = cantidadFiltrosActivos(f) <= 2 && !f.q && f.pagina === 1;
  return {
    title: t,
    description: `${t}: usados y 0 km de agencias verificadas. Mirá fotos, precio y kilómetros, y consultá directo por WhatsApp.`,
    robots: simple ? undefined : { index: false, follow: true },
  };
}

export default async function AutosPage({ searchParams }: PageProps<"/autos">) {
  const filtros = leerFiltros(await searchParams);
  const [{ items, total, hayMas, conteos }, agencias] = await Promise.all([buscarVehiculos(filtros), getAgencias()]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{titulo(filtros)}</h1>
      <div className="mt-4 max-w-2xl">
        <SearchBox key={filtros.q ?? ""} defaultValue={filtros.q ?? ""} />
      </div>

      <div className="mt-5 lg:grid lg:grid-cols-[270px_1fr] lg:gap-8">
        <div className="hidden lg:block">
          <Filters filtros={filtros} conteos={conteos} agencias={agencias} total={total} />
        </div>

        <div>
          <div className="sticky top-16 z-20 -mx-4 flex items-center gap-2 border-b border-line bg-bg px-4 py-2.5 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pt-0">
            <div className="lg:hidden">
              <Filters filtros={filtros} conteos={conteos} agencias={agencias} total={total} soloSheet />
            </div>
            <div className="ml-auto min-w-0">
              <SortSelect filtros={filtros} />
            </div>
          </div>

          <ResultadosConLocales items={items} total={total} filtros={filtros} agencias={agencias}>
            <ActiveChips filtros={filtros} />
          </ResultadosConLocales>
          {hayMas && (
            <div className="mt-8 text-center">
              <Link href={`/autos?${filtrosAQuery({ ...filtros, pagina: filtros.pagina + 1 })}`} scroll={false} className="btn btn-ghost">
                Ver más autos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
