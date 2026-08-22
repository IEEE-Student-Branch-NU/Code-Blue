import React, { useState } from 'react'
import { societyOf } from '../../lib/technodysseyEvents'
import './EventPoster.css'

/* A deterministic starfield: seeded from the event id, so the same
 * event gets the same sky on every render and between paints. Math.random
 * would shift the stars on every re-render, which reads as a glitch. */
const starfield = (seed, count = 34) => {
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0

    const next = () => {
        h = (h * 1664525 + 1013904223) >>> 0
        return h / 4294967296
    }

    return Array.from({ length: count }, () => ({
        x: next() * 100,
        y: next() * 100,
        r: 0.4 + next() * 1.1,
        o: 0.15 + next() * 0.55,
    }))
}

const EventPoster = ({ event }) => {
    const society = societyOf(event)
    const [failed, setFailed] = useState(false)
    const stars = React.useMemo(() => starfield(event.id), [event.id])

    if (!failed && event.poster) {
        return (
            <img
                className="tdposter__img"
                src={event.poster}
                alt={`${event.name} poster`}
                loading="lazy"
                onError={() => setFailed(true)}
            />
        )
    }

    return (
        <div className="tdposter__plate" style={{ '--accent': society.accent }} role="img"
            aria-label={`${event.name} — poster to be released`}>
            <svg className="tdposter__stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {stars.map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.22} fill="#f7f4ee" opacity={s.o} />
                ))}
            </svg>
            <span className="tdposter__glyph" aria-hidden="true">{society.code}</span>
            <span className="tdposter__label">
                <em>{event.name}</em>
                <i>Poster to be released</i>
            </span>
        </div>
    )
}

export default EventPoster
