import Link from "next/link";
import { AgencyAvatar } from "@/components/agency-avatar";
import { CarCard, CarGrid } from "@/components/car-card";
import { CarIcon, ChevronRight, PickupIcon, SearchIcon, SparkIcon, SuvIcon, TagIcon, VerifiedIcon, WhatsAppIcon, WrenchIcon } from "@/components/icons";
import { TallerCard } from "@/components/talleres-list";
import { SearchBox } from "@/components/search-box";
import { marcas } from "@/data/catalogos";
import { contarPorAgencia, contarPorTipo, getAgencias, getDestacados, getRecientes, getTalleres } from "@/lib/catalog";
import { localidadCorta } from "@/lib/format";

const ACCESOS = [
  { href: "/autos?tipo=auto", label: "Autos", key: "auto", Icon: CarIcon },
  { href: "/autos?tipo=camioneta", label: "Camionetas y pick-ups", key: "camioneta", Icon: PickupIcon },
  { href: "/autos?tipo=suv", label: "SUV", key: "suv", Icon: SuvIcon },
  { href: "/autos?condicion=0km", label: "0 km", key: "0km", Icon: SparkIcon },
] as const;

const PASOS = [
  { Icon: SearchIcon, titulo: "Buscá", texto: "Filtrá por marca, precio, año o kilómetros. Gratis y sin registrarte." },
  { Icon: CarIcon, titulo: "Mirá el auto", texto: "Fotos, datos completos y estado de los papeles informado por la agencia." },
  { Icon: WhatsAppIcon, titulo: "Consultá por WhatsApp", texto: "Hablás directo con el vendedor, con el auto ya escrito en el mensaje." },
];

export default async function HomePage() {
  const [recientes, destacados, agencias, porTipo, porAgencia, talleres] = await Promise.all([
    getRecientes(8),
    getDestacados(),
    getAgencias(),
    contarPorTipo(),
    contarPorAgencia(),
    getTalleres(),
  ]);
  const nombreAgencia = Object.fromEntries(agencias.map((a) => [a.slug, a]));

  return (
    <>
      {/* Hero + buscador */}
      <section className="relative overflow-hidden bg-brand text-white">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-80 rounded-full bg-white/5" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-16 size-72 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:pb-14 sm:pt-14">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Autos de Catamarca, en un solo lugar
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">Usados y 0 km de concesionarias y particulares. Encontrá el tuyo y consultá directo por WhatsApp.</p>
          <div className="mt-6 max-w-2xl text-ink">
            <SearchBox grande />
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            <li className="flex items-center gap-1.5">
              <VerifiedIcon className="size-4 text-white" /> Concesionarias verificadas
            </li>
            <li className="flex items-center gap-1.5">
              <WhatsAppIcon className="size-4" /> Consulta directa por WhatsApp
            </li>
            <li className="flex items-center gap-1.5">
              <TagIcon className="size-4" /> Vendé tu auto gratis
            </li>
          </ul>
        </div>
      </section>

      {/* Accesos rápidos */}
      <section aria-label="Buscar por tipo" className="relative z-10 mx-auto -mt-5 max-w-6xl px-4">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACCESOS.map(({ href, label, key, Icon }) => (
            <li key={key}>
              <Link href={href} className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 shadow-sm transition hover:border-brand hover:shadow-md">
                <Icon className="size-8 text-brand" />
                <span className="font-bold leading-tight">{label}</span>
                <span className="text-sm text-muted">{porTipo[key]} disponibles</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Destacados */}
      {destacados.length > 0 && (
        <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="destacados">
          <div className="flex items-end justify-between gap-4">
            <h2 id="destacados" className="text-2xl font-extrabold tracking-tight">
              Destacados
            </h2>
          </div>
          <ul className="scroll-row -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {destacados.map((v) => (
              <li key={v.codigo} className="w-[78%] shrink-0 sm:w-[44%] lg:w-[31%]">
                <CarCard v={v} agencia={nombreAgencia[v.agencia]} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recién publicados */}
      <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="recientes">
        <div className="flex items-end justify-between gap-4">
          <h2 id="recientes" className="text-2xl font-extrabold tracking-tight">
            Recién publicados
          </h2>
          <Link href="/autos" className="flex items-center text-sm font-bold text-brand hover:underline">
            Ver todos <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="mt-4">
          <CarGrid>
            {recientes.map((v, i) => (
              <CarCard key={v.codigo} v={v} agencia={nombreAgencia[v.agencia]} eager={i < 2} />
            ))}
          </CarGrid>
        </div>
        <div className="mt-6 text-center">
          <Link href="/autos" className="btn btn-ghost">
            Ver todos los autos
          </Link>
        </div>
      </section>

      {/* Marcas */}
      <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="marcas">
        <h2 id="marcas" className="text-2xl font-extrabold tracking-tight">
          Buscar por marca
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {Object.keys(marcas).map((m) => (
            <li key={m}>
              <Link href={`/autos?marca=${encodeURIComponent(m)}`} className="chip hover:border-brand">
                {m}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Agencias */}
      <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="agencias">
        <div className="flex items-end justify-between gap-4">
          <h2 id="agencias" className="text-2xl font-extrabold tracking-tight">
            Concesionarias
          </h2>
          <Link href="/concesionarias" className="flex items-center text-sm font-bold text-brand hover:underline">
            Ver todas <ChevronRight className="size-4" />
          </Link>
        </div>
        <ul className="scroll-row -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {agencias.map((a) => (
            <li key={a.slug} className="w-64 shrink-0">
              <Link href={`/agencia/${a.slug}`} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition hover:border-brand">
                <AgencyAvatar agencia={a} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-bold">
                    <span className="truncate">{a.nombre}</span>
                    {a.verificada && <VerifiedIcon className="size-4 shrink-0 text-brand" />}
                  </span>
                  <span className="block truncate text-sm text-muted">{localidadCorta(a.localidad)}</span>
                  <span className="block text-sm font-semibold text-brand">{porAgencia[a.slug] ?? 0} autos</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Mecánicos */}
      <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="mecanicos">
        <div className="flex items-end justify-between gap-4">
          <h2 id="mecanicos" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <WrenchIcon className="size-6 text-brand" /> Mecánicos
          </h2>
          <Link href="/mecanicos" className="flex items-center text-sm font-bold text-brand hover:underline">
            Ver todos <ChevronRight className="size-4" />
          </Link>
        </div>
        <p className="mt-1 text-muted">Para el service, una reparación o revisar un usado antes de comprarlo.</p>
        <ul className="scroll-row -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {talleres.slice(0, 4).map((t) => (
            <li key={t.slug} className="w-80 max-w-[85vw] shrink-0">
              <TallerCard t={t} />
            </li>
          ))}
        </ul>
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto mt-12 max-w-6xl px-4" aria-labelledby="como">
        <h2 id="como" className="text-2xl font-extrabold tracking-tight">
          Cómo funciona
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {PASOS.map(({ Icon, titulo, texto }, i) => (
            <li key={titulo} className="rounded-2xl border border-line bg-surface p-5">
              <span className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand-light text-brand">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-bold text-muted">Paso {i + 1}</span>
              </span>
              <p className="mt-3 text-lg font-bold">{titulo}</p>
              <p className="mt-1 text-sm text-muted">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Vendé gratis + concesionarias y talleres */}
      <section className="mx-auto mt-12 grid max-w-6xl gap-4 px-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-5 rounded-3xl bg-brand p-6 text-white sm:p-10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Vendé tu auto gratis</h2>
            <p className="mt-2 max-w-xl text-white/85">Publicalo desde el celular en pocos minutos y recibí las consultas en tu WhatsApp. Sin comisiones.</p>
          </div>
          <Link href="/mi-cuenta/publicar" className="btn w-fit bg-white text-brand hover:bg-brand-light">
            Publicar mi auto
          </Link>
        </div>
        <div className="flex flex-col justify-between gap-4 rounded-3xl bg-ink p-6 text-white">
          <div>
            <h2 className="text-xl font-extrabold">¿Concesionaria o taller?</h2>
            <p className="mt-1 text-sm text-white/80">Llegá a los compradores de Catamarca con tu catálogo o tu ficha de taller.</p>
          </div>
          <div className="grid gap-2">
            <Link href="/para-concesionarias" className="btn border border-white/30 text-white hover:bg-white/10">
              Planes para concesionarias
            </Link>
            <Link href="/para-talleres" className="btn border border-white/30 text-white hover:bg-white/10">
              Plan para talleres
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
