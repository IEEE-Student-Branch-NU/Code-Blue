# Technodyssey page — design

**Date:** 2026-08-23
**Status:** approved for planning

A dedicated `/technodyssey` route carrying the fest's full itinerary and its
per-event poster showcase, in the cosmic language the Home hero already
established. Home's hero sheds its event list and becomes a door to this page.

**The fest runs 25–27 September 2026 — Friday, Saturday, Sunday.** The dates
currently in `lib/technodyssey.js` (22–23 August) are stale and are corrected as
part of this work; see §3.5.

---

## 1. Goals

1. A **color-coded itinerary** for all three fest days, faithful to the
   organisers' sheet, where every event tile leads to that event's KonfHub
   listing.
2. An **event showcase** — one poster per event, with full information and a
   registration action.
3. **Continuity of theme.** The page is the same place as the Home hero, not a
   different site: same palette, same type, same staged-reveal motion.
4. **Home simplifies.** The hero drops its two-item mission list and its CTA
   becomes the entrance to this page.
5. **Links arrive later.** KonfHub URLs and posters are not available yet.
   Nothing may look broken in their absence, and adding each must be a
   one-line edit to a data file.

### Non-goals

- No CMS, no admin UI, no fetching. The roster is source-controlled data.
- No changes to `StaggeredMenu`'s navigation mechanism (plain `<a href>`,
  full reload) — that is existing sitewide behaviour and out of scope.
- No changes to `CyberGateTransition` or the Carnival/Code Blue experiences.

---

## 2. Design language

Inherited verbatim from `src/components/technodyssey/technodyssey.css`:

| Token     | Value                        | Role                        |
| --------- | ---------------------------- | --------------------------- |
| `--void`  | `#05070d`                    | ground                      |
| `--navy`  | `#0b132b`                    | raised surfaces             |
| `--ivory` | `#f7f4ee`                    | primary text                |
| `--gold`  | `#e4b55d`                    | the fest's own accent       |
| `--neb`   | `#76a8ff`                    | secondary light             |
| `--mute`  | `rgba(247, 244, 238, 0.44)`  | instrument labels           |
| `--hair`  | `rgba(247, 244, 238, 0.14)`  | 1px rules and borders       |

Type: **Bodoni Moda** (display, `opsz 14` held down so hairlines survive at
size) · **Space Mono** (times, codes, instruments) · **Manrope** (UI, body).
All three are already loaded in `index.html`.

Composition rule carried from the hero: **off-axis, never centred.** Section
heads sit left against a gold hairline; the anomaly holds a corner.

### 2.1 Society accents

Seven hues held at comparable lightness so no single society dominates the
grid. `CS` and `WIE` are the values already in `lib/technodyssey.js`.

| Code    | Society                                    | Accent    | Name       |
| ------- | ------------------------------------------ | --------- | ---------- |
| `CS`    | IEEE Computer Society                      | `#93b6dd` | cornflower |
| `SIGHT` | IEEE Special Interest Group on Humanitarian Technology | `#79cfa4` | jade |
| `SPS`   | IEEE Signal Processing Society             | `#a98cf0` | violet     |
| `WIE`   | IEEE Women in Engineering                  | `#d9a271` | terracotta |
| `PELS`  | IEEE Power Electronics Society             | `#e2705f` | ember      |
| `ITSS`  | IEEE Intelligent Transportation Systems Society | `#c8cf72` | sodium |
| `SBNU`  | IEEE Student Branch Nirma University       | `#5ec9d8` | cyan       |

Colour is never the sole carrier of meaning: every tile also prints its
society code in text, which satisfies WCAG 1.4.1 and survives the legend
filter being unavailable to a screen reader.

---

## 3. Data layer

### 3.1 `src/lib/technodysseyEvents.js` (new)

Three exports plus derivation helpers. `technodyssey.js` keeps dates, the
countdown, and phase logic; its `TRACKS` export is **retired** — `EVENTS`
supersedes it, and `TechnodysseyHero` was its only consumer.

```js
export const SOCIETIES = {
  CS: { code:'CS', name:'IEEE Computer Society', short:'Computer Society',
        accent:'#93b6dd', logo:'/ieee-cs-logo.webp' },
  // …SIGHT, SPS, WIE, PELS, ITSS, SBNU
}

export const EVENTS = [
  {
    id: 'novahack',
    name: 'NovaHack 2026',
    society: 'CS',
    kind: 'Hackathon',            // one-line category, printed in mono
    blurb: '…',                   // 1–2 sentences for the detail overlay
    poster: '/technodyssey/novahack.webp',   // may not exist yet — see §5.3
    konfhub: null,                // null until the organisers publish it
    venue: null,                  // optional; hidden when null
    team: null,                   // optional, e.g. 'Teams of 2–4'
    tba: false,                   // true ⇒ name is provisional
  },
  // …
]
```

Seven events, transcribed from the organisers' sheet:

| id               | name                                  | society | notes                     |
| ---------------- | ------------------------------------- | ------- | ------------------------- |
| `voices-in-motion` | Voices in Motion                    | SIGHT   |                           |
| `novahack`       | NovaHack 2026                         | CS      |                           |
| `stellar-shield` | Stellar Shield — A Lesson in Cybersecurity | SPS |                           |
| `art-workshop`   | Art Workshop                          | WIE     | see §3.4                  |
| `embedded-system`| Embedded System                       | PELS    |                           |
| `itss-event`     | ITSS Event                            | ITSS    | `tba: true`, name pending |
| `line-follower`  | Line Follower: Labyrinth Challenge    | SBNU    |                           |

### 3.2 `SCHEDULE`

Three days: **Friday 25**, **Saturday 26**, **Sunday 27 September 2026**. Rows
are transcribed at the sheet's own granularity. A `lunch` row carries no slots.
`null` in a slot is a genuinely empty column.

```js
export const SCHEDULE = [
  { day:'Friday', date:'25 September 2026', iso:'2026-09-25',
    rows: [ /* PENDING — see §3.5 */ ] },
  { day:'Saturday', date:'26 September 2026', iso:'2026-09-26',
    rows: [
      { from:'09:00', to:'12:00', slots:['voices-in-motion','novahack','stellar-shield'] },
      { from:'12:00', to:'13:00', lunch:true },
      { from:'13:00', to:'15:00', slots:['voices-in-motion','novahack','art-workshop'] },
      { from:'15:00', to:'17:00', slots:['voices-in-motion','novahack','embedded-system'] },
    ] },
  { day:'Sunday', date:'27 September 2026', iso:'2026-09-27',
    rows: [
      { from:'08:00', to:'10:00', slots:['itss-event','line-follower','embedded-system'] },
      { from:'10:00', to:'12:00', slots:['itss-event','line-follower','embedded-system'] },
      { from:'12:00', to:'13:00', lunch:true },
      { from:'13:00', to:'14:00', slots:[null,'line-follower',null] },
    ] },
]
```

A day whose `rows` array is empty renders a **"Schedule to be announced"**
plate under its day-head rather than being omitted — the reader should see that
Friday exists and is coming, not that the fest is two days long. The plate
disappears the moment rows are filled in; no code change.

Times are stored as 24-hour strings and **formatted for display** by a single
helper, so the sheet's bare "9 TO 12" becomes an unambiguous "9:00 – 12:00 AM/PM"
without the data carrying presentation.

### 3.3 `buildRuns(day)`

The sheet splits a continuous event across consecutive rows because that is
how a spreadsheet works, not because the event stops and restarts. `buildRuns`
walks each column and merges **vertically contiguous identical** slots into one
tile spanning those rows, with the combined time range.

- It **never merges across a `lunch` row** — that break is real.
- Output per column is a list of `{ eventId, fromRow, span, from, to }`.

Consequence on the transcribed data: Saturday's *Voices in Motion* and *NovaHack*
render as two tiles each (09:00–12:00, then 13:00–17:00) rather than three;
Sunday's *ITSS Event*, *Line Follower* and *Embedded System* each become one
08:00–12:00 tile, and *Line Follower* gets a second 13:00–14:00 tile after
lunch. This is a presentation merge only — no time is invented or lost.

### 3.4 Known data question

`lib/technodyssey.js` currently lists the WIE event as **"Mirrors & Mud — a
Lippan art workshop"** with a live KonfHub URL. The organisers' sheet says
**"Art Workshop (WIE)"**. These are very likely the same event. The spec takes
the sheet's label as the display name and **carries the existing KonfHub URL
forward** onto `art-workshop`, since a working link is strictly better than
`null`. Flag for the user; changing it is a one-line edit.

The `novahack` KonfHub URL (`https://konfhub.com/novahack-2026`) is likewise
carried forward from `TRACKS`. All five remaining events start at `null`.

### 3.5 Corrected fest dates — `lib/technodyssey.js`

The library's dates predate the current schedule and are corrected here, since
the countdown, the strip, the hero and this page all read from them:

| Constant        | Was                         | Becomes                     |
| --------------- | --------------------------- | --------------------------- |
| `FEST_START`    | `2026-08-22T08:00+05:30`    | `2026-09-25T09:00+05:30` ¹  |
| `FEST_END`      | `2026-08-23T17:00+05:30`    | `2026-09-27T14:00+05:30` ²  |
| `DATE_LABEL`    | `'22–23 August 2026'`       | `'25–27 September 2026'`    |
| `FEST_ANNOUNCED`| `2026-07-01`                | unchanged                   |

¹ Provisional — Friday's first slot is unknown until §3.6 is answered. If
Friday opens earlier than 09:00 this must move, or the countdown will reach zero
after the fest has already started.
² Sunday's last row ends at 14:00, so the fest is over at 14:00 on the 27th.

Because `FEST_ANNOUNCED` stays at 1 July, moving the start date lengthens the
announcement→launch window; `approachRatio()` handles this without change, and
the hero's sun simply climbs more slowly.

### 3.6 Open data question — Friday's rows

The supplied screenshot is cropped: it begins mid-row above the SATURDAY
header, so **Friday 25 September's slots are not known**. The build proceeds
with Friday present but empty (§3.2). Filling it in is a data-only edit.

---

## 4. Routing and integration

| Change                                   | File           |
| ---------------------------------------- | -------------- |
| `React.lazy` import + `<Route path="/technodyssey">` with a `Suspense` void fallback | `App.jsx` |
| `{ label: "Technodyssey", link: "/technodyssey" }` added to `menuItems` | `App.jsx` |
| `/technodyssey` added to `noFestStrip`   | `App.jsx`      |
| `<OdysseyGate />` mounted beside `CyberGateTransition` | `App.jsx` |

The fest strip is suppressed on this page because the page *is* the fest; a bar
advertising it would be redundant and would steal the last inch of the page.

---

## 5. The page — `src/pages/Technodyssey.jsx`

Three sections in one scroll, per the approved shape. Anchors `#itinerary` and
`#events` are deep-linkable.

### 5.1 § Masthead

The `Anomaly` field returns, dimmed and pushed off-axis — this is a return to a
place already visited, not a first arrival, so it must not restage the Home
hero's full three-act reveal. `StardustTitle` is Home's moment and is **not**
reused; here the fest name is set directly in Bodoni with a mono callsign above
it. Carries `LaunchClock`, the date/venue line, and two descend links to the
sections below.

Height is `min-height: 62svh` rather than a full screen: the itinerary is the
reason to be here and should be visible on first scroll, not hidden behind a
second full-bleed hero.

### 5.2 § Itinerary — `components/technodyssey/Itinerary.jsx`

**Desktop (≥900px).** Per day: a gold hairline day-head (Bodoni day name, mono
date), then a CSS grid of a mono time rail plus three track columns.

Each tile carries:
- the society code in its accent, in mono, as a chip;
- the event name in ivory (Manrope, 500);
- the kind in mute mono, right-aligned;
- an accent wash at ~8% and a `--hair` border that lights to the full accent on
  hover;
- a `↗` glyph **only when a KonfHub link exists**, so the affordance never lies.

A `lunch` row is a full-width band across all three columns: no accent, hairline
border, mono "LUNCH" centred. An empty slot renders as an unbordered gap.

**Legend and filter.** Above the grid, a row of society chips. Clicking one
dims every tile not belonging to it (opacity, not display, so the grid never
reflows). The chips are real `<button aria-pressed>` elements; a second click
clears. This is the one interactive flourish the section gets.

**Now-marker.** When `getCountdown().phase === 'live'`, the row covering the
current time is marked with a pulsing gold edge and an `aria-current`. Reuses
the hero's `td-led` keyframe.

**Motion.** Rows reveal on scroll with a stagger travelling down the time rail
(GSAP `ScrollTrigger`, the site's existing tool). The rail itself draws with the
falling-light animation already defined for `.td__descend-line`. Hover lifts a
tile 2px and brightens its wash. All of it collapses to plain opacity under
`prefers-reduced-motion`.

**Click behaviour.** `konfhub` present → open in a new tab
(`noopener,noreferrer`). `konfhub` null → open that event's detail overlay
instead, so a tile is never a dead click. The tile is a `<button>` in both
cases for consistent keyboard handling.

**Mobile (<900px).** The grid becomes a per-day vertical timeline: the time on a
left rail, event cards stacked beneath it, the society accent as a 3px left
edge. `buildRuns` merging still applies. LUNCH stays a full-width band.

### 5.3 § The Events — `EventGallery.jsx` + `EventPoster.jsx`

A responsive grid of 3:4 plates, one per event, in schedule order.

**Hover.** The poster scales to 1.04 inside a fixed, clipping frame; an accent
glow rises from the bottom edge; *Register* and *More* slide up together. Cards
enter staggered on scroll with a slight tilt settle.

**Poster fallback — `EventPoster.jsx`.** No Technodyssey posters exist in
`public/` yet. Rather than a broken-image icon or a grey box, a missing poster
renders a **generated plate**: an accent radial bloom on void, the society code
set very large in Bodoni at low opacity, the event name in mono, and a fine
deterministic starfield (seeded from the event `id`, so it is stable across
renders and never uses randomness that would differ between paints).

Detection is an `<img onError>` flip to the generated plate — this works whether
the file is absent, malformed, or blocked, and needs no build-time manifest.
Dropping `/technodyssey/<id>.webp` into `public/` replaces the plate with **zero
code change**.

### 5.4 Event detail — `EventDetail.jsx`

Opened from a gallery card's *More*, or from an itinerary tile with no link.

Layout: poster left, information right — society (with logo), kind, **when and
where derived from `SCHEDULE`** rather than duplicated on the event, so the two
can never drift apart; then blurb, team/format if present.

Primary action: **Register on KonfHub**, styled on the hero's `td__launch`
(filament ring, glass face, sweep, authorisation lamp). When `konfhub` is null
it becomes a non-interactive plate reading *Registration opens soon*; when the
fest phase is `over` it reads *Registration closed*.

Behaviour: opens with a scale-from-card transform via `framer-motion`
`AnimatePresence` (already a dependency, already used in `App.jsx`); closes on
Escape and on backdrop click; focus is trapped while open and returned to the
invoking element on close; body scroll is locked. `role="dialog" aria-modal`.

---

## 6. Transition — `components/OdysseyGate.jsx`

`CyberGateTransition` is a mechanical blast door in Code Blue's idiom and is
wrong for this journey. `OdysseyGate` is new, and reuses the *mechanism* that is
already proven in this codebase — a window `CustomEvent` carrying a path, a
`onGateClosed` callback that calls `navigate()`, and an `onComplete` that
unmounts — with its own visual:

1. the void closes in as a horizon ring;
2. light stretches radially into a jump;
3. the ring snaps to a point — **route swaps here**;
4. the ring blooms open on the new page.

Event name: `start-odyssey-transition`, distinct from
`start-carnival-transition` so the two gates never both fire. Under
`prefers-reduced-motion` the whole thing is a 200ms fade with the same
callback timing, so navigation still happens at the same point.

---

## 7. Home hero changes — `TechnodysseyHero.jsx`

- The `td__missions` list and its `TRACKS` import are **removed**. `td__aside`
  keeps only `LaunchClock`.
- The `launch` button's label becomes **"Enter Technodyssey"** and its handler
  dispatches `start-odyssey-transition` with `{ path: '/technodyssey' }`
  instead of opening KonfHub. It keeps `emitPulse()` — the field should still
  answer the click — and the existing 240ms delay becomes the gate's own timing.
- `.td__missions` rules are removed from `technodyssey.css`; the `.td__aside`
  rules stay, since the clock still lives there.

The hero remains gated behind `isFestOver()` in `Home.jsx` — unchanged.

---

## 8. Fest phases

`getCountdown().phase` is already `'upcoming' | 'live' | 'over'`. The page reads
it once on mount and adapts:

| phase      | Masthead                | Itinerary          | Register actions        |
| ---------- | ----------------------- | ------------------ | ----------------------- |
| `upcoming` | countdown clock         | plain              | *Register on KonfHub*   |
| `live`     | "Happening now"         | now-marker on row  | *Register on KonfHub*   |
| `over`     | `DATE_LABEL`, no clock  | plain              | *Registration closed*   |

**The route stays alive after `FEST_END`.** The hero and the strip retire
themselves by design; a dedicated page that deleted itself would 404 every
shared link, so it degrades to a record of what happened instead. Note that
because Home's hero disappears at `FEST_END`, after that moment the page is
reachable only from the menu — which is the correct outcome.

---

## 9. Accessibility

- Society colour is always paired with the printed society code.
- The itinerary is **not** marked up as a `<table>`: merged runs would fight
  table semantics, since a run spans rows in one column only. It is a CSS grid
  of buttons, with a visually-hidden `<h3>` per day and each tile carrying its
  own complete accessible name —
  `"{event} — {society}, {day} {from} to {to}"` — so no tile depends on a
  column header to be understood.
- Focus-visible outlines reuse the hero's `2px solid var(--gold)` at 4px offset.
- Every animation has a `prefers-reduced-motion` branch.
- The dialog traps focus, restores it, and locks scroll.

---

## 10. Files

**New**

```
src/lib/technodysseyEvents.js
src/pages/Technodyssey.jsx
src/pages/Technodyssey.css
src/components/technodyssey/Itinerary.jsx
src/components/technodyssey/EventGallery.jsx
src/components/technodyssey/EventPoster.jsx
src/components/technodyssey/EventDetail.jsx
src/components/OdysseyGate.jsx
src/components/OdysseyGate.css
```

**Edited**

```
src/App.jsx                                  route, menu, strip suppression, gate
src/components/technodyssey/TechnodysseyHero.jsx   list removed, CTA rerouted
src/components/technodyssey/technodyssey.css       .td__missions rules removed
src/lib/technodyssey.js                            TRACKS retired, dates corrected (§3.5)
```

---

## 11. Verification

This repository has no test harness — `npm run lint` and `npm run build` are the
only checks available, and both must pass. Beyond that:

- Screenshot `/technodyssey` at 1440px and 390px with `playwright-core` driving
  the installed Chrome. (The Chrome extension and headless `--screenshot` both
  fail on this machine; this is the route that works here.)
- Confirm by inspection: the run-merge produces the tile spans listed in §3.3;
  a tile with a null `konfhub` opens the overlay rather than a blank tab; a
  missing poster renders the generated plate; Home's hero shows no event list
  and its button reaches the new page through the gate.
