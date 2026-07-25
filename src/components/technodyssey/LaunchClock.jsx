import React, { useEffect, useState } from 'react'
import { getCountdown, phaseLabel, countdownSpoken } from '../../lib/technodyssey'

/* ─── Launch clock ────────────────────────────────────────────────
 * An odometer, not a seven-segment display. Each column holds the ten
 * digits stacked in a strip and rolls to the one it needs, so the
 * mechanism can never fall out of register — a split-flap has four
 * layers per digit that must agree with each other, and at instrument
 * size they do not.
 *
 * The overshoot in the easing is the whole point: the drum arrives,
 * settles back, and that half-beat is what reads as a machine.
 * ---------------------------------------------------------------- */

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const Drum = ({ value }) => (
    <span className="td-drum">
        <span
            className="td-drum__strip"
            style={{ transform: `translateY(${-value * 10}%)` }}
        >
            {DIGITS.map((d) => <i key={d}>{d}</i>)}
        </span>
        {/* the seam the drum turns behind */}
        <span className="td-drum__seam" aria-hidden="true" />
    </span>
)

const Cell = ({ value, label }) => (
    <div className="td-cell">
        <div className="td-cell__glass">
            {String(value).split('').map((d, i) => <Drum key={i} value={Number(d)} />)}
        </div>
        <span className="td-cell__label">{label}</span>
    </div>
)

const LaunchClock = () => {
    const [c, setC] = useState(getCountdown)

    useEffect(() => {
        const tick = () => setC(getCountdown())
        const id = setInterval(tick, 1000)
        /* Background tabs throttle intervals, so resync on return
           rather than trusting the tick count. */
        document.addEventListener('visibilitychange', tick)
        return () => {
            clearInterval(id)
            document.removeEventListener('visibilitychange', tick)
        }
    }, [])

    const pad = (n, w = 2) => String(n).padStart(w, '0')

    return (
        <div className="td-clock">
            <div className="td-clock__head">
                <span className="td-clock__led" aria-hidden="true" />
                <span>{phaseLabel(c.phase)}</span>
                <span className="td-clock__sign" aria-hidden="true">
                    {c.phase === 'upcoming' ? 'T−' : 'T+'}
                </span>
            </div>

            <div className="td-clock__row" aria-hidden="true">
                <Cell value={pad(c.days, 3)} label="Days" />
                <Cell value={pad(c.hours)} label="Hrs" />
                <Cell value={pad(c.minutes)} label="Min" />
                <Cell value={pad(c.seconds)} label="Sec" />
            </div>

            {/* Spoken once instead of the digits, which would otherwise
                be re-announced every second. */}
            <p className="td-sr">{countdownSpoken(c)}</p>
        </div>
    )
}

export default LaunchClock
