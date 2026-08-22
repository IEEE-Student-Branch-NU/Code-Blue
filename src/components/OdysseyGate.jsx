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
            return () => { tl.kill() }
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
