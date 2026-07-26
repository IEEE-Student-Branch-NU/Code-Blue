import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import {
    FEST_NAME,
    FEST_YEAR,
    DATE_LABEL,
    VENUE_LABEL,
    CITY_LABEL,
    TRACKS,
    KONFHUB_URL,
} from '../../lib/technodyssey'
import StardustTitle from './StardustTitle'
import LaunchClock from './LaunchClock'
import { emitPulse, emitReady } from './pulse'
import './technodyssey.css'

const Anomaly = React.lazy(() => import('./Anomaly'))

/* ─── Hero ────────────────────────────────────────────────────────
 * The composition is deliberately off-axis: the anomaly holds the
 * right of the frame, the type sits low and left against it, and the
 * space between them is the subject. Nothing is centred because
 * centring is the easy answer.
 *
 * Three states, in order — void, formed, assembled — and every piece
 * of the interface waits its turn.
 * ---------------------------------------------------------------- */

const TechnodysseyHero = ({ scrollTargetId }) => {
    const rootRef = useRef(null)
    const [formed, setFormed] = useState(false)
    const [assembled, setAssembled] = useState(false)

    const onFormed = useCallback(() => setFormed(true), [])
    const onAssembled = useCallback(() => {
        setAssembled(true)
        /* The darkness is over; anything holding back may come in. */
        emitReady()
    }, [])

    /* Everything else arrives only once the name has finished building
       itself — the interface is the last thing in, never the first. */
    useEffect(() => {
        if (!assembled || !rootRef.current) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const items = rootRef.current.querySelectorAll('[data-late]')

        if (reduced) {
            gsap.set(items, { opacity: 1, y: 0 })
            return
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(items,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 0.9, stagger: 0.075, ease: 'power3.out' }
            )
        }, rootRef)

        return () => ctx.revert()
    }, [assembled])

    const launch = useCallback(() => {
        /* The field answers the click before the tab opens. */
        emitPulse()
        window.setTimeout(() => {
            window.open(KONFHUB_URL, '_blank', 'noopener,noreferrer')
        }, 240)
    }, [])

    const descend = useCallback(() => {
        const target = scrollTargetId && document.getElementById(scrollTargetId)
        if (!target) return
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    }, [scrollTargetId])

    return (
        <header
            className={`td${formed ? ' is-formed' : ''}${assembled ? ' is-assembled' : ''}`}
            ref={rootRef}
        >
            <div className="td__field">
                <Suspense fallback={null}>
                    <Anomaly onFormed={onFormed} />
                </Suspense>
            </div>

            <div className="td__frame">
                <div className="td__mark" data-late>
                    <img src="/ieee-logo.webp" alt="" width="86" height="84" />
                    <span>
                        <strong>IEEE SBNU</strong>
                        <em>Student Branch · Nirma University</em>
                    </span>
                </div>

                <div className="td__lower">
                    <div className="td__type">
                        <p className="td__eyebrow" data-late>
                            <span aria-hidden="true" />
                            {DATE_LABEL} · {VENUE_LABEL}, {CITY_LABEL}
                        </p>

                        <StardustTitle
                            text={FEST_NAME}
                            active={formed}
                            onAssembled={onAssembled}
                        />

                        <p className="td__year" data-late>{FEST_YEAR}</p>

                        <button className="td__launch" type="button" onClick={launch} data-late>
                            <span className="td__launch-ring" aria-hidden="true" />
                            <span className="td__launch-face">
                                <span className="td__launch-key" aria-hidden="true" />
                                Begin registration
                            </span>
                        </button>
                    </div>

                    <div className="td__aside">
                        <div data-late><LaunchClock /></div>

                        <ul className="td__missions" data-late>
                            {TRACKS.map((t) => (
                                <li key={t.name}>
                                    <a href={t.url} target="_blank" rel="noopener noreferrer">
                                        <span className="td__mission-code">{t.code}</span>
                                        <span className="td__mission-name">{t.name}</span>
                                        <span className="td__mission-kind">{t.kind}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button className="td__descend" type="button" onClick={descend} data-late>
                    <span className="td__descend-line" aria-hidden="true" />
                    Descend
                </button>
            </div>
        </header>
    )
}

export default TechnodysseyHero
