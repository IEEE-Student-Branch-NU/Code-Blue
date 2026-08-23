import React, { useEffect, useState } from 'react'
import { societyOf } from '../../lib/technodysseyEvents'
import './EventPoster.css'

/* The real poster if there is one, and a printed ink plate if there is
 * not — so a missing file reads as a plate awaiting its art, never as a
 * broken image.
 *
 * The plate used to be a seeded starfield over a near-black gradient.
 * With the page printed rather than lit, it is now one society ink
 * flooded edge to edge under a halftone; the stars, and the seeded RNG
 * that kept them stable between paints, are gone with it. */
const EventPoster = ({ event }) => {
    const society = societyOf(event)
    const [failed, setFailed] = useState(false)
    /* A persisting instance handed a different event must retry the image —
       otherwise one event's missing poster would suppress the next one's. */
    useEffect(() => { setFailed(false) }, [event.id])

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
        <div
            className="tdposter__plate"
            style={{ '--accent': society.accent, '--code-len': society.code.length }}
            role="img"
            aria-label={`${event.name} — poster to be released`}>
            <span className="tdposter__ht" aria-hidden="true" />
            <span className="tdposter__glyph" aria-hidden="true">{society.code}</span>
            <span className="tdposter__label" aria-hidden="true">
                <em>{event.name}</em>
                <i>Poster to be released</i>
            </span>
        </div>
    )
}

export default EventPoster
