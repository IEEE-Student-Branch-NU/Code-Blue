import React, { useCallback, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { partNumber, revision, parameterRows, NIL } from '../lib/events'

const FOCUSABLE =
    'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

const stamp = (date) => (date ? date.toISOString().slice(0, 10) : NIL)

/* Page 2 of the datasheet: the same document as the card, opened out.
 * Everything the API returns is on this page, including the identifiers,
 * which sit in a document-control block at the foot the way a real sheet
 * carries its revision metadata. */
const EventSheet = ({ event, onClose }) => {
    const dialogRef = useRef(null)
    const restoreTo = useRef(null)

    /* Whatever opened the sheet gets focus back when it closes, so
       keyboard users land on the card they were just reading. */
    useEffect(() => {
        restoreTo.current = document.activeElement
        const opened = restoreTo.current
        return () => {
            if (opened instanceof HTMLElement) opened.focus()
        }
    }, [])

    useEffect(() => {
        dialogRef.current?.focus()

        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = overflow
        }
    }, [])

    const onKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation()
                onClose()
                return
            }
            if (e.key !== 'Tab') return

            /* Queried per keypress rather than cached: the sheet's
               focusables depend on which fields the event actually has. */
            const items = [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
            if (!items.length) return

            const first = items[0]
            const last = items[items.length - 1]
            const active = document.activeElement

            if (e.shiftKey && (active === first || active === dialogRef.current)) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && active === last) {
                e.preventDefault()
                first.focus()
            }
        },
        [onClose]
    )

    const part = partNumber(event)
    const rev = revision(event)
    const rows = parameterRows(event, { long: true })

    return (
        <div className="ev-sheet-backdrop" onMouseDown={onClose}>
            <div
                className="ev-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ev-sheet-title"
                tabIndex={-1}
                ref={dialogRef}
                onKeyDown={onKeyDown}
                /* The backdrop closes on click; the sheet itself must not
                   pass that click up to it. */
                onMouseDown={(e) => e.stopPropagation()}
            >
                <header className="ev-sheet-head">
                    <span className="ev-part">{part}</span>
                    <span className="ev-rev">
                        {rev ? `${rev} · ` : ''}SHEET 2 OF 2
                    </span>
                    <button
                        type="button"
                        className="ev-sheet-close"
                        onClick={onClose}
                        aria-label="Close datasheet"
                    >
                        <X size={18} />
                    </button>
                </header>

                <div className="ev-sheet-body">
                    {event.banner && (
                        <figure className="ev-sheet-fig">
                            <img src={event.banner} alt="" decoding="async" />
                            <figcaption>FIG. 1 — EVENT BANNER</figcaption>
                        </figure>
                    )}

                    <h2 className="ev-sheet-name" id="ev-sheet-title">
                        {event.name}
                    </h2>

                    <div className="ev-sheet-cols">
                        <div className="ev-sheet-desc">
                            <span className="ev-sheet-label">1. DESCRIPTION</span>
                            {event.description ? (
                                <p>{event.description}</p>
                            ) : (
                                <p className="is-nil">
                                    No description was filed for this event.
                                </p>
                            )}

                            {(event.organizerEmail || event.registrationUrl) && (
                                <>
                                    <span className="ev-sheet-label">2. CONTACT</span>
                                    <ul className="ev-sheet-links">
                                        {event.registrationUrl && (
                                            <li>
                                                <a
                                                    href={event.registrationUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Registration →
                                                </a>
                                            </li>
                                        )}
                                        {event.organizerEmail && (
                                            <li>
                                                <a href={`mailto:${event.organizerEmail}`}>
                                                    {event.organizerEmail}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </>
                            )}
                        </div>

                        <dl className="ev-table ev-table-wide">
                            {rows.map(([key, value]) => (
                                <div className="ev-row" key={key}>
                                    <dt>{key}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                <footer className="ev-sheet-foot">
                    <span>DOC ID {event.id || NIL}</span>
                    <span>ISSUED {stamp(event.createdAt)}</span>
                    <span>REVISED {stamp(event.updatedAt)}</span>
                </footer>
            </div>
        </div>
    )
}

export default EventSheet
