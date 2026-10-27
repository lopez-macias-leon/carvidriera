"use client";

import { useEffect, useRef, useState } from "react";
import { FlagIcon } from "./icons";

const MOTIVOS = [
  ["vendido", "El auto ya se vendió"],
  ["precio_falso", "El precio no es real"],
  ["fotos_no_corresponden", "Las fotos no corresponden"],
  ["estafa", "Creo que es una estafa"],
  ["otro", "Otro motivo"],
] as const;

/** Denunciar un aviso. En producción guarda en la tabla `denuncias`; el contacto es opcional. */
export function ReportDialog({ codigo }: { codigo: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [enviado, setEnviado] = useState(false);
  useEffect(() => {
    const d = ref.current;
    const onClose = () => setTimeout(() => setEnviado(false), 300);
    d?.addEventListener("close", onClose);
    return () => d?.removeEventListener("close", onClose);
  }, []);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-danger">
        <FlagIcon className="size-4" />
        Denunciar este aviso
      </button>
      <dialog ref={ref} className="m-auto w-[min(92vw,28rem)] rounded-2xl p-0 backdrop:bg-ink/50" aria-labelledby="titulo-denuncia">
        {enviado ? (
          <div className="p-6 text-center">
            <p id="titulo-denuncia" className="text-lg font-extrabold">
              Gracias por avisarnos
            </p>
            <p className="mt-2 text-sm text-muted">Vamos a revisar el aviso. Si no cumple las reglas, lo pausamos.</p>
            <form method="dialog">
              <button className="btn btn-brand mt-5 w-full">Cerrar</button>
            </form>
          </div>
        ) : (
          <form
            className="p-5"
            onSubmit={(e) => {
              e.preventDefault();
              // Demo: no se guarda. Producción: insert en `denuncias` con el código del aviso.
              void codigo;
              setEnviado(true);
            }}
          >
            <h2 id="titulo-denuncia" className="text-lg font-extrabold">
              Denunciar aviso
            </h2>
            <fieldset className="mt-4">
              <legend className="text-sm font-bold">Motivo</legend>
              <div className="mt-2 grid gap-1">
                {MOTIVOS.map(([value, label], i) => (
                  <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-soft">
                    <input type="radio" name="motivo" value={value} required defaultChecked={i === 0} className="size-5 accent-brand" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="mt-3 block">
              <span className="text-sm font-bold">Detalle (opcional)</span>
              <textarea name="detalle" rows={3} maxLength={500} className="field mt-1" />
            </label>
            <label className="mt-3 block">
              <span className="text-sm font-bold">Tu contacto (opcional)</span>
              <input name="contacto" maxLength={120} className="field mt-1" placeholder="Email o teléfono, si querés que te respondamos" />
            </label>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => ref.current?.close()} className="btn btn-ghost flex-1">
                Cancelar
              </button>
              <button type="submit" className="btn btn-brand flex-1">
                Enviar denuncia
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
