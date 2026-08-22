# Technodyssey Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/technodyssey` route carrying the colour-coded three-day itinerary and the per-event poster showcase, and turn the Home hero's CTA into the door to it.

**Architecture:** One source-controlled data module (`technodysseyEvents.js`) holds the societies, the event roster and the schedule; every surface derives from it, so adding a KonfHub link or a poster is a one-line edit. The page is three sections in one scroll — masthead, itinerary, events — styled from the palette already fixed in `technodyssey.css`. A new `OdysseyGate` transition reuses the codebase's proven window-event → `navigate()` → reopen mechanism with a cosmic visual.

**Tech Stack:** React 18, react-router-dom 7, GSAP + ScrollTrigger (scroll reveals), framer-motion (overlay), vanilla CSS with custom properties. Tests: Node's built-in `node:test` — **no new dependencies**.

**Spec:** `docs/superpowers/specs/2026-08-23-technodyssey-page-design.md`

## Global Constraints

- **Palette tokens, exact values** — `--void: #05070d`, `--navy: #0b132b`, `--ivory: #f7f4ee`, `--gold: #e4b55d`, `--neb: #76a8ff`, `--mute: rgba(247, 244, 238, 0.44)`, `--hair: rgba(247, 244, 238, 0.14)`.
- **Society accents, exact values** — `CS #93b6dd`, `SIGHT #79cfa4`, `SPS #a98cf0`, `WIE #d9a271`, `PELS #e2705f`, `ITSS #c8cf72`, `SBNU #5ec9d8`.
- **Fonts** — `'Bodoni Moda', Didot, Georgia, serif` (display, always with `font-variation-settings: 'opsz' 14`); `'Space Mono', ui-monospace, monospace` (times, codes, instruments); `'Manrope', 'Inter', system-ui, sans-serif` (UI/body). All three are already loaded in `index.html` — **do not add font links**.
- **Fest dates** — 25–27 September 2026 (Friday/Saturday/Sunday). `DATE_LABEL` is exactly `'25–27 September 2026'` (en dash, U+2013).
- **Every animation must have a `@media (prefers-reduced-motion: reduce)` branch.**
- **Colour is never the sole signal** — every tile that is tinted by society also prints that society's code in text.
- **No new npm dependencies.** Everything needed is already in `package.json`.
- **Focus rings** reuse the hero's rule: `outline: 2px solid var(--gold); outline-offset: 4px`.
- Node's test runner is invoked as `node --test src/lib/` from the `Code-Blue` directory.
- All paths below are relative to `Code-Blue/`.

---

## File Structure

**Create**

| File | Responsibility |
| --- | --- |
| `src/lib/technodysseyEvents.js` | Societies, event roster, schedule, and every derivation (`buildRuns`, `formatRange`, `eventSchedule`, `currentSlot`). Pure — no React, no CSS, no Vite-only syntax, so `node --test` can import it. |
| `src/lib/technodysseyEvents.test.js` | Unit tests for the derivations above. |
| `src/pages/Technodyssey.jsx` | The route. Composes masthead + itinerary + gallery, owns the detail-overlay open/close state. |
| `src/pages/Technodyssey.css` | Page shell, masthead, section heads. |
| `src/components/technodyssey/Itinerary.jsx` | The colour-coded grid, the legend filter, the now-marker, the mobile timeline. |
| `src/components/technodyssey/Itinerary.css` | Grid, tiles, lunch bands, rail, responsive collapse. |
| `src/components/technodyssey/EventPoster.jsx` | One poster plate. Renders the image, falls back to a generated plate on error/absence. |
| `src/components/technodyssey/EventPoster.css` | Plate, bloom, starfield, code glyph. |
| `src/components/technodyssey/EventGallery.jsx` | The grid of poster cards with hover actions. |
| `src/components/technodyssey/EventGallery.css` | Card frame, hover, action reveal. |
| `src/components/technodyssey/EventDetail.jsx` | The modal overlay: poster, derived schedule, register action. |
| `src/components/technodyssey/EventDetail.css` | Backdrop, panel, register button states. |
| `src/components/OdysseyGate.jsx` | Home → Technodyssey transition. |
| `src/components/OdysseyGate.css` | Horizon ring, radial jump, bloom. |

**Modify**

| File | Change |
| --- | --- |
| `src/lib/technodyssey.js` | Correct `FEST_START` / `FEST_END` / `DATE_LABEL`; delete `TRACKS`. |
| `src/App.jsx` | Lazy route, menu entry, `noFestStrip` entry, mount `OdysseyGate`. |
| `src/components/technodyssey/TechnodysseyHero.jsx` | Remove the mission list and its `TRACKS` import; reroute the CTA through the gate. |
| `src/components/technodyssey/technodyssey.css` | Remove the now-dead `.td__missions*` rules. |

---

## Task 1: Data layer

**Files:**
- Create: `src/lib/technodysseyEvents.js`
- Test: `src/lib/technodysseyEvents.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `SOCIETIES: Record<string, { code, name, short, accent, logo }>`
  - `EVENTS: Array<{ id, name, society, kind, blurb, poster, konfhub, venue, team, tba }>`
  - `SCHEDULE: Array<{ day, date, iso, rows }>` where `rows: Array<{ from, to, slots?: (string|null)[], lunch?: true }>`
  - `TRACK_COUNT: 3`
  - `getEvent(id) → event | undefined`
  - `societyOf(event) → society`
  - `formatTime(hhmm) → string` e.g. `'09:00' → '9 AM'`
  - `formatRange(from, to) → string` e.g. `('13:00','17:00') → '1 – 5 PM'`
  - `buildRuns(day) → Array<Array<{ eventId, fromRow, span, from, to }>>` — one array per track column
  - `eventSchedule(eventId) → Array<{ day, date, from, to, label }>`
  - `currentSlot(now?) → { dayIndex, rowIndex } | null`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/technodysseyEvents.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
    SOCIETIES, EVENTS, SCHEDULE, TRACK_COUNT,
    getEvent, societyOf, formatTime, formatRange,
    buildRuns, eventSchedule, currentSlot,
} from './technodysseyEvents.js'

test('every event names a society that exists', () => {
    for (const e of EVENTS) {
        assert.ok(SOCIETIES[e.society], `unknown society ${e.society} on ${e.id}`)
    }
})

test('every scheduled slot names an event that exists', () => {
    for (const day of SCHEDULE) {
        for (const row of day.rows) {
            if (row.lunch) continue
            assert.equal(row.slots.length, TRACK_COUNT)
            for (const id of row.slots) {
                if (id === null) continue
                assert.ok(getEvent(id), `unknown event ${id}`)
            }
        }
    }
})

test('the fest runs Friday to Sunday, 25-27 September 2026', () => {
    assert.deepEqual(SCHEDULE.map((d) => d.iso),
        ['2026-09-25', '2026-09-26', '2026-09-27'])
    assert.deepEqual(SCHEDULE.map((d) => d.day),
        ['Friday', 'Saturday', 'Sunday'])
})

test('Friday is present but has no rows yet', () => {
    assert.equal(SCHEDULE[0].rows.length, 0)
})

test('formatTime drops a zero minute and uses a 12-hour clock', () => {
    assert.equal(formatTime('09:00'), '9 AM')
    assert.equal(formatTime('12:00'), '12 PM')
    assert.equal(formatTime('13:30'), '1:30 PM')
    assert.equal(formatTime('00:00'), '12 AM')
})

test('formatRange prints one meridiem when both ends share it', () => {
    assert.equal(formatRange('13:00', '17:00'), '1 – 5 PM')
    assert.equal(formatRange('08:00', '10:00'), '8 – 10 AM')
    assert.equal(formatRange('12:00', '13:00'), '12 – 1 PM')
})

test('formatRange keeps both when the range crosses noon', () => {
    assert.equal(formatRange('09:00', '12:00'), '9 AM – 12 PM')
})

test('buildRuns merges contiguous identical slots in a column', () => {
    const saturday = SCHEDULE[1]
    const [voices] = buildRuns(saturday)
    assert.equal(voices.length, 2)
    assert.deepEqual(voices[0], {
        eventId: 'voices-in-motion', fromRow: 0, span: 1, from: '09:00', to: '12:00',
    })
    assert.deepEqual(voices[1], {
        eventId: 'voices-in-motion', fromRow: 2, span: 2, from: '13:00', to: '17:00',
    })
})

test('buildRuns never merges across lunch', () => {
    const sunday = SCHEDULE[2]
    const lineFollower = buildRuns(sunday)[1]
    assert.equal(lineFollower.length, 2)
    assert.equal(lineFollower[0].span, 2)
    assert.equal(lineFollower[0].to, '12:00')
    assert.equal(lineFollower[1].fromRow, 3)
    assert.equal(lineFollower[1].span, 1)
})

test('buildRuns leaves distinct neighbours unmerged', () => {
    const saturday = SCHEDULE[1]
    const third = buildRuns(saturday)[2]
    assert.deepEqual(third.map((r) => r.eventId),
        ['stellar-shield', 'art-workshop', 'embedded-system'])
    assert.ok(third.every((r) => r.span === 1))
})

test('buildRuns skips empty slots without emitting a run', () => {
    const sunday = SCHEDULE[2]
    const [itss, , embedded] = buildRuns(sunday)
    assert.equal(itss.length, 1)
    assert.equal(itss[0].span, 2)
    assert.equal(embedded.length, 1)
})

test('buildRuns returns empty columns for a day with no rows', () => {
    const runs = buildRuns(SCHEDULE[0])
    assert.equal(runs.length, TRACK_COUNT)
    assert.ok(runs.every((c) => c.length === 0))
})

test('eventSchedule reports every run an event has, in order', () => {
    assert.deepEqual(
        eventSchedule('novahack').map((s) => s.label),
        ['Saturday · 9 AM – 12 PM', 'Saturday · 1 – 5 PM'],
    )
    assert.deepEqual(
        eventSchedule('embedded-system').map((s) => s.label),
        ['Saturday · 3 – 5 PM', 'Sunday · 8 AM – 12 PM'],
    )
})

test('societyOf resolves an event to its society record', () => {
    assert.equal(societyOf(getEvent('line-follower')).accent, '#5ec9d8')
    assert.equal(societyOf(getEvent('novahack')).code, 'CS')
})

test('currentSlot finds the row covering a moment inside the fest', () => {
    const during = new Date('2026-09-26T14:00:00+05:30').getTime()
    assert.deepEqual(currentSlot(during), { dayIndex: 1, rowIndex: 2 })
})

test('currentSlot returns null outside the fest', () => {
    assert.equal(currentSlot(new Date('2026-09-01T10:00:00+05:30').getTime()), null)
    assert.equal(currentSlot(new Date('2026-09-26T12:30:00+05:30').getTime()), null)
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test src/lib/`
Expected: FAIL — `Cannot find module '.../technodysseyEvents.js'`

- [ ] **Step 3: Write the implementation**

Create `src/lib/technodysseyEvents.js`:

```js
/* ─── Technodyssey 2026 — the roster and the running order ────────
 * Read by the itinerary, the gallery and the detail overlay. Adding a
 * KonfHub link or a poster is a one-line edit here and nothing else.
 *
 * Deliberately free of React, CSS and Vite-only syntax so the whole
 * module can be imported by `node --test`.
 * ---------------------------------------------------------------- */

export const TRACK_COUNT = 3

/* Seven hues held at comparable lightness, so no society shouts over
 * the others on the void. CS and WIE carry the values the hero was
 * already using. */
export const SOCIETIES = {
    CS: {
        code: 'CS',
        name: 'IEEE Computer Society',
        short: 'Computer Society',
        accent: '#93b6dd',
        logo: '/ieee-cs-logo.webp',
    },
    SIGHT: {
        code: 'SIGHT',
        name: 'IEEE Special Interest Group on Humanitarian Technology',
        short: 'SIGHT',
        accent: '#79cfa4',
        logo: '/ieee-sight-logo.webp',
    },
    SPS: {
        code: 'SPS',
        name: 'IEEE Signal Processing Society',
        short: 'Signal Processing',
        accent: '#a98cf0',
        logo: '/ieee-sps-logo.webp',
    },
    WIE: {
        code: 'WIE',
        name: 'IEEE Women in Engineering',
        short: 'Women in Engineering',
        accent: '#d9a271',
        logo: '/Docs/ieee-wie-logo.webp',
    },
    PELS: {
        code: 'PELS',
        name: 'IEEE Power Electronics Society',
        short: 'Power Electronics',
        accent: '#e2705f',
        logo: '/ieee-logo.webp',
    },
    ITSS: {
        code: 'ITSS',
        name: 'IEEE Intelligent Transportation Systems Society',
        short: 'Intelligent Transportation',
        accent: '#c8cf72',
        logo: '/ieee-itss-logo.webp',
    },
    SBNU: {
        code: 'SBNU',
        name: 'IEEE Student Branch Nirma University',
        short: 'Student Branch',
        accent: '#5ec9d8',
        logo: '/ieee-logo.webp',
    },
}

/* `konfhub: null` renders as "Registration opens soon" and makes the
 * itinerary tile open the detail panel instead of a dead tab.
 * `poster` may point at a file that does not exist yet — EventPoster
 * falls back to a generated plate, so absence is never a broken image.
 * `tba: true` marks a name the organisers have not settled. */
export const EVENTS = [
    {
        id: 'voices-in-motion',
        name: 'Voices in Motion',
        society: 'SIGHT',
        kind: 'Workshop',
        blurb: 'A hands-on session on communication and expression, run by SIGHT across the whole of Saturday.',
        poster: '/technodyssey/voices-in-motion.webp',
        konfhub: null,
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'novahack',
        name: 'NovaHack 2026',
        society: 'CS',
        kind: 'Hackathon',
        blurb: 'The branch hackathon: one long build, judged at the end of Saturday.',
        poster: '/technodyssey/novahack.webp',
        konfhub: 'https://konfhub.com/novahack-2026',
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'stellar-shield',
        name: 'Stellar Shield — A Lesson in Cybersecurity',
        society: 'SPS',
        kind: 'Workshop',
        blurb: 'An introduction to the attacks that actually happen, and the defences that actually hold.',
        poster: '/technodyssey/stellar-shield.webp',
        konfhub: null,
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'art-workshop',
        name: 'Art Workshop',
        society: 'WIE',
        kind: 'Workshop',
        blurb: 'A making session run by Women in Engineering — traditional craft, done by hand.',
        poster: '/technodyssey/art-workshop.webp',
        konfhub: 'https://konfhub.com/mirrors-mud-a-lippan-art-workshop',
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'embedded-system',
        name: 'Embedded System',
        society: 'PELS',
        kind: 'Workshop',
        blurb: 'Power electronics on real hardware, running from Saturday afternoon into Sunday morning.',
        poster: '/technodyssey/embedded-system.webp',
        konfhub: null,
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'itss-event',
        name: 'ITSS Event',
        society: 'ITSS',
        kind: 'To be announced',
        blurb: 'Intelligent Transportation Systems opens Sunday. The full brief lands closer to the date.',
        poster: '/technodyssey/itss-event.webp',
        konfhub: null,
        venue: null,
        team: null,
        tba: true,
    },
    {
        id: 'line-follower',
        name: 'Line Follower: Labyrinth Challenge',
        society: 'SBNU',
        kind: 'Competition',
        blurb: 'Build a bot that reads the line and solves the maze. Fastest clean run takes it.',
        poster: '/technodyssey/line-follower.webp',
        konfhub: null,
        venue: null,
        team: null,
        tba: false,
    },
]

/* Rows are kept at the organisers' own granularity; buildRuns does the
 * merging for display. A `lunch` row carries no slots; `null` in a slot
 * is a genuinely empty column.
 *
 * Friday is present with no rows on purpose — the masthead says 25–27
 * September, so dropping the day would contradict the page's own
 * header. It renders a "Schedule to be announced" plate until the
 * organisers publish it. */
export const SCHEDULE = [
    {
        day: 'Friday',
        date: '25 September 2026',
        iso: '2026-09-25',
        rows: [],
    },
    {
        day: 'Saturday',
        date: '26 September 2026',
        iso: '2026-09-26',
        rows: [
            { from: '09:00', to: '12:00', slots: ['voices-in-motion', 'novahack', 'stellar-shield'] },
            { from: '12:00', to: '13:00', lunch: true },
            { from: '13:00', to: '15:00', slots: ['voices-in-motion', 'novahack', 'art-workshop'] },
            { from: '15:00', to: '17:00', slots: ['voices-in-motion', 'novahack', 'embedded-system'] },
        ],
    },
    {
        day: 'Sunday',
        date: '27 September 2026',
        iso: '2026-09-27',
        rows: [
            { from: '08:00', to: '10:00', slots: ['itss-event', 'line-follower', 'embedded-system'] },
            { from: '10:00', to: '12:00', slots: ['itss-event', 'line-follower', 'embedded-system'] },
            { from: '12:00', to: '13:00', lunch: true },
            { from: '13:00', to: '14:00', slots: [null, 'line-follower', null] },
        ],
    },
]

const byId = new Map(EVENTS.map((e) => [e.id, e]))

export const getEvent = (id) => byId.get(id)

export const societyOf = (event) => SOCIETIES[event.society]

export const formatTime = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 === 0 ? 12 : h % 12
    return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, '0')} ${period}`
}

/* One meridiem when both ends share it — "1 – 5 PM" rather than the
 * "1 PM – 5 PM" every other schedule prints. */
export const formatRange = (from, to) => {
    const fromPm = Number(from.split(':')[0]) >= 12
    const toPm = Number(to.split(':')[0]) >= 12
    if (fromPm !== toPm) return `${formatTime(from)} – ${formatTime(to)}`
    return `${formatTime(from).replace(/ [AP]M$/, '')} – ${formatTime(to)}`
}

/* A spreadsheet splits a continuous event across consecutive rows
 * because that is how a spreadsheet works, not because the event stops
 * and restarts. Merge those back into one tile — but never across
 * lunch, because that break is real.
 *
 * Returns one array of runs per track column. */
export const buildRuns = (day) => {
    const rows = day.rows || []
    const columns = []

    for (let c = 0; c < TRACK_COUNT; c++) {
        const runs = []
        let r = 0

        while (r < rows.length) {
            if (rows[r].lunch) { r++; continue }

            const id = rows[r].slots?.[c] ?? null
            if (id === null) { r++; continue }

            let end = r
            while (
                end + 1 < rows.length &&
                !rows[end + 1].lunch &&
                (rows[end + 1].slots?.[c] ?? null) === id
            ) end++

            runs.push({
                eventId: id,
                fromRow: r,
                span: end - r + 1,
                from: rows[r].from,
                to: rows[end].to,
            })
            r = end + 1
        }

        columns.push(runs)
    }

    return columns
}

/* Every run an event has, across every day. The detail overlay reads
 * this rather than carrying its own copy of the times, so the two can
 * never drift apart. */
export const eventSchedule = (eventId) =>
    SCHEDULE.flatMap((day) => {
        const runs = buildRuns(day)
            .flat()
            .filter((run) => run.eventId === eventId)
            .sort((a, b) => a.fromRow - b.fromRow)

        return runs.map((run) => ({
            day: day.day,
            date: day.date,
            from: run.from,
            to: run.to,
            label: `${day.day} · ${formatRange(run.from, run.to)}`,
        }))
    })

/* Which row is running right now, for the itinerary's now-marker.
 * Null during lunch and outside the fest entirely — the marker is a
 * claim about a session, and lunch is not one. */
export const currentSlot = (now = Date.now()) => {
    for (let dayIndex = 0; dayIndex < SCHEDULE.length; dayIndex++) {
        const day = SCHEDULE[dayIndex]
        for (let rowIndex = 0; rowIndex < day.rows.length; rowIndex++) {
            const row = day.rows[rowIndex]
            if (row.lunch) continue
            const from = new Date(`${day.iso}T${row.from}:00+05:30`).getTime()
            const to = new Date(`${day.iso}T${row.to}:00+05:30`).getTime()
            if (now >= from && now < to) return { dayIndex, rowIndex }
        }
    }
    return null
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test src/lib/`
Expected: PASS — 16 tests, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/lib/technodysseyEvents.js src/lib/technodysseyEvents.test.js
git commit -m "feat(technodyssey): the roster, the running order, and the derivations

Societies with their accents, the seven events, and the three-day
schedule at the organisers' own row granularity. buildRuns merges the
contiguous rows a spreadsheet splits, but never across lunch.

Tested with node:test — no new dependencies."
```

---

## Task 2: Correct the fest dates and retire TRACKS

**Files:**
- Modify: `src/lib/technodyssey.js`
- Test: `src/lib/technodyssey.test.js` (create)

**Interfaces:**
- Consumes: nothing.
- Produces: `FEST_START`, `FEST_END`, `DATE_LABEL` with corrected values. `TRACKS` **no longer exists** — Task 5 removes its only consumer.

**Why this matters:** the countdown, the sitewide strip and the Home hero all read these. The dates currently in the file are August; the fest is September.

- [ ] **Step 1: Write the failing test**

Create `src/lib/technodyssey.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import * as td from './technodyssey.js'
import { SCHEDULE } from './technodysseyEvents.js'

test('the fest starts on the first scheduled day and ends on the last', () => {
    assert.equal(td.FEST_START.toISOString(), '2026-09-25T03:30:00.000Z')  // 09:00 IST
    assert.equal(td.FEST_END.toISOString(), '2026-09-27T08:30:00.000Z')    // 14:00 IST
})

test('the date label matches the schedule', () => {
    assert.equal(td.DATE_LABEL, '25–27 September 2026')
    assert.equal(SCHEDULE[0].iso, td.FEST_START.toISOString().slice(0, 10))
})

test('the fest ends when the last scheduled row ends', () => {
    const last = SCHEDULE.at(-1)
    const lastRow = last.rows.at(-1)
    assert.equal(
        td.FEST_END.getTime(),
        new Date(`${last.iso}T${lastRow.to}:00+05:30`).getTime(),
    )
})

test('TRACKS has been retired in favour of EVENTS', () => {
    assert.equal(td.TRACKS, undefined)
})
```

Deliberately **not** asserting `getCountdown().phase === 'upcoming'` — that reads the wall clock and would start failing on 25 September. The phase logic is existing behaviour and is not what this task changes.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/lib/`
Expected: FAIL — the ISO strings are August, and `TRACKS` is still exported.

- [ ] **Step 3: Apply the edits**

In `src/lib/technodyssey.js`:

Replace the two date constants:

```js
export const FEST_START = new Date('2026-09-25T09:00:00+05:30')
export const FEST_END = new Date('2026-09-27T14:00:00+05:30')
```

Replace the label:

```js
export const DATE_LABEL = '25–27 September 2026'
```

Delete the whole `TRACKS` array and the comment block above it (the one beginning `/* The events listed on KonfHub so far`). Replace it with:

```js
/* The event roster lives in ./technodysseyEvents.js — it outgrew a
 * two-field list once the itinerary needed societies, posters and
 * per-event schedules. */
```

Leave `FEST_ANNOUNCED`, `KONFHUB_URL`, `approachRatio`, `getCountdown` and everything below untouched. Moving the start date lengthens the announcement→launch window; `approachRatio()` handles that without change.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test src/lib/`
Expected: PASS — all tests from Tasks 1 and 2.

- [ ] **Step 5: Commit**

```bash
git add src/lib/technodyssey.js src/lib/technodyssey.test.js
git commit -m "fix(technodyssey): the fest runs 25-27 September, not 22-23 August

The countdown, the sitewide strip and the Home hero all read these
dates, so the stale values were visible on every page. FEST_END is
pinned to the end of the last scheduled row, and a test now holds it
there.

TRACKS retired: EVENTS in technodysseyEvents.js supersedes it."
```

**Note for the executor:** `npm run build` will fail after this task until Task 5 removes the `TRACKS` import from `TechnodysseyHero.jsx`. That is expected and is fixed in Task 5. Run `node --test src/lib/` to gate this task, not the build.

---

## Task 3: The route, the menu, and the page shell

**Files:**
- Create: `src/pages/Technodyssey.jsx`, `src/pages/Technodyssey.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `FEST_NAME`, `FEST_YEAR`, `DATE_LABEL`, `VENUE_LABEL`, `CITY_LABEL`, `getCountdown` (Task 2); the existing `LaunchClock` and `Anomaly` components.
- Produces: the `/technodyssey` route; `Technodyssey` default export; the callbacks `openEvent(id)` / `closeEvent()` and the `phase` value that Tasks 6, 8 and 9 are passed; CSS classes `.tdp`, `.tdp__masthead`, `.tdp__sectionhead`, and the page-level palette tokens every later task inherits.

**Note:** `Technodyssey.jsx` imports `technodyssey.css` as well as its own stylesheet. That is load-bearing — Task 9's register control reuses the `td-orbit` keyframe defined there.

- [ ] **Step 1: Create the page shell**

Create `src/pages/Technodyssey.jsx`:

```jsx
import React, { Suspense, useCallback, useState } from 'react'
import {
    FEST_NAME, FEST_YEAR, DATE_LABEL, VENUE_LABEL, CITY_LABEL, getCountdown,
} from '../lib/technodyssey'
import LaunchClock from '../components/technodyssey/LaunchClock'
import '../components/technodyssey/technodyssey.css'
import './Technodyssey.css'

const Anomaly = React.lazy(() => import('../components/technodyssey/Anomaly'))

/* ─── Technodyssey ────────────────────────────────────────────────
 * Three sections in one scroll: who and when, the running order, then
 * the events themselves. The same place as the Home hero — same
 * palette, same type, same staged reveals — but a return to it rather
 * than a first arrival, so the anomaly is dimmed and held to a corner
 * and the name does not restage its assembly.
 * ---------------------------------------------------------------- */

const Technodyssey = () => {
    /* Read once. The page must not restructure itself mid-visit if
       FEST_END happens to pass while someone is reading. */
    const [phase] = useState(() => getCountdown().phase)

    const [openEventId, setOpenEventId] = useState(null)
    const openEvent = useCallback((id) => setOpenEventId(id), [])
    const closeEvent = useCallback(() => setOpenEventId(null), [])

    const descend = useCallback((id) => () => {
        const target = document.getElementById(id)
        if (!target) return
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }, [])

    return (
        <main className="tdp" data-phase={phase}>
            <header className="tdp__masthead">
                <div className="tdp__field" aria-hidden="true">
                    <Suspense fallback={null}>
                        <Anomaly />
                    </Suspense>
                </div>

                <div className="tdp__masthead-inner">
                    <p className="tdp__callsign">
                        <span aria-hidden="true" />
                        IEEE SBNU · {VENUE_LABEL}, {CITY_LABEL}
                    </p>

                    <h1 className="tdp__title">
                        {FEST_NAME}
                        <span className="tdp__year">{FEST_YEAR}</span>
                    </h1>

                    <p className="tdp__dates">{DATE_LABEL}</p>

                    {phase !== 'over' && (
                        <div className="tdp__clock"><LaunchClock /></div>
                    )}

                    <nav className="tdp__jump" aria-label="Sections">
                        <button type="button" onClick={descend('itinerary')}>
                            The itinerary
                        </button>
                        <button type="button" onClick={descend('events')}>
                            The events
                        </button>
                    </nav>
                </div>
            </header>

            <section className="tdp__section" id="itinerary">
                <h2 className="tdp__sectionhead">
                    <span className="tdp__sectionhead-index">01</span>
                    The itinerary
                </h2>
                {/* Task 6 mounts <Itinerary /> here */}
            </section>

            <section className="tdp__section" id="events">
                <h2 className="tdp__sectionhead">
                    <span className="tdp__sectionhead-index">02</span>
                    The events
                </h2>
                {/* Task 8 mounts <EventGallery /> here */}
            </section>

            {/* Task 9 mounts <EventDetail /> here */}
        </main>
    )
}

export default Technodyssey
```

- [ ] **Step 2: Create the page stylesheet**

Create `src/pages/Technodyssey.css`:

```css
/* ─── Technodyssey page ───────────────────────────────────────────
 * Palette fixed here, matching the hero's, because this section is a
 * different place from the rest of the site and shares nothing with it.
 * ---------------------------------------------------------------- */

.tdp {
    --void: #05070d;
    --navy: #0b132b;
    --ivory: #f7f4ee;
    --gold: #e4b55d;
    --neb: #76a8ff;
    --mute: rgba(247, 244, 238, 0.44);
    --hair: rgba(247, 244, 238, 0.14);

    position: relative;
    min-height: 100vh;
    background: var(--void);
    color: var(--ivory);
    font-family: 'Manrope', 'Inter', system-ui, sans-serif;
    overflow-x: hidden;
}

/* ── masthead ───────────────────────────────────────────────────
   62svh, not a full screen: the itinerary is the reason to be here
   and should be visible on the first scroll, not hidden behind a
   second full-bleed hero. */
.tdp__masthead {
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: 62svh;
    padding: clamp(6rem, 14vh, 9rem) clamp(1.2rem, 5vw, 4.5rem) clamp(2.5rem, 6vh, 4rem);
    overflow: hidden;
}

/* Dimmed and pushed off-axis: a return to a place, not an arrival. */
.tdp__field {
    position: absolute;
    inset: -20% -30% auto auto;
    width: 78%;
    height: 130%;
    opacity: 0.5;
    pointer-events: none;
    mask-image: radial-gradient(58% 58% at 62% 40%, #000 42%, transparent 78%);
    -webkit-mask-image: radial-gradient(58% 58% at 62% 40%, #000 42%, transparent 78%);
}

.tdp__field canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
}

.tdp__masthead-inner {
    position: relative;
    z-index: 1;
    max-width: 46rem;
}

.tdp__callsign {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin: 0 0 clamp(0.9rem, 2vh, 1.4rem);
    font-size: clamp(0.5rem, 1.35vw, 0.62rem);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--mute);
}

.tdp__callsign span {
    width: clamp(22px, 4vw, 46px);
    height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
}

.tdp__title {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: clamp(0.6rem, 2vw, 1.4rem);
    margin: 0;
    font-family: 'Bodoni Moda', Didot, Georgia, serif;
    font-weight: 600;
    font-variation-settings: 'opsz' 14;
    font-size: clamp(2.4rem, 8vw, 6rem);
    line-height: 1.12;
    letter-spacing: -0.012em;
    background-image: linear-gradient(168deg, #ffffff 0%, #f7f4ee 42%, #f0dcb4 74%, #e4b55d 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.tdp__year {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.62rem, 1.7vw, 0.78rem);
    font-weight: 400;
    letter-spacing: 0.62em;
    text-indent: 0.62em;
    -webkit-text-fill-color: var(--gold);
    color: var(--gold);
}

.tdp__dates {
    margin: clamp(0.8rem, 2vh, 1.2rem) 0 0;
    font-size: clamp(0.78rem, 2vw, 0.95rem);
    letter-spacing: 0.06em;
    color: var(--ivory);
}

.tdp__clock {
    max-width: 420px;
    margin-top: clamp(1.4rem, 3vh, 2rem);
}

.tdp__jump {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.8rem, 2vw, 1.4rem);
    margin-top: clamp(1.6rem, 4vh, 2.4rem);
}

.tdp__jump button {
    padding: 0.7rem 1.4rem;
    background: rgba(11, 19, 43, 0.55);
    border: 1px solid var(--hair);
    color: var(--ivory);
    cursor: pointer;
    font-family: inherit;
    font-size: clamp(0.56rem, 1.5vw, 0.66rem);
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    transition: border-color 0.35s ease, letter-spacing 0.45s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.35s ease;
}

.tdp__jump button:hover {
    border-color: var(--gold);
    letter-spacing: 0.28em;
    background: rgba(11, 19, 43, 0.9);
}

/* ── sections ───────────────────────────────────────────────────── */
.tdp__section {
    position: relative;
    padding: clamp(3rem, 9vh, 6rem) clamp(1.2rem, 5vw, 4.5rem);
    max-width: 1400px;
    margin: 0 auto;
}

.tdp__sectionhead {
    display: flex;
    align-items: baseline;
    gap: clamp(0.8rem, 2vw, 1.4rem);
    margin: 0 0 clamp(1.8rem, 4vh, 3rem);
    padding-bottom: clamp(0.8rem, 2vh, 1.2rem);
    border-bottom: 1px solid var(--hair);
    font-family: 'Bodoni Moda', Didot, Georgia, serif;
    font-weight: 500;
    font-variation-settings: 'opsz' 14;
    font-size: clamp(1.4rem, 4vw, 2.4rem);
    letter-spacing: -0.01em;
    color: var(--ivory);
}

.tdp__sectionhead-index {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.5rem, 1.3vw, 0.6rem);
    letter-spacing: 0.3em;
    color: var(--gold);
}

.tdp button:focus-visible,
.tdp a:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 4px;
}

.tdp-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
}

@media (max-width: 560px) {
    .tdp__masthead {
        min-height: auto;
        padding-top: clamp(5rem, 12vh, 7rem);
    }

    .tdp__field {
        opacity: 0.34;
    }
}

@media (prefers-reduced-motion: reduce) {
    .tdp__jump button {
        transition: border-color 0.2s ease;
    }

    .tdp__jump button:hover {
        letter-spacing: 0.22em;
    }
}
```

- [ ] **Step 3: Wire the route, the menu and the strip suppression**

In `src/App.jsx`:

Add beside the other lazy imports:

```jsx
const Technodyssey = React.lazy(() => import('./pages/Technodyssey'))
```

Extend `noFestStrip` — the page *is* the fest, so a bar advertising it would be redundant and would steal the page's last inch:

```jsx
const noFestStrip = ['/carnival-gallery', '/code-blue', '/technodyssey'];
```

Add the menu entry, second in the list so it sits directly under Home:

```jsx
const menuItems = [
  { label: "Home", link: "/" },
  { label: "Technodyssey", link: "/technodyssey" },
  { label: "About", link: "/about" },
  { label: "Join Us", link: "/join-us" },
  { label: "Contact", link: "/contact" },
  { label: "Board Members", link: "/board-members" },
  { label: "Gallery", link: "/gallery" },
];
```

Add the route inside `<Routes>`, above the `path="*"` catch-all:

```jsx
<Route path="/technodyssey" element={
  <Suspense fallback={<div style={{ minHeight: '100vh', background: '#05070d' }} />}>
    <Technodyssey />
  </Suspense>
} />
```

- [ ] **Step 4: Verify it builds and the route renders**

Run: `npm run build`
Expected: FAIL — `TRACKS` is not exported (the leftover import in `TechnodysseyHero.jsx` from Task 2). This is expected; Task 5 fixes it.

Run: `node --test src/lib/`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Technodyssey.jsx src/pages/Technodyssey.css src/App.jsx
git commit -m "feat(technodyssey): the /technodyssey route and its masthead

62svh rather than a full screen, so the itinerary is visible on the
first scroll instead of hiding behind a second full-bleed hero. The
anomaly returns dimmed and off-axis: this is a return to the place the
Home hero established, not another arrival.

The fest strip is suppressed here — the page is the fest."
```

---

## Task 4: OdysseyGate — the Home → Technodyssey transition

**Files:**
- Create: `src/components/OdysseyGate.jsx`, `src/components/OdysseyGate.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: the `start-odyssey-transition` window event contract — `window.dispatchEvent(new CustomEvent('start-odyssey-transition', { detail: { path } }))`. Task 5 is its only caller.

**Why a new component:** `CyberGateTransition` is a mechanical blast door in Code Blue's idiom. It stays untouched and keeps serving the carnival route; this is the cosmic equivalent, reusing the same proven mechanism (window event → gate closes → `navigate()` → gate opens) with its own visual.

- [ ] **Step 1: Create the gate**

Create `src/components/OdysseyGate.jsx`:

```jsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './OdysseyGate.css'

/* ─── OdysseyGate ─────────────────────────────────────────────────
 * The fall into the fest. The void closes to a horizon ring, light
 * stretches radially into a jump, the ring snaps to a point — the
 * route swaps there — and then blooms open on the far side.
 *
 * Same mechanism as CyberGateTransition, which is proven in this
 * codebase; the visual is the only thing that differs.
 * ---------------------------------------------------------------- */

const OdysseyGate = ({ trigger, onGateClosed, onComplete }) => {
    const rootRef = useRef(null)
    const ringRef = useRef(null)
    const jumpRef = useRef(null)
    const runningRef = useRef(false)

    const onGateClosedRef = useRef(onGateClosed)
    const onCompleteRef = useRef(onComplete)

    useEffect(() => {
        onGateClosedRef.current = onGateClosed
        onCompleteRef.current = onComplete
    }, [onGateClosed, onComplete])

    useEffect(() => {
        if (!trigger || runningRef.current) return
        runningRef.current = true

        const root = rootRef.current
        const ring = ringRef.current
        const jump = jumpRef.current
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const finish = () => {
            runningRef.current = false
            gsap.set(root, { display: 'none' })
            if (onCompleteRef.current) onCompleteRef.current()
        }

        /* Reduced motion still navigates at the same point in the
           timeline — only the picture is removed, never the mechanism. */
        if (reduced) {
            const tl = gsap.timeline({ onComplete: finish })
            gsap.set(root, { display: 'block', opacity: 0 })
            tl.to(root, { opacity: 1, duration: 0.2 })
                .add(() => { if (onGateClosedRef.current) onGateClosedRef.current() })
                .to(root, { opacity: 0, duration: 0.2 }, '+=0.05')
            return
        }

        const tl = gsap.timeline({ onComplete: finish })

        gsap.set(root, { display: 'block', opacity: 1 })
        gsap.set(ring, { scale: 1.9, opacity: 0, borderWidth: 1 })
        gsap.set(jump, { opacity: 0, scaleY: 0.02 })

        tl
            /* 1 — the void closes in */
            .to(root, { backgroundColor: 'rgba(5, 7, 13, 0.96)', duration: 0.34, ease: 'power2.in' })
            /* 2 — a horizon ring finds itself */
            .to(ring, { opacity: 1, scale: 1, duration: 0.42, ease: 'power3.out' }, '-=0.18')
            /* 3 — light stretches: the jump */
            .to(jump, { opacity: 1, scaleY: 1, duration: 0.3, ease: 'power2.in' }, '-=0.12')
            .to(ring, { scale: 0.02, borderWidth: 3, duration: 0.34, ease: 'power3.in' }, '-=0.16')
            .to(jump, { opacity: 0, duration: 0.18 }, '-=0.14')
            /* 4 — the point. The route swaps behind the black. */
            .add(() => { if (onGateClosedRef.current) onGateClosedRef.current() })
            /* 5 — and blooms open on the far side */
            .to(ring, { scale: 2.6, opacity: 0, borderWidth: 1, duration: 0.62, ease: 'power2.out' }, '+=0.08')
            .to(root, { opacity: 0, duration: 0.46, ease: 'power2.out' }, '-=0.42')

        return () => { tl.kill() }
    }, [trigger])

    return (
        <div className="odyssey-gate" ref={rootRef} aria-hidden="true">
            <span className="odyssey-gate__jump" ref={jumpRef} />
            <span className="odyssey-gate__ring" ref={ringRef} />
        </div>
    )
}

export default OdysseyGate
```

- [ ] **Step 2: Create the gate stylesheet**

Create `src/components/OdysseyGate.css`:

```css
.odyssey-gate {
    position: fixed;
    inset: 0;
    z-index: 9998;
    display: none;
    background-color: rgba(5, 7, 13, 0);
    pointer-events: none;
    overflow: hidden;
}

/* The horizon. A ring, not a plate — the fall has a shape. */
.odyssey-gate__ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(52vmin, 460px);
    aspect-ratio: 1;
    margin: calc(min(52vmin, 460px) / -2) 0 0 calc(min(52vmin, 460px) / -2);
    border: 1px solid var(--gold, #e4b55d);
    border-radius: 50%;
    box-shadow:
        0 0 60px 6px rgba(228, 181, 93, 0.28),
        inset 0 0 80px 10px rgba(118, 168, 255, 0.16);
    will-change: transform, opacity;
}

/* Light stretched by the jump: radial streaks, not a flash. */
.odyssey-gate__jump {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 220vmax;
    height: 220vmax;
    transform-origin: 50% 50%;
    margin: -110vmax 0 0 -110vmax;
    background:
        repeating-conic-gradient(from 0deg at 50% 50%,
            rgba(247, 244, 238, 0) 0deg,
            rgba(247, 244, 238, 0.5) 0.35deg,
            rgba(247, 244, 238, 0) 1.4deg);
    mask-image: radial-gradient(circle at 50% 50%, transparent 12%, #000 40%, transparent 72%);
    -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 12%, #000 40%, transparent 72%);
    will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
    .odyssey-gate__ring,
    .odyssey-gate__jump {
        display: none;
    }

    .odyssey-gate {
        background-color: rgba(5, 7, 13, 0.96);
    }
}
```

- [ ] **Step 3: Mount and drive it from App.jsx**

In `src/App.jsx`, add the import:

```jsx
import OdysseyGate from './components/OdysseyGate'
```

Add state and a target ref beside the existing carnival ones, inside the `App` component:

```jsx
  const [isOdyssey, setIsOdyssey] = useState(false);
  const odysseyTargetRef = useRef('/technodyssey');
```

Add the listener effect beside the existing `start-carnival-transition` one:

```jsx
  useEffect(() => {
    const handleOdyssey = (e) => {
      odysseyTargetRef.current = (e.detail && e.detail.path) || '/technodyssey';
      setIsOdyssey(prev => prev || true);
    };
    window.addEventListener('start-odyssey-transition', handleOdyssey);
    return () => window.removeEventListener('start-odyssey-transition', handleOdyssey);
  }, []);

  const handleOdysseyClosed = useCallback(() => {
    navigate(odysseyTargetRef.current);
    window.scrollTo(0, 0);
  }, [navigate]);

  const handleOdysseyComplete = useCallback(() => {
    setIsOdyssey(false);
  }, []);
```

Mount it directly below `<CyberGateTransition ... />`:

```jsx
      <OdysseyGate
        trigger={isOdyssey}
        onGateClosed={handleOdysseyClosed}
        onComplete={handleOdysseyComplete}
      />
```

- [ ] **Step 4: Verify**

Run: `npm run lint`
Expected: no new errors in `OdysseyGate.jsx` or `App.jsx`. (`npm run build` still fails on the Task 2 `TRACKS` import — fixed next.)

- [ ] **Step 5: Commit**

```bash
git add src/components/OdysseyGate.jsx src/components/OdysseyGate.css src/App.jsx
git commit -m "feat(technodyssey): OdysseyGate, the fall into the fest

CyberGateTransition is a mechanical blast door in Code Blue's idiom and
stays where it is. This is the cosmic equivalent on the same proven
mechanism: void closes, horizon ring finds itself, light stretches into
a jump, the ring snaps to a point — route swaps there — and blooms open
on the far side.

Reduced motion keeps the mechanism and drops only the picture, so
navigation still happens at the same point in the timeline."
```

---

## Task 5: Home hero — drop the event list, reroute the CTA

**Files:**
- Modify: `src/components/technodyssey/TechnodysseyHero.jsx`
- Modify: `src/components/technodyssey/technodyssey.css`

**Interfaces:**
- Consumes: the `start-odyssey-transition` contract (Task 4).
- Produces: nothing new. Removes the last consumer of `TRACKS`, which unblocks `npm run build`.

- [ ] **Step 1: Edit the hero component**

In `src/components/technodyssey/TechnodysseyHero.jsx`:

Replace the import block so `TRACKS` and `KONFHUB_URL` are gone:

```jsx
import {
    FEST_NAME,
    FEST_YEAR,
    DATE_LABEL,
    VENUE_LABEL,
    CITY_LABEL,
} from '../../lib/technodyssey'
```

Replace the `launch` callback — the field still answers the click, then the gate takes over:

```jsx
    const launch = useCallback(() => {
        /* The field answers the click before the fall begins. */
        emitPulse()
        window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent('start-odyssey-transition', {
                detail: { path: '/technodyssey' },
            }))
        }, 180)
    }, [])
```

Change the button's label:

```jsx
                        <button className="td__launch" type="button" onClick={launch} data-late>
                            <span className="td__launch-ring" aria-hidden="true" />
                            <span className="td__launch-face">
                                <span className="td__launch-key" aria-hidden="true" />
                                Enter Technodyssey
                            </span>
                        </button>
```

Delete the entire `<ul className="td__missions">…</ul>` block, so `td__aside` holds only the clock:

```jsx
                    <div className="td__aside">
                        <div data-late><LaunchClock /></div>
                    </div>
```

- [ ] **Step 2: Remove the dead CSS**

In `src/components/technodyssey/technodyssey.css`, delete the whole `/* ── missions ── */` block — every rule from `.td__missions {` through `.td__mission-kind { … }` inclusive.

Also delete the now-orphaned narrow-viewport references:
- in the `@media (max-width: 900px)` block, change `.td-clock,\n    .td__missions {` to just `.td-clock {`
- in the `@media (max-width: 560px)` block, delete the `.td__mission-kind { display: none; }` rule.

- [ ] **Step 3: Verify the build is green again**

Run: `npm run build`
Expected: PASS — this is the first green build since Task 2.

Run: `npm run lint`
Expected: no new errors.

Run: `node --test src/lib/`
Expected: PASS.

- [ ] **Step 4: Verify by eye**

Run `npm run dev`, open the site, and confirm on Home:
- no event list beside the clock;
- the button reads **Enter Technodyssey**;
- clicking it plays the gate and lands on `/technodyssey` scrolled to the top.

- [ ] **Step 5: Commit**

```bash
git add src/components/technodyssey/TechnodysseyHero.jsx src/components/technodyssey/technodyssey.css
git commit -m "feat(technodyssey): the Home hero becomes a door

The two-item mission list is gone — the whole roster now lives one
route away, and a partial list beside it only invited the question of
what was missing. The CTA falls through OdysseyGate to /technodyssey
instead of opening KonfHub.

Retires the last TRACKS consumer; the build is green again."
```

---

## Task 6: The itinerary

**Files:**
- Create: `src/components/technodyssey/Itinerary.jsx`, `src/components/technodyssey/Itinerary.css`
- Modify: `src/pages/Technodyssey.jsx`

**Interfaces:**
- Consumes: `SCHEDULE`, `SOCIETIES`, `TRACK_COUNT`, `getEvent`, `societyOf`, `buildRuns`, `formatRange`, `formatTime`, `currentSlot` (Task 1).
- Produces: `<Itinerary onOpenEvent={(id) => void} />`. Calls `onOpenEvent` only when the clicked event has no `konfhub`; otherwise it opens the link itself.

- [ ] **Step 1: Create the component**

Create `src/components/technodyssey/Itinerary.jsx`:

```jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    SCHEDULE, SOCIETIES, TRACK_COUNT,
    getEvent, societyOf, buildRuns, formatRange, formatTime, currentSlot,
} from '../../lib/technodysseyEvents'
import './Itinerary.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── The running order ───────────────────────────────────────────
 * A time rail and three tracks per day. The organisers' sheet splits a
 * continuous event across consecutive rows; buildRuns puts it back
 * together, so a tile spans what the event actually spans.
 *
 * A tile with a KonfHub link goes there. A tile without one opens the
 * detail panel instead — never a dead click, and the ↗ appears only
 * when the link is real, so the affordance never lies.
 * ---------------------------------------------------------------- */

/* Only societies that actually appear, in first-appearance order —
 * a legend listing societies with nothing on the grid is noise. */
const usedSocieties = () => {
    const seen = []
    for (const day of SCHEDULE) {
        for (const row of day.rows) {
            if (row.lunch) continue
            for (const id of row.slots) {
                if (!id) continue
                const code = getEvent(id).society
                if (!seen.includes(code)) seen.push(code)
            }
        }
    }
    return seen.map((code) => SOCIETIES[code])
}

const Itinerary = ({ onOpenEvent }) => {
    const rootRef = useRef(null)
    const [filter, setFilter] = useState(null)
    const legend = useMemo(usedSocieties, [])
    const [now] = useState(() => currentSlot())

    const days = useMemo(
        () => SCHEDULE.map((day) => ({ day, columns: buildRuns(day) })),
        [],
    )

    /* Rows arrive as the reader comes down the rail. */
    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(root.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
            return
        }

        const ctx = gsap.context(() => {
            root.querySelectorAll('[data-day]').forEach((dayEl) => {
                gsap.fromTo(
                    dayEl.querySelectorAll('[data-reveal]'),
                    { opacity: 0, y: 26 },
                    {
                        opacity: 1, y: 0, duration: 0.75, stagger: 0.055, ease: 'power3.out',
                        scrollTrigger: { trigger: dayEl, start: 'top 82%', once: true },
                    },
                )
            })
        }, rootRef)

        return () => ctx.revert()
    }, [])

    const activate = (event) => () => {
        if (event.konfhub) {
            window.open(event.konfhub, '_blank', 'noopener,noreferrer')
            return
        }
        onOpenEvent(event.id)
    }

    return (
        <div className="itin" ref={rootRef}>
            <div className="itin__legend" role="group" aria-label="Filter by society">
                {legend.map((s) => {
                    const on = filter === s.code
                    return (
                        <button
                            key={s.code}
                            type="button"
                            className={`itin__chip${on ? ' is-on' : ''}`}
                            style={{ '--accent': s.accent }}
                            aria-pressed={on}
                            onClick={() => setFilter(on ? null : s.code)}
                        >
                            <span className="itin__chip-dot" aria-hidden="true" />
                            {s.code}
                        </button>
                    )
                })}
                {filter && (
                    <button type="button" className="itin__chip itin__chip--clear" onClick={() => setFilter(null)}>
                        Clear
                    </button>
                )}
            </div>

            {days.map(({ day, columns }, dayIndex) => (
                <section className="itin__day" key={day.iso} data-day>
                    <header className="itin__dayhead" data-reveal>
                        <h3>{day.day}</h3>
                        <span>{day.date}</span>
                    </header>

                    {day.rows.length === 0 ? (
                        <p className="itin__tba" data-reveal>Schedule to be announced</p>
                    ) : (
                        <div
                            className="itin__grid"
                            style={{ '--rows': day.rows.length }}
                        >
                            {day.rows.map((row, rowIndex) => (
                                <div
                                    className="itin__time"
                                    key={`t-${rowIndex}`}
                                    style={{ gridRow: rowIndex + 1 }}
                                    data-reveal
                                >
                                    {formatTime(row.from)}
                                    <i aria-hidden="true">{formatTime(row.to)}</i>
                                </div>
                            ))}

                            {day.rows.map((row, rowIndex) => row.lunch && (
                                <div
                                    className="itin__lunch"
                                    key={`l-${rowIndex}`}
                                    style={{ gridRow: rowIndex + 1 }}
                                    data-reveal
                                >
                                    Lunch
                                </div>
                            ))}

                            {columns.map((runs, col) => runs.map((run) => {
                                const event = getEvent(run.eventId)
                                const society = societyOf(event)
                                const dim = filter && filter !== society.code
                                const live = now
                                    && now.dayIndex === dayIndex
                                    && now.rowIndex >= run.fromRow
                                    && now.rowIndex < run.fromRow + run.span

                                return (
                                    <button
                                        type="button"
                                        key={`${col}-${run.fromRow}`}
                                        className={`itin__tile${dim ? ' is-dim' : ''}${live ? ' is-live' : ''}`}
                                        style={{
                                            '--accent': society.accent,
                                            gridColumn: col + 2,
                                            gridRow: `${run.fromRow + 1} / span ${run.span}`,
                                        }}
                                        onClick={activate(event)}
                                        aria-current={live ? 'time' : undefined}
                                        aria-label={
                                            `${event.name} — ${society.name}, ${day.day} ` +
                                            `${formatRange(run.from, run.to)}` +
                                            (event.konfhub ? '. Opens registration in a new tab.' : '. Opens details.')
                                        }
                                    >
                                        <span className="itin__code">{society.code}</span>
                                        <span className="itin__name">{event.name}</span>
                                        <span className="itin__meta">
                                            <span className="itin__span">{formatRange(run.from, run.to)}</span>
                                            <span className="itin__kind">{event.kind}</span>
                                        </span>
                                        {event.konfhub && <span className="itin__out" aria-hidden="true">↗</span>}
                                    </button>
                                )
                            }))}
                        </div>
                    )}
                </section>
            ))}
        </div>
    )
}

export default Itinerary
```

- [ ] **Step 2: Create the stylesheet**

Create `src/components/technodyssey/Itinerary.css`:

```css
/* ── legend ─────────────────────────────────────────────────────── */
.itin__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: clamp(1.6rem, 4vh, 2.4rem);
}

.itin__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.42rem 0.8rem;
    background: transparent;
    border: 1px solid var(--hair);
    color: var(--mute);
    cursor: pointer;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.56rem;
    letter-spacing: 0.18em;
    transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}

.itin__chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.itin__chip:hover,
.itin__chip.is-on {
    color: var(--ivory);
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, transparent);
}

.itin__chip--clear {
    color: var(--gold);
    border-color: rgba(228, 181, 93, 0.4);
}

/* ── day ────────────────────────────────────────────────────────── */
.itin__day + .itin__day {
    margin-top: clamp(2.4rem, 6vh, 4rem);
}

.itin__dayhead {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    padding-bottom: 0.7rem;
    margin-bottom: clamp(1rem, 2.5vh, 1.6rem);
    border-bottom: 1px solid rgba(228, 181, 93, 0.34);
}

.itin__dayhead h3 {
    margin: 0;
    font-family: 'Bodoni Moda', Didot, Georgia, serif;
    font-weight: 500;
    font-variation-settings: 'opsz' 14;
    font-size: clamp(1.1rem, 3vw, 1.7rem);
    color: var(--ivory);
}

.itin__dayhead span {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.48rem, 1.2vw, 0.58rem);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--mute);
}

.itin__tba {
    margin: 0;
    padding: clamp(1.6rem, 5vh, 2.6rem);
    border: 1px dashed var(--hair);
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.55rem, 1.4vw, 0.65rem);
    letter-spacing: 0.24em;
    text-transform: uppercase;
    text-align: center;
    color: var(--mute);
}

/* ── grid ───────────────────────────────────────────────────────── */
.itin__grid {
    display: grid;
    grid-template-columns: clamp(4.4rem, 8vw, 6.4rem) repeat(3, minmax(0, 1fr));
    grid-auto-rows: minmax(clamp(76px, 9vh, 104px), auto);
    gap: 8px;
    align-items: stretch;
}

/* The rail: each row's own boundaries, whatever the tiles above it
   have been merged into. */
.itin__time {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.2rem;
    padding-right: 0.7rem;
    border-right: 1px solid var(--hair);
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.52rem, 1.3vw, 0.62rem);
    letter-spacing: 0.1em;
    color: var(--ivory);
    text-align: right;
}

.itin__time i {
    font-style: normal;
    color: var(--mute);
}

.itin__lunch {
    grid-column: 2 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--hair);
    background: rgba(11, 19, 43, 0.34);
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.5rem, 1.3vw, 0.6rem);
    letter-spacing: 0.42em;
    text-indent: 0.42em;
    text-transform: uppercase;
    color: var(--mute);
}

/* ── tile ───────────────────────────────────────────────────────── */
.itin__tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: clamp(0.7rem, 1.8vh, 1rem) clamp(0.7rem, 1.6vw, 1.05rem);
    background:
        linear-gradient(158deg,
            color-mix(in srgb, var(--accent) 13%, transparent),
            color-mix(in srgb, var(--accent) 4%, transparent) 62%),
        rgba(11, 19, 43, 0.5);
    border: 1px solid var(--hair);
    color: var(--ivory);
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
        border-color 0.3s ease, background 0.3s ease, opacity 0.3s ease;
}

.itin__tile::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 2px;
    background: var(--accent);
    opacity: 0.62;
    transition: opacity 0.3s ease, width 0.3s ease;
}

.itin__tile:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    background:
        linear-gradient(158deg,
            color-mix(in srgb, var(--accent) 22%, transparent),
            color-mix(in srgb, var(--accent) 7%, transparent) 62%),
        rgba(11, 19, 43, 0.72);
}

.itin__tile:hover::before {
    opacity: 1;
    width: 3px;
}

.itin__tile.is-dim {
    opacity: 0.2;
}

.itin__code {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.5rem;
    letter-spacing: 0.2em;
    color: var(--accent);
}

.itin__name {
    font-size: clamp(0.76rem, 1.7vw, 0.94rem);
    font-weight: 500;
    line-height: 1.28;
    letter-spacing: 0.01em;
}

.itin__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: auto;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.48rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--mute);
}

.itin__out {
    position: absolute;
    top: 0.6rem;
    right: 0.7rem;
    font-size: 0.7rem;
    color: var(--accent);
    opacity: 0;
    transform: translate(-3px, 3px);
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.itin__tile:hover .itin__out,
.itin__tile:focus-visible .itin__out {
    opacity: 1;
    transform: translate(0, 0);
}

/* ── now ────────────────────────────────────────────────────────── */
.itin__tile.is-live {
    border-color: var(--gold);
}

.itin__tile.is-live::after {
    content: 'NOW';
    position: absolute;
    right: 0.7rem;
    bottom: 0.6rem;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.44rem;
    letter-spacing: 0.24em;
    color: var(--gold);
    animation: itin-now 1.6s steps(1) infinite;
}

@keyframes itin-now {
    0%, 60% { opacity: 1; }
    61%, 100% { opacity: 0.24; }
}

/* ── narrow: a list, not a reflowed grid ────────────────────────
   The grid's DOM order is column-major — all of track 1, then track 2,
   then track 3 — which cannot be made to read in schedule order in a
   single column with CSS alone. Step 3 renders an explicit list from
   the same data instead, and the two swap here. */
.itin__list {
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
}

.itin__list li {
    display: block;
}

.itin__list li + li {
    margin-top: 10px;
}

.itin__list .itin__tile {
    width: 100%;
    border-left: 3px solid var(--accent);
}

.itin__list .itin__tile::before {
    display: none;
}

.itin__listlunch {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.9rem;
    padding: 0.9rem;
    border: 1px solid var(--hair);
    background: rgba(11, 19, 43, 0.34);
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.5rem, 1.3vw, 0.6rem);
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--mute);
}

.itin__listlunch span {
    letter-spacing: 0.16em;
    color: var(--ivory);
}

@media (max-width: 900px) {
    .itin__grid {
        display: none;
    }

    .itin__list {
        display: block;
    }
}

@media (prefers-reduced-motion: reduce) {
    .itin__tile,
    .itin__tile::before,
    .itin__out {
        transition: none;
    }

    .itin__tile:hover {
        transform: none;
    }

    .itin__tile.is-live::after {
        animation: none;
    }
}
```

- [ ] **Step 3: Render the narrow-viewport list**

The grid alone cannot serve narrow viewports: its DOM order is column-major (all of track 1, then track 2, then track 3), and no CSS reflow turns that into schedule order in a single column. Render an explicit list from the same data and let the two swap at 900px.

Add it in `Itinerary.jsx`, inside the `day.rows.length === 0 ? … : (…)` branch, directly after the `<div className="itin__grid">…</div>`. Wrap both in a fragment so the branch still returns one node:

```jsx
                            <ol className="itin__list">
                                {day.rows.flatMap((row, rowIndex) => {
                                    if (row.lunch) {
                                        return [(
                                            <li className="itin__listlunch" key={`ml-${rowIndex}`} data-reveal>
                                                <span>{formatRange(row.from, row.to)}</span>
                                                Lunch
                                            </li>
                                        )]
                                    }
                                    return columns
                                        .flatMap((runs) => runs.filter((run) => run.fromRow === rowIndex))
                                        .map((run) => {
                                            const event = getEvent(run.eventId)
                                            const society = societyOf(event)
                                            const dim = filter && filter !== society.code
                                            return (
                                                <li key={`m-${rowIndex}-${run.eventId}`} data-reveal>
                                                    <button
                                                        type="button"
                                                        className={`itin__tile${dim ? ' is-dim' : ''}`}
                                                        style={{ '--accent': society.accent }}
                                                        onClick={activate(event)}
                                                        aria-label={
                                                            `${event.name} — ${society.name}, ${day.day} ` +
                                                            `${formatRange(run.from, run.to)}` +
                                                            (event.konfhub ? '. Opens registration in a new tab.' : '. Opens details.')
                                                        }
                                                    >
                                                        <span className="itin__code">{society.code}</span>
                                                        <span className="itin__name">{event.name}</span>
                                                        <span className="itin__meta">
                                                            <span className="itin__span">{formatRange(run.from, run.to)}</span>
                                                            <span className="itin__kind">{event.kind}</span>
                                                        </span>
                                                        {event.konfhub && <span className="itin__out" aria-hidden="true">↗</span>}
                                                    </button>
                                                </li>
                                            )
                                        })
                                })}
                            </ol>
```

The CSS for this list is already in the stylesheet from Step 2 (`.itin__list`, `.itin__listlunch`, and the 900px swap) — no further CSS is needed.

The grid branch must now return both nodes, so change the opening of the else-branch from `) : (` … `<div className="itin__grid" …>` to wrap the pair in a fragment:

```jsx
                    ) : (
                        <>
                            <div className="itin__grid" style={{ '--rows': day.rows.length }}>
                                {/* …the time cells, lunch bands and tiles from Step 1, unchanged… */}
                            </div>

                            <ol className="itin__list">
                                {/* …the list above… */}
                            </ol>
                        </>
                    )}
```

Both renderings read the same `columns` and `day.rows`, so they cannot disagree. Only one is in the accessibility tree at a time, because `display: none` removes the other.

- [ ] **Step 4: Mount it on the page**

In `src/pages/Technodyssey.jsx`, add the import:

```jsx
import Itinerary from '../components/technodyssey/Itinerary'
```

Replace the `{/* Task 6 mounts <Itinerary /> here */}` comment with:

```jsx
                <Itinerary onOpenEvent={openEvent} />
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: PASS.

Run: `npm run lint`
Expected: no new errors.

Then `npm run dev` and confirm at 1440px:
- Saturday shows *Voices in Motion* as two tiles (9 AM – 12 PM, then 1 – 5 PM), not three;
- Sunday's *Line Follower* shows a 2-row tile and a separate 1 – 2 PM tile;
- lunch is a full-width band on both days;
- Friday shows "Schedule to be announced";
- clicking a NovaHack tile opens KonfHub in a new tab; clicking *Stellar Shield* does nothing yet (the overlay arrives in Task 9) — confirm no error in the console;
- clicking a legend chip dims the other tiles without the grid reflowing.

At 390px, confirm the grid is replaced by the single-column list in schedule order.

- [ ] **Step 6: Commit**

```bash
git add src/components/technodyssey/Itinerary.jsx src/components/technodyssey/Itinerary.css src/pages/Technodyssey.jsx
git commit -m "feat(technodyssey): the colour-coded itinerary

A time rail and three tracks per day, tinted by society and always
printing the society code as well, so colour is never carrying the
meaning alone. Contiguous rows are merged back into the run the event
actually is — but never across lunch.

Narrow viewports get an explicit list rather than a reflowed grid:
column-major DOM order cannot be made to read correctly in one column
with CSS alone. Both renderings derive from the same data."
```

---

## Task 7: EventPoster — the plate, and its fallback

**Files:**
- Create: `src/components/technodyssey/EventPoster.jsx`, `src/components/technodyssey/EventPoster.css`

**Interfaces:**
- Consumes: `societyOf` (Task 1).
- Produces: `<EventPoster event={event} />` — renders `event.poster` when it loads, and a generated plate when it does not.

**Why:** no Technodyssey posters exist in `public/` yet. A broken-image icon or a grey box would read as a bug. The generated plate reads as a deliberate placeholder, and dropping `/technodyssey/<id>.webp` into `public/` replaces it with **zero code change**.

- [ ] **Step 1: Create the component**

Create `src/components/technodyssey/EventPoster.jsx`:

```jsx
import React, { useState } from 'react'
import { societyOf } from '../../lib/technodysseyEvents'
import './EventPoster.css'

/* A deterministic starfield: seeded from the event id, so the same
 * event gets the same sky on every render and between paints. Math.random
 * would shift the stars on every re-render, which reads as a glitch. */
const starfield = (seed, count = 34) => {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0

    const next = () => {
        h = (h * 1664525 + 1013904223) >>> 0
        return h / 4294967296
    }

    return Array.from({ length: count }, () => ({
        x: next() * 100,
        y: next() * 100,
        r: 0.4 + next() * 1.1,
        o: 0.15 + next() * 0.55,
    }))
}

const EventPoster = ({ event }) => {
    const society = societyOf(event)
    const [failed, setFailed] = useState(false)
    const stars = React.useMemo(() => starfield(event.id), [event.id])

    if (!failed && event.poster) {
        return (
            <img
                className="tdposter__img"
                src={event.poster}
                alt={`${event.name} poster`}
                loading="lazy"
                onError={() => setFailed(true)}
            />
        )
    }

    return (
        <div className="tdposter__plate" style={{ '--accent': society.accent }} role="img"
            aria-label={`${event.name} — poster to be released`}>
            <svg className="tdposter__stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {stars.map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.22} fill="#f7f4ee" opacity={s.o} />
                ))}
            </svg>
            <span className="tdposter__glyph" aria-hidden="true">{society.code}</span>
            <span className="tdposter__label">
                <em>{event.name}</em>
                <i>Poster to be released</i>
            </span>
        </div>
    )
}

export default EventPoster
```

- [ ] **Step 2: Create the stylesheet**

Create `src/components/technodyssey/EventPoster.css`:

```css
.tdposter__img,
.tdposter__plate {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.tdposter__plate {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: clamp(0.9rem, 2.4vw, 1.4rem);
    background:
        radial-gradient(78% 58% at 64% 26%,
            color-mix(in srgb, var(--accent) 42%, transparent) 0%,
            color-mix(in srgb, var(--accent) 12%, transparent) 38%,
            transparent 72%),
        linear-gradient(168deg, #0b132b 0%, #05070d 74%);
    overflow: hidden;
}

.tdposter__stars {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* The society's own initials, large enough to be architecture rather
   than a label. */
.tdposter__glyph {
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Bodoni Moda', Didot, Georgia, serif;
    font-weight: 600;
    font-variation-settings: 'opsz' 14;
    font-size: clamp(3rem, 11vw, 6.4rem);
    line-height: 1;
    letter-spacing: -0.02em;
    color: color-mix(in srgb, var(--accent) 26%, transparent);
    white-space: nowrap;
    pointer-events: none;
}

.tdposter__label {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.tdposter__label em {
    font-style: normal;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: clamp(0.56rem, 1.5vw, 0.68rem);
    line-height: 1.4;
    letter-spacing: 0.1em;
    color: var(--ivory, #f7f4ee);
}

.tdposter__label i {
    font-style: normal;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.44rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--accent) 72%, #f7f4ee);
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: PASS.

The plate has no consumer until Task 8; correctness is confirmed there.

- [ ] **Step 4: Commit**

```bash
git add src/components/technodyssey/EventPoster.jsx src/components/technodyssey/EventPoster.css
git commit -m "feat(technodyssey): poster plates, with a fallback that looks deliberate

No posters exist yet, and a broken-image icon reads as a bug. A missing
file falls back to a generated plate — the society's initials as
architecture, an accent bloom, and a starfield seeded from the event id
so the sky never shifts between renders.

Dropping /technodyssey/<id>.webp into public/ replaces it with no code
change."
```

---

## Task 8: The event gallery

**Files:**
- Create: `src/components/technodyssey/EventGallery.jsx`, `src/components/technodyssey/EventGallery.css`
- Modify: `src/pages/Technodyssey.jsx`

**Interfaces:**
- Consumes: `EVENTS`, `societyOf` (Task 1); `EventPoster` (Task 7).
- Produces: `<EventGallery onOpenEvent={(id) => void} phase={'upcoming'|'live'|'over'} />`.

- [ ] **Step 1: Create the component**

Create `src/components/technodyssey/EventGallery.jsx`:

```jsx
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EVENTS, societyOf } from '../../lib/technodysseyEvents'
import EventPoster from './EventPoster'
import './EventGallery.css'

gsap.registerPlugin(ScrollTrigger)

const EventGallery = ({ onOpenEvent, phase }) => {
    const rootRef = useRef(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        const cards = root.querySelectorAll('[data-card]')

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(cards, { opacity: 1, y: 0, rotateX: 0 })
            return
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(cards,
                { opacity: 0, y: 40, rotateX: 6 },
                {
                    opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
                    scrollTrigger: { trigger: root, start: 'top 84%', once: true },
                },
            )
        }, rootRef)

        return () => ctx.revert()
    }, [])

    const register = (event) => (e) => {
        e.stopPropagation()
        if (!event.konfhub) { onOpenEvent(event.id); return }
        window.open(event.konfhub, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="tdgal" ref={rootRef}>
            {EVENTS.map((event) => {
                const society = societyOf(event)
                return (
                    <article
                        className="tdgal__card"
                        key={event.id}
                        data-card
                        style={{ '--accent': society.accent }}
                    >
                        <div className="tdgal__frame">
                            <EventPoster event={event} />
                            <div className="tdgal__actions">
                                <button type="button" className="tdgal__act tdgal__act--primary"
                                    onClick={register(event)}>
                                    {phase === 'over'
                                        ? 'Closed'
                                        : event.konfhub ? 'Register' : 'Soon'}
                                </button>
                                <button type="button" className="tdgal__act"
                                    onClick={() => onOpenEvent(event.id)}>
                                    More
                                </button>
                            </div>
                        </div>

                        <button type="button" className="tdgal__body" onClick={() => onOpenEvent(event.id)}>
                            <span className="tdgal__code">{society.code}</span>
                            <h3 className="tdgal__name">
                                {event.name}
                                {event.tba && <em> · name to be announced</em>}
                            </h3>
                            <span className="tdgal__kind">{event.kind}</span>
                        </button>
                    </article>
                )
            })}
        </div>
    )
}

export default EventGallery
```

- [ ] **Step 2: Create the stylesheet**

Create `src/components/technodyssey/EventGallery.css`:

```css
.tdgal {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 236px), 1fr));
    gap: clamp(1rem, 2.6vw, 1.8rem);
    perspective: 1200px;
}

.tdgal__card {
    display: flex;
    flex-direction: column;
    will-change: transform, opacity;
}

/* A fixed frame the poster moves inside — the crop stays put. */
.tdgal__frame {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border: 1px solid var(--hair);
    background: var(--navy);
    transition: border-color 0.35s ease;
}

.tdgal__card:hover .tdgal__frame,
.tdgal__card:focus-within .tdgal__frame {
    border-color: var(--accent);
}

.tdgal__frame > .tdposter__img,
.tdgal__frame > .tdposter__plate {
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.tdgal__card:hover .tdposter__img,
.tdgal__card:hover .tdposter__plate {
    transform: scale(1.04);
}

/* The glow rises out of the bottom edge with the actions. */
.tdgal__actions {
    position: absolute;
    inset: auto 0 0 0;
    display: flex;
    gap: 0.5rem;
    padding: clamp(0.7rem, 2vw, 1rem);
    background: linear-gradient(0deg,
        color-mix(in srgb, var(--accent) 26%, rgba(5, 7, 13, 0.96)) 0%,
        rgba(5, 7, 13, 0.72) 52%,
        transparent 100%);
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.tdgal__card:hover .tdgal__actions,
.tdgal__card:focus-within .tdgal__actions {
    opacity: 1;
    transform: translateY(0);
}

.tdgal__act {
    flex: 1;
    padding: 0.6rem 0.5rem;
    background: rgba(5, 7, 13, 0.72);
    border: 1px solid var(--hair);
    color: var(--ivory);
    cursor: pointer;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.5rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.tdgal__act:hover {
    border-color: var(--accent);
    color: #fff;
}

.tdgal__act--primary {
    border-color: color-mix(in srgb, var(--accent) 56%, transparent);
    background: color-mix(in srgb, var(--accent) 18%, rgba(5, 7, 13, 0.8));
}

/* The whole caption is the third way into the detail panel. */
.tdgal__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.34rem;
    padding: 0.85rem 0 0;
    background: none;
    border: 0;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
}

.tdgal__code {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.48rem;
    letter-spacing: 0.22em;
    color: var(--accent);
}

.tdgal__name {
    margin: 0;
    font-size: clamp(0.8rem, 1.9vw, 0.95rem);
    font-weight: 500;
    line-height: 1.3;
    color: var(--ivory);
    transition: color 0.3s ease;
}

.tdgal__name em {
    font-style: normal;
    font-size: 0.62em;
    color: var(--mute);
}

.tdgal__body:hover .tdgal__name {
    color: color-mix(in srgb, var(--accent) 60%, #ffffff);
}

.tdgal__kind {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.46rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mute);
}

/* Touch has no hover: the actions must not be unreachable. */
@media (hover: none) {
    .tdgal__actions {
        opacity: 1;
        transform: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .tdgal__frame > .tdposter__img,
    .tdgal__frame > .tdposter__plate,
    .tdgal__actions,
    .tdgal__act,
    .tdgal__name {
        transition: none;
    }

    .tdgal__card:hover .tdposter__img,
    .tdgal__card:hover .tdposter__plate {
        transform: none;
    }
}
```

- [ ] **Step 3: Mount it on the page**

In `src/pages/Technodyssey.jsx`, add the import:

```jsx
import EventGallery from '../components/technodyssey/EventGallery'
```

Replace the `{/* Task 8 mounts <EventGallery /> here */}` comment with:

```jsx
                <EventGallery onOpenEvent={openEvent} phase={phase} />
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: PASS.

Run `npm run dev` and confirm at 1440px:
- seven cards, each showing the generated plate (no posters exist yet), with the society's initials large behind an accent bloom;
- hovering a card scales the plate inside a fixed frame and slides *Register* / *More* up from the bottom edge;
- NovaHack's *Register* opens KonfHub; the others read *Soon*;
- no card shows a broken-image icon.

- [ ] **Step 5: Commit**

```bash
git add src/components/technodyssey/EventGallery.jsx src/components/technodyssey/EventGallery.css src/pages/Technodyssey.jsx
git commit -m "feat(technodyssey): the event gallery

Seven plates, each tinted by its society. The poster moves inside a
fixed frame on hover so the crop stays put, and the actions rise out of
the bottom edge with the accent glow behind them.

Touch devices get the actions unconditionally — there is no hover to
reveal them with."
```

---

## Task 9: The event detail overlay

**Files:**
- Create: `src/components/technodyssey/EventDetail.jsx`, `src/components/technodyssey/EventDetail.css`
- Modify: `src/pages/Technodyssey.jsx`

**Interfaces:**
- Consumes: `getEvent`, `societyOf`, `eventSchedule` (Task 1); `EventPoster` (Task 7).
- Produces: `<EventDetail eventId={string|null} phase={string} onClose={() => void} />`.

- [ ] **Step 1: Create the component**

Create `src/components/technodyssey/EventDetail.jsx`:

```jsx
import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getEvent, societyOf, eventSchedule } from '../../lib/technodysseyEvents'
import EventPoster from './EventPoster'
import './EventDetail.css'

/* Focusable descendants, in DOM order — enough for a trap in a panel
 * this small without pulling in a focus-management library. */
const FOCUSABLE =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const EventDetail = ({ eventId, phase, onClose }) => {
    const panelRef = useRef(null)
    const returnRef = useRef(null)
    const event = eventId ? getEvent(eventId) : null

    /* Remember what opened us, so focus goes back where it came from. */
    useEffect(() => {
        if (eventId) returnRef.current = document.activeElement
    }, [eventId])

    useEffect(() => {
        if (!event) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const panel = panelRef.current
        const first = panel?.querySelector(FOCUSABLE)
        first?.focus()

        const onKey = (e) => {
            if (e.key === 'Escape') { onClose(); return }
            if (e.key !== 'Tab' || !panel) return

            const items = Array.from(panel.querySelectorAll(FOCUSABLE))
            if (items.length === 0) return
            const firstItem = items[0]
            const lastItem = items[items.length - 1]

            if (e.shiftKey && document.activeElement === firstItem) {
                e.preventDefault()
                lastItem.focus()
            } else if (!e.shiftKey && document.activeElement === lastItem) {
                e.preventDefault()
                firstItem.focus()
            }
        }

        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
            /* Only reach back if the element is still in the document. */
            if (returnRef.current && document.contains(returnRef.current)) {
                returnRef.current.focus()
            }
        }
    }, [event, onClose])

    const society = event ? societyOf(event) : null
    const when = event ? eventSchedule(event.id) : []

    const registerLabel =
        phase === 'over' ? 'Registration closed'
            : event?.konfhub ? 'Register on KonfHub'
                : 'Registration opens soon'

    return (
        <AnimatePresence>
            {event && (
                <motion.div
                    className="tddet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="tddet__panel"
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tddet-title"
                        style={{ '--accent': society.accent }}
                        initial={{ opacity: 0, scale: 0.94, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="tddet__close" type="button" onClick={onClose}
                            aria-label={`Close ${event.name}`}>
                            <X size={16} />
                        </button>

                        <div className="tddet__poster">
                            <EventPoster event={event} />
                        </div>

                        <div className="tddet__info">
                            <p className="tddet__society">
                                <img src={society.logo} alt="" width="24" height="24" />
                                <span>{society.name}</span>
                            </p>

                            <h2 className="tddet__title" id="tddet-title">{event.name}</h2>
                            <p className="tddet__kind">{event.kind}</p>

                            {when.length > 0 && (
                                <dl className="tddet__when">
                                    <dt>When</dt>
                                    <dd>
                                        {when.map((w) => (
                                            <span key={`${w.day}-${w.from}`}>{w.label}</span>
                                        ))}
                                    </dd>
                                    {event.venue && (<><dt>Where</dt><dd><span>{event.venue}</span></dd></>)}
                                    {event.team && (<><dt>Format</dt><dd><span>{event.team}</span></dd></>)}
                                </dl>
                            )}

                            <p className="tddet__blurb">{event.blurb}</p>

                            {event.konfhub && phase !== 'over' ? (
                                <a className="tddet__go" href={event.konfhub}
                                    target="_blank" rel="noopener noreferrer">
                                    <span className="tddet__go-ring" aria-hidden="true" />
                                    <span className="tddet__go-face">
                                        <span className="tddet__go-key" aria-hidden="true" />
                                        {registerLabel}
                                    </span>
                                </a>
                            ) : (
                                <p className="tddet__pending">{registerLabel}</p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default EventDetail
```

- [ ] **Step 2: Create the stylesheet**

Create `src/components/technodyssey/EventDetail.css`:

```css
.tddet {
    position: fixed;
    inset: 0;
    z-index: 9997;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 4vw, 2.5rem);
    background: rgba(3, 4, 9, 0.82);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    overflow-y: auto;
}

.tddet__panel {
    --void: #05070d;
    --navy: #0b132b;
    --ivory: #f7f4ee;
    --gold: #e4b55d;
    --mute: rgba(247, 244, 238, 0.44);
    --hair: rgba(247, 244, 238, 0.14);

    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: clamp(1.2rem, 3vw, 2.4rem);
    width: min(100%, 900px);
    padding: clamp(1.2rem, 3vw, 2rem);
    background: linear-gradient(158deg, rgba(11, 19, 43, 0.96), rgba(5, 7, 13, 0.98));
    border: 1px solid var(--hair);
    border-top-color: color-mix(in srgb, var(--accent) 52%, transparent);
    color: var(--ivory);
    font-family: 'Manrope', 'Inter', system-ui, sans-serif;
}

.tddet__close {
    position: absolute;
    top: 0.7rem;
    right: 0.7rem;
    display: flex;
    padding: 0.5rem;
    background: rgba(5, 7, 13, 0.7);
    border: 1px solid var(--hair);
    color: var(--mute);
    cursor: pointer;
    transition: color 0.3s ease, border-color 0.3s ease;
}

.tddet__close:hover {
    color: var(--ivory);
    border-color: var(--accent);
}

.tddet__poster {
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border: 1px solid var(--hair);
}

.tddet__info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-right: 1.6rem;
}

.tddet__society {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    margin: 0;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.5rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
}

.tddet__society img {
    width: 20px;
    height: auto;
    filter: brightness(1.8) saturate(0.8);
}

.tddet__title {
    margin: 0;
    font-family: 'Bodoni Moda', Didot, Georgia, serif;
    font-weight: 500;
    font-variation-settings: 'opsz' 14;
    font-size: clamp(1.3rem, 3.4vw, 2rem);
    line-height: 1.2;
    letter-spacing: -0.01em;
}

.tddet__kind {
    margin: 0;
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.48rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--mute);
}

/* Derived from SCHEDULE, never duplicated — the two cannot drift. */
.tddet__when {
    display: grid;
    grid-template-columns: 4.6rem 1fr;
    gap: 0.4rem 0.8rem;
    margin: 0.5rem 0 0;
    padding-top: 0.8rem;
    border-top: 1px solid var(--hair);
    font-size: 0.72rem;
}

.tddet__when dt {
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.46rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--mute);
    padding-top: 0.18rem;
}

.tddet__when dd {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin: 0;
    color: var(--ivory);
}

.tddet__blurb {
    margin: 0.3rem 0 0;
    font-size: clamp(0.8rem, 1.9vw, 0.9rem);
    line-height: 1.62;
    color: rgba(247, 244, 238, 0.78);
}

/* Built on the hero's launch control, so the two read as one system. */
.tddet__go {
    position: relative;
    display: inline-block;
    margin-top: auto;
    padding: 1px;
    overflow: hidden;
    isolation: isolate;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
}

.tddet__go-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 260%;
    aspect-ratio: 1;
    background: conic-gradient(from 0deg,
        color-mix(in srgb, var(--accent) 16%, transparent) 0deg,
        color-mix(in srgb, var(--accent) 16%, transparent) 232deg,
        var(--accent) 318deg,
        #fff 344deg,
        var(--accent) 356deg,
        color-mix(in srgb, var(--accent) 16%, transparent) 360deg);
    opacity: 0.55;
    transform: translate(-50%, -50%);
    transition: opacity 0.5s ease;
    animation: td-orbit 5.5s linear infinite;
}

.tddet__go:hover .tddet__go-ring,
.tddet__go:focus-visible .tddet__go-ring {
    opacity: 1;
    animation-duration: 1.9s;
}

.tddet__go-face {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 0.95rem 1.6rem;
    background: linear-gradient(163deg, rgba(247, 244, 238, 0.09), rgba(247, 244, 238, 0) 44%), #05070d;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--ivory);
    transition: letter-spacing 0.45s cubic-bezier(0.22, 1, 0.36, 1), color 0.4s ease;
}

.tddet__go:hover .tddet__go-face {
    letter-spacing: 0.28em;
    color: #fff6e6;
}

.tddet__go-key {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
}

/* The same control, unarmed. Deliberately not a disabled <button>:
   there is nothing to press, so nothing offers to be pressed. */
.tddet__pending {
    margin: auto 0 0;
    padding: 0.95rem 1.6rem;
    border: 1px dashed var(--hair);
    font-family: 'Space Mono', ui-monospace, monospace;
    font-size: 0.56rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    text-align: center;
    color: var(--mute);
}

.tddet__panel a:focus-visible,
.tddet__panel button:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 4px;
}

@media (max-width: 760px) {
    .tddet {
        align-items: flex-start;
    }

    .tddet__panel {
        grid-template-columns: minmax(0, 1fr);
    }

    .tddet__poster {
        max-height: 46svh;
        aspect-ratio: 4 / 3;
    }

    .tddet__info {
        padding-right: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .tddet__go-ring {
        animation: none;
    }

    .tddet__go:hover .tddet__go-face {
        letter-spacing: 0.22em;
    }
}
```

- [ ] **Step 3: Mount it on the page**

In `src/pages/Technodyssey.jsx`, add the import:

```jsx
import EventDetail from '../components/technodyssey/EventDetail'
```

Replace the `{/* Task 9 mounts <EventDetail /> here */}` comment with:

```jsx
            <EventDetail eventId={openEventId} phase={phase} onClose={closeEvent} />
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: PASS.

Run `npm run lint`
Expected: no new errors. If `useMemo` is flagged as unused in `Technodyssey.jsx`, remove it from the import.

Run `npm run dev` and confirm:
- clicking *Stellar Shield* in the itinerary opens the overlay (it has no KonfHub link);
- clicking a NovaHack itinerary tile still opens KonfHub rather than the overlay;
- *More* on any gallery card opens the overlay;
- the overlay's **When** for *Embedded System* reads `Saturday · 3 – 5 PM` and `Sunday · 8 AM – 12 PM`;
- Escape closes it, the backdrop closes it, the panel does not;
- Tab cycles inside the panel and does not reach the page behind;
- on close, focus returns to the tile or card that opened it;
- the page behind does not scroll while the overlay is open.

- [ ] **Step 5: Commit**

```bash
git add src/components/technodyssey/EventDetail.jsx src/components/technodyssey/EventDetail.css src/pages/Technodyssey.jsx
git commit -m "feat(technodyssey): the event detail overlay

Poster left, information right. When and where are derived from
SCHEDULE rather than copied onto the event, so the itinerary and the
panel cannot disagree.

The register control is the hero's launch button in the event's own
accent. Without a link it becomes a dashed plate rather than a disabled
button: there is nothing to press, so nothing offers to be pressed.

Escape and backdrop close, focus is trapped and returned, body scroll
is locked."
```

---

## Task 10: Verification pass

**Files:**
- Modify: none expected. Fix whatever the pass surfaces.

- [ ] **Step 1: Run every automated check**

```bash
node --test src/lib/
npm run lint
npm run build
```

Expected: tests PASS, lint reports no new errors, build succeeds.

- [ ] **Step 2: Screenshot the real page**

The Chrome extension and headless `--screenshot` both fail on this machine; drive the installed Chrome with `playwright-core` instead. Start the preview server, then capture `/technodyssey` at 1440×900 and 390×844, and Home at 1440×900.

```bash
npm run build && npm run preview -- --port 4173
```

Save the shots into the scratchpad, not the repo.

- [ ] **Step 3: Confirm the spec's checklist by eye**

- [ ] Saturday: *Voices in Motion* and *NovaHack* are two tiles each (9 AM – 12 PM, 1 – 5 PM), not three.
- [ ] Sunday: *ITSS Event*, *Line Follower* and *Embedded System* each span 8 AM – 12 PM; *Line Follower* has a second 1 – 2 PM tile.
- [ ] Friday shows "Schedule to be announced".
- [ ] Lunch is a full-width band on Saturday and Sunday.
- [ ] Every tile prints its society code, not colour alone.
- [ ] A tile with no KonfHub link opens the overlay; NovaHack and Art Workshop open KonfHub.
- [ ] Every gallery card shows a generated plate — no broken-image icons.
- [ ] Home shows no event list, and its button reads **Enter Technodyssey**.
- [ ] The button plays the gate and lands on `/technodyssey` at the top.
- [ ] The fest strip does not appear on `/technodyssey`.
- [ ] `Technodyssey` appears in the menu, second.
- [ ] At 390px the itinerary is a single-column list in schedule order.

- [ ] **Step 4: Check reduced motion**

In Chrome DevTools → Rendering → *Emulate CSS prefers-reduced-motion: reduce*, confirm: the gate still navigates, tiles do not lift, the gallery does not stagger in, and the NOW marker does not blink.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix(technodyssey): verification pass"
```

---

## Handoff notes for the user

Two things stay open, both data-only edits in `src/lib/technodysseyEvents.js`:

1. **Friday 25 September's rows** — `SCHEDULE[0].rows` is `[]`. Fill it in the shape of Saturday's and the day renders itself.
2. **KonfHub links** — five of seven events have `konfhub: null`. Setting a URL flips the itinerary tile from *opens the detail panel* to *opens KonfHub*, turns the gallery's *Soon* into *Register*, and arms the overlay's control. No other change.

Also open:

3. **Posters** — drop `/technodyssey/<event-id>.webp` into `public/` (e.g. `public/technodyssey/novahack.webp`) and the generated plate is replaced automatically.
4. **`FEST_START` is provisional** — pinned to 09:00 on the 25th. If Friday opens earlier, correct it in `src/lib/technodyssey.js`, or the countdown reaches zero after the fest has begun.
5. **The WIE event** — the sheet says *Art Workshop*; the old `TRACKS` list called it *Mirrors & Mud — a Lippan art workshop* and had a live KonfHub URL. This plan takes the sheet's name and keeps the URL. Correct either in one line if that assumption is wrong.
