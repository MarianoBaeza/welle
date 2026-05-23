# Welle

Premium sound libraries for content creators — TikTok, Reels, YouTube Shorts, and streamers.

## Products

| Library | Price | Sounds |
|---|---|---|
| ASMR | $19 | 60 |
| Content Creator | $19 | 80 |
| Cinematic | $19 | 70 |
| Complete Bundle | $39 | 210 |

## Stack

- **Next.js 16** + React 19 + TypeScript (strict)
- **Tailwind CSS 4** + shadcn/ui + Framer Motion
- **PayPal Orders API v2** — payments
- **Cloudflare R2** — file delivery with 48h signed URLs
- **Resend** — confirmation emails

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and fill in credentials
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
NEXT_PUBLIC_PAYPAL_CLIENT_ID
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL

RESEND_API_KEY
RESEND_FROM_EMAIL

NEXT_PUBLIC_APP_URL
```

## Payment Flow

1. User clicks Buy Now → `PayPalModal` opens
2. Frontend calls `POST /api/checkout` → receives `orderID`
3. User approves in PayPal popup
4. Frontend calls `POST /api/capture` with `orderID`
5. Server verifies payment → redirect to `/success`
6. *(Phase 2)* Generate R2 signed URL + send email via Resend

## Project Structure

```
src/
  app/            — pages and API routes (App Router)
  components/     — React components (shadcn in components/ui/)
  data/
    products.ts   — product catalog (source of truth)
  lib/            — utilities
  types/
    index.ts      — Library, Bundle, PreviewTrack interfaces
public/
  previews/       — audio preview MP3s (30s, 128kbps)
```

## Commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # lint
```
