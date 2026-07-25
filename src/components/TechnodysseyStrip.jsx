import React, { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X } from 'lucide-react'
import {
    FEST_NAME,
    FEST_YEAR,
    DATE_LABEL,
    KONFHUB_URL,
    isFestOver,
} from '../lib/technodyssey'
import { useCountdown } from '../lib/useCountdown'
import { useAfterHero } from '../lib/useAfterHero'
import './TechnodysseyStrip.css'

/* ─── The fest, carried at the foot of every other page ───────────
 * Home doesn't need this until the hero has scrolled away, so it
 * takes `revealAfterHero` and waits. Same clock, same sun, one line
 * tall — the hero's composition reduced to its two smallest parts.
 * ---------------------------------------------------------------- */

const STORAGE_KEY = 'ieee-sbnu-technodyssey-2026-strip'

/* localStorage throws in private mode / blocked-cookie setups */
const wasDismissed = () => {
    try {
        return window.localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
        return false
    }
}

const markDismissed = () => {
    try {
        window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
        /* non-fatal — the bar just comes back next visit */
    }
}

const TechnodysseyStrip = ({ revealAfterHero = false }) => {
    const barRef = useRef(null)
    const { clock, phase } = useCountdown()

    /* Decided once, before first paint: over or already dismissed means
       this component never renders anything at all. */
    const [isEligible] = useState(() => !isFestOver() && !wasDismissed())

    /* On Home the hero already carries the fest, so hold the bar back
       until the reader has left it behind. */
    const afterHero = useAfterHero(revealAfterHero)
    const [isDismissed, setIsDismissed] = useState(false)
    const isVisible = afterHero && !isDismissed

    /* Keep the page's own last inch clear of the bar. */
    useEffect(() => {
        if (!isEligible || !isVisible) return
        const previous = document.body.style.paddingBottom
        document.body.style.paddingBottom = 'var(--td-strip-h)'
        return () => { document.body.style.paddingBottom = previous }
    }, [isEligible, isVisible])

    useEffect(() => {
        if (!isVisible || !barRef.current) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(barRef.current, { y: 0, opacity: 1 })
            return
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(barRef.current,
                { y: '100%', opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 }
            )
        }, barRef)

        return () => ctx.revert()
    }, [isVisible])

    const dismiss = useCallback(() => {
        markDismissed()

        if (!barRef.current) {
            setIsDismissed(true)
            return
        }

        gsap.to(barRef.current, {
            y: '100%',
            opacity: 0,
            duration: 0.35,
            ease: 'power3.in',
            onComplete: () => setIsDismissed(true),
        })
    }, [])

    if (!isEligible || !isVisible) return null

    return (
        <aside className="tdstrip" ref={barRef} aria-label={`${FEST_NAME} ${FEST_YEAR}`}>
            <span className="tdstrip__sun" aria-hidden="true" />

            <span className="tdstrip__name">
                {FEST_NAME} <span className="tdstrip__year">{FEST_YEAR}</span>
            </span>

            <span className="tdstrip__date">{DATE_LABEL}</span>

            <span className="tdstrip__clock">
                {phase === 'live' ? 'Happening now' : clock}
            </span>

            <a
                className="tdstrip__cta"
                href={KONFHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                Register
            </a>

            <button
                className="tdstrip__close"
                type="button"
                onClick={dismiss}
                aria-label={`Hide the ${FEST_NAME} bar`}
            >
                <X size={14} />
            </button>
        </aside>
    )
}

export default TechnodysseyStrip
