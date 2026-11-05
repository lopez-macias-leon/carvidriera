"use client";

/**
 * Revisa cada foto en el teléfono antes de subirla, con NSFW.js (modelo MobileNetV2, sin servidor ni costo).
 * Frena desnudos y contenido sexual. Se puede saltear con conocimientos técnicos: por eso, en producción,
 * las fotos se vuelven a revisar en el servidor y el primer aviso de cada particular pasa por el administrador.
 *
 * El modelo (unos 5 MB con TensorFlow.js) se descarga recién cuando alguien elige fotos, y una sola vez.
 */
import type { NSFWJS } from "nsfwjs/core";

export type Resultado = { apta: true } | { apta: false; motivo: string } | { apta: "sin_revisar" };

/** Umbrales: por encima, la foto no se acepta. Un portal de autos no tiene por qué mostrar nada "sugerente". */
const UMBRAL_EXPLICITO = 0.5; // Porn + Hentai
const UMBRAL_SUGERENTE = 0.7; // Sexy

let modelo: Promise<NSFWJS> | null = null;

function cargar() {
  modelo ??= (async () => {
    const [{ load }, { MobileNetV2Model }, tf] = await Promise.all([import("nsfwjs/core"), import("nsfwjs/models/mobilenet_v2"), import("@tensorflow/tfjs")]);
    tf.enableProdMode();
    return load("MobileNetV2", { modelDefinitions: [MobileNetV2Model] });
  })();
  modelo.catch(() => (modelo = null));
  return modelo;
}

/** Empieza a descargar el modelo mientras la persona elige las fotos. */
export const precargarDetector = () => void cargar().catch(() => {});

function imagen(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Si el modelo no carga (sin conexión, navegador viejo), la foto se acepta pero el aviso
 * queda en revisión para que la mire el administrador: nunca se publica sin revisar.
 */
export async function revisarFoto(src: string): Promise<Resultado> {
  try {
    const [m, img] = await Promise.all([cargar(), imagen(src)]);
    const p = Object.fromEntries((await m.classify(img, 5)).map((x) => [x.className, x.probability]));
    if ((p.Porn ?? 0) + (p.Hentai ?? 0) >= UMBRAL_EXPLICITO) return { apta: false, motivo: "parece contenido sexual" };
    if ((p.Sexy ?? 0) >= UMBRAL_SUGERENTE) return { apta: false, motivo: "parece contenido inapropiado" };
    return { apta: true };
  } catch {
    return { apta: "sin_revisar" };
  }
}
