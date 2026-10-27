"use client";

/**
 * Comprime y redimensiona una foto en el teléfono antes de subirla: WebP, lado mayor `max` px.
 * Al redibujar en un canvas se descartan los metadatos EXIF (incluida la ubicación GPS).
 */
export async function comprimirFoto(file: File, max = 1600, calidad = 0.8): Promise<{ src: string; ancho: number; alto: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const escala = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);
  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo comprimir"))), "image/webp", calidad));
  const src = await new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(blob);
  });
  return { src, ancho, alto };
}
