/* ─── Technodyssey 2026 — single source of truth ──────────────────
 * Read by the Home hero (CosmosHero) and the sitewide bar
 * (TechnodysseyStrip). Edit here, both update. Once FEST_END passes
 * every surface retires itself and Home returns to its permanent hero.
 *
 * Dates mirror the branch's KonfHub listing:
 * https://konfhub.com/g/ieee-student-branch-nirma-university
 * KonfHub stores timestamps in UTC; they are written here in IST,
 * which is what the fest actually runs on.
 * ---------------------------------------------------------------- */

export const FEST_NAME = 'Technodyssey'
export const FEST_YEAR = '2026'

/* When the fest went public. Only used to scale the hero's sun —
 * see approachRatio() — so moving it changes where the sun starts,
 * nothing else. */
export const FEST_ANNOUNCED = new Date('2026-07-01T00:00:00+05:30')

export const FEST_START = new Date('2026-08-22T08:00:00+05:30')
export const FEST_END = new Date('2026-08-23T17:00:00+05:30')

export const KONFHUB_URL =
    'https://konfhub.com/g/ieee-student-branch-nirma-university'

export const DATE_LABEL = '22–23 August 2026'
export const VENUE_LABEL = 'Nirma University'
export const CITY_LABEL = 'Ahmedabad'

/* The events listed on KonfHub so far — the organisers have more
 * marked "Coming Soon". Adding one is a single entry here.
 *
 * `code` is the host society's own short form, used as the marker in
 * the hero; `accent` is the colour that code is set in. */
export const TRACKS = [
    {
        code: 'CS',
        name: 'NovaHack 2026',
        host: 'IEEE Computer Society',
        kind: 'Hackathon',
        url: 'https://konfhub.com/novahack-2026',
        accent: '#93b6dd',
    },
    {
        code: 'WIE',
        name: 'Mirrors & Mud',
        host: 'IEEE Women in Engineering',
        kind: 'Lippan art workshop',
        url: 'https://konfhub.com/mirrors-mud-a-lippan-art-workshop',
        accent: '#d9a271',
    },
]

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const isFestOver = () => Date.now() >= FEST_END.getTime()

const pad = (n, width = 2) => String(n).padStart(width, '0')
const clamp01 = (n) => Math.min(1, Math.max(0, n))

/* How far the fest has travelled from announcement to launch, 0 → 1.
 * The hero reads this directly as the sun's height above the monolith,
 * so the picture tells the time before the digits do. */
export const approachRatio = () => {
    const announced = FEST_ANNOUNCED.getTime()
    const start = FEST_START.getTime()
    return clamp01((Date.now() - announced) / (start - announced))
}

/* One object drives every surface.
 *   phase  'upcoming' | 'live' | 'over' — 'over' means stop rendering
 *   clock  the whole countdown as one mission-clock string, because
 *          four labelled boxes is the thing every other fest site does */
export const getCountdown = () => {
    const now = Date.now()
    const start = FEST_START.getTime()
    const end = FEST_END.getTime()

    const phase = now < start ? 'upcoming' : now < end ? 'live' : 'over'

    /* Before launch we count down to it; once it is running the clock
       flips to elapsed mission time, the way a real one does. */
    const total = phase === 'upcoming' ? start - now : Math.max(0, now - start)
    const sign = phase === 'upcoming' ? '−' : '+'  // real minus, not a hyphen

    const days = Math.floor(total / DAY)
    const hours = Math.floor((total % DAY) / HOUR)
    const minutes = Math.floor((total % HOUR) / MINUTE)
    const seconds = Math.floor((total % MINUTE) / SECOND)

    return {
        phase,
        total,
        days,
        hours,
        minutes,
        seconds,
        approach: phase === 'upcoming' ? approachRatio() : 1,
        clock: `T${sign}${pad(days, 3)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    }
}

export const phaseLabel = (phase) =>
    phase === 'live' ? 'Mission elapsed' : 'Time to launch'

/* Spoken once by screen readers instead of the digits, which would
 * otherwise be re-announced every second. */
export const countdownSpoken = ({ phase, days, hours, minutes }) => {
    if (phase === 'live') return `${FEST_NAME} ${FEST_YEAR} is happening now.`
    const parts = []
    if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`)
    if (hours) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`)
    if (!days) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)
    return `${FEST_NAME} ${FEST_YEAR} starts in ${parts.join(', ')}.`
}

export const openKonfhub = () => {
    window.open(KONFHUB_URL, '_blank', 'noopener,noreferrer')
}
