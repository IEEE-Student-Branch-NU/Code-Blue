import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    EVENTS, SCHEDULE, SOCIETIES,
    getEvent, societyOf, buildRuns, formatRange, formatTime, currentSlot,
} from '../../lib/technodysseyEvents'
import './Itinerary.css'

gsap.registerPlugin(ScrollTrigger)

/* ─── The running order ───────────────────────────────────────────
 * A ruled table, one record per session, grouped under a band for each
 * time slot. It replaces the old two-render-path layout — a parallel
 * track grid for wide viewports and a separate flat list for narrow
 * ones — with a single set of rows that restructure at 760px. One
 * render path, so a change to a row can only ever be made once.
 *
 * Colour does the work here: each row is flooded with its society's
 * Risograph ink and the type is knocked out of it in stock indigo, so
 * the day reads by colour before it reads by word.
 *
 * A row with a KonfHub link goes there. A row without one opens the
 * detail panel instead — never a dead click, and the ↗ appears only
 * when the link is real, so the affordance never lies.
 * ---------------------------------------------------------------- */

/* Only societies that actually appear, in first-appearance order —
 * a legend listing societies with nothing on the schedule is noise. */
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

/* Runs keyed by the row they begin on, so the table can emit a time
 * band followed by everything that starts in that band. */
const runsByStartRow = (columns) => {
    const byRow = new Map()
    columns.forEach((runs, col) => {
        runs.forEach((run) => {
            if (!byRow.has(run.fromRow)) byRow.set(run.fromRow, [])
            byRow.get(run.fromRow).push({ run, col })
        })
    })
    return byRow
}

const ItineraryRow = ({ event, society, day, run, dim, live, showVenue, onClick }) => (
    <button
        type="button"
        className={`itin__row${dim ? ' is-dim' : ''}${live ? ' is-live' : ''}`}
        style={{ '--accent': society.accent }}
        onClick={onClick}
        data-reveal
        aria-current={live ? 'time' : undefined}
        aria-label={
            `${event.name} — ${society.name}, ${day.day} ` +
            `${formatRange(run.from, run.to)}` +
            (event.konfhub ? '. Opens registration in a new tab.' : '. Opens details.')
        }
    >
        <span className="itin__c-time">
            {formatRange(run.from, run.to)}
            {live && <i className="itin__now">Now</i>}
        </span>
        <span className="itin__c-soc">{society.code}</span>
        <span className="itin__c-name">
            {event.name}
            {event.tba && <em> · name to be announced</em>}
        </span>
        <span className="itin__c-kind">{event.kind}</span>
        {showVenue && <span className="itin__c-venue">{event.venue || '—'}</span>}
        <span className="itin__c-act">
            <i>{event.konfhub ? 'Register ↗' : 'Details +'}</i>
        </span>
    </button>
)

const Itinerary = ({ onOpenEvent }) => {
    const rootRef = useRef(null)
    const [filter, setFilter] = useState(null)
    const legend = useMemo(usedSocieties, [])
    const [now] = useState(() => currentSlot())

    /* The column exists only once a venue does. Until then it would be
       a full column of em-dashes, and adding one to the data is still
       the one-line edit the handoff promises. */
    const showVenue = useMemo(() => EVENTS.some((e) => e.venue), [])

    const days = useMemo(
        () => SCHEDULE.map((day) => {
            const columns = buildRuns(day)
            const byRow = runsByStartRow(columns)
            let sessions = 0
            byRow.forEach((list) => { sessions += list.length })
            return { day, byRow, sessions }
        }),
        [],
    )

    /* Rows land in sequence, like ink laid down in passes. */
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
                    { opacity: 0, y: 18 },
                    {
                        opacity: 1, y: 0, duration: 0.62, stagger: 0.05, ease: 'power3.out',
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
            <div
                className={`itin__legend${filter ? ' is-filtered' : ''}`}
                role="group"
                aria-label="Filter by society"
            >
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
                            {s.code}
                        </button>
                    )
                })}
                {/* Always mounted, never unmounted on clear — clearing the filter
                    must not drop keyboard focus to <body>. Inactive, it fades out
                    and steps out of the tab order, but stays the same focused
                    node if it was the one just clicked. */}
                <button
                    type="button"
                    className={`itin__chip itin__chip--clear${filter ? '' : ' itin__chip--clear-hidden'}`}
                    tabIndex={filter ? 0 : -1}
                    onClick={() => setFilter(null)}
                >
                    Clear
                </button>
            </div>

            {days.map(({ day, byRow, sessions }, dayIndex) => (
                <section className="itin__day" key={day.iso} data-day>
                    <header className="itin__dayhead" data-reveal>
                        <h3>{day.day}</h3>
                        <span>{day.date}</span>
                        <b>
                            {`Day 0${dayIndex + 1}`}
                            {sessions > 0 && ` · ${sessions} session${sessions === 1 ? '' : 's'}`}
                        </b>
                    </header>

                    <div className={`itin__table${showVenue ? ' has-venue' : ''}`}>
                        <div className="itin__head" aria-hidden="true">
                            <span>Time</span>
                            <span>Society</span>
                            <span>Session</span>
                            <span>Format</span>
                            {showVenue && <span>Venue</span>}
                            <span />
                        </div>

                        {day.rows.length === 0 ? (
                            <p className="itin__tba" data-reveal>Schedule to be announced</p>
                        ) : day.rows.map((row, rowIndex) => {
                            if (row.lunch) {
                                return (
                                    <div className="itin__band itin__band--lunch" key={`l-${rowIndex}`} data-reveal>
                                        <b>{formatRange(row.from, row.to)} · Lunch</b>
                                        <em>All delegates</em>
                                    </div>
                                )
                            }

                            const here = byRow.get(rowIndex)
                            /* A continuation row of an event that began earlier
                               carries nothing of its own to print. */
                            if (!here) return null

                            return (
                                <React.Fragment key={`s-${rowIndex}`}>
                                    <div className="itin__band" data-reveal>
                                        <b>From {formatTime(row.from)}</b>
                                        <em>{here.length > 1 ? `${here.length} parallel` : '1 session'}</em>
                                    </div>
                                    {here.map(({ run, col }) => {
                                        const event = getEvent(run.eventId)
                                        const society = societyOf(event)
                                        const dim = filter && filter !== society.code
                                        const live = now
                                            && now.dayIndex === dayIndex
                                            && now.rowIndex >= run.fromRow
                                            && now.rowIndex < run.fromRow + run.span

                                        return (
                                            <ItineraryRow
                                                key={`${col}-${run.fromRow}`}
                                                event={event}
                                                society={society}
                                                day={day}
                                                run={run}
                                                dim={dim}
                                                live={live}
                                                showVenue={showVenue}
                                                onClick={activate(event)}
                                            />
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </section>
            ))}
        </div>
    )
}

export default Itinerary
