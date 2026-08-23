import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    FEST_NAME, FEST_YEAR, DATE_LABEL, VENUE_LABEL, CITY_LABEL, getCountdown,
} from '../lib/technodyssey'
import LaunchClock from '../components/technodyssey/LaunchClock'
import Itinerary from '../components/technodyssey/Itinerary'
import EventGallery from '../components/technodyssey/EventGallery'
import EventDetail from '../components/technodyssey/EventDetail'
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

    /* #itinerary / #events are meant to be deep-linkable, but the route
       is lazy and a browser does not retry the initial hash scroll once
       the target finally exists — so land on it ourselves, once, the
       same way `descend` does. */
    useEffect(() => {
        const hash = window.location.hash.slice(1)
        if (!hash) return
        const target = document.getElementById(hash)
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
                    <Link className="tdp__back" to="/">
                        <span aria-hidden="true">&#8592;</span>
                        Back to IEEE SBNU
                    </Link>

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
                <Itinerary onOpenEvent={openEvent} />
            </section>

            <section className="tdp__section" id="events">
                <h2 className="tdp__sectionhead">
                    <span className="tdp__sectionhead-index">02</span>
                    The events
                </h2>
                <EventGallery onOpenEvent={openEvent} phase={phase} />
            </section>

            <EventDetail eventId={openEventId} phase={phase} onClose={closeEvent} />
        </main>
    )
}

export default Technodyssey
