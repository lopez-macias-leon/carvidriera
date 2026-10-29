# CarVidriera — Versión 2: particulares, concesionarias y mecánicos

Este documento **reemplaza** lo que [PROPUESTA.md](PROPUESTA.md) dice sobre a quién apunta el portal y cómo gana plata.
El resto de la propuesta (stack, seguridad por fila, SEO, medición de vistas, pausa automática) sigue vigente.

Convenciones: lo que está entre corchetes (`[PRECIO DESTACADO]`…) es un marcador. **Decisión pendiente** marca lo que falta definir.

---

## 1. Qué cambia

| | Versión 1 | Versión 2 |
|---|---|---|
| Quién publica autos | Solo agencias | **Agencias y particulares** |
| Costo para particulares | — | **Gratis**, con mejoras pagas |
| Tope por particular | — | **2 autos publicados a la vez** |
| Concesionarias | Todo el portal | **Apartado propio** dentro del portal |
| Mecánicos | — | **Apartado nuevo** con talleres de Catamarca |
| Fuentes de ingreso | 1 (suscripción de agencias) | **3** (agencias, mejoras de particulares, talleres) |

Por qué conviene: hay pocas agencias en la provincia. Los particulares llenan el portal de autos, eso atrae compradores, y los compradores son lo que las agencias y los talleres pagan por alcanzar.

---

## 2. Los cuatro públicos

| Público | Qué hace | Paga |
|---|---|---|
| **Comprador** | Busca, filtra, guarda favoritos y consulta por WhatsApp. Sin registro. | No |
| **Particular** | Publica hasta 2 autos propios desde el celular. | No, salvo mejoras opcionales |
| **Concesionaria / agencia** | Publica su stock, tiene catálogo propio y estadísticas. | Suscripción mensual |
| **Mecánico / taller** | Aparece en el apartado de mecánicos y recibe consultas por WhatsApp. | Suscripción mensual |

---

## 3. Particulares

### Reglas

- **Registro simple:** email (enlace mágico, sin contraseña) y WhatsApp obligatorio.
- **Tope de 2 autos** publicados o reservados a la vez. Lo controla la base de datos, no solo el formulario.
- **Duración del aviso:** 60 días, y se renueva con un toque. Así no quedan avisos de autos ya vendidos. *(Propuesta: decisión pendiente.)*
- **Hasta 8 fotos** gratis; 12 con "Aviso completo".
- **Anti agencias encubiertas** *(propuesta, decisión pendiente)*: un mismo teléfono o email no puede publicar más de `[N]` autos en 12 meses. Pasado ese número, se le ofrece el plan de agencia.
- En la ficha y en la tarjeta se indica **"Particular"**, para que el comprador sepa con quién habla.

### Mejoras pagas (pago único con Mercado Pago)

| Mejora | Qué hace | Precio |
|---|---|---|
| **Destacado 7 días** | Arriba del listado y en la portada, con la etiqueta "Destacado" | `[PRECIO DESTACADO]` |
| **Subir al principio** | El aviso vuelve a "Recién publicados" | `[PRECIO SUBIR]` |
| **Aviso completo** | 12 fotos y 90 días publicado | `[PRECIO COMPLETO]` |

Referencia sugerida para probar: cada mejora entre el 10 % y el 15 % del plan Básico de agencias (hoy entre $ 6.000 y $ 9.000). **Decisión pendiente.**

### Seguridad contra estafas

Los particulares traen más riesgo de avisos falsos que las agencias. Medidas:

1. WhatsApp obligatorio y visible solo a través del botón de consulta.
2. **Verificación del teléfono por SMS** con código al publicar el primer auto. Tiene un costo por mensaje (proveedor de SMS de Supabase Auth). **Decisión pendiente:** desde el lanzamiento o cuando aparezcan avisos falsos.
3. Tope de 2 autos y duración de 60 días.
4. Botón "Denunciar" visible; con `[N]` denuncias el aviso se pausa solo hasta que el admin lo revise.
5. Consejos de compra segura en cada ficha de particular.
6. Pagar una mejora deja a la persona identificada por Mercado Pago.

### Panel del particular (`/mi-cuenta`)

Más simple que el de agencias:
- **Mis avisos** (hasta 2): estado, vistas y consultas, renovar, marcar vendido, editar.
- **Publicar auto:** el mismo asistente de 4 pasos que usan las agencias.
- **Destacar:** elige la mejora, paga con Mercado Pago y se activa sola.

---

## 4. Apartado de concesionarias

- Nueva sección **`/concesionarias`** (reemplaza a `/agencias`): agencias verificadas, sus catálogos y acceso directo a los 0 km.
- **`/para-concesionarias`** (reemplaza a `/para-agencias`): planes y beneficios.
- En el listado de autos, filtro **Vendedor: Concesionarias / Particulares**.

### Qué las diferencia de un particular (para que sigan pagando)

| | Particular | Concesionaria |
|---|---|---|
| Autos | Hasta 2 | 5 (Básico) o ilimitados (Pro) |
| Insignia | "Particular" | "Concesionaria verificada" |
| Catálogo propio con link y QR | No | Sí |
| Estadísticas | Vistas y consultas de sus avisos | Completas (Pro) |
| Destacados | Pagos, de a uno | 12 incluidos (Pro) |
| Duración del aviso | 60 días | Mientras esté al día |

Los planes de agencias no cambian: Básico $ 60.000 y Pro $ 80.000 por mes, con precio fundador y carga inicial bonificada.

---

## 5. Apartado de mecánicos

### Para el comprador

- Sección **`/mecanicos`**: talleres de Catamarca con filtros por **especialidad** y **localidad**.
- Especialidades: mecánica general, electricidad, chapa y pintura, gomería, tren delantero, aire acondicionado, diésel, inyección, service, **revisión precompra**.
- Ficha del taller **`/mecanico/[slug]`**: especialidades, dirección, horarios con "Abierto ahora", cómo llegar, botón de WhatsApp con mensaje prearmado.
- **En la ficha de cada auto usado:** recuadro "¿Lo querés revisar antes de comprar?" con 2 o 3 talleres que hacen revisión precompra en esa localidad, rotando en forma pareja entre los suscriptos. Es lo que hace que el taller reciba clientes y renueve.

### Para el taller

- Suscripción mensual: `[PRECIO TALLER]`. **Decisión pendiente** (incluido si los primeros meses son gratis para llenar la sección).
- Panel simple: datos del taller, especialidades, horarios, fotos del local y estadísticas (vistas y clics en WhatsApp, y cuántas veces apareció en fichas de autos).
- Insignia "Taller verificado" con CUIT, igual que las agencias.
- Si no paga, se pausa con las mismas reglas que las agencias (5 días de gracia).

---

## 6. Navegación

```
Inicio | Autos | Concesionarias | Mecánicos | Publicá gratis
```

- **Publicá gratis** lleva a elegir: "Soy particular" (registro y publicar) o "Tengo una concesionaria" / "Tengo un taller" (planes y contacto).
- En la portada: accesos a autos, concesionarias y mecánicos, y un banner "Vendé tu auto gratis".

---

## 7. Cómo entra la plata

### Fuentes de ingreso

1. **Suscripción de concesionarias** (ingreso fijo): $ 60.000 o $ 80.000 por mes.
2. **Suscripción de talleres** (ingreso fijo): `[PRECIO TALLER]` por mes.
3. **Mejoras de particulares** (ingreso variable): depende del tráfico del portal.

Queda para más adelante: **"Vendé tu auto ya"** (el particular pide cotización y las agencias Pro reciben el contacto).

No se cobra comisión por venta de autos ni se procesa el pago de los autos.

### Cómo se cobra

| Quién | Cómo | Automatización |
|---|---|---|
| Concesionarias | Suscripción de Mercado Pago o transferencia | Vencimiento y pausa automáticos |
| Talleres | Suscripción de Mercado Pago o transferencia | Igual que concesionarias |
| Particulares | Pago único con Mercado Pago (Checkout Pro) | La mejora se activa sola al acreditarse el pago |

Flujo de una mejora:
1. El particular toca "Destacar" y elige la mejora.
2. El servidor crea la compra (`compras_mejoras`, estado pendiente) y una preferencia de Mercado Pago con `external_reference` = id de la compra.
3. El particular paga en Mercado Pago y vuelve al portal.
4. El aviso de pago de Mercado Pago llega a `/api/mp/webhook`. El servidor consulta el pago a la API de Mercado Pago (no confía en el aviso), y si está aprobado marca la compra como pagada y activa la mejora (`destacado_hasta`, fecha de publicación o duración extendida).
5. El `mp_payment_id` único evita activar dos veces la misma compra.

### Lo que te queda en el bolsillo

```
Ingresos (concesionarias + talleres + mejoras)
− comisión de Mercado Pago por cada cobro (según plazo de acreditación)
− monotributo (o los impuestos que correspondan)
− hosting: US$ 0 al inicio; unos US$ 25/mes con Supabase Pro cuando crezca
= ganancia
```

Ejemplo con **supuestos** (no es una proyección): 6 concesionarias en Básico y 3 en Pro ($ 600.000), 10 talleres a `[PRECIO TALLER]` y 30 mejoras a un precio de referencia de $ 7.000 ($ 210.000).

Importante: cada cobro se factura. Conviene hablar con un contador sobre la categoría de monotributo antes de lanzar, porque los ingresos de las tres fuentes se suman.

---

## 8. Cambios en el modelo de datos

**Nuevas tablas**

- **`particulares`**: user_id → auth.users, nombre, whatsapp, telefono_verificado_at, localidad_id, bloqueado, created_at.
- **`talleres`**: como `agencias` (slug, nombre, logo, dirección, localidad, lat, lng, horarios, whatsapp, cuit privado, verificada, estado, plan, precio_mensual_ars, vigente_hasta) + `especialidades` (lista), `hace_precompra` (bool), `fotos`.
- **`taller_usuarios`**: user_id, taller_id.
- **`mejoras`**: codigo (`destacado`, `subir`, `completo`), nombre, dias, precio_ars, activa.
- **`compras_mejoras`**: id, vehiculo_id, particular_id, mejora, monto, estado (`pendiente`, `pagada`, `rechazada`), mp_payment_id (único), activa_desde, activa_hasta, created_at.
- **`estadisticas_taller_diarias`**: taller_id, fecha, vistas, clics_whatsapp, apariciones_en_fichas.

**Cambios en `vehiculos`**

- `vendedor_tipo`: `agencia` o `particular`.
- `agencia_id` y `particular_id`, ambos opcionales, con una regla que exige exactamente uno según `vendedor_tipo`.
- `vence_at`: fecha de vencimiento del aviso de particular.
- La vista pública muestra un auto si está publicado o reservado, no está bloqueado, y además: si es de agencia, la agencia está al día; si es de particular, el aviso no venció.

**Cambios en `pagos`**: suma `taller_id` (opcional) para registrar las suscripciones de talleres.

### Reglas en la base de datos

- **Tope de 2 autos:** un control antes de guardar rechaza el tercer auto publicado o reservado de un mismo particular, con el mensaje "Podés tener hasta 2 autos publicados".
- **Cada uno lo suyo:** un particular solo lee y edita sus autos; un taller solo su ficha; una agencia solo su stock (las reglas de la versión 1 se extienden igual).
- **Mejoras:** solo el servidor (webhook) puede marcar una compra como pagada y activar un destacado. El particular no puede ponerse `destacado_hasta` a sí mismo.

---

## 9. Plan de trabajo actualizado

### Etapa 0 — Actualizar la demo
- Publicar como particular (gratis, con tope de 2) y su panel "Mi cuenta".
- Botón "Destacar" con el pago simulado.
- Apartado de concesionarias (renombrar agencias) y filtro por tipo de vendedor.
- Apartado de mecánicos con talleres ficticios y el recuadro de revisión precompra en las fichas.
- Navegación y portada nuevas.

### Etapa 1 — Lanzamiento
- Supabase con login para particulares, concesionarias y talleres, y seguridad por fila.
- Panel del administrador: alta y verificación de concesionarias y talleres, pagos, vencimientos, moderación y denuncias.
- Mejoras pagas con Mercado Pago (Checkout Pro y webhook): se automatizan desde el inicio porque son muchos pagos chicos.
- Suscripciones de concesionarias y talleres con registro manual de pagos.
- Términos, condiciones y privacidad actualizados para particulares y talleres.

### Etapa 2 — Después
- Suscripciones automáticas de Mercado Pago para concesionarias y talleres.
- Verificación de teléfono por SMS (si no se hizo en la etapa 1).
- "Vendé tu auto ya".
- Más localidades.

---

## 10. Decisiones pendientes

| Tema | Marcador |
|---|---|
| Precio de cada mejora para particulares | `[PRECIO DESTACADO]`, `[PRECIO SUBIR]`, `[PRECIO COMPLETO]` |
| Precio mensual de talleres y si los primeros meses son gratis | `[PRECIO TALLER]` |
| Duración del aviso de particular (propuesta: 60 días) | — |
| Tope anual de autos por particular (anti agencias encubiertas) | `[N]` |
| Verificación de teléfono por SMS: desde el inicio o después | — |
| Cantidad de denuncias que pausan un aviso automáticamente | `[N]` |
