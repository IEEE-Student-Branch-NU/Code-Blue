import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    SCHEDULE, SOCIETIES,
    getEvent, societyOf, buildRuns, formatRange, formatTime, currentSlot,
} from '../../lib/technodysseyEvents'
import './Itinerary.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── The running order ───────────────────────────────────────────
 * A time rail and three tracks per day. The organisers' sheet splits a
 * continuous event across consecutive rows; buildRuns puts it back
 * together, so a tile spans what the event actually spans.
 *
 * A tile with a KonfHub link goes there. A tile without one opens the
 * detail panel instead — never a dead click, and the ↗ appears only
 * when the link is real, so the affordance never lies.
 * ---------------------------------------------------------------- */

/* Only societies that actually appear, in first-appearance order —
 * a legend listing societies with nothing on the grid is noise. */
const usedSocieties = () => {
    const seen = []
    for (const day of SCHEDULE) {
        for (const row of day.rows) {
            if (row.lunch) continue
            for (const id of row.slots) {
                if (!id) continue
                const code = getEvent(id).society
                if (!seen.includes(code)) seen.push(code)
            }
        }
    }
    return seen.map((code) => SOCIETIES[code])
}

const Itinerary = ({ onOpenEvent }) => {
    const rootRef = useRef(null)
    const [filter, setFilter] = useState(null)
    const legend = useMemo(usedSocieties, [])
    const [now] = useState(() => currentSlot())

    const days = useMemo(
        () => SCHEDULE.map((day) => ({ day, columns: buildRuns(day) })),
        [],
    )

    /* Rows arrive as the reader comes down the rail. */
    useEffect(() => {
        const root = rootRef.current
        if (!root) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(root.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
            return
        }

        const ctx = gsap.context(() => {
            root.querySelectorAll('[data-day]').forEach((dayEl) => {
                gsap.fromTo(
                    dayEl.querySelectorAll('[data-reveal]'),
                    { opacity: 0, y: 26 },
                    {
                        opacity: 1, y: 0, duration: 0.75, stagger: 0.055, ease: 'power3.out',
                        scrollTrigger: { trigger: dayEl, start: 'top 82%', once: true },
                    },
                )
            })
        }, rootRef)

        return () => ctx.revert()
    }, [])

    const activate = (event) => () => {
        if (event.konfhub) {
            window.open(event.konfhub, '_blank', 'noopener,noreferrer')
            return
        }
        onOpenEvent(event.id)
    }

    return (
        <div className="itin" ref={rootRef}>
            <div className="itin__legend" role="group" aria-label="Filter by society">
                {legend.map((s) => {
                    const on = filter === s.code
                    return (
                        <button
                            key={s.code}
                            type="button"
                            className={`itin__chip${on ? ' is-on' : ''}`}
                            style={{ '--accent': s.accent }}
                            aria-pressed={on}
                            onClick={() => setFilter(on ? null : s.code)}
                        >
                            <span className="itin__chip-dot" aria-hidden="true" />
                            {s.code}
                        </button>
                    )
                })}
                {filter && (
                    <button type="button" className="itin__chip itin__chip--clear" onClick={() => setFilter(null)}>
                        Clear
                    </button>
                )}
            </div>

            {days.map(({ day, columns }, dayIndex) => (
                <section className="itin__day" key={day.iso} data-day>
                    <header className="itin__dayhead" data-reveal>
                        <h3>{day.day}</h3>
                        <span>{day.date}</span>
                    </header>

                    {day.rows.length === 0 ? (
                        <p className="itin__tba" data-reveal>Schedule to be announced</p>
                    ) : (
                        <>
                            <div className="itin__grid">
                                {day.rows.map((row, rowIndex) => (
                                    <div
                                        className="itin__time"
                                        key={`t-${rowIndex}`}
                                        style={{ gridRow: rowIndex + 1 }}
                                        data-reveal
                                    >
                                        {formatTime(row.from)}
                                        <i aria-hidden="true">{formatTime(row.to)}</i>
                                    </div>
                                ))}

                                {day.rows.map((row, rowIndex) => row.lunch && (
                                    <div
                                        className="itin__lunch"
                                        key={`l-${rowIndex}`}
                                        style={{ gridRow: rowIndex + 1 }}
                                        data-reveal
                                    >
                                        Lunch
                                    </div>
                                ))}

                                {columns.map((runs, col) => runs.map((run) => {
                                    const event = getEvent(run.eventId)
                                    const society = societyOf(event)
                                    const dim = filter && filter !== society.code
                                    const live = now
                                        && now.dayIndex === dayIndex
                                        && now.rowIndex >= run.fromRow
                                        && now.rowIndex < run.fromRow + run.span

                                    return (
                                        <button
                                            type="button"
                                            key={`${col}-${run.fromRow}`}
                                            className={`itin__tile${dim ? ' is-dim' : ''}${live ? ' is-live' : ''}`}
                                            style={{
                                                '--accent': society.accent,
                                                gridColumn: col + 2,
                                                gridRow: `${run.fromRow + 1} / span ${run.span}`,
                                            }}
                                            onClick={activate(event)}
                                            aria-current={live ? 'time' : undefined}
                                            aria-label={
                                                `${event.name} — ${society.name}, ${day.day} ` +
                                                `${formatRange(run.from, run.to)}` +
                                                (event.konfhub ? '. Opens registration in a new tab.' : '. Opens details.')
                                            }
                                        >
                                            <span className="itin__code">{society.code}</span>
                                            <span className="itin__name">{event.name}</span>
                                            <span className="itin__meta">
                                                <span className="itin__span">{formatRange(run.from, run.to)}</span>
                                                <span className="itin__kind">{event.kind}</span>
                                            </span>
                                            {event.konfhub && <span className="itin__out" aria-hidden="true">↗</span>}
                                        </button>
                                    )
                                }))}
                            </div>

                            <ol className="itin__list">
                                {day.rows.flatMap((row, rowIndex) => {
                                    if (row.lunch) {
                                        return [(
                                            <li className="itin__listlunch" key={`ml-${rowIndex}`} data-reveal>
                                                <span>{formatRange(row.from, row.to)}</span>
                                                Lunch
                                            </li>
                                        )]
                                    }
                                    return columns
                                        .flatMap((runs) => runs.filter((run) => run.fromRow === rowIndex))
                                        .map((run) => {
                                            const event = getEvent(run.eventId)
                                            const society = societyOf(event)
                                            const dim = filter && filter !== society.code
                                            return (
                                                <li key={`m-${rowIndex}-${run.eventId}`} data-reveal>
                                                    <button
                                                        type="button"
                                                        className={`itin__tile${dim ? ' is-dim' : ''}`}
                                                        style={{ '--accent': society.accent }}
                                                        onClick={activate(event)}
                                                        aria-label={
                                                            `${event.name} — ${society.name}, ${day.day} ` +
                                                            `${formatRange(run.from, run.to)}` +
                                                            (event.konfhub ? '. Opens registration in a new tab.' : '. Opens details.')
                                                        }
                                                    >
                                                        <span className="itin__code">{society.code}</span>
                                                        <span className="itin__name">{event.name}</span>
                                                        <span className="itin__meta">
                                                            <span className="itin__span">{formatRange(run.from, run.to)}</span>
                                                            <span className="itin__kind">{event.kind}</span>
                                                        </span>
                                                        {event.konfhub && <span className="itin__out" aria-hidden="true">↗</span>}
                                                    </button>
                                                </li>
                                            )
                                        })
                                })}
                            </ol>
                        </>
                    )}
                </section>
            ))}
        </div>
    )
}

export default Itinerary
