/** Contenedor de páginas de texto (legales, ayuda, contacto). */
export function PageShell({ titulo, bajada, children }: { titulo: string; bajada?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{titulo}</h1>
      {bajada && <p className="mt-2 text-lg text-muted">{bajada}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function Borrador() {
  return (
    <p className="mb-6 rounded-xl bg-warn-bg p-3 text-sm font-semibold text-warn">
      Borrador pendiente de revisión legal. Los datos entre corchetes se completan antes de publicar.
    </p>
  );
}

export function Faq({ items }: { items: { p: string; r: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((it) => (
        <details key={it.p} className="group p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
            {it.p}
            <span aria-hidden="true" className="text-xl text-brand transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-2 text-muted">{it.r}</div>
        </details>
      ))}
    </div>
  );
}
