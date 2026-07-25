import React from 'react'
import { partNumber, revision, parameterRows, PAST } from '../lib/events'

/* One event, rendered as a component datasheet: part number and
 * revision in the header, the banner as a captioned figure, then the
 * parameters as a ruled table. Unpopulated parameters are a dash, the
 * way they are on a real sheet.
 *
 * The whole card is the button — an event has one destination, so
 * there is nothing to be gained from a separate hit target. */
const EventCard = ({ event, onOpen }) => {
    const isPast = event.status === PAST
    const part = partNumber(event)

    const rows = parameterRows(event)

    return (
        <article className={`ev-card${isPast ? ' is-past' : ''}`}>
            <button
                type="button"
                className="ev-card-btn"
                onClick={() => onOpen(event)}
                aria-label={`Open full datasheet for ${event.name}`}
            >
                <header className="ev-card-head">
                    <span className="ev-part">{part}</span>
                    <span className="ev-rev">{revision(event)}</span>
                </header>

                <figure className="ev-fig">
                    {event.banner ? (
                        <img
                            className="ev-fig-img"
                            src={event.banner}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        /* No art uploaded. Rather than a broken image or a
                           grey box, the sheet shows its own part number —
                           an unpopulated figure, still on-document. */
                        <div className="ev-fig-blank" aria-hidden="true">
                            <span>{part}</span>
                        </div>
                    )}
                    <figcaption className="ev-fig-cap">
                        FIG. 1 — {event.banner ? 'EVENT BANNER' : 'NO ART ON FILE'}
                    </figcaption>
                </figure>

                <h3 className="ev-card-name">{event.name}</h3>

                {rows.length > 0 && (
                    <dl className="ev-table">
                        {rows.map(([key, value]) => (
                            <div className="ev-row" key={key}>
                                <dt>{key}</dt>
                                <dd>{value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <footer className="ev-card-foot">
                    {isPast ? (
                        <span className="ev-stamp" aria-hidden="true">ARCHIVED</span>
                    ) : (
                        <span className="ev-pill">SCHEDULED</span>
                    )}
                    <span className="ev-more" aria-hidden="true">FULL SHEET →</span>
                </footer>
            </button>
        </article>
    )
}

export default EventCard
