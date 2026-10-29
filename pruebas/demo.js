/**
 * Prueba de punta a punta de la demo, en tamaño celular.
 * Uso: npm run build && npx next start -p 3200, y en otra terminal: node pruebas/demo.js
 * (BASE=http://otra-url node pruebas/demo.js para probar otra dirección)
 */
const { chromium } = require("playwright");
const path = require("path");

const BASE = process.env.BASE ?? "http://localhost:3200";
let fallas = 0;
const visible = (loc) => loc.first().waitFor({ timeout: 5000 }).then(() => true, () => false);
const ok = (cond, msg) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) fallas++;
};

let page;
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  page = await ctx.newPage();
  const errores = [];
  page.on("pageerror", (e) => errores.push(e.message));

  // Comprador: buscar, filtrar, ver ficha y consultar.
  await page.goto(`${BASE}/`);
  await page.getByRole("combobox", { name: "Buscá marca o modelo" }).fill("hilux");
  await page.getByRole("option", { name: "Toyota Hilux" }).click();
  await page.waitForURL(/\/autos\?q=Toyota\+Hilux|\/autos\?q=Toyota%20Hilux/);
  ok((await page.getByRole("article").count()) === 2, "La búsqueda 'Hilux' devuelve 2 autos (concesionaria y particular)");

  await page.goto(`${BASE}/autos`);
  const total = await page.getByRole("article").count();
  await page.getByRole("button", { name: /^Filtros/ }).click();
  await page.getByRole("dialog", { name: "Filtros" }).getByRole("button", { name: /^Camioneta/ }).click();
  await page.waitForURL(/tipo=camioneta/);
  await page.getByRole("dialog").getByRole("button", { name: /^Ver \d+ autos?$/ }).click();
  const camionetas = await page.getByRole("article").count();
  ok(camionetas > 0 && camionetas < total, `Filtro por tipo: ${camionetas} de ${total}`);
  await page.getByRole("combobox", { name: "Ordenar por" }).selectOption("precio_asc");
  await page.waitForURL(/orden=precio_asc/);
  ok(true, "Orden por precio aplicado");

  await page.goto(`${BASE}/auto/toyota-hilux-2-8-srx-4x4-at-2021-h7k2q`);
  const wa = page.getByRole("link", { name: "Consultar por WhatsApp" }).last();
  const href = decodeURIComponent(await wa.getAttribute("href"));
  ok(href.startsWith("https://wa.me/") && href.includes("Toyota Hilux 2.8 SRX 4x4 AT 2021") && href.includes("/auto/toyota-hilux"), "Mensaje de WhatsApp con el auto y su link");
  await page.getByRole("button", { name: /Guardar .* en favoritos/ }).last().click();
  await page.goto(`${BASE}/favoritos`);
  ok((await page.getByRole("article").count()) === 1, "Favorito guardado sin registrarse");

  // Agencia: cargar un auto con foto desde el panel y publicarlo.
  await page.goto(`${BASE}/panel/autos/nuevo`);
  await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, "foto-prueba.jpg"));
  await page.getByText("Portada").waitFor();
  const src = await page.locator('img[alt="Foto 1"]').getAttribute("src");
  ok(src.startsWith("data:image/webp") && src.length < 400_000, `Foto comprimida a WebP (${Math.round((src.length * 0.75) / 1024)} KB)`);
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByRole("button", { name: "Siguiente" }).click();
  ok(await page.getByRole("alert").filter({ hasText: "Falta completar" }).isVisible(), "Valida datos faltantes");
  await page.getByRole("radio", { name: "Auto", exact: true }).click();
  await page.getByRole("radio", { name: "Peugeot" }).click();
  await page.getByRole("radio", { name: "208" }).click();
  await page.getByLabel("Versión").fill("1.6 Allure");
  await page.getByLabel("Año").selectOption("2022");
  await page.getByLabel("Kilómetros").fill("35000");
  await page.getByRole("radio", { name: "Nafta", exact: true }).click();
  await page.getByRole("radio", { name: "Manual" }).click();
  await page.getByRole("radio", { name: "Blanco" }).click();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByRole("radio", { name: "Pesos $" }).click();
  await page.getByRole("textbox", { name: /^Precio/ }).fill("21500000");
  await page.getByRole("button", { name: "+ Único dueño" }).click();
  await page.getByRole("button", { name: "Siguiente" }).click();
  ok(await page.getByText("$ 21.500.000").first().isVisible(), "Vista previa con precio formateado");
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByRole("heading", { name: /Tu auto ya está publicado/ }).waitFor();
  ok(true, "Auto publicado");

  await page.getByRole("link", { name: "Ver cómo lo ve el comprador" }).click();
  await page.getByRole("heading", { name: "Peugeot 208" }).waitFor();
  ok(await visible(page.getByText("Único dueño")), "La ficha del auto nuevo se ve en el portal");

  await page.goto(`${BASE}/agencia/automotores-demo`);
  await page.getByRole("link", { name: "Peugeot 208" }).first().waitFor();
  ok(true, "El auto nuevo aparece en el catálogo de la agencia");

  await page.goto(`${BASE}/panel/autos`);
  const fila = page.getByRole("listitem").filter({ hasText: "Peugeot 208 2022" });
  await fila.getByRole("button", { name: "Marcar reservado" }).click();
  ok(await visible(fila.getByText("Reservado", { exact: true })), "Cambio de estado a reservado");

  await page.goto(`${BASE}/panel`);
  ok(await page.getByText(/tus autos tuvieron .* vistas/).isVisible(), "Inicio del panel con resumen del mes");

  // Particulares: publican gratis hasta 2 autos.
  await page.goto(`${BASE}/autos`);
  await page.getByRole("button", { name: /^Filtros/ }).click();
  await page.getByRole("dialog", { name: "Filtros" }).getByRole("button", { name: /^Particulares/ }).click();
  await page.waitForURL(/vendedor=particular/);
  await page.getByRole("dialog").getByRole("button", { name: /^Ver \d+ autos?$/ }).click();
  const deParticulares = await page.getByRole("article").count();
  ok(deParticulares > 0 && (await page.getByRole("article").filter({ hasText: "Particular" }).count()) === deParticulares, `Filtro por vendedor: ${deParticulares} autos de particulares`);

  await page.getByRole("link", { name: "Fiat Argo" }).first().click();
  await page.getByText("Vendedor particular").waitFor();
  ok(await visible(page.getByRole("heading", { name: "¿Lo querés revisar antes de comprar?" })), "Ficha de particular con talleres de revisión precompra");

  const publicarParticular = async (marca, modelo) => {
    await page.goto(`${BASE}/mi-cuenta/publicar`);
    const empezar = page.getByRole("button", { name: "Empezar de nuevo" });
    if (await empezar.isVisible().catch(() => false)) await empezar.click();
    await page.getByRole("button", { name: /Seguir sin fotos/ }).click();
    await page.getByRole("radio", { name: "Auto", exact: true }).click();
    await page.getByRole("radio", { name: marca }).click();
    await page.getByRole("radio", { name: modelo, exact: true }).click();
    await page.getByLabel("Año").selectOption("2018");
    await page.getByLabel("Kilómetros").fill("90000");
    await page.getByRole("radio", { name: "Nafta", exact: true }).click();
    await page.getByRole("radio", { name: "Manual" }).click();
    await page.getByRole("radio", { name: "Gris" }).click();
    await page.getByRole("button", { name: "Siguiente" }).click();
    await page.getByRole("textbox", { name: /^Precio/ }).fill("12000000");
    await page.getByRole("button", { name: "Siguiente" }).click();
  };
  await publicarParticular("Fiat", "Cronos");
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByRole("heading", { name: /Tu auto ya está publicado/ }).waitFor();
  await publicarParticular("Chevrolet", "Onix");
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByRole("heading", { name: /Tu auto ya está publicado/ }).waitFor();
  ok(true, "Un particular publica 2 autos gratis");
  await publicarParticular("Ford", "Ka");
  ok(
    (await page.getByRole("button", { name: "Publicar" }).isDisabled()) && (await visible(page.getByRole("alert").filter({ hasText: "Ya tenés 2 autos publicados" }))),
    "El tercer auto no se puede publicar (tope de 2)",
  );

  await page.goto(`${BASE}/mi-cuenta`);
  await page.getByText("2 de 2 autos publicados").waitFor();
  const avisoCronos = page.getByRole("listitem").filter({ hasText: "Fiat Cronos 2018" });
  await avisoCronos.getByRole("button", { name: "Destacar" }).click();
  await page.getByRole("button", { name: "Pagar con Mercado Pago" }).click();
  await page.getByRole("button", { name: "Simular pago aprobado" }).click();
  await page.getByText("Destacado 7 días activado en tu aviso.").waitFor();
  await page.getByRole("button", { name: "Listo" }).click();
  ok(await visible(avisoCronos.getByText(/Destacado hasta el/)), "Destacar un aviso con pago simulado");
  await avisoCronos.getByRole("button", { name: "Lo vendí" }).click();
  await page.getByText("1 de 2 autos publicados").waitFor();
  ok(await visible(page.getByRole("link", { name: "Publicar" })), "Al marcar vendido se libera el lugar");

  // Mecánicos.
  await page.goto(`${BASE}/mecanicos`);
  const talleres = await page.getByRole("article").count();
  await page.getByRole("button", { name: "Revisión precompra" }).click();
  const precompra = await page.getByRole("article").count();
  ok(talleres > precompra && precompra > 0, `Mecánicos filtrados por especialidad: ${precompra} de ${talleres}`);
  await page.getByRole("link", { name: "Taller Demo Central" }).click();
  await page.getByRole("heading", { name: "Taller Demo Central" }).waitFor();
  const waTaller = decodeURIComponent(await page.getByRole("link", { name: "Consultar por WhatsApp" }).getAttribute("href"));
  ok(waTaller.includes("Taller Demo Central"), "Ficha de taller con WhatsApp");

  await page.goto(`${BASE}/agencias`);
  ok(page.url().endsWith("/concesionarias"), "Las direcciones viejas de agencias redirigen a concesionarias");

  ok(errores.length === 0, `Sin errores de JavaScript${errores.length ? `: ${errores.join(" | ")}` : ""}`);
  await browser.close();
  console.log(fallas ? `\n${fallas} prueba(s) fallaron` : "\nTodo OK");
  process.exit(fallas ? 1 : 0);
})().catch(async (e) => {
  console.error(e.message.split("\n")[0]);
  await page?.screenshot({ path: path.join(__dirname, "error.png"), fullPage: true });
  console.error("Captura en pruebas/error.png");
  process.exit(1);
});
