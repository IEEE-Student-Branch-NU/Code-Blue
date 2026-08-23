/* ─── Technodyssey 2026 — the roster and the running order ────────
 * Read by the itinerary, the gallery and the detail overlay. Adding a
 * KonfHub link or a poster is a one-line edit here and nothing else.
 *
 * Deliberately free of React, CSS and Vite-only syntax so the whole
 * module can be imported by `node --test`.
 * ---------------------------------------------------------------- */

export const TRACK_COUNT = 3

/* Seven Risograph inks at 40% tint. The page prints each society as a
 * flooded panel with dark indigo type knocked out of it, so these must
 * be light enough to carry that type at full contrast — the earlier
 * near-black-with-a-14%-border scheme never let the colour reach the
 * eye at all. Held at comparable lightness so no society shouts. */
export const SOCIETIES = {
    CS: {
        code: 'CS',
        name: 'IEEE Computer Society',
        short: 'Computer Society',
        accent: '#a6c8f2',
        logo: '/ieee-cs-logo.webp',
    },
    SIGHT: {
        code: 'SIGHT',
        name: 'IEEE Special Interest Group on Humanitarian Technology',
        short: 'SIGHT',
        accent: '#a8e6e0',
        logo: '/ieee-sight-logo.webp',
    },
    SPS: {
        code: 'SPS',
        name: 'IEEE Signal Processing Society',
        short: 'Signal Processing',
        accent: '#c6b2ec',
        logo: '/ieee-sps-logo.webp',
    },
    WIE: {
        code: 'WIE',
        name: 'IEEE Women in Engineering',
        short: 'Women in Engineering',
        accent: '#ffaad6',
        logo: '/Docs/ieee-wie-logo.webp',
    },
    PELS: {
        code: 'PELS',
        name: 'IEEE Power Electronics Society',
        short: 'Power Electronics',
        accent: '#ffbc9b',
        logo: '/ieee-logo.webp',
    },
    ITSS: {
        code: 'ITSS',
        name: 'IEEE Intelligent Transportation Systems Society',
        short: 'Intelligent Transportation',
        accent: '#f2e68c',
        logo: '/ieee-itss-logo.webp',
    },
    SBNU: {
        code: 'SBNU',
        name: 'IEEE Student Branch Nirma University',
        short: 'Student Branch',
        accent: '#9edcb8',
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
