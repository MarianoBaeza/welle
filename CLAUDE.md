# Welle

Proyecto personal de Mariano Baeza. Nombre elegido por él.

## Documento de referencia

**Leer antes de trabajar:** [`contexto_detallado_proyecto_welle.md`](contexto_detallado_proyecto_welle.md) — descripción completa del negocio, producto, público, modelo de venta y estrategia de crecimiento.

## Contexto y propósito

Mariano sale de Ethix a fines de junio 2026. Welle es su proyecto de portfolio, con doble propósito:
- Mostrar capacidad técnica a empresas donde aplique como desarrollador
- Conseguir clientes freelance / ingresos propios

No es un proyecto de portfolio para completar un formulario — es un negocio real que además funciona como carta de presentación.

## Qué es Welle

Marca digital de librerías de sonido para creadores de contenido (TikTok, Reels, YouTube Shorts, streamers). Tres productos iniciales:
1. **Librería ASMR** — sonidos relajantes e inmersivos
2. **Librería de efectos para editores** — transiciones, impacts, whooshes, foley
3. **Librería para streamers** — alertas, notificaciones, memes sonoros, overlays

Modelo de venta: compra por librería, bundle con las tres, descuento de lanzamiento.

## Restricciones de contexto

- Tiempo acotado: ~3-4 meses de runway antes de necesitar ingresos
- La prioridad paralela es conseguir trabajo activamente (CV, LinkedIn, entrevistas)
- La presión financiera es real — no hay espacio para experimentar indefinidamente

## Stack

| Capa | Decisión |
|---|---|
| Framework | Next.js full-stack (API routes para webhooks) |
| CSS/UI | Tailwind + shadcn/ui + Framer Motion (selectivo) |
| Pagos | Stripe Checkout + webhooks |
| Storage/entrega | Cloudflare R2 + signed URLs (expiración 48hs) |
| Email transaccional | Resend |
| Catálogo de productos | `products.ts` en el repo (sin DB por ahora) |
| Deployment | Vercel |
| Auth / DB | Fuera del MVP — se agrega cuando el negocio lo justifique |

## MVP

Cuatro superficies, un flujo: browse → preview → pagar → descargar.

| Página / superficie | Contenido |
|---|---|
| `/` | Hero + las 3 librerías con precio + CTA |
| `/library/[slug]` | Descripción, previews con audio player HTML, botón comprar |
| `/success` | Confirmación de pago + instrucciones de email |
| Email automático | Link de descarga firmado (48hs), disparado por webhook de Stripe |

**Fuera del MVP:** cuentas de usuario, about/blog/contacto, i18n, analytics avanzados.

**Estrategia de lanzamiento:** construir el store custom (portfolio) mientras se lanza en Gumroad para validar ventas reales. Cuando el store esté listo, migrar las ventas.

## Estructura de carpetas

```
src/
  app/          — páginas y API routes (Next.js App Router)
  components/   — componentes React (shadcn en components/ui/)
  data/
    products.ts — catálogo de librerías y bundle (fuente de verdad)
  lib/          — utilidades
  types/
    index.ts    — interfaces Library, Bundle, PreviewTrack
```

## Productos y precios

| ID | Nombre | Precio |
|---|---|---|
| `asmr` | ASMR | USD 19 |
| `content-creator` | Content Creator | USD 19 |
| `cinematic` | Cinematic | USD 19 |
| — | Complete Bundle | USD 39 |

## Variables de entorno

Grupos: PayPal (sandbox), Cloudflare R2, Resend, App URL. Ver `.env.local`.

```
PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET   ← server-only
NEXT_PUBLIC_PAYPAL_CLIENT_ID             ← frontend (PayPalScriptProvider)
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

## Pasarela de pagos — PayPal Orders API v2

**Stripe fue eliminado.** No hay `stripePriceId` en types ni products.ts.

Flujo:
1. BUY NOW abre `PayPalModal`
2. `PayPalButtons.createOrder` → `POST /api/checkout { productSlug, type }` → `{ orderID }`
3. Usuario aprueba en popup de PayPal
4. `PayPalButtons.onApprove` → `POST /api/capture { orderID }` → verifica `status === COMPLETED`
5. Redirect a `/success?product={slug}&type={type}`

Componentes clave:
- `PayPalProvider` — wrapper client (`'use client'`) con `PayPalScriptProvider`, montado en `layout.tsx`
- `PayPalModal` — modal con `PayPalButtons`, acepta `{ isOpen, onClose, productName, productSlug, price, type }`
- Modal se gestiona con estado local en `HomeClient` y `LibraryPageClient`

## Estado del proyecto

- [x] Next.js 16 + TypeScript + Tailwind + App Router inicializado
- [x] shadcn/ui configurado
- [x] `@paypal/react-paypal-js`, `framer-motion`, `resend` instalados
- [x] `products.ts` con las 3 librerías y bundle (sin Stripe IDs)
- [x] `.env.local` con credenciales PayPal sandbox
- [x] Homepage (`/`)
- [x] Library page (`/library/[slug]`)
- [x] PayPal checkout (`/api/checkout`) + capture (`/api/capture`)
- [x] `PayPalModal` + `PayPalProvider`
- [x] Audio previews MP3 en `public/previews/{slug}/` (22 archivos, 30s trim)
- [x] Success page (`/success`) — nav + footer + gradient cálido
- [ ] R2 signed URLs post-capture (Fase 2)
- [ ] Email de confirmación con Resend (Fase 2)

## Componentes UI

### Regla de estandarización
- Antes de crear cualquier botón, input, badge u otro elemento de UI, verificar si ya existe un componente en `components/ui/` que lo cubra
- Si existe: usarlo siempre. Si necesita una nueva variante, agregarla al componente existente
- Si no existe: crear el componente en `components/ui/` con variantes desde el principio, pensando en todos los usos conocidos
- Nunca instanciar `<button>` o `<input>` raw en componentes de feature — siempre usar el componente de `components/ui/`

### Componentes disponibles
| Componente | Archivo | Variantes / Notas |
|---|---|---|
| `HoverButton` | `components/ui/hover-button.tsx` | Botón glass con partículas de luz que siguen el cursor. Prop `accentColor` controla el color del highlight. Sin variantes — todo se personaliza vía `className`. |
| `BackgroundGradient` | `components/ui/background-gradient.tsx` | Gradiente radial con Framer Motion que sigue el cursor. Props: `hoveredId` (string \| null), `accents` (array `{id, color}`). Posición `fixed -z-10`. |
| `NavHeader` | `components/NavHeader.tsx` | Prop opcional `cta: { label, onAction, loading?, accentColor? }`. Si se pasa, reemplaza el tagline con un botón `outline-accent`. Backdrop blur al hacer scroll. Logo linkea a `/`. |
| `LibraryPlayer` | `components/LibraryPlayer.tsx` | Player de audio con tracks agrupados por categoría (2 columnas), barra de progreso clickeable, y `SpectrumVisualizer`. Props: `tracks`, `accentColor`, `soundCount`. |
| `SpectrumVisualizer` | `components/SpectrumVisualizer.tsx` | Canvas con Web Audio API. Recibe `analyserRef`, `isPlaying`, `accentColor`. Estado idle: barras finas al 15% de opacidad. |

## Sistema de diseño

### Mood general
Dark premium. Fondo casi negro, tipografía blanca, acentos por producto. Referentes: Splice, Artlist.

### Tipografía
- **Poppins** para todo (display y body)
- Contraste de peso: títulos muy bold, cuerpo regular/light

### Identidad visual por producto
Cada producto tiene imagen propia (generada con IA) y un color de acento que define su atmósfera:

| Producto | Color de acento | Mood de la imagen |
|---|---|---|
| ASMR | Verde | Orgánico, relajante, textural |
| Content Creator | Cyan eléctrico | Energético, digital, rápido |
| Cinematic | Ámbar dorado | Dramático, profundo, cinematográfico |
| Bundle | Imagen propia única | Abstracto, expansivo, "todo adentro" |

### Layout del home
1. **Hero** — chico, solo "Welle" + tagline
2. **Bundle card** — grande/prominente
3. **3 cards individuales** — en fila

### Tagline
> "Make your creativity heard."

### Cards individuales
- Imagen cuadrada 1:1 con el título del pack en grande adentro
- Debajo: título del pack, tags, botón play, botón "BUY NOW"
- **Al dar play:**
  - La imagen se anima con CSS (Ken Burns o glow pulsante) — video loop como mejora futura
  - El color de acento del pack toma toda la página: highlight/bordes + gradiente sutil de fondo

### Card del bundle
- Misma estructura que individuales pero más grande
- Botón play con espectro de audio (waveform)
- Botón de compra en color más llamativo
- Imagen propia (no mosaico ni gradiente)

### Interacción de audio
- Múltiples preview tracks por producto (ya en `products.ts`)
- La card muestra nombre del track activo + barra de progreso
- Solo una card puede estar en play a la vez

### Layout de la library page (`/library/[slug]`)
Banner 3 columnas (`grid-cols-[2fr_3fr_2fr]`):
- **Izquierda**: imagen `aspect-square` + tags + description
- **Centro**: `LibraryPlayer` — tracks por categoría, progress bar, `SpectrumVisualizer`
- **Derecha**: precio en `accentColor` (6xl/black) + sound count + `WelleButton variant="white"`

Debajo del banner:
1. **Upsell al bundle** — "Get all 3 libraries · $39 · Save $18"
2. **CTA banner full-width** — tagline a la izquierda, `Buy Now — $19` a la derecha
3. **Footer**

El `NavHeader` en library pages reemplaza el tagline con un botón `outline-accent` sticky.

### Audio previews
- Archivos en `public/previews/{slug}/*.mp3` (30s trim, 128kbps)
- `PreviewTrack` tiene `name`, `file`, `category` — los tracks se agrupan por categoría en el player
- El `AudioContext` se inicializa lazy en el primer click (compatibilidad Safari/autoplay policy)
- `MediaElementSourceNode` se crea una sola vez por instancia del player — no recrear

### API de checkout
- `POST /api/checkout` — body: `{ priceId: string }` — responde: `{ url: string }`
- Redirige a Stripe Checkout. `success_url` → `/success?session_id=...`, `cancel_url` → `/`
- Requiere `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_APP_URL` en env
