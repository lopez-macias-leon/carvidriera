import { Fragment } from "react";

/** Markdown mínimo para los textos legales: títulos, párrafos, listas, citas, tablas y negritas. */
function inline(texto: string) {
  return texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((parte, i) =>
    parte.startsWith("**") ? <strong key={i}>{parte.slice(2, -2)}</strong> : parte.startsWith("`") ? <Fragment key={i}>{parte.slice(1, -1)}</Fragment> : parte,
  );
}

export function Markdown({ texto }: { texto: string }) {
  const bloques = texto.trim().split(/\n{2,}/);
  return (
    <div className="space-y-4 leading-relaxed">
      {bloques.map((b, i) => {
        const lineas = b.split("\n");
        if (b.startsWith("### ")) return <h2 key={i} className="pt-2 text-lg font-extrabold">{inline(b.slice(4))}</h2>;
        if (b.startsWith("## ")) return <h2 key={i} className="pt-2 text-xl font-extrabold">{inline(b.slice(3))}</h2>;
        if (b.startsWith("> ")) return <blockquote key={i} className="rounded-xl bg-soft p-4 text-sm">{inline(lineas.map((l) => l.replace(/^> ?/, "")).join(" "))}</blockquote>;
        if (b.startsWith("- ")) return <ul key={i} className="list-disc space-y-1.5 pl-5">{lineas.map((l, j) => <li key={j}>{inline(l.replace(/^- /, ""))}</li>)}</ul>;
        if (b.startsWith("|")) {
          const filas = lineas.filter((l) => !/^\|[-\s|]+\|$/.test(l)).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">{filas[0].map((c, j) => <th key={j} className="py-2 pr-4 font-bold">{inline(c)}</th>)}</tr>
                </thead>
                <tbody>
                  {filas.slice(1).map((f, j) => (
                    <tr key={j} className="border-b border-line">{f.map((c, k) => <td key={k} className="py-2 pr-4">{inline(c)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (b.startsWith("*") && b.endsWith("*") && !b.startsWith("**")) return <p key={i} className="text-sm text-muted">{b.slice(1, -1)}</p>;
        return <p key={i}>{inline(lineas.join(" "))}</p>;
      })}
    </div>
  );
}
