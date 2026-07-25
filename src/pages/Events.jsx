import React, { useCallback, useEffect, useRef, useState } from 'react'
import Footer from './Footer'
import Squares from '../components/Backgrounds/Squares/Squares'
import EventCard from '../components/EventCard'
import EventSheet from '../components/EventSheet'
import {
    fetchEvents, fallbackPage, branchesIn,
    UPCOMING, PAST, ALL_BRANCHES, PAGE_SIZE, API_BASE,
} from '../lib/events'
import './Events.css'

const TABS = [
    { id: UPCOMING, label: 'Upcoming' },
    { id: PAST, label: 'Past' },
]

const Events = () => {
    const [tab, setTab] = useState(UPCOMING)
    const [branch, setBranch] = useState(ALL_BRANCHES)
    const [page, setPage] = useState(1)

    const [state, setState] = useState({ status: 'loading', events: [], meta: null })
    /* Branches accumulate across loads. A single page of results only
       shows the branches on that page, and a filter that appears and
       disappears as you paginate is worse than one that grows. */
    const [branches, setBranches] = useState([])
    const [open, setOpen] = useState(null)

    const tabRefs = useRef([])

    useEffect(() => {
        const controller = new AbortController()
        setState((prev) => ({ ...prev, status: 'loading' }))

        const query = { status: tab, branch, page, limit: PAGE_SIZE }

        fetchEvents({ ...query, signal: controller.signal })
            .then((result) => ({ ...result, live: true }))
            .catch((error) => {
                if (controller.signal.aborted) return null
                if (import.meta.env.DEV) {
                    console.warn(
                        `[events] ${API_BASE} unreachable — showing curated fallback.`,
                        error
                    )
                }
                return { ...fallbackPage(query), live: false }
            })
            .then((result) => {
                if (!result || controller.signal.aborted) return
                setState({ status: 'ready', ...result })
                setBranches((prev) => {
                    const merged = new Map(prev.map((b) => [b.slug, b]))
                    branchesIn(result.events).forEach((b) => merged.set(b.slug, b))
                    return [...merged.values()]
                })
            })

        return () => controller.abort()
    }, [tab, branch, page])

    /* Both filters reset paging — page 3 of one filter is rarely a
       meaningful place to land in another. */
    const chooseTab = useCallback((id) => {
        setTab(id)
        setPage(1)
    }, [])

    const chooseBranch = useCallback((slug) => {
        setBranch(slug)
        setPage(1)
    }, [])

    const onTabKeyDown = (e) => {
        const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
        if (!delta) return
        e.preventDefault()
        const next = (TABS.findIndex((t) => t.id === tab) + delta + TABS.length) % TABS.length
        chooseTab(TABS[next].id)
        tabRefs.current[next]?.focus()
    }

    const totalPages = state.meta?.totalPages ?? 1
    const showChips = branches.length > 1

    return (
        <div className="ev-page">
            <div className="ev-bg">
                <Squares
                    direction="diagonal"
                    speed={0.15}
                    borderColor="#222"
                    squareSize={50}
                    hoverFillColor="#1a1a1a"
                />
            </div>

            <div className="ev-shell">
                <header className="ev-header">
                    <span className="ev-tag">/// EVENTS</span>
                    <h1 className="ev-title">
                        Event<span className="accent">Sheets</span>
                    </h1>
                    <p className="ev-lede">
                        Every workshop, hackathon and talk run by IEEE Student Branch
                        Nirma University — filed as specifications, published from the
                        branch&rsquo;s Atrium portal.
                    </p>
                </header>

                <div className="ev-controls">
                    <div className="ev-tabs" role="tablist" aria-label="Event timeframe">
                        {TABS.map((t, i) => (
                            <button
                                key={t.id}
                                type="button"
                                role="tab"
                                id={`ev-tab-${t.id}`}
                                aria-selected={tab === t.id}
                                aria-controls="ev-panel"
                                tabIndex={tab === t.id ? 0 : -1}
                                ref={(el) => { tabRefs.current[i] = el }}
                                className={`ev-tab${tab === t.id ? ' is-on' : ''}`}
                                onClick={() => chooseTab(t.id)}
                                onKeyDown={onTabKeyDown}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {showChips && (
                        <div className="ev-chips" role="group" aria-label="Filter by branch">
                            <button
                                type="button"
                                className={`ev-chip${branch === ALL_BRANCHES ? ' is-on' : ''}`}
                                aria-pressed={branch === ALL_BRANCHES}
                                onClick={() => chooseBranch(ALL_BRANCHES)}
                            >
                                ALL
                            </button>
                            {branches.map((b) => (
                                <button
                                    key={b.slug}
                                    type="button"
                                    className={`ev-chip${branch === b.slug ? ' is-on' : ''}`}
                                    aria-pressed={branch === b.slug}
                                    onClick={() => chooseBranch(b.slug)}
                                    title={b.name}
                                >
                                    {b.slug.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className="ev-panel"
                    id="ev-panel"
                    role="tabpanel"
                    aria-labelledby={`ev-tab-${tab}`}
                    tabIndex={-1}
                >
                    {state.status === 'loading' && (
                        <div className="ev-grid" aria-hidden="true">
                            {[0, 1, 2].map((i) => (
                                <div className="ev-card ev-skeleton" key={i}>
                                    <div className="ev-sk-head" />
                                    <div className="ev-sk-fig" />
                                    <div className="ev-sk-name" />
                                    <div className="ev-sk-rows" />
                                </div>
                            ))}
                        </div>
                    )}

                    <p className="ev-live" role="status">
                        {state.status === 'loading'
                            ? 'Loading events…'
                            : `${state.meta?.total ?? state.events.length} ${
                                tab === UPCOMING ? 'upcoming' : 'past'
                            } event${(state.meta?.total ?? state.events.length) === 1 ? '' : 's'}`}
                    </p>

                    {state.status === 'ready' && state.events.length === 0 && (
                        <div className="ev-empty">
                            <span className="ev-empty-code">NO RECORDS ON FILE</span>
                            <p>
                                {tab === UPCOMING
                                    ? 'Nothing is scheduled right now. New events are published here as soon as they are approved.'
                                    : 'No past events match this filter.'}
                            </p>
                            {branch !== ALL_BRANCHES && (
                                <button
                                    type="button"
                                    className="ev-chip"
                                    onClick={() => chooseBranch(ALL_BRANCHES)}
                                >
                                    CLEAR FILTER
                                </button>
                            )}
                        </div>
                    )}

                    {state.status === 'ready' && state.events.length > 0 && (
                        <div className="ev-grid">
                            {state.events.map((event) => (
                                <EventCard key={event.id} event={event} onOpen={setOpen} />
                            ))}
                        </div>
                    )}

                    {state.status === 'ready' && totalPages > 1 && (
                        <nav className="ev-pager" aria-label="Pagination">
                            <button
                                type="button"
                                className="ev-page-btn"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                ← PREV
                            </button>
                            <span className="ev-page-count">
                                SHEET {page} / {totalPages}
                            </span>
                            <button
                                type="button"
                                className="ev-page-btn"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                NEXT →
                            </button>
                        </nav>
                    )}
                </div>
            </div>

            {open && <EventSheet event={open} onClose={() => setOpen(null)} />}

            <Footer />
        </div>
    )
}

export default Events
