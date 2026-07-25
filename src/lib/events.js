/* ─── Events — single source of truth ─────────────────────────────
 * Read by the Events page. One GET against the IEEE Atrium portal's
 * public endpoint, documented as:
 *
 *   GET {API_BASE}/api/public/events
 *       ?status=published|completed  &branch=<slug>
 *       &startDate=<iso> &endDate=<iso> &limit=<n> &page=<n>
 *
 * Atrium only ever exposes approved events here, so anything this
 * module returns is safe to render publicly.
 *
 * NOTE (2026-07-26): the endpoint currently 307-redirects to /login
 * and sends no CORS headers, so every browser call fails and the page
 * falls back to FALLBACK_EVENTS below. Two fixes are needed on the
 * Atrium side, not here — see docs/EVENTS_API_HANDOFF.md.
 * ---------------------------------------------------------------- */

export const API_BASE =
    import.meta.env.VITE_ATRIUM_API_BASE || 'https://atrium.ieeenirma.org'

export const EVENTS_PATH = '/api/public/events'

/* Atrium's status vocabulary, mapped to the two tabs. An event is
   "upcoming" until an organiser marks it completed. */
export const UPCOMING = 'published'
export const PAST = 'completed'

export const PAGE_SIZE = 9
const TIMEOUT_MS = 10000

/* ─── The request ─────────────────────────────────────────────── */

export const eventsUrl = ({ status, branch, page = 1, limit = PAGE_SIZE } = {}) => {
    const url = new URL(EVENTS_PATH, API_BASE)
    if (status) url.searchParams.set('status', status)
    if (branch && branch !== ALL_BRANCHES) url.searchParams.set('branch', branch)
    url.searchParams.set('page', String(page))
    url.searchParams.set('limit', String(limit))
    return url.toString()
}

/* Resolves to { events, meta }. Throws on anything else — network,
 * CORS, non-2xx, or the login page arriving where JSON was expected.
 * The caller decides what to show; see useEvents in the page. */
export const fetchEvents = async ({ signal, ...query } = {}) => {
    /* Our own deadline on top of the caller's abort, so a hanging
       request can't leave the page spinning forever. */
    const timer = new AbortController()
    const stop = setTimeout(() => timer.abort(), TIMEOUT_MS)
    signal?.addEventListener('abort', () => timer.abort(), { once: true })

    try {
        const res = await fetch(eventsUrl(query), {
            signal: timer.signal,
            headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error(`Events API responded ${res.status}`)

        const body = await res.json()
        return {
            events: (Array.isArray(body?.data) ? body.data : []).map(normalizeEvent),
            meta: body?.meta ?? null,
        }
    } finally {
        clearTimeout(stop)
    }
}

/* ─── Normalising ─────────────────────────────────────────────── */

const text = (value) => (typeof value === 'string' ? value.trim() : '')

/* `banner` is documented as an object but has been seen as a bare
   string, and is absent on events nobody uploaded art for. */
const bannerUrl = (banner) => {
    if (typeof banner === 'string') return banner.trim()
    return text(banner?.url)
}

const boolOrNull = (value) => (typeof value === 'boolean' ? value : null)

const toDate = (value) => {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

/* Every field the UI touches, with a defined fallback. Nothing
   downstream has to null-check an API response again. */
export const normalizeEvent = (raw) => ({
    id: text(raw?.id) || null,
    name: text(raw?.name) || 'Untitled event',
    description: text(raw?.description),
    date: toDate(raw?.event_date),
    location: text(raw?.location),
    capacity: Number.isFinite(raw?.capacity) ? raw.capacity : null,
    organizerEmail: text(raw?.organizer_email),
    banner: bannerUrl(raw?.banner),
    status: text(raw?.status) || UPCOMING,
    branchName: text(raw?.branches?.name),
    branchSlug: text(raw?.branches?.slug).toLowerCase(),
    eventType: text(raw?.event_types?.name) || text(raw?.event_type?.name),
    createdAt: toDate(raw?.created_at),
    updatedAt: toDate(raw?.updated_at),
    registrationUrl: text(raw?.registration_url),
    /* Read off the event, falling back to `banner.is_free` — the
       portal team's own sample component reads it there. Left null
       when absent so an unknown fee prints nothing rather than
       advertising an event as free on a guess. */
    isFree: boolOrNull(raw?.is_free) ?? boolOrNull(raw?.banner?.is_free),
})

/* ─── Datasheet presentation ──────────────────────────────────── */

export const ALL_BRANCHES = 'all'

/* Datasheets have part numbers, so events get one: branch code plus
   four digits derived from the event id. Same event, same number on
   every render and every visitor's screen — it is a label, not an ID,
   and it only has to be stable and plausible. */
export const partNumber = (event) => {
    const branch = (event.branchSlug || 'sb').toUpperCase().slice(0, 4)
    const seed = event.id || event.name
    let hash = 0
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) % 10000
    }
    return `SBNU-${branch}-${String(hash).padStart(4, '0')}`
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

/* An em dash, not "TBA" or "unknown" — on a spec sheet an unpopulated
   parameter is a dash, and it reads as deliberate rather than broken. */
export const NIL = '—'

export const dateLine = (date) => {
    if (!date) return NIL
    return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export const timeLine = (date) => {
    if (!date) return NIL
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: false,
    })
}

export const revision = (event) => {
    const date = event.updatedAt || event.createdAt || event.date
    if (!date) return ''
    return `REV ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

/* The parameters worth printing, in reading order.
 *
 * Only populated ones are returned. A dash in a table of otherwise
 * filled rows reads as "not applicable"; a table where five of six
 * rows are dashes just reads as broken, which is exactly what the
 * archive events look like — we have their posters and nothing else.
 * A real datasheet lists the parameters that apply and omits the rest,
 * so this does too. */
export const parameterRows = (event, { long = false } = {}) => {
    const all = [
        ['DATE', dateLine(event.date)],
        ['TIME', timeLine(event.date)],
        [long ? 'LOCATION' : 'LOC', event.location],
        [
            long ? 'CAPACITY' : 'CAP',
            event.capacity == null
                ? ''
                : `${event.capacity}${long ? ' attendees max' : ' max'}`,
        ],
        ['BRANCH', event.branchName],
        ['TYPE', event.eventType],
        ['FEE', event.isFree == null ? '' : event.isFree ? 'FREE' : 'PAID'],
    ]

    const rows = all.filter(([, value]) => value && value !== NIL)

    /* The sheet always states where the event stands, even when every
       other parameter is missing, so the table is never empty. */
    if (long) rows.push(['STATUS', event.status === PAST ? 'COMPLETED' : 'PUBLISHED'])

    return rows
}

/* ─── Fallback ────────────────────────────────────────────────── */

/* Shown only when the request above fails. Every entry is a real IEEE
 * SBNU event with art already in /public — the past ones from the
 * Carnival, the upcoming ones from src/lib/technodyssey.js. Fields we
 * genuinely do not have are left empty on purpose so they render as a
 * dash rather than as a guess. Delete this array once Atrium serves
 * the endpoint; nothing else depends on it.
 */
const carnival = (name, banner) => ({
    id: `carnival-${banner}`,
    name,
    description: '',
    event_date: null,
    location: 'Nirma University',
    capacity: null,
    organizer_email: '',
    banner: { url: `/Carnival/${banner}.webp` },
    status: PAST,
    branches: null,
    event_types: null,
})

export const FALLBACK_EVENTS = [
    {
        id: 'technodyssey-novahack-2026',
        name: 'NovaHack 2026',
        description:
            'The Computer Society track at Technodyssey 2026 — a hackathon run across the two days of the fest at Nirma University. Registration is handled on KonfHub.',
        event_date: '2026-08-22T08:00:00+05:30',
        location: 'Nirma University, Ahmedabad',
        capacity: null,
        organizer_email: '',
        banner: null,
        status: UPCOMING,
        branches: { name: 'IEEE Computer Society', slug: 'cs' },
        event_types: { name: 'Hackathon' },
        registration_url: 'https://konfhub.com/novahack-2026',
    },
    {
        id: 'technodyssey-mirrors-and-mud-2026',
        name: 'Mirrors & Mud',
        description:
            'A Lippan art workshop hosted by Women in Engineering as part of Technodyssey 2026. Registration is handled on KonfHub.',
        event_date: '2026-08-22T08:00:00+05:30',
        location: 'Nirma University, Ahmedabad',
        capacity: null,
        organizer_email: '',
        banner: null,
        status: UPCOMING,
        branches: { name: 'IEEE Women in Engineering', slug: 'wie' },
        event_types: { name: 'Workshop' },
        registration_url: 'https://konfhub.com/mirrors-mud-a-lippan-art-workshop',
    },
    carnival('Next-Gen Intelligent Transportation Systems', 'ITSS'),
    carnival('Photonic Sensors', 'LUMISENSE'),
    carnival('FPGA Forge Workshops', 'FGPA WS'),
    carnival('Forged in Wire', 'DECODE THE CIRCUIT_FORGED IN WIRES'),
    carnival('Lambda Genie', 'LAMBDA-GENIE'),
    carnival('PromptVerse', '2'),
    carnival('Swarm Agentic AI', 'AGENTVERSE'),
    carnival('Ideathon', 'IDEATHON'),
    carnival('Hire Your Research Agent', 'HIRE_YR_RESEARCH_AGENT'),
    carnival('Bot Talks', 'BOT-TALKS'),
    carnival('Robowars', 'ROBOWARS'),
].map(normalizeEvent)

/* The API paginates and filters server-side; the fallback has to do it
   here so both paths behave identically from the page's point of view. */
export const fallbackPage = ({ status, branch, page = 1, limit = PAGE_SIZE }) => {
    const matching = FALLBACK_EVENTS.filter(
        (event) =>
            (!status || event.status === status) &&
            (!branch || branch === ALL_BRANCHES || event.branchSlug === branch)
    )
    const start = (page - 1) * limit
    return {
        events: matching.slice(start, start + limit),
        meta: {
            total: matching.length,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(matching.length / limit)),
        },
    }
}

/* Chips are built from whatever branches the data actually contains,
   so adding a branch in Atrium adds a chip here with no code change. */
export const branchesIn = (events) => {
    const seen = new Map()
    events.forEach((event) => {
        if (event.branchSlug && !seen.has(event.branchSlug)) {
            seen.set(event.branchSlug, event.branchName || event.branchSlug.toUpperCase())
        }
    })
    return [...seen].map(([slug, name]) => ({ slug, name }))
}
