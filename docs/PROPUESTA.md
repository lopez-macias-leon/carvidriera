# [NOMBRE DEL PORTAL] — Propuesta de planificación

Portal de compraventa de autos usados y 0 km, exclusivo para agencias y concesionarias de Catamarca.
Documento de planificación: **no hay código todavía**. Una vez aprobado, se avanza sección por sección.

Convenciones del documento:

- Todo lo que está entre corchetes (`[NOMBRE DEL PORTAL]`, `[PRECIO]`, `[DÍAS DE GRACIA]`…) es un marcador para reemplazar por el dato real.
- **Decisión pendiente** marca algo que tiene que definir el dueño del portal (no se inventan precios, plazos ni políticas).
- Las decisiones del dueño ya tomadas están resumidas en la [sección 16](#16-decisiones-del-dueño-del-portal); las que siguen abiertas, también.
- Los límites de los planes gratuitos de terceros (Supabase, Netlify, Cloudflare, Resend) y las comisiones de Mercado Pago cambian seguido: hay que confirmarlos al momento de contratar.

---

## Índice

1. [Sitemap](#1-sitemap)
2. [Arquitectura, stack y costos](#2-arquitectura-stack-y-costo-mensual-inicial)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Roles, permisos y seguridad en Supabase](#4-roles-permisos-y-seguridad-en-supabase)
5. [Home](#5-home-sección-por-sección)
6. [Listado y filtros](#6-listado-y-sistema-de-filtros)
7. [Ficha del auto](#7-ficha-del-auto)
8. [Catálogo de agencia](#8-catálogo-de-agencia)
9. [Panel de agencia y carga desde el celular](#9-panel-de-agencia-y-flujo-de-carga-desde-el-celular)
10. [Panel de administrador](#10-panel-de-administrador)
11. [Planes, cobros, vencimientos y pausa automática](#11-planes-cobros-con-mercado-pago-vencimientos-y-pausa-automática)
12. [Medición de vistas y clics en WhatsApp](#12-medición-de-vistas-y-clics-en-whatsapp)
13. [SEO local, velocidad y accesibilidad](#13-seo-local-velocidad-y-accesibilidad)
14. [Plan de lanzamiento por etapas](#14-plan-de-lanzamiento-por-etapas)
15. [Propuestas de nombre](#15-tres-propuestas-de-nombre)
16. [Decisiones del dueño](#16-decisiones-del-dueño-del-portal)

---

## 1. Sitemap

### Parte pública (sin registro)

```
/                                   Inicio
/autos                              Listado con filtros (estado de filtros en la URL)
/autos/0km                          Landing SEO: 0 km en Catamarca
/autos/usados                       Landing SEO: usados en Catamarca
/autos/tipo/[tipo]                  camionetas-pickups · suv · autos · utilitarios
/autos/marca/[marca]                ej. /autos/marca/toyota
/autos/marca/[marca]/[modelo]       ej. /autos/marca/toyota/hilux
/autos/localidad/[localidad]        ej. /autos/localidad/valle-viejo
/auto/[slug]-[codigo]               Ficha: /auto/toyota-hilux-srx-2021-k7m2q
/agencias                           Listado de agencias
/agencia/[slug]                     Catálogo propio de cada agencia
/favoritos                          Favoritos guardados en el teléfono (sin cuenta)
/para-agencias                      Beneficios, planes, preguntas, formulario de contacto
/preguntas-frecuentes
/contacto
/terminos
/privacidad
/consejos-de-compra                 Recomendaciones de compra segura (contenido útil + SEO)
/sitemap.xml · /robots.txt · /manifest.webmanifest
```

"Denunciar aviso" y "Compartir" son ventanas dentro de la ficha, no páginas aparte.

### Panel de agencia (con login)

```
/panel/ingresar                     Login (email + contraseña, o enlace mágico por email)
/panel                              Inicio: resumen del mes y plan vigente
/panel/autos                        Mis autos (lista con filtro por estado)
/panel/autos/nuevo                  Carga de auto (asistente en 4 pasos)
/panel/autos/[id]                   Editar auto + estadísticas de ese auto
/panel/estadisticas                 Estadísticas de la agencia
/panel/catalogo                     Link del catálogo, botón copiar, QR descargable, vista previa
/panel/agencia                      Datos: logo, dirección, horarios, WhatsApp, redes
/panel/plan                         Plan, vencimiento, historial de pagos, botón pagar / mejorar plan
/panel/ayuda                        Guía corta con capturas + WhatsApp del administrador
```

### Panel de administrador (con login)

```
/admin                              Tablero: alertas del día y métricas generales
/admin/agencias                     Lista y estados (pendiente, activa, suspendida)
/admin/agencias/nueva               Alta
/admin/agencias/[id]                Ficha: datos, verificación, plan, pagos, usuarios, stock
/admin/agencias/[id]/autos/nuevo    Carga de stock en nombre de la agencia (carga inicial)
/admin/pagos                        Registro e historial de pagos
/admin/vencimientos                 Por vencer, vencidas, en gracia, suspendidas
/admin/avisos                       Moderación de todos los avisos
/admin/denuncias                    Bandeja de denuncias
/admin/solicitudes                  Agencias interesadas (formulario de "Para agencias")
/admin/metricas                     Métricas del portal
/admin/ajustes                      Planes, marcas y modelos, localidades, textos y datos del portal
```

---

## 2. Arquitectura, stack y costo mensual inicial

### Decisión de stack

| Capa | Elección | Por qué |
|---|---|---|
| Frontend + servidor | **Next.js (App Router) + TypeScript + Tailwind CSS** | Cada ficha y cada catálogo se genera en el servidor: Google los indexa bien y, sobre todo, **WhatsApp e Instagram muestran la vista previa con foto, título y precio** al compartir el link. Con HTML/JS puro renderizado en el navegador esa vista previa no sale, y es el corazón del producto. Es el mismo stack que ya usa este repositorio, así que se reutiliza experiencia y patrones. |
| Base de datos y login | **Supabase** (PostgreSQL, Auth, Row Level Security, `pg_cron`) | Seguridad por fila nativa, login listo, tareas programadas dentro de la base (vencimientos) sin servicios extra. |
| Fotos | **Supabase Storage** (decidido) | Un servicio menos para configurar: login, permisos y fotos en el mismo lugar. Ver límites y plan de crecimiento abajo. |
| Hosting | **Netlify** (plan gratuito) | Ya se usa en este proyecto. **Ojo: el plan gratuito de Vercel (Hobby) no permite uso comercial**, por eso no se recomienda para este portal. |
| DNS | **Cloudflare** (gratis) | DNS del dominio y reenvío de email. |
| Dominio | **.com.ar** en NIC Argentina | Arancel anual (consultar valor vigente). |
| Emails del sistema | **Resend** (plan gratuito) | Recordatorios de vencimiento y avisos a agencias. Volumen muy bajo. |
| Cobros | **Mercado Pago** (suscripciones y links de pago) | Sin costo fijo; comisión por cobro según plazo de acreditación (consultar la vigente). |
| Contacto | Links `wa.me` | Gratis, sin API de WhatsApp Business. |
| PWA | Manifest + service worker propio | Instalable desde el navegador, sin tiendas. |

Por qué React (Next.js) se justifica acá: el panel de carga necesita interacción rica (fotos, reordenar, compresión, borrador automático) y la parte pública necesita renderizado en servidor para SEO y vistas previas. Las páginas públicas se arman con componentes de servidor y mandan muy poco JavaScript al teléfono.

### Diagrama general

```
 Comprador (celular)            Agencia (celular)            Administrador
        │                              │                            │
        ▼                              ▼                            ▼
 ┌──────────────────────── Netlify: Next.js ─────────────────────────┐
 │ Páginas públicas (servidor + caché)  /panel  /admin               │
 │ /api/evento (vistas, clics)  /api/fotos/firmar  /api/mp/webhook   │
 └──────┬───────────────────────────────┬───────────────────┬────────┘
        │                               │                   │
        ▼                               ▼                   ▼
 ┌─────────────── Supabase ──────────────┐                   Mercado Pago
 │ Postgres + RLS · Auth · pg_cron       │   (fotos WebP)    (suscripciones,
 │ (vencimientos, limpieza, resúmenes)   │                    links, webhook)
 └───────────────────────────────────────┘
```

### Fotos en Supabase Storage

- Las fotos se **comprimen y redimensionan en el teléfono antes de subir** (canvas → WebP): una versión grande de 1600 px de ancho (~150–200 KB) y una miniatura de 480 px (~30–40 KB). Al re-codificar se **borran los datos EXIF**, incluida la ubicación GPS de la foto (protección de datos).
- Se suben directo a Supabase Storage, en un bucket de lectura pública con rutas `agencia_id/vehiculo_id/archivo.webp`. Las reglas de seguridad del bucket solo permiten escribir en carpetas de agencias del usuario.
- No se usa la optimización de imágenes del hosting ni la de Supabase (consumen cuota o son pagas): los tamaños ya vienen hechos y se sirven con `srcset`.
- **Límite a vigilar**: ~10 fotos × ~220 KB ≈ 2,2 MB por auto. El plan gratuito de Supabase Storage (1 GB) alcanza para unos 400 autos, y la transferencia mensual gratuita es acotada. Como el plan Pro de agencias no tiene límite de autos, esto se cuida así:
  - Al marcar un auto como vendido, a los 30 días se borran sus fotos salvo la portada.
  - El panel del admin muestra el espacio usado y avisa al llegar al 70 %.
  - Al acercarse al límite se pasa a Supabase Pro (más espacio y transferencia; ver costos), que se paga con el ingreso de una o dos agencias.
- La base guarda solo la ruta de cada foto y todas las URLs salen de una función (`urlFoto(ruta, tamaño)`): si algún día conviene mudarlas a Cloudflare R2 (sin costo de transferencia), se cambia en un solo lugar.

### Costo mensual estimado al inicio

| Servicio | Plan | Costo mensual |
|---|---|---|
| Netlify | Gratuito | US$ 0 |
| Supabase | Gratuito | US$ 0 |
| Cloudflare (DNS, email) | Gratuito | US$ 0 |
| Resend | Gratuito | US$ 0 |
| Mercado Pago | Sin abono | Solo comisión por cobro |
| Dominio .com.ar | NIC Argentina | Arancel anual (prorrateado: muy bajo) |
| **Total** | | **US$ 0 + dominio** |

Cuándo y por qué pagar:

- **Supabase Pro (US$ 25/mes aprox.)**: cuando haya agencias pagando o cuando las fotos se acerquen al límite gratuito. Da más espacio para fotos, copias de seguridad diarias automáticas y evita que el proyecto se pause por inactividad (el plan gratuito pausa proyectos sin uso durante una semana y no incluye backups). Mientras tanto, copia semanal automática con `pg_dump` desde GitHub Actions (como ya se hace en este repositorio).
- **Netlify pago**: solo si el tráfico supera la cuota gratuita; como las fotos se sirven desde Supabase, es poco probable al inicio.
- Email profesional (`contacto@[dominio].com.ar`): reenvío gratis con Cloudflare Email Routing a un Gmail existente.

---

## 3. Modelo de datos

Principio clave: **la visibilidad de un auto se calcula, no se guarda**. Un auto se ve en el portal solo si:

```
vehiculo.estado IN ('publicado','reservado')
AND vehiculo.bloqueado = false            -- moderación
AND agencia.estado = 'activa'             -- al día con el pago
```

Así, la pausa por falta de pago **no toca los autos**: cuando la agencia paga, todo su stock vuelve tal como estaba, al instante, sin procesos masivos ni riesgo de pisar lo que la agencia había pausado a mano.

### Tablas

**`localidades`** — id, nombre, slug, departamento, activa, orden.
Arranca con San Fernando del Valle de Catamarca, Valle Viejo y Fray Mamerto Esquiú; se suman más sin tocar código.

**`marcas`** — id, nombre, slug, logo_permitido (bool).
**`modelos`** — id, marca_id → marcas, nombre, slug, tipo_sugerido.
Lista cerrada administrada por el admin (evita "Toyota", "toyota", "TOYOTA" y mejora filtros y SEO). Si falta un modelo, la agencia lo pide desde el formulario y el admin lo aprueba.

**`planes`** — id, codigo (`basico`, `pro`), nombre, limite_autos, destacados_incluidos, estadisticas_completas (bool), precio_lista_ars, precio_fundador_ars, activo.
Valores iniciales: Básico 5 autos y $ 60.000 por mes; Pro sin límite (`limite_autos` nulo), 12 destacados y $ 80.000 por mes.

**`agencias`**
| Campo | Notas |
|---|---|
| id (uuid), slug (único), nombre | slug para `/agencia/[slug]` |
| logo_ruta, descripcion | logo solo con autorización (`autoriza_marca_at`) |
| direccion, localidad_id, lat, lng | mapa |
| horarios (jsonb) | `{lun:[["09:00","13:00"],["17:00","21:00"]], …}` → "Abierto ahora" |
| whatsapp (formato internacional `549383…`), telefono, email, instagram, facebook, sitio_web | |
| cuit, razon_social | **privados**, nunca se exponen al público |
| estado | `pendiente` · `activa` · `suspendida` (la baja borra la agencia) |
| motivo_suspension | `impaga` · `moderacion` · `pedido_agencia` |
| verificada, verificada_at, verificada_por | insignia "Agencia verificada" |
| plan_id, precio_mensual_ars | precio pactado y congelado (precio fundador) |
| es_fundador, fundador_desde | |
| vigente_hasta (date) | fecha de vencimiento del período pago |
| mp_preapproval_id | suscripción de Mercado Pago si la tiene |
| carga_inicial (`no` · `cobrada` · `bonificada`) | |
| created_at, updated_at | |

**`agencia_usuarios`** — user_id → auth.users, agencia_id → agencias, rol (`titular` · `vendedor`). Permite más de un usuario por agencia sin rehacer nada.

**`administradores`** — user_id → auth.users. Una sola persona hoy; preparado para más.

**`vehiculos`**
| Campo | Notas |
|---|---|
| id (uuid), codigo (corto, único, ej. `k7m2q`), slug | URL estable aunque cambie el precio |
| agencia_id → agencias | |
| categoria | `auto` (hoy) · `moto` (futuro) — crecer sin rehacer |
| tipo | `auto` · `camioneta_pickup` · `suv` · `utilitario` |
| condicion | `0km` · `usado` |
| marca_id, modelo_id, version, anio, km | |
| combustible | `nafta` · `diesel` · `gnc` · `nafta_gnc` · `hibrido` · `electrico` |
| caja | `manual` · `automatica` |
| color, puertas | |
| precio (numeric, null), moneda (`ARS` · `USD`), precio_consultar (bool) | "Consultar precio" |
| acepta_permuta, financiacion (bool) | informado por la agencia |
| papeles_al_dia (bool), documentacion_detalle (texto) | "Informado por la agencia" |
| descripcion | |
| localidad_id | por defecto la de la agencia |
| estado | `borrador` · `publicado` · `reservado` · `pausado` · `vendido` |
| bloqueado, motivo_bloqueo | moderación del admin |
| destacado_hasta (date) | plan Pro (y destacados pagos a futuro) |
| portada_ruta | primera foto, para listados rápidos |
| publicado_at, vendido_at, created_at, updated_at | |
| busqueda (tsvector generado) | marca + modelo + versión, sin acentos |

**`vehiculo_fotos`** — id, vehiculo_id, ruta, orden, ancho, alto. Máximo 12 por auto (validado con trigger).

**`estadisticas_diarias`** — (vehiculo_id, fecha) clave primaria, agencia_id, vistas, clics_whatsapp, compartidos. Contadores agregados por día: muy livianos.

**`estadisticas_agencia_diarias`** — (agencia_id, fecha), vistas_catalogo, clics_whatsapp_catalogo.

**`eventos_vistos`** — huella diaria anónima para no contar dos veces la misma vista (ver punto 12). Se vacía todas las noches.

**`pagos`** — id, agencia_id, monto, moneda, medio (`mercadopago` · `transferencia` · `efectivo` · `bonificado`), mp_payment_id (único, evita duplicados), periodo_desde, periodo_hasta, registrado_por (admin o `webhook`), nota, created_at.

**`denuncias`** — id, vehiculo_id, motivo (`vendido` · `precio_falso` · `fotos_no_corresponden` · `estafa` · `otro`), detalle, contacto (opcional), estado (`nueva` · `revisada` · `descartada` · `accion_tomada`), resuelta_por, created_at.

**`solicitudes_agencia`** — leads del formulario "Para agencias": nombre, agencia, whatsapp, localidad, mensaje, estado.

**`auditoria`** — quién cambió qué en acciones del admin (planes, pagos, bloqueos). Útil ante reclamos.

**`ajustes_portal`** — nombre del portal, WhatsApp del administrador, días de gracia, textos editables.

Favoritos del comprador: **en el teléfono** (localStorage), sin tabla ni registro.

### Relaciones

```
localidades 1─┬─* agencias 1─┬─* agencia_usuarios *─1 auth.users
              │              ├─* vehiculos 1─┬─* vehiculo_fotos
              └─* vehiculos  │               ├─* estadisticas_diarias
                             │               └─* denuncias
planes 1─* agencias          ├─* pagos
marcas 1─* modelos 1─* vehiculos
                             └─* estadisticas_agencia_diarias
```

Índices principales: `vehiculos(estado, agencia_id)`, `(marca_id, modelo_id)`, `(precio, moneda)`, `(anio)`, `(km)`, `(publicado_at desc)`, GIN sobre `busqueda`, trigramas (`pg_trgm`) para tolerar errores de tipeo ("hylux" → Hilux).

---

## 4. Roles, permisos y seguridad en Supabase

### Roles

| Rol | Cómo se identifica | Puede |
|---|---|---|
| Comprador (anónimo) | sin sesión (`anon`) | Leer autos visibles, agencias activas (solo columnas públicas), catálogos. Crear denuncias y solicitudes. Registrar eventos (vía función). |
| Agencia | `auth.uid()` en `agencia_usuarios` | Leer y editar **solo** su agencia, sus autos, sus fotos y sus estadísticas. |
| Administrador | `auth.uid()` en `administradores` | Todo. |
| Servidor | clave `service_role` | Solo en funciones del servidor (webhook de Mercado Pago). **Nunca** llega al navegador. |

### Funciones auxiliares (security definer)

```sql
es_admin()          -- true si auth.uid() está en administradores
mis_agencias()      -- conjunto de agencia_id del usuario actual
```

### Reglas (resumen)

- **`vehiculos`**
  - Público: lectura solo a través de la vista `vehiculos_publicos`, que aplica la regla de visibilidad del punto 3.
  - Agencia: `select/insert/update/delete` donde `agencia_id IN mis_agencias()`.
  - Trigger de validación:
    - no permite cambiar `agencia_id`, `bloqueado`, `destacado_hasta` (salvo si el plan lo incluye y dentro del cupo);
    - **controla el límite del plan**: al pasar a `publicado` o `reservado`, si la agencia ya tiene `limite_autos` en esos estados, rechaza con un mensaje claro ("Llegaste al límite de tu plan").
  - Admin: todo.
- **`vehiculo_fotos`**: misma regla vía el vehículo dueño; máximo 12.
- **`agencias`**
  - Público: vista `agencias_publicas` (sin CUIT, razón social, email ni datos de pago), solo `estado = 'activa'`.
  - Agencia: `update` solo de columnas propias (logo, descripción, dirección, horarios, WhatsApp, redes) con **permisos por columna**: no puede tocar plan, precio, estado, vencimiento ni verificación.
- **`pagos`, `planes`, `auditoria`, `administradores`**: agencia solo lee sus pagos; el resto, solo admin.
- **`estadisticas_*`**: agencia lee las suyas; nadie escribe directo: solo la función `registrar_evento()`.
- **`denuncias` y `solicitudes_agencia`**: el público solo puede insertar (con límite de frecuencia); leer y resolver, solo admin.
- **Fotos (Supabase Storage)**: bucket `vehiculos` de lectura pública; escribir y borrar solo si `(storage.foldername(name))[1]::uuid IN mis_agencias()` o `es_admin()`.
- **Logos**: misma lógica.

### Otras medidas

- Pruebas automáticas de seguridad: un usuario de la agencia A intenta leer, editar y borrar autos de la agencia B → debe fallar siempre. Se corren antes de cada publicación.
- Login con email y contraseña o enlace mágico; recuperación de clave por email. El admin da de alta a la agencia e **invita** al titular: no hay registro abierto.
- Protección de datos personales (Ley 25.326): el portal casi no guarda datos de compradores (no hay registro ni chat). Política de privacidad clara; inscripción de las bases ante la AAIP a revisar con un asesor legal.

---

## 5. Home, sección por sección

Orden pensado para celular (de arriba hacia abajo):

1. **Encabezado fijo**: logo `[NOMBRE DEL PORTAL]`, ícono de favoritos con contador, menú (Inicio · Autos · Agencias · Para agencias · Contacto). En escritorio, el menú se ve completo.
2. **Hero con buscador**: título corto ("Autos de agencias de Catamarca, en un solo lugar"), campo grande "Buscá marca o modelo" con sugerencias mientras se escribe (Hilux, Cronos, Amarok…) y botón Buscar. Debajo, una línea de confianza: "Solo agencias verificadas · Consultás directo por WhatsApp · Sin registrarte".
3. **Accesos rápidos por tipo**: 4 tarjetas grandes con ícono — Autos · Camionetas/Pick-ups · SUV · 0 km — con la cantidad disponible de cada una.
4. **Destacados** (si hay): carrusel horizontal deslizable con la etiqueta "Destacado".
5. **Recién publicados**: 8–12 tarjetas en grilla (1 columna en celular chico, 2 en celular grande, 4 en escritorio) + "Ver todos los autos".
6. **Buscar por precio** (opcional, si hay volumen): chips de rangos en pesos y en dólares que llevan al listado filtrado.
7. **Marcas más buscadas**: chips de texto (sin logos de marcas de fábrica, para no usar marcas sin autorización).
8. **Agencias del portal**: fila deslizable de logos (solo agencias que autorizaron su logo; si no, iniciales con color) con nombre, localidad y cantidad de autos → catálogo.
9. **Cómo funciona** (3 pasos): Buscá → Mirá fotos y datos → Consultá por WhatsApp directo con la agencia.
10. **Banner para agencias**: "¿Tenés una agencia? Publicá tu stock" + botón → `/para-agencias`.
11. **Pie**: localidades, links a páginas legales, consejos de compra, contacto, "Instalá la app" (aparece solo si el navegador lo permite).

---

## 6. Listado y sistema de filtros

### Diseño en celular

- Barra superior fija: buscador + botón **Filtros (n)** + selector **Ordenar**.
- Filtros activos como chips debajo ("Toyota ✕", "Hasta USD 20.000 ✕", "Diésel ✕") + "Limpiar".
- Resultados: "37 autos en Catamarca".
- El botón Filtros abre un **panel desde abajo** a pantalla completa con botón fijo **"Ver 37 autos"** que actualiza el número en vivo.
- En escritorio: filtros en columna izquierda, resultados a la derecha.

### Tarjeta de auto

Foto 4:3 (miniatura WebP) · etiqueta (0 km / Destacado / Reservado) · corazón de favorito · **precio grande** (o "Consultar precio") · Marca Modelo · Versión · `2021 · 45.000 km · Diésel · Manual` · localidad · nombre de la agencia con tilde de verificada. Toda la tarjeta es tocable; el corazón no abre la ficha.

### Filtros

| Filtro | Control | Notas |
|---|---|---|
| Búsqueda libre | texto | marca, modelo, versión; tolera errores |
| Tipo | chips | auto, camioneta/pick-up, SUV, utilitario |
| Condición | chips | 0 km / usado |
| Marca | lista con buscador y cantidades | |
| Modelo | lista dependiente de la marca | |
| Moneda | ARS / USD | **requerida para filtrar por precio** |
| Precio | desde–hasta | en la moneda elegida; no se convierte entre monedas (no se inventa cotización) |
| Año | desde–hasta | |
| Kilómetros | hasta (rangos sugeridos) | |
| Combustible | chips múltiples | |
| Caja | chips | |
| Localidad | chips múltiples | |
| Agencia | lista | útil y casi gratis |
| Extras | casillas | acepta permuta, financiación, papeles al día |

Reglas:
- Los autos con "Consultar precio" **no aparecen** cuando hay filtro de precio, y sí aparecen sin él.
- Cada opción muestra cuántos autos hay; las opciones en cero se atenúan.
- **Todo el estado vive en la URL** (`/autos?marca=toyota&tipo=camioneta_pickup&moneda=USD&precio_max=25000`): se puede compartir por WhatsApp, el botón Atrás funciona y se puede guardar.

### Orden

Más recientes (por defecto) · Menor precio · Mayor precio · Menos kilómetros · Más nuevos (año). En los órdenes por precio se pide una moneda y "Consultar precio" va al final.

### Paginación

24 por página con botón **"Ver más autos"** (no scroll infinito: mejor para el pie de página, accesibilidad y Google). Cada página tiene su URL (`?pagina=2`).

---

## 7. Ficha del auto

Orden en celular:

1. **Galería**: foto a todo el ancho, deslizable con el dedo, contador "3/12", miniaturas debajo, pantalla completa con zoom al tocar. Etiqueta "Reservado" o "Vendido" sobre la foto si corresponde.
2. **Título**: Marca Modelo · Versión. Debajo, **precio grande** con su moneda (`USD 32.000` / `$ 28.500.000`) o "Consultar precio".
3. **Datos clave en fichas**: Año · Km · Combustible · Caja · Color · Localidad.
4. **Documentación**: "Papeles al día ✓" + detalle, con la leyenda "Informado por la agencia".
5. **Más datos**: tipo, condición, puertas, acepta permuta, financiación.
6. **Descripción** de la agencia (con "Ver más" si es larga).
7. **Tarjeta de la agencia**: logo, nombre, "Agencia verificada", localidad, horario de hoy ("Abierto ahora"), botón "Ver los N autos de esta agencia".
8. **Consejos de compra segura** (desplegable): ver el auto en persona, verificar documentación, no hacer señas sin ver el vehículo.
9. **Autos similares**: misma marca/modelo o tipo y rango de precio. Si el comprador llegó desde el catálogo de una agencia, primero "Más autos de esta agencia".
10. **Denunciar este aviso** (link discreto) → ventana con motivo, detalle y contacto opcional.

**Barra fija abajo** (siempre visible en celular): **[Consultar por WhatsApp]** (verde, grande, ocupa la mayor parte) · [Compartir] · [♡].

### Mensaje prearmado de WhatsApp

```
Hola [Agencia], vi en [NOMBRE DEL PORTAL] el Toyota Hilux SRX 2021
(45.000 km, USD 32.000) y quería consultar si sigue disponible.
https://[dominio].com.ar/auto/toyota-hilux-srx-2021-k7m2q
```

Se abre con `https://wa.me/549383XXXXXXX?text=…` (funciona en la app y en WhatsApp Web). Si el auto está reservado, el botón dice "Consultar igual".

### Compartir

Botón nativo del teléfono (`navigator.share`) con copia de link como respaldo. El link muestra en WhatsApp **una vista previa generada** con la foto de portada, marca, modelo, año y precio.

### Estados especiales

- **Vendido**: la página sigue viva 30 días con la etiqueta "Vendido" y autos similares (los links compartidos no quedan rotos), sin botón de WhatsApp; después deja de indexarse.
- **Pausado o agencia suspendida**: "Este aviso no está disponible" + similares.

---

## 8. Catálogo de agencia

URL amigable: `/agencia/[slug]` (ej. `/agencia/automotores-del-valle`). Es la página que la agencia pone en la bio de Instagram y manda por WhatsApp, así que tiene que verse **como suya**.

1. **Portada**: logo, nombre, "Agencia verificada", localidad, "N autos disponibles".
2. **Botones**: WhatsApp (mensaje: "Hola, vi su catálogo en [NOMBRE DEL PORTAL]…") · Cómo llegar (abre Google Maps) · Compartir catálogo.
3. **Datos**: dirección, horarios de la semana con "Abierto ahora / Cerrado", redes.
4. **Stock**: grilla de tarjetas con filtros simples (tipo, marca, precio, condición) y orden. Reservados al final.
5. **Mapa**: se carga solo al tocar "Ver mapa" (OpenStreetMap, sin clave ni costo) para no frenar la página.
6. **Pie** con "Catálogo en [NOMBRE DEL PORTAL]" → link al portal.

Decisiones de producto que lo hacen vendible:
- **Sin autos de otras agencias en el catálogo**: es la vidriera exclusiva de la agencia.
- Vista previa de WhatsApp propia: logo + nombre + "N autos disponibles".
- **QR descargable** desde el panel para imprimir y pegar en la agencia o en los autos ("Escaneá y mirá todo nuestro stock").

### Listado de agencias (`/agencias`)

Tarjetas con logo, nombre, localidad, cantidad de autos y "Abierto ahora"; filtro por localidad.

---

## 9. Panel de agencia y flujo de carga desde el celular

### Inicio del panel

- Saludo + **plan vigente** ("Plan Pro · vence el 15/11") con aviso amarillo desde 7 días antes y botón "Renovar".
- **Cuatro números grandes del mes**: autos publicados (`12 de 20`), vistas, clics en WhatsApp, veces compartido. Comparación con el mes anterior (↑ 18 %).
- Botón principal fijo: **＋ Cargar auto**.
- "Tus autos más vistos" (top 3) y "Autos sin consultas hace 15 días" (sugerencia: actualizar fotos o precio).
- Botón **Copiar link de mi catálogo** + Compartir por WhatsApp + Descargar QR.

### Mis autos

Lista con foto, título, precio, estado (chip de color + texto) y vistas/clics del mes. Filtro por estado. Acciones rápidas desde cada fila sin entrar a editar: **Marcar reservado · Pausar · Marcar vendido · Editar · Duplicar**.

### Estados del auto

| Estado | Se ve en el portal | Cuenta para el límite |
|---|---|---|
| Borrador | No | No |
| Publicado | Sí | Sí |
| Reservado | Sí, con etiqueta | Sí |
| Pausado | No | No |
| Vendido | Página "Vendido" 30 días | No |

### Flujo de carga (objetivo: menos de 3 minutos)

Asistente de 4 pasos con barra de progreso, botones grandes y el borrador guardado automáticamente (si se corta la conexión o entra una llamada, no se pierde nada).

**Paso 1 — Fotos**
- "Elegir fotos" abre la galería del teléfono (o la cámara) con selección múltiple, hasta 12.
- Cada foto se comprime y redimensiona en el teléfono y **se sube en segundo plano** mientras la agencia sigue con los pasos siguientes.
- Reordenar arrastrando; la primera es la portada (se puede cambiar con "Usar de portada").
- Guía corta: "Frente, lateral, trasera, interior, tablero con km, motor".

**Paso 2 — El auto**
- Condición y tipo: chips grandes.
- Marca: buscador con las más usadas arriba. Modelo: lista filtrada por la marca.
- Versión: texto con sugerencias de versiones ya cargadas para ese modelo.
- Año: selector. Km: teclado numérico con separador de miles automático.
- Combustible, caja y color: chips de un toque.

**Paso 3 — Precio y detalles**
- Moneda: interruptor `$ ARS | US$ USD`. Precio con teclado numérico. O interruptor "Consultar precio".
- Papeles al día (sí/no) + detalle opcional.
- Acepta permuta / Financiación.
- Descripción (opcional) con frases sugeridas tocables ("Único dueño", "Service oficial", "Cubiertas nuevas").

**Paso 4 — Revisar y publicar**
- Vista previa de la tarjeta y de la ficha como la verá el comprador.
- **[Publicar]** o **[Guardar borrador]**.
- Al publicar: "¡Listo! Tu auto ya está en el portal" + Compartir por WhatsApp / Copiar link / Cargar otro.

Atajos: **Duplicar** (para 0 km parecidos o versiones), validaciones amables en el momento ("¿45.000.000 km? Revisá el kilometraje").

Si la agencia llegó al límite del plan, "Publicar" se reemplaza por "Guardar borrador" + aviso "Llegaste a los N autos de tu plan. Pausá o marcá vendido otro auto, o pasate a Pro".

### Estadísticas

- **Plan Básico**: por cada auto, vistas y clics en WhatsApp del mes actual; totales de la agencia.
- **Plan Pro**: histórico, gráfico por día, comparación con el mes anterior, tasa de consulta (clics / vistas), ranking de autos, días publicado, visitas al catálogo y de dónde vienen (WhatsApp, Instagram, Google, directo), exportar a planilla.
- **Resumen mensual** automático (email + pantalla de inicio): "En octubre tus autos tuvieron 1.240 vistas y 86 consultas por WhatsApp". Es el argumento de renovación.

### Datos de la agencia

Logo (con recorte cuadrado), descripción, dirección (y punto en el mapa), horarios por día con copiar a todos los días, WhatsApp (con botón "Probar" que abre un chat de prueba), redes.

---

## 10. Panel de administrador

### Tablero (lo primero que ve cada mañana)

- **Para hacer hoy**: agencias que vencen en ≤ 7 días, vencidas en gracia, suspendidas, denuncias nuevas, solicitudes de agencias nuevas, modelos pedidos por agencias.
- **Números**: agencias activas por plan, ingreso mensual esperado (suma de `precio_mensual_ars` de las activas), autos publicados, vistas y clics del mes en todo el portal.

### Agencias

- Lista con filtros por estado y plan; búsqueda por nombre.
- **Alta**: datos básicos → plan → precio pactado → ¿fundador? → vigencia inicial → **invitar al titular por email**.
- **Verificación**: CUIT validado (constancia de inscripción de ARCA) → marca "Agencia verificada". Por separado, y sin afectar la verificación, se registra la autorización para usar su logo y sus fotos.
- Ficha de la agencia con pestañas: Datos · Plan y pagos · Usuarios · Autos · Estadísticas.
- **Cargar stock en su nombre** (para la carga inicial): mismo asistente que usa la agencia, con la agencia elegida.
- **Baja**: se **borran automáticamente** la agencia, sus autos, fotos, estadísticas y usuarios. Como no se puede deshacer, el admin confirma escribiendo el nombre de la agencia. Se conserva solo el historial de pagos (monto, fecha, nombre y CUIT), porque es un registro contable.

### Pagos

- **Registrar pago** (transferencia, efectivo, bonificado): agencia, monto, fecha, nota → extiende el vencimiento automáticamente y reactiva si estaba suspendida.
- Los pagos de Mercado Pago entran solos por webhook y aparecen en la misma lista.

### Vencimientos

Columnas: por vencer (7 días) · vencidas en gracia · suspendidas. En cada una, botón **"Avisar por WhatsApp"** que abre el chat con el mensaje de recordatorio ya escrito (sin API paga de WhatsApp).

### Moderación de avisos

Todos los avisos con filtros (agencia, estado, denunciados, sin fotos, precio sospechoso). Acciones: **Bloquear con motivo** (la agencia lo ve en su panel) · Desbloquear. Bloquear no borra.

### Denuncias

Bandeja con el aviso, el motivo y el detalle. Acciones: Descartar · Bloquear aviso · Contactar a la agencia (WhatsApp con mensaje prearmado).

### Métricas del portal

Visitas y clics totales por día, autos publicados, agencias por plan, búsquedas más hechas (para saber qué piden los compradores: también argumento de venta), búsquedas sin resultados.

### Ajustes

Planes y precios, marcas/modelos, localidades, días de gracia, WhatsApp y textos del portal.

---

## 11. Planes, cobros con Mercado Pago, vencimientos y pausa automática

### Planes

| | Básico | Pro |
|---|---|---|
| Autos publicados | Hasta 5 | Sin límite |
| Catálogo propio + QR | Sí | Sí |
| Estadísticas | Vistas y clics del mes | Completas (histórico, fuentes, exportar) |
| Autos destacados | No | 12 incluidos |
| Precio mensual | $ 60.000 | $ 80.000 |
| Precio fundador | $ 60.000, congelado | $ 80.000, congelado |
| Carga inicial del stock | Bonificada | Bonificada |

El precio se guarda **en cada agencia** (`precio_mensual_ars`), no solo en el plan: así el precio fundador queda congelado aunque más adelante suban los precios de lista. Hoy el precio fundador es igual al de lista: el beneficio de ser fundador es que **ese precio no aumenta** mientras la agencia siga suscripta.

### Cobro en dos niveles (simple primero, automático después)

**Nivel 1 — lanzamiento (sin desarrollo de pagos):**
- Link de pago de Mercado Pago por el monto de cada agencia, o transferencia.
- El admin registra el pago en un toque ("Registrar pago") → el sistema extiende el vencimiento y reactiva.

**Nivel 2 — suscripción automática (etapa 2):**
1. Desde `/panel/plan` la agencia toca "Activar débito automático".
2. El servidor crea una **suscripción de Mercado Pago** (preapproval) con el monto de esa agencia y `external_reference = agencia_id`, y redirige a Mercado Pago para que la agencia la autorice con su tarjeta o cuenta.
3. Cada mes Mercado Pago cobra solo y avisa a `/api/mp/webhook`.
4. El webhook **no confía en el mensaje recibido**: consulta el pago a la API de Mercado Pago, verifica la firma, y si está aprobado inserta en `pagos` (el `mp_payment_id` único evita duplicados) y extiende `vigente_hasta` un mes desde el vencimiento anterior (o desde hoy, si estaba vencida).
5. Si el cobro falla, Mercado Pago reintenta; la agencia ve el aviso en su panel.

Las transferencias siguen disponibles siempre (muchas agencias las prefieren).

### Vencimientos y pausa automática

Tarea diaria con `pg_cron` dentro de Supabase (03:00, hora de Argentina):

| Momento | Acción |
|---|---|
| 7 días antes | Email a la agencia + aviso en su panel + aparece en "Por vencer" del admin |
| 2 días antes | Segundo email |
| Día del vencimiento | Email "Tu plan venció, tenés 5 días para renovar" |
| Vencimiento + gracia | `agencias.estado = 'suspendida'`, motivo `impaga` → **su stock deja de verse al instante** (regla de visibilidad). La agencia sigue entrando al panel, ve sus autos y estadísticas y el botón de pagar. |
| Al pagar (webhook o registro manual) | Trigger: `estado = 'activa'` → **todo vuelve a publicarse tal como estaba** |

Los catálogos de agencias suspendidas muestran "Catálogo no disponible temporalmente" (sin exponer el motivo).

### Cambios de plan

- **Subir a Pro**: el cambio (y el nuevo precio) corre **desde el próximo pago**. Hasta entonces sigue con las condiciones de Básico.
- **Bajar a Básico** con más de 5 autos publicados o reservados: antes del cambio, el panel le pide a la agencia **que elija los 5 que quedan**; el resto pasa a pausado (no se borra). Si llega la fecha sin haber elegido, la agencia ve esa pantalla al entrar y no puede publicar nada nuevo hasta resolverlo.

### Precio fundador

Se marca `es_fundador` y se congela el precio. **Un atraso no hace perder el precio fundador**: con ponerse al día, lo conserva. Queda escrito en las condiciones para agencias. Solo se pierde si la agencia se da de baja (sus datos se borran, ver punto 10).

---

## 12. Medición de vistas y clics en WhatsApp

Sin Google Analytics ni servicios externos: todo queda en Supabase y es lo que ve la agencia.

### Qué se mide

| Evento | Cuándo |
|---|---|
| `vista` | Se abre la ficha de un auto (en el navegador, después de cargar) |
| `whatsapp` | Toque en "Consultar por WhatsApp" (ficha, tarjeta o catálogo) |
| `compartir` | Toque en Compartir |
| `vista_catalogo` | Se abre el catálogo de la agencia |

### Cómo

1. El navegador envía el evento con `navigator.sendBeacon('/api/evento', …)`: no se pierde aunque la página se cierre al abrir WhatsApp.
2. `/api/evento` llama a la función `registrar_evento(vehiculo_id, tipo, huella)` en Supabase, que hace un `insert … on conflict do update set vistas = vistas + 1` sobre `estadisticas_diarias`. Una fila por auto por día: liviano y rápido.
3. **Sin inflar números** (las agencias tienen que creerle a la estadística):
   - Se cuenta desde JavaScript del navegador: la mayoría de los robots no lo ejecuta, y se descartan los que se identifican como tal.
   - **Huella diaria anónima**: hash con sal diaria de IP + navegador + auto + tipo, guardado en `eventos_vistos` con clave única; si ya existe hoy, no suma. Se borra cada noche. No se guarda la IP real.
   - No se cuentan las visitas de la propia agencia (el panel marca ese teléfono).
4. **Fuentes** (plan Pro): los links que comparte el portal y el panel llevan `?ref=whatsapp`, `?ref=instagram`, etc.; además se lee el sitio de origen. Se agregan por día.
5. Para el SEO se usa Google Search Console (gratis).

Importante para la venta: el portal mide **intenciones de contacto** (clics en WhatsApp), no ventas, porque la venta ocurre afuera. Así se debe comunicar a las agencias.

---

## 13. SEO local, velocidad y accesibilidad

### SEO local (Catamarca)

- Páginas generadas en el servidor y cacheadas; se actualizan solas cuando la agencia edita un auto.
- Títulos con patrón local:
  - Ficha: "Toyota Hilux SRX 2021 usada en Catamarca · USD 32.000 | [NOMBRE DEL PORTAL]"
  - Landings: "Camionetas usadas en Catamarca", "Autos 0 km en Catamarca", "Autos usados en Valle Viejo", "Toyota Hilux usadas en Catamarca".
- Landings por tipo, marca, modelo y localidad **solo si tienen al menos 3 autos** (evita páginas vacías); el resto con `noindex, follow`. Combinaciones arbitrarias de filtros: `noindex` y `canonical` a la landing más cercana.
- Datos estructurados (JSON-LD): `Car` + `Offer` (precio, moneda, disponibilidad) en fichas; `AutoDealer` con dirección y horarios en catálogos; `ItemList` en listados; `BreadcrumbList`; `Organization` en el portal.
- `sitemap.xml` dinámico (fichas, agencias, landings) y `robots.txt`.
- Ficha de Google Business del portal; las agencias ponen el link de su catálogo en Instagram y en su ficha de Google (enlaces locales de calidad).
- Contenido útil: "Consejos para comprar un usado en Catamarca", "Qué papeles pedir al comprar un auto" → tráfico de Google y confianza.
- Idioma `es-AR`, URLs en español, sin acentos.

### Velocidad (objetivo: carga rápida con 4G en un Android de gama media)

- Metas: LCP < 2,5 s, CLS < 0,1, INP < 200 ms; menos de ~150 KB de JavaScript en páginas públicas.
- Fotos WebP en dos tamaños con `srcset`, carga diferida salvo la primera, proporción fija (no saltan al cargar).
- Componentes de servidor: la parte pública manda casi nada de JS; los filtros y la galería son las únicas islas interactivas.
- Tipografía del sistema o una sola fuente variable alojada en el propio sitio.
- Mapa solo al tocar. Sin widgets de terceros.
- PWA: el service worker guarda la estructura del sitio y los últimos autos vistos; los favoritos funcionan sin conexión.

### Accesibilidad (WCAG 2.2 nivel AA)

- Contraste suficiente, botones de al menos 44 × 44 px, campos con texto de 16 px (evita el zoom en iPhone).
- Todo usable con teclado y lector de pantalla: etiquetas en campos, foco visible, panel de filtros y galería con manejo correcto del foco y tecla Escape.
- Texto alternativo automático en fotos ("Foto 3 de 12 de Toyota Hilux SRX 2021").
- Estados con texto y no solo color ("Reservado", no solo un punto naranja).
- Respeta "reducir movimiento" del sistema.

### Protección de datos

- No se pide registro al comprador; favoritos en el teléfono.
- Denuncias con contacto opcional.
- Se borran los datos de ubicación de las fotos al subirlas.
- Sugerencia a las agencias: tapar la patente en las fotos (opcional).
- Política de privacidad y términos claros: el portal es una vidriera, no interviene en la venta ni procesa pagos de autos; la información de cada aviso la informa la agencia.

---

## 14. Plan de lanzamiento por etapas

### Etapa 0 — Demo vendible (para las primeras reuniones)

Lo mínimo para mostrar en 10 minutos desde el celular:
- Home, listado con filtros, ficha con WhatsApp y compartir, catálogo de agencia.
- Panel de agencia: carga de auto desde el celular, mis autos, inicio con números.
- Agencias y autos de prueba ficticios, claramente marcados como DEMO (todavía no hay agencias), con fotos de stock de uso libre o ilustraciones, nunca de agencias reales.

**Guion de demo (10 minutos):**
1. (2 min) El comprador: buscar "Hilux", filtrar, abrir ficha, tocar WhatsApp → llega el mensaje con el auto y el link.
2. (3 min) La agencia: cargar un auto en vivo desde su propio celular, con sus fotos.
3. (2 min) Su catálogo: el link para la bio de Instagram, la vista previa en WhatsApp, el QR.
4. (2 min) Estadísticas: "esto es lo que vas a ver cada mes".
5. (1 min) Plan fundador y cómo se paga.

### Etapa 1 — MVP (lanzamiento con las agencias fundadoras)

- **Público**: todo lo de la demo + listado de agencias, Para agencias, preguntas frecuentes, términos, privacidad, contacto, favoritos, denunciar, autos similares, consejos de compra.
- **Agencia**: carga y edición, estados, límite por plan, estadísticas básicas por auto, copiar link y QR, datos de la agencia, ver plan y vencimiento.
- **Admin**: alta, verificación y baja de agencias, invitación de usuarios, carga de stock en nombre de la agencia, planes, **registro manual de pagos**, vencimientos con **pausa y reactivación automáticas**, moderación, denuncias, solicitudes, métricas básicas.
- **Técnico**: seguridad por fila con pruebas, medición de eventos, SEO completo, PWA instalable, copias de seguridad semanales, emails de vencimiento.
- **Cobro**: links de pago de Mercado Pago + transferencias.

### Etapa 2 — Automatización y valor Pro (primeros meses)

- Suscripción automática de Mercado Pago con webhook.
- Estadísticas Pro completas, resumen mensual por email, exportar.
- Destacados incluidos en el plan Pro.
- Varios usuarios por agencia (vendedores).
- Búsquedas sin resultados como información para el admin.
- Pasar a Supabase Pro cuando haya ingresos.

### Etapa 3 — Crecimiento

- Destacados pagos y otros servicios.
- Más localidades de la provincia.
- Motos y otros vehículos (`categoria`).
- Alertas de búsqueda para compradores ("avisame cuando entre una Hilux").
- Calculadora de financiación, comparador, historial de precio.

---

## 15. Tres propuestas de nombre

> **Elegido por el dueño: CarVidriera.** Ver la nota sobre el dominio en la sección 16. En el código el nombre sale de un único archivo de configuración, así que cambiarlo es inmediato.

> Antes de elegir: verificar dominio `.com.ar` en NIC Argentina, usuario de Instagram libre y que no haya una marca registrada igual o parecida en el INPI.

1. **AutoValle** — Corto, fácil de decir y de escribir en un mensaje. "Valle" conecta con San Fernando del Valle, Valle Viejo y el Valle Central, la zona de lanzamiento, y le da identidad local sin quedar atado a una sola ciudad. Suena a marca, no a clasificado.

2. **Catamarca Autos** — El nombre más directo: dice qué es y dónde en dos palabras. Máxima ventaja para la búsqueda local ("autos Catamarca") y transmite seriedad e institucionalidad, ideal para que una agencia sienta que está en "el" portal de la provincia. Contra: es más genérico y cuesta más diferenciarlo como marca.

3. **Vidriera Motor** — Describe exactamente el modelo de negocio (una vidriera de agencias, no un sitio de particulares) y "Motor" deja lugar a sumar motos y otros vehículos sin cambiar de nombre. No depende de una localidad, así que acompaña la expansión. Requiere apoyarse en la bajada "Autos de agencias de Catamarca" para el SEO local.

---

## 16. Decisiones del dueño del portal

### Tomadas

| Tema | Decisión |
|---|---|
| Planificación | Aprobada |
| Repositorio | Nuevo, separado de la tienda |
| Fotos | Supabase Storage |
| Estilo visual | A elección del diseño, priorizando lo que más vende (ver dirección visual abajo) |
| Demo | Con datos ficticios marcados DEMO |
| Plan Básico | 5 autos · $ 60.000 por mes |
| Plan Pro | Sin límite de autos · 12 destacados · $ 80.000 por mes |
| Precio fundador | Igual al de lista y congelado; un atraso no lo hace perder |
| Carga inicial del stock | Bonificada en los dos planes |
| Días de gracia | 5 |
| Subir de plan | Desde el próximo pago |
| Bajar de plan con autos de más | La agencia elige cuáles quedan |
| Baja de una agencia | Sus datos se borran automáticamente (se conservan solo los registros de pago) |
| Nombre | CarVidriera |
| Verificación de agencias | CUIT |
| Términos y privacidad | Borrador en [`LEGALES-BORRADOR.md`](LEGALES-BORRADOR.md) |

### Dirección visual (propuesta)

- **Azul profundo** como color de marca: es el que más se asocia a confianza y seriedad, y es el que usan bancos y los portales de autos más grandes. Fondo blanco y grises suaves para que las fotos de los autos sean las protagonistas.
- **Verde WhatsApp** reservado solo para el botón de consulta: así el comprador lo encuentra sin buscar y la acción principal se destaca en toda la página.
- **Ámbar** solo para "Destacado" y avisos de vencimiento.
- Tipografía sans serif moderna, precios grandes y en negrita.

### Abiertas

| Tema | Por qué importa |
|---|---|
| **Dominio**: `carvidriera.cat` no es viable | `.cat` es el dominio de la comunidad de lengua y cultura catalana (España) y exige contenido vinculado a ella. Propuesta: `carvidriera.com.ar` (confianza local y mejor posicionamiento en Argentina). Verificar disponibilidad en NIC Argentina y en Instagram, y que no haya una marca parecida en el INPI. |
| Cupo de agencias fundadoras | ¿Las primeras N agencias o las que se sumen hasta una fecha? |
| Precios con o sin IVA | Depende de tu situación fiscal (monotributo o responsable inscripto); tiene que figurar en las condiciones. |
| Datos de contacto del portal | Número de WhatsApp, email y localidad o dirección que se publican en el sitio. |
| Responsable legal | Nombre o razón social, CUIT y domicilio que figuran en términos y privacidad. |

---

Una vez aprobada esta planificación, el siguiente paso propuesto es el **diseño visual** (paleta, tipografía, tarjeta de auto, ficha y panel de carga en celular) y luego la implementación por etapas, empezando por la Etapa 0.

Recomendación técnica: implementar el portal en **un repositorio propio** (es un producto distinto de la tienda), reutilizando de este proyecto los patrones ya probados: configuración de Netlify, conexión a Supabase, SEO (sitemap, robots, datos estructurados), consulta por WhatsApp y copias de seguridad.
