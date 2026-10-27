# CarVidriera

Portal de autos usados y 0 km de agencias y concesionarias de Catamarca.
Los compradores buscan gratis y sin registrarse y consultan a la agencia por WhatsApp.
Las agencias pagan una suscripción mensual por publicar su stock, tener su catálogo propio y ver estadísticas.

Hecho con [Next.js](https://nextjs.org) y Tailwind CSS, pensado primero para celular e instalable como app (PWA).

> **Etapa 0: demo para vender.** Agencias, autos, precios y estadísticas son **ficticios** y están marcados como DEMO.
> El panel de agencia funciona sin login y lo que se carga queda solo en el teléfono que se usa.
> Todavía no hay base de datos: ver [Próximos pasos](#próximos-pasos).

## Cómo correrlo

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # versión de producción
```

## Qué incluye la demo

**Parte pública**
- Inicio con buscador, accesos por tipo, destacados, recién publicados, marcas, agencias y banner para agencias.
- Listado `/autos` con filtros (tipo, condición, marca, modelo, precio en pesos o dólares, año, km, combustible, caja, localidad, agencia, permuta, financiación) y orden. Todo queda en la URL para compartir.
- Ficha `/auto/[slug]` con galería, datos, documentación informada por la agencia, consulta por WhatsApp con el auto y el link ya escritos, compartir, favoritos, denunciar y autos similares.
- Catálogo propio de cada agencia `/agencia/[slug]` con WhatsApp, cómo llegar, horarios con "Abierto ahora", mapa y stock con filtros.
- Agencias, Para agencias (planes y preguntas), favoritos, consejos de compra, preguntas frecuentes, contacto, términos, condiciones para agencias y privacidad (borradores).
- Vista previa al compartir por WhatsApp (imagen con foto, precio y datos), sitemap, robots y datos estructurados.

**Panel de agencia** (`/panel`, demo sin login)
- Inicio con el resumen del mes, gráfico de vistas por día, autos más vistos y plan vigente.
- Mis autos: estados (publicado, reservado, pausado, vendido, borrador), vistas y consultas por auto, duplicar y editar.
- Cargar auto en 4 pasos desde el celular: fotos comprimidas a WebP en el teléfono (sin datos de ubicación), datos con un toque, precio y detalles, revisar y publicar. Guarda borrador automático.
- Catálogo: link para copiar, compartir por WhatsApp y QR para imprimir.

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Nombre, dominio, WhatsApp y email del portal, modo demo | `src/config/portal.ts` |
| Planes y precios | `src/config/planes.ts` |
| Marcas, modelos, localidades, colores | `src/data/catalogos.ts` |
| Agencias y autos de demostración | `src/data/demo.ts` |
| Colores y estilos | `src/app/globals.css` |
| Textos legales | `src/content/legales.ts` (sale de `docs/LEGALES-BORRADOR.md`) |

Todo lo que aparece entre corchetes (`[dominio]`, `[EMAIL]`, `[RESPONSABLE]`…) es un marcador que hay que reemplazar.

## Pruebas

Prueba de punta a punta en tamaño celular (búsqueda, filtros, ficha, WhatsApp, favoritos, carga de un auto con foto, catálogo y panel):

```bash
npm run build && npx next start -p 3200
npm run prueba        # en otra terminal; usa el Playwright instalado en el sistema
```

## Documentos

- [docs/PROPUESTA.md](docs/PROPUESTA.md): planificación completa (sitemap, arquitectura, modelo de datos, seguridad, cobros, métricas, SEO y etapas).
- [docs/LEGALES-BORRADOR.md](docs/LEGALES-BORRADOR.md): términos, condiciones para agencias y privacidad (para revisión profesional).
- [docs/GUION-DEMO.md](docs/GUION-DEMO.md): cómo mostrar el portal a una agencia en 10 minutos.

## Próximos pasos

- [ ] Supabase: tablas, seguridad por fila (cada agencia solo ve lo suyo), login de agencias y fotos en Storage.
- [ ] Panel del administrador: alta y verificación de agencias, planes, pagos, vencimientos y pausa automática, moderación y denuncias.
- [ ] Registro real de vistas y clics (`/api/evento` ya recibe los eventos).
- [ ] Cobro con Mercado Pago (links de pago al inicio, suscripción automática después).
- [ ] Dominio `carvidriera.com.ar`, datos de contacto y responsable legal.
