/**
 * Recibe vistas y clics del navegador.
 * Con Supabase: calcula una huella anónima diaria (hash con sal de IP + navegador + id + tipo),
 * descarta duplicados y llama a la función `registrar_evento`, que suma en `estadisticas_diarias`.
 * En la demo solo valida y responde.
 */
const TIPOS = new Set(["vista", "whatsapp", "compartir", "vista_catalogo"]);

export async function POST(request: Request) {
  try {
    const { id, tipo } = JSON.parse(await request.text());
    if (typeof id !== "string" || id.length > 80 || !TIPOS.has(tipo)) return new Response(null, { status: 400 });
    const ua = request.headers.get("user-agent") ?? "";
    if (/bot|crawl|spider|preview|facebookexternalhit|whatsapp/i.test(ua)) return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
  return new Response(null, { status: 204 });
}
