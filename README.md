# web

Website de Orasalud – www.orasalud.com

One-page landing site for Orasalud (home nursing in San Bernardo) plus `/privacidad`.
Next.js (App Router, fully static) + TypeScript + Tailwind CSS. The only server code is
`/api/lead`, which emails callback requests via Resend.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: everything works with it empty
npm run dev                  # http://localhost:3000
```

Production build: `npm run build && npm run start`. Lint: `npm run lint`.

Without `RESEND_API_KEY` in `npm run dev`, form submissions are printed to the terminal
instead of emailed. In a production build without Resend configured, the form shows its
error message, so a visitor is never told "we'll call you" when nobody got the lead.

## Editing prices and contact data

Everything lives in **`src/config/site.ts`**. Every section of the page, the WhatsApp
links, the footer, the form's service list and the structured data (JSON-LD) read from it.

| What | Field | Notes |
| --- | --- | --- |
| WhatsApp number | `whatsappNumber` | Digits only, with country code: `"56912345678"` |
| Phone for "Llamar" | `phone.e164` | With `+`: `"+56912345678"` |
| Phone as shown | `phone.display` | Free text: `"+56 9 1234 5678"` |
| Nurse | `nurse.name`, `nurse.registry`, `nurse.experience` | |
| Photos | `photos` | See [Photos](#photos) below |
| Privacy contact email | `contactEmail` | Shown on `/privacidad` |
| Communes | `communes` | |
| Hours | `hours` | `label` is what's shown; `schema` is the machine format for Google (`"Mo-Fr 08:30-19:00"`), `null` for closed days |
| Services and prices | `services` | `price` is a plain number in CLP (`25000`), shown as `$25.000`. Order in the array = order on the page. Keep `slug` stable (used in analytics). `group` is the id of one of the `serviceGroups`. |
| Service groups | `serviceGroups` | `id`, `title` and `icon` (one of `bandage`, `syringe`, `heart-pulse`, `iv-bag`). Order in the array = order on the page. |
| FAQ | `faqs` | `question` / `answer` pairs, in display order |

Any value written as `[like this]` is treated as a placeholder and highlighted in yellow on
the page, so you can spot what's still missing. Once you replace it, the highlight disappears.

The section headings, steps and sample report text are in `src/app/page.tsx`.

## Photos

Real photos only: no stock photos, AI-generated people or illustrations of people.
Exception: the hero may show hands only, with no identifiable faces. The nurse portrait
must always be a real photo of the actual nurse.
Drop the files into `public/images/` with these exact names, then rebuild (or restart
`npm run dev`). Until a file exists, a labeled gray box shows its slot.

| File | Where | Shape |
| --- | --- | --- |
| `hero.jpg` | Hero: beside the text on desktop, below the buttons on mobile. Nurse with an older adult at home. | 4:3 |
| `nurse.jpg` | "Quién va a la casa". Nurse portrait. | 1:1 |

- Photos are cropped to fill their shape (centered), so keep the subject near the middle.
  Any size works; 2400px on the long side is plenty.
- Edit file names and alt text (what screen readers and Google read) in `photos` in `site.ts`.
- **Compression on build:** `npm run dev` and `npm run build` first run
  `scripts/compress-images.mjs`, which processes `public/images/` **in place**: applies the
  camera rotation, removes metadata (including GPS location, important for photos taken in
  patients' homes), shrinks to 2400px max and re-compresses heavy files. Files already
  processed are left alone. Keep your untouched originals somewhere else. You can run it by
  hand with `npm run images`.
- `next/image` then serves each device a resized AVIF/WebP version, and every photo box
  reserves its space before loading, so there is no layout shift.

## Environment variables

Set them in `.env.local` for local work and in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | PostHog project API key. Empty = no analytics, no errors. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | `https://us.i.posthog.com` (default) or `https://eu.i.posthog.com` |
| `RESEND_API_KEY` | Yes in production | Resend API key |
| `LEAD_NOTIFY_EMAIL` | Yes in production | Who receives leads. Comma-separate several addresses. |
| `LEAD_FROM_EMAIL` | Recommended | Sender, e.g. `Orasalud <avisos@orasalud.com>`. The domain must be verified in Resend. If unset, Resend's test sender `onboarding@resend.dev` is used, which only delivers to your own Resend account email. |

`NEXT_PUBLIC_*` values are baked in at build time: redeploy after changing them.

### Analytics events

Only three events are sent (no pageviews, autocapture or session recording). Each includes
`utm_source` / `utm_medium` / `utm_campaign` when present. PostHog's script is only downloaded
on the first tracked click, so it doesn't slow down page load.

- `whatsapp_click` — `location`: `header` | `hero` | `service` | `services_multi` | `sticky` | `final` | `footer`, plus `service` (slug) on service rows. `services_multi` is the "¿Necesita más de un procedimiento?" button.
- `call_click` — `location`: `hero` | `footer`
- `lead_form_submit` — `service` (slug, `otro`, or `sin_especificar`), sent after a successful submit

UTM parameters from the landing URL are kept in `sessionStorage`, added to WhatsApp messages
as ` (vía {utm_source})`, and included in lead emails together with the page URL.

## Deploy on Vercel and connect orasalud.com

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo. The framework is detected as Next.js; keep the defaults.
3. Before the first deploy, add the environment variables above (Production, and Preview if you want to test the form there).
4. Deploy. Check the `*.vercel.app` URL: open it on a phone, tap WhatsApp, and send a test form.
5. **Settings → Domains**: add `orasalud.com` and `www.orasalud.com`. Choose to redirect `www` to `orasalud.com`; the canonical URL in the code is `https://orasalud.com`.
6. At your DNS provider, create the records Vercel shows on that screen. Usually:
   - `orasalud.com` → `A` record → `76.76.21.21`
   - `www` → `CNAME` → `cname.vercel-dns.com`

   Use the exact values Vercel displays if they differ. HTTPS is issued automatically once DNS resolves.
7. In Resend: **Domains → Add** `orasalud.com`, add the DNS records it gives you (SPF/DKIM), wait for "Verified", then set `LEAD_FROM_EMAIL` and redeploy.
8. Share `https://orasalud.com` in a WhatsApp chat to check the preview image.

## Project layout

```
src/
  config/site.ts          business data (single source of truth)
  app/page.tsx            landing page sections
  app/privacidad/         privacy notice (draft)
  app/api/lead/route.ts   form handler → Resend
  app/opengraph-image.tsx share image (1200×630), generated at build
  app/icon.svg            favicon; app/apple-icon.tsx = home-screen icon
  app/sitemap.ts, robots.ts
  components/             header, footer, CTA links, form, sticky bar, photo slots
  lib/                    WhatsApp URLs, UTM storage, analytics, lead validation
public/images/            photos (see Photos)
scripts/compress-images.mjs  photo compression, runs before dev/build
```
