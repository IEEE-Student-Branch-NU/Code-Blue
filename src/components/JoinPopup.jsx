import React, { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X, ArrowRight } from 'lucide-react'
import {
    isCampaignLive,
    deadlineLabel,
    openForm,
    TRACE_PATH,
} from '../lib/joinCampaign'
import { READY_EVENT } from './technodyssey/pulse'
import { useAfterHero } from '../lib/useAfterHero'
import './JoinPopup.css'

/* Branch recruitment, not the fest — but it sits on the fest plate,
 * so it is cut from the same material: ink panel, hairline rule, IEEE
 * blue kept for the trace because that is the branch's own colour.
 *
 * Campaign dates and form URL live in src/lib/joinCampaign.js */
const STORAGE_KEY = 'ieee-sbnu-join-2026-07'
const SHOW_DELAY = 3500       // let the hero land first
const HERO_FALLBACK = 15000  // if the cold open never signals, come anyway

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
        /* non-fatal — the card just reappears next visit */
    }
}

const JoinPopup = ({ holdForHero = false }) => {
    const cardRef = useRef(null)
    const traceRef = useRef(null)

    // Decided once, before first paint: expired or already dismissed means
    // this component never renders anything at all.
    const [isEligible] = useState(() => isCampaignLive() && !wasDismissed())
    const [isMounted, setIsMounted] = useState(false)

    /* A phone has one screenful and the hero needs all of it — the card
       docks over the events and the descend cue at 360px wide. There it
       waits until the reader has left the hero behind; on a desktop it
       sits in a corner the composition leaves empty. */
    const narrow = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
    const pastHero = useAfterHero(holdForHero && narrow)

    /* Reveal after the delay — but never on top of the hero's cold
       open, which opens on darkness and has to stay that way. */
    useEffect(() => {
        if (!isEligible || !pastHero) return

        if (!holdForHero) {
            const timer = setTimeout(() => setIsMounted(true), SHOW_DELAY)
            return () => clearTimeout(timer)
        }

        let timer = 0
        const go = () => {
            window.removeEventListener(READY_EVENT, go)
            timer = setTimeout(() => setIsMounted(true), 900)
        }

        window.addEventListener(READY_EVENT, go)
        /* If WebGL never starts, the signal never comes — so the card
           still arrives on its own. */
        const fallback = setTimeout(go, HERO_FALLBACK)

        return () => {
            window.removeEventListener(READY_EVENT, go)
            clearTimeout(timer)
            clearTimeout(fallback)
        }
    }, [isEligible, holdForHero, pastHero])

    /* Orchestrated entrance: card arrives, trace draws, content settles */
    useEffect(() => {
        if (!isMounted || !cardRef.current) return

        const card = cardRef.current
        const trace = traceRef.current
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const content = card.querySelectorAll('[data-stagger]')

        if (reduced) {
            gsap.set(card, { opacity: 1, x: 0 })
            gsap.set(content, { opacity: 1, y: 0 })
            if (trace) gsap.set(trace, { strokeDashoffset: 0 })
            return
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            tl.fromTo(card,
                { opacity: 0, x: 48 },
                { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' }
            )

            if (trace) {
                tl.fromTo(trace,
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' },
                    '-=0.2'
                )
            }

            tl.fromTo(content,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' },
                '-=0.75'
            )
        }, card)

        return () => ctx.revert()
    }, [isMounted])

    /* Re-pulse the trace on hover */
    const pulseTrace = useCallback(() => {
        if (!traceRef.current) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        gsap.fromTo(traceRef.current,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut', overwrite: true }
        )
    }, [])

    const dismiss = useCallback(() => {
        markDismissed()

        if (!cardRef.current) {
            setIsMounted(false)
            return
        }

        gsap.to(cardRef.current, {
            x: 48,
            opacity: 0,
            duration: 0.35,
            ease: 'power3.in',
            onComplete: () => setIsMounted(false),
        })
    }, [])

    const apply = useCallback(() => {
        openForm()
        dismiss()  // they applied — don't ask again
    }, [dismiss])

    /* Esc closes it */
    useEffect(() => {
        if (!isMounted) return
        const onKeyDown = (e) => {
            if (e.key === 'Escape') dismiss()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isMounted, dismiss])

    if (!isEligible || !isMounted) return null

    return (
        <div
            ref={cardRef}
            className="join-popup"
            role="dialog"
            aria-label="Join IEEE SBNU"
            onMouseEnter={pulseTrace}
        >
            <button
                className="join-popup__close"
                onClick={dismiss}
                aria-label="Close"
                type="button"
            >
                <X size={16} />
            </button>

            <p className="join-popup__tag" data-stagger>/// Applications Open</p>

            <h3 className="join-popup__title" data-stagger>
                Join <span>IEEE SBNU</span>
            </h3>

            <svg
                className="join-popup__trace"
                viewBox="0 0 280 28"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    ref={traceRef}
                    d={TRACE_PATH}
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                />
            </svg>

            <p className="join-popup__body" data-stagger>
                Workshops, technical projects, and a global network of 400,000
                engineers — through the student branch at Nirma.
            </p>

            {/* Its own element, not a line inside the pitch: on a phone
                the pitch is dropped and the deadline still has to run. */}
            <p className="join-popup__deadline" data-stagger>{deadlineLabel()}</p>

            <button
                className="join-popup__cta"
                onClick={apply}
                type="button"
                data-stagger
            >
                Apply now
                <ArrowRight size={18} />
            </button>
        </div>
    )
}

export default JoinPopup
