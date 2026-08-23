import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { getEvent, societyOf, eventSchedule } from '../../lib/technodysseyEvents'
import EventPoster from './EventPoster'
import './EventDetail.css'

/* Focusable descendants, in DOM order — enough for a trap in a panel
 * this small without pulling in a focus-management library. */
const FOCUSABLE =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const EventDetail = ({ eventId, phase, onClose }) => {
    const panelRef = useRef(null)
    const returnRef = useRef(null)
    /* Called unconditionally, before any early return, so hook order
       stays stable across renders. */
    const reduceMotion = useReducedMotion()
    const event = eventId ? getEvent(eventId) : null

    /* Remember what opened us, so focus goes back where it came from. */
    useEffect(() => {
        if (eventId) returnRef.current = document.activeElement
    }, [eventId])

    useEffect(() => {
        if (!event) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const panel = panelRef.current
        const first = panel?.querySelector(FOCUSABLE)
        first?.focus()

        const onKey = (e) => {
            if (e.key === 'Escape') { onClose(); return }
            if (e.key !== 'Tab' || !panel) return

            const items = Array.from(panel.querySelectorAll(FOCUSABLE))
            if (items.length === 0) return
            const firstItem = items[0]
            const lastItem = items[items.length - 1]

            if (e.shiftKey && document.activeElement === firstItem) {
                e.preventDefault()
                lastItem.focus()
            } else if (!e.shiftKey && document.activeElement === lastItem) {
                e.preventDefault()
                firstItem.focus()
            }
        }

        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = previousOverflow
            /* Only reach back if the element is still in the document. */
            if (returnRef.current && document.contains(returnRef.current)) {
                returnRef.current.focus()
            }
        }
    }, [event, onClose])

    const society = event ? societyOf(event) : null
    const when = event ? eventSchedule(event.id) : []

    const registerLabel =
        phase === 'over' ? 'Registration closed'
            : event?.konfhub ? 'Register on KonfHub'
                : 'Registration opens soon'

    return (
        <AnimatePresence>
            {event && (
                <motion.div
                    className="tddet"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={reduceMotion ? { duration: 0.12 } : { duration: 0.24 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="tddet__panel"
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tddet-title"
                        style={{ '--accent': society.accent }}
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                        transition={reduceMotion
                            ? { duration: 0.12 }
                            : { duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top-LEFT, and labelled. Sitting top-right it landed
                            directly under the site's fixed Menu button on a
                            phone, which made the overlay impossible to close. */}
                        <button className="tddet__close" type="button" onClick={onClose}
                            aria-label={`Close ${event.name}`}>
                            <X size={14} aria-hidden="true" />
                            Back
                        </button>

                        <div className="tddet__poster">
                            <EventPoster event={event} />
                        </div>

                        <div className="tddet__info">
                            <p className="tddet__society">
                                <span className="tddet__society-dot" aria-hidden="true" />
                                <span>{society.name}</span>
                            </p>

                            <h2 className="tddet__title" id="tddet-title">{event.name}</h2>
                            <p className="tddet__kind">{event.kind}</p>

                            {when.length > 0 && (
                                <dl className="tddet__when">
                                    <dt>When</dt>
                                    <dd>
                                        {when.map((w) => (
                                            <span key={`${w.day}-${w.from}`}>{w.label}</span>
                                        ))}
                                    </dd>
                                    {event.venue && (<><dt>Where</dt><dd><span>{event.venue}</span></dd></>)}
                                    {event.team && (<><dt>Format</dt><dd><span>{event.team}</span></dd></>)}
                                </dl>
                            )}

                            <p className="tddet__blurb">{event.blurb}</p>

                            {event.konfhub && phase !== 'over' ? (
                                <a className="tddet__go" href={event.konfhub}
                                    target="_blank" rel="noopener noreferrer">
                                    <span className="tddet__go-ring" aria-hidden="true" />
                                    <span className="tddet__go-face">
                                        <span className="tddet__go-key" aria-hidden="true" />
                                        {registerLabel}
                                    </span>
                                </a>
                            ) : (
                                <p className="tddet__pending">{registerLabel}</p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default EventDetail
