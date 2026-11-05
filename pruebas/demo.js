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

  await page.goto(`${BASE}/`);
  ok(await visible(page.getByRole("region", { name: "Recién publicados" }).getByRole("link", { name: "Peugeot 208" })), "El auto publicado aparece en la portada, en Recién publicados");
  await page.goto(`${BASE}/autos?marca=Peugeot`);
  ok(await visible(page.getByRole("link", { name: "Peugeot 208" })), "El auto publicado aparece en el listado con filtros");

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

  const publicarParticular = async (marca, modelo, { foto = false, descripcion = "" } = {}) => {
    await page.goto(`${BASE}/mi-cuenta/publicar`);
    // El borrador guardado se ofrece apenas termina de leerse: esperar el formulario o esa pregunta.
    await page.getByRole("button", { name: /Empezar de nuevo|Seguir sin fotos/ }).first().waitFor();
    const empezar = page.getByRole("button", { name: "Empezar de nuevo" });
    if (await empezar.isVisible()) await empezar.click();
    if (foto) {
      await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, "foto-prueba.jpg"));
      await page.getByText("Portada").waitFor({ timeout: 60000 }); // la primera vez descarga el detector
      await page.getByRole("button", { name: "Siguiente" }).click();
    } else {
      await page.getByRole("button", { name: /Seguir sin fotos/ }).click();
    }
    await page.getByRole("radio", { name: "Auto", exact: true }).click();
    await page.getByRole("radio", { name: marca }).click();
    await page.getByRole("radio", { name: modelo, exact: true }).click();
    await page.getByLabel("Año").selectOption("2018");
    await page.getByLabel("Kilómetros").fill("90000");
    await page.getByRole("radio", { name: "Nafta", exact: true }).click();
    await page.getByRole("radio", { name: "Manual" }).click();
    await page.getByRole("radio", { name: "Gris" }).click();
    await page.getByRole("button", { name: "Siguiente" }).click();
    await page.getByRole("radio", { name: "Pesos $" }).click();
    await page.getByRole("textbox", { name: /^Precio/ }).fill("12000000");
    let avisoTexto = false;
    if (descripcion) {
      await page.getByLabel("Descripción (opcional)").fill(descripcion);
      avisoTexto = await visible(page.getByRole("status").filter({ hasText: "Teléfono en la descripción" }));
    }
    await page.getByRole("button", { name: "Siguiente" }).click();
    return avisoTexto;
  };
  const admin = async () => {
    await page.goto(`${BASE}/admin`);
    await page.getByRole("heading", { name: "Moderación" }).waitFor();
  };

  // Catálogo amplio: populares primero, buscador para el resto y modelo escrito a mano.
  await page.goto(`${BASE}/mi-cuenta/publicar`);
  await page.getByRole("button", { name: /Seguir sin fotos/ }).click();
  await page.getByLabel("Otra marca").selectOption("Chery");
  await page.getByPlaceholder(/Buscá otro modelo de Chery/).fill("tiggo");
  const tiggos = await page.getByRole("radio", { name: /^Tiggo/ }).count();
  ok(tiggos === 5, `Buscar "tiggo" en Chery muestra ${tiggos} modelos`);
  await page.getByPlaceholder(/Buscá otro modelo de Chery/).fill("Tiggo 9 Pro");
  await page.getByRole("button", { name: /Usar “Tiggo 9 Pro”/ }).click();
  ok(await visible(page.getByText("Modelo elegido:")), "Un modelo que no está en la lista se puede escribir a mano");
  await page.getByRole("radio", { name: "Toyota" }).click();
  ok((await page.getByRole("radio", { name: "Hilux" }).count()) === 1 && (await page.getByRole("radio", { name: "86" }).count()) === 0, "Toyota muestra primero sus modelos más vendidos");

  // Moderación: el primer aviso de una cuenta nueva pasa por el administrador.
  await publicarParticular("Fiat", "Cronos");
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByRole("heading", { name: "Tu aviso está en revisión" }).waitFor();
  ok(await visible(page.getByText(/Motivo: Primer aviso de la cuenta/)), "Primer aviso de un particular queda en revisión");
  await page.goto(`${BASE}/autos?vendedor=particular&marca=Fiat`);
  await page.getByRole("link", { name: "Fiat Argo" }).waitFor();
  ok((await page.getByRole("link", { name: "Fiat Cronos" }).count()) === 0, "Un aviso en revisión no aparece en el portal");
  await admin();
  const enRevision = page.getByRole("listitem").filter({ hasText: "Fiat Cronos" });
  await enRevision.getByRole("button", { name: "Aprobar", exact: true }).click();
  await page.getByText("No hay avisos esperando revisión.").waitFor();
  await page.goto(`${BASE}/mi-cuenta`);
  ok(await visible(page.getByRole("listitem").filter({ hasText: "Fiat Cronos 2018" }).getByText("Publicado", { exact: true })), "El administrador lo aprueba y se publica");
  await page.goto(`${BASE}/autos?vendedor=particular&marca=Fiat`);
  ok(await visible(page.getByRole("link", { name: "Fiat Cronos" })), "Una vez aprobado, aparece en el listado");

  // Con la cuenta aprobada, el segundo sale al instante. La foto pasa por el detector del teléfono.
  await publicarParticular("Chevrolet", "Onix", { foto: true });
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByRole("heading", { name: /Tu auto ya está publicado|Tu aviso está en revisión/ }).waitFor();
  ok(await visible(page.getByRole("heading", { name: /Tu auto ya está publicado/ })), "Cuenta aprobada: el segundo aviso, con foto revisada por el detector, se publica directo");
  ok(true, "Un particular publica 2 autos gratis");
  await publicarParticular("Ford", "Ka");
  ok(
    (await page.getByRole("button", { name: "Publicar" }).isDisabled()) && (await visible(page.getByRole("alert").filter({ hasText: "Ya tenés 2 autos publicados" }))),
    "El tercer auto no se puede publicar (tope de 2)",
  );

  await page.goto(`${BASE}/mi-cuenta`);
  await page.getByText("Usaste 2 de 2 lugares").waitFor();
  const avisoCronos = page.getByRole("listitem").filter({ hasText: "Fiat Cronos 2018" });
  await avisoCronos.getByRole("button", { name: "Destacar" }).click();
  await page.getByRole("button", { name: "Pagar con Mercado Pago" }).click();
  await page.getByRole("button", { name: "Simular pago aprobado" }).click();
  await page.getByText("Destacado 7 días activado en tu aviso.").waitFor();
  await page.getByRole("button", { name: "Listo" }).click();
  ok(await visible(avisoCronos.getByText(/Destacado hasta el/)), "Destacar un aviso con pago simulado");
  await avisoCronos.getByRole("button", { name: "Lo vendí" }).click();
  await page.getByText("Usaste 1 de 2 lugares").waitFor();
  ok(await visible(page.getByRole("link", { name: "Publicar" })), "Al marcar vendido se libera el lugar");

  // Un teléfono en la descripción manda el aviso a revisión, y el administrador lo rechaza.
  const avisoTelefono = await publicarParticular("Ford", "Ka", { descripcion: "Impecable, escribime al 383 4123456" });
  ok(avisoTelefono, "Avisa mientras escribe que el teléfono manda el aviso a revisión");
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByRole("heading", { name: "Tu aviso está en revisión" }).waitFor();
  await admin();
  const ka = page.getByRole("listitem").filter({ hasText: "Ford Ka" });
  ok(await visible(ka.getByText("Teléfono en la descripción")), "El administrador ve por qué está en revisión");
  await ka.getByRole("button", { name: "Rechazar" }).click();
  await ka.getByLabel(/Motivo del rechazo/).selectOption("Teléfono o links en el texto");
  await ka.getByRole("button", { name: "Rechazar aviso" }).click();
  await page.getByText("No hay avisos esperando revisión.").waitFor();
  await page.goto(`${BASE}/mi-cuenta`);
  ok(await visible(page.getByText(/No se publicó: Teléfono o links en el texto/)), "Quien publicó ve el motivo del rechazo y puede corregirlo");

  // Denuncias: con 3, un aviso sale del portal y vuelve a revisión.
  const onix = page.getByRole("listitem").filter({ hasText: "Chevrolet Onix 2018" });
  await onix.getByRole("link", { name: /Ver aviso de/ }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Denunciar este aviso" }).click();
    await page.getByRole("radio", { name: "Fotos inapropiadas o que no son del auto" }).check();
    await page.getByRole("button", { name: "Enviar denuncia" }).click();
    await page.getByText("Gracias por avisarnos").waitFor();
    await page.getByRole("button", { name: "Cerrar" }).click();
  }
  await page.goto(`${BASE}/mi-cuenta`);
  ok(await visible(onix.getByText("En revisión", { exact: true })), "Con 3 denuncias el aviso sale del portal y vuelve a revisión");

  // Bloquear la cuenta: no puede publicar más.
  await admin();
  await page.getByRole("listitem").filter({ hasText: "Chevrolet Onix" }).getByRole("button", { name: "Bloquear cuenta" }).click();
  await page.getByRole("button", { name: "Bloquear cuenta" }).last().click();
  await page.goto(`${BASE}/mi-cuenta/publicar`);
  ok(await visible(page.getByRole("heading", { name: "Tu cuenta está bloqueada" })), "Una cuenta bloqueada no puede publicar");

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
