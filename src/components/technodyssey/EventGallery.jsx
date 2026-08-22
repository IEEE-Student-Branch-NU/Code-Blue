import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EVENTS, societyOf } from '../../lib/technodysseyEvents'
import EventPoster from './EventPoster'
import './EventGallery.css'

gsap.registerPlugin(ScrollTrigger)

const EventGallery = ({ onOpenEvent, phase }) => {
    const rootRef = useRef(null)

    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        const cards = root.querySelectorAll('[data-card]')

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(cards, { opacity: 1, y: 0, rotateX: 0 })
            return
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(cards,
                { opacity: 0, y: 40, rotateX: 6 },
                {
                    opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out',
                    scrollTrigger: { trigger: root, start: 'top 84%', once: true },
                },
            )
        }, rootRef)

        return () => ctx.revert()
    }, [])

    const register = (event) => (e) => {
        e.stopPropagation()
        if (!event.konfhub) { onOpenEvent(event.id); return }
        window.open(event.konfhub, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="tdgal" ref={rootRef}>
            {EVENTS.map((event) => {
                const society = societyOf(event)
                return (
                    <article
                        className="tdgal__card"
                        key={event.id}
                        data-card
                        style={{ '--accent': society.accent }}
                    >
                        <div className="tdgal__frame">
                            <EventPoster event={event} />
                            <div className="tdgal__actions">
                                <button type="button" className="tdgal__act tdgal__act--primary"
                                    onClick={register(event)}>
                                    {phase === 'over'
                                        ? 'Closed'
                                        : event.konfhub ? 'Register' : 'Soon'}
                                </button>
                                <button type="button" className="tdgal__act"
                                    onClick={() => onOpenEvent(event.id)}>
                                    More
                                </button>
                            </div>
                        </div>

                        <button type="button" className="tdgal__body" onClick={() => onOpenEvent(event.id)}>
                            <span className="tdgal__code">{society.code}</span>
                            <h3 className="tdgal__name">
                                {event.name}
                                {event.tba && <em> · name to be announced</em>}
                            </h3>
                            <span className="tdgal__kind">{event.kind}</span>
                        </button>
                    </article>
                )
            })}
        </div>
    )
}

export default EventGallery
