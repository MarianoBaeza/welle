<p align="center">
  <img src="public/logo-welle.png" alt="Welle" width="160" />
</p>

<h3 align="center">Premium sound libraries for content creators</h3>
<p align="center">TikTok · Reels · YouTube Shorts · Streamers</p>

<p align="center">
  <a href="https://welle.vercel.app">welle.vercel.app</a>
</p>

---

## What is Welle

Welle is a digital storefront for premium sound libraries built for short-form content creators. Users browse libraries, preview tracks directly in the browser, pay via PayPal, and receive a time-limited download link by email — no account required.

| Library | Price | Sounds |
|---|---|---|
| ASMR | $19 | 60 |
| Content Creator | $19 | 80 |
| Cinematic | $19 | 70 |
| Complete Bundle | $39 | 210 |

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 + App Router | Full-stack in a single repo — API routes handle payments server-side |
| UI | Tailwind CSS 4 + shadcn/ui + Framer Motion | Dark premium aesthetic with per-product accent colors |
| Payments | PayPal Orders API v2 | Stripe requires a US LLC to hold USD — PayPal Business works with CUIL only |
| File delivery | Cloudflare R2 + signed URLs (48h TTL) | Files never exposed publicly; links expire automatically after delivery |
| Email | Resend | Simple transactional API, no SMTP setup |
| Deployment | Vercel | Zero-config Next.js hosting |

## Architecture decisions

**No database, no auth.** The product catalog lives in `src/data/products.ts`. Purchase state is passed through the PayPal flow and stored briefly in `sessionStorage` to populate the success page — no user accounts needed for a one-time download product.

**Payment capture is always server-side.** The frontend never trusts itself to confirm a payment. After the user approves in the PayPal popup, the client calls `POST /api/capture`, which re-verifies `status === COMPLETED` against the PayPal API before generating any download links.

**File delivery is decoupled from payment capture.** `/api/capture` returns download URLs but does not send email. The user enters their email on `/success`, which calls `/api/send-download`. This prevents silent failures: if Resend is down, the user already has the download URLs on screen.

**R2 signed URLs require `forcePathStyle: true`.** Cloudflare R2 requires path-style URLs when using the AWS S3 SDK — virtual-hosted-style fails silently.

## Payment flow

```
Buy Now click
  → POST /api/checkout           create PayPal order → { orderID }
  → PayPal popup (user approves)
  → POST /api/capture            verify COMPLETED → generate R2 signed URLs
  → /success                     user enters email
  → POST /api/send-download      Resend delivers download link
```

## Audio previews

30-second MP3 previews (128 kbps) live in `public/previews/{slug}/`. The browser player uses the Web Audio API with a `SpectrumVisualizer` canvas component. `AudioContext` initializes lazily on first user interaction to comply with Safari and Chrome autoplay policies. A single `MediaElementSourceNode` per player instance avoids the `already connected` error on track switches.

## Project structure

```
src/
  app/
    api/
      checkout/       — create PayPal order
      capture/        — verify payment + generate R2 signed URLs
      send-download/  — send email via Resend
    library/[slug]/   — individual library page with player
    success/          — post-purchase page with EmailForm
  components/
    ui/               — shared UI primitives (HoverButton, BackgroundGradient, etc.)
    LibraryPlayer.tsx
    SpectrumVisualizer.tsx
    PayPalModal.tsx
    NavHeader.tsx
  data/
    products.ts       — single source of truth for catalog
  lib/
    r2.ts             — R2 client + signed URL generation
    email.ts          — Resend email sender
  types/
    index.ts          — Library, Bundle, PreviewTrack
public/
  previews/           — audio previews (MP3, 30s, 128kbps)
scripts/
  upload-to-r2.mjs    — one-time script to upload ZIPs to R2
```

## Local development

```bash
npm install
cp .env.example .env.local   # fill in credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```bash
# PayPal (get credentials at developer.paypal.com)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=         # server-only, never exposed to the client
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_API_URL=https://api-m.sandbox.paypal.com   # swap for api-m.paypal.com in production

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=            # must be from a verified domain in production

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # ESLint
```
