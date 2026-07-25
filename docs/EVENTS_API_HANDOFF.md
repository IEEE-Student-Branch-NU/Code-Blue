# Events API — what the website needs from Atrium

The `/events` page on ieeenirma.org makes one `GET` to the Atrium portal
and renders whatever comes back. No auth, no keys, no POST.

```
GET https://atrium.ieeenirma.org/api/public/events
    ?status=published|completed
    &branch=<slug>&page=<n>&limit=<n>
```

The site code is done and matches the documented response shape. It
currently falls back to a curated list because **the request does not
reach the route handler.** Details below.

## What is happening now

Measured 2026-07-26 against the deployed portal:

```
GET /api/public/events            → 307 → /login
GET /api/public/nonexistent-xyz   → 307 → /login
GET /api/health                   → 307 → /login
GET /totally-made-up-path         → 307 → /login
OPTIONS /api/public/events        → 307 → /login
```

A path that does not exist redirects the same way a real one does. That
rules out anything inside `src/app/api/public/events/route.ts` — the
route never runs. The redirect is coming from Next.js middleware whose
matcher covers every path in the app.

This also explains the missing CORS headers. `Access-Control-Allow-Origin: *`
may well be set inside the route handler, but middleware returns the 307
before the handler is reached, so the header is never sent. A browser
therefore reports:

```
Access to fetch at 'https://atrium.ieeenirma.org/api/public/events'
from origin 'https://ieeenirma.org' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

That is a real browser error, reproduced in Chrome — not a guess.

## Fix

In the portal's `middleware.ts`, exclude the public API from the matcher:

```ts
export const config = {
  matcher: [
    // everything except the public API, Next internals and static files
    '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

Then confirm from any machine:

```bash
curl -i -H "Origin: https://ieeenirma.org" \
  "https://atrium.ieeenirma.org/api/public/events?limit=1"
```

Expected: `200`, `content-type: application/json`, and an
`access-control-allow-origin` header. Anything that still says `307` or
`Location: /login` means the matcher is still catching it.

`OPTIONS` should return `204` with the same CORS headers, or browser
preflight will fail even when `GET` works.

## Second thing to check: there are no published events

Querying the `events` table directly with the anon key for
`status in (published, completed)` returned an empty array. So once the
middleware fix ships, the endpoint will correctly return:

```json
{ "data": [], "meta": { "total": 0, "page": 1, "limit": 10, "totalPages": 1 } }
```

The website will show its empty state until events are actually
published in Atrium. Worth publishing one real event to test the whole
path end to end.

## What the website does meanwhile

`src/lib/events.js` catches any failure — CORS, redirect, non-2xx, bad
JSON, timeout — and renders `FALLBACK_EVENTS`, a curated list built from
event art already in `/public`. In dev a warning is logged to the
console naming the unreachable host; visitors just see events.

Nothing needs to change on the website when the API starts working. The
fetch succeeds, live data replaces the fallback, and the fallback array
can then be deleted from `src/lib/events.js` — nothing else imports it.

## Fields the website reads

`name`, `description`, `event_date`, `location`, `capacity`,
`organizer_email`, `banner.url`, `status`, `branches.name`,
`branches.slug`, `event_types.name`, `created_at`, `updated_at`, and
optionally `registration_url` and `is_free`.

Anything missing renders as an omitted row rather than an error, so
adding fields later needs no coordination. `is_free` is read off the
event first and off `banner.is_free` second, since the portal team's
sample component read it there — settle on one and the other path can
go.

Branch filter chips are built from the `branches.slug` values in the
response, so a new branch in Atrium appears on the site with no code
change.

## Configuring the host

The base URL is `VITE_ATRIUM_API_BASE`, defaulting to
`https://atrium.ieeenirma.org`. Set it in `.env` or in the Vercel
project settings to point at a different deployment.

## Note on credentials

The website needs no Supabase keys. It talks to the Atrium API, not to
Supabase, so nothing secret belongs in this repo. If a service role key
or JWT secret has been shared anywhere, rotate it in the Supabase
dashboard — the service role key bypasses Row Level Security entirely.
