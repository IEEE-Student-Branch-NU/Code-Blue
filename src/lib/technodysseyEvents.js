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
 * Posters are the organisers' own plates, 4:5, under /technodyssey/.
 * `tba: true` marks a name the organisers have not settled.
 * `dateNote` states a day for an event SCHEDULE cannot place yet; the
 * detail panel prefers real runs and falls back to it. */
export const EVENTS = [
    {
        id: 'stellar-shield',
        name: 'Stellar Shield',
        society: 'SPS',
        kind: 'Cybersecurity workshop',
        blurb: 'Learn, detect, investigate, defend — an introduction to the attacks that actually happen, and the defences that actually hold.',
        poster: '/technodyssey/Stellar_Shield.webp',
        konfhub: 'https://forms.gle/GATMKEZGQP7PPch46',
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'traject-iq',
        name: 'Traject IQ',
        society: 'ITSS',
        kind: 'Workshop',
        blurb: 'Build JARVIS for your vehicle: Intelligent Transportation Systems on a car that listens, reasons and answers back.',
        poster: '/technodyssey/Traject_IQ.webp',
        konfhub: 'https://docs.google.com/forms/d/e/1FAIpQLSfJHBvUN6EoFlhgwROzYRA8U9JDow2n5Z1Csk1hvhknUxQBKg/viewform?usp=dialog',
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'voices-in-motion',
        name: 'Voices in Motion — A Model Lok Sabha',
        society: 'SIGHT',
        kind: 'Model Lok Sabha',
        blurb: 'SIGHT convenes a full sitting of the house: motions raised, debated and put to the vote. Where ideas speak, leaders listen, and change begins.',
        poster: '/technodyssey/voices-in-motion.webp',
        konfhub: 'https://forms.gle/ti3RvEivrt7F3fUA6',
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
        konfhub: [
            { label: 'IEEE CS Form', url: 'https://forms.gle/BQbrZHzTgQbwe6856' },
            { label: 'MLH Form', url: 'https://events.mlh.com/events/14703-hack-days-ahmedabad' }
        ],
        registrationNote: 'It is compulsory to register on both forms.',
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'pixel-and-perception',
        name: 'Pixel and Perception',
        society: 'WIE',
        kind: 'Workshop',
        blurb: 'A workshop by IEEE Women in Engineering.',
        poster: '/technodyssey/Pixels_and_perception.webp',
        konfhub: 'https://docs.google.com/forms/d/17_N7UuWV3T47qlh837ZZ0lbsBcdska9zsbsJrAWZ2Ng/edit?chromeless=1',
        venue: null,
        team: null,
        tba: false,
    },
    {
        id: 'embedded-system',
        name: 'Protosphere — Embedded Systems & IoT 101',
        society: 'PELS',
        kind: 'Workshop',
        blurb: 'Power Electronics takes it from a bare board to a connected device, running from Saturday afternoon into Sunday morning.',
        poster: '/technodyssey/embedded-system.webp',
        konfhub: 'https://docs.google.com/forms/d/e/1FAIpQLSe0Scx7W05cZBK84_MtLMMRb7Qi5PuWCb9OAOpWrpKaoYDEsA/viewform?usp=header',
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
 * header. Traject IQ's poster dates it to the Friday, but the hour-by-
 * hour order for that day is unpublished, so it carries a `dateNote`
 * instead of an invented slot here. Friday renders a "Schedule to be
 * announced" plate until the organisers publish it. */
export const SCHEDULE = [
    {
        day: 'Friday',
        date: '25 September 2026',
        iso: '2026-09-25',
        rows: [
            { from: '16:00', to: '18:00', slots: ['stellar-shield', 'stellar-shield', 'stellar-shield'] },
        ],
    },
    {
        day: 'Saturday',
        date: '26 September 2026',
        iso: '2026-09-26',
        rows: [
            { from: '09:00', to: '11:00', slots: ['traject-iq', 'voices-in-motion', 'novahack'] },
            { from: '11:00', to: '12:00', lunch: true },
            { from: '12:00', to: '15:00', slots: ['pixel-and-perception', 'voices-in-motion', 'novahack'] },
            { from: '15:00', to: '18:00', slots: ['embedded-system', 'voices-in-motion', 'novahack'] },
        ],
    },
    {
        day: 'Sunday',
        date: '27 September 2026',
        iso: '2026-09-27',
        rows: [
            { from: '09:00', to: '12:00', slots: ['embedded-system', 'embedded-system', 'embedded-system'] },
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
