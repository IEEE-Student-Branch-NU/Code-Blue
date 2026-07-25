import React, { useEffect, useRef, useState } from 'react'
import { field } from './field'

/* ─── Stardust title ──────────────────────────────────────────────
 * Two things happen here.
 *
 * First the word is built: it is rasterised offscreen, its ink sampled
 * into a few thousand target points, and every point gets a particle
 * thrown out of the black hole on its own delay until it lands on its
 * letter. At 92% landed the canvas hands off to real DOM text — sharp,
 * selectable, legible to a screen reader — and keeps a thinned residue
 * drifting off the letterforms.
 *
 * Then it bends. Each letter is its own element, displaced away from
 * the hole by an inverse-distance law and stretched across the pull,
 * which is what lensing does to an image. The letters carry a slice of
 * one continuous gradient, so the light across the word stays whole no
 * matter how far the letters move.
 * ---------------------------------------------------------------- */

const SAMPLE_STEP = 4
const MAX_POINTS = 5200
const HANDOFF = 0.92

/* Tuned so the bend is legible as an effect and never as a problem. */
const PULL = 13000       // px² — deflection ∝ 1/distance
const PULL_MAX = 44      // px, hard cap
const NEAR = 380         // px, where the tangential stretch dies off

const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5)

const StardustTitle = ({ text, active, onAssembled }) => {
    const canvasRef = useRef(null)
    const wrapRef = useRef(null)
    const glyphsRef = useRef([])
    const [handedOff, setHandedOff] = useState(false)

    const letters = React.useMemo(() => text.split(''), [text])

    /* ── the bend, and the light travelling over it ─────────────── */
    useEffect(() => {
        if (!handedOff) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        /* Geometry is measured on a schedule rather than every frame:
           getBoundingClientRect on every letter is the expensive part,
           and letters do not change size between resizes. */
        let boxes = []
        let wordWidth = 1
        /* A phone puts the type much closer to the mass, so the same
           law would throw the letters far too far. */
        let reach = 1

        const measure = () => {
            const nodes = glyphsRef.current.filter(Boolean)
            if (!nodes.length) return
            const host = nodes[0].parentElement
            if (!host) return

            const hr = host.getBoundingClientRect()
            wordWidth = hr.width || 1
            reach = Math.min(1, window.innerWidth / 1180)

            boxes = nodes.map((n) => {
                /* Measured with the transform cleared, so a previous
                   frame's displacement cannot compound into the next. */
                const prev = n.style.transform
                n.style.transform = 'none'
                const r = n.getBoundingClientRect()
                n.style.transform = prev
                return { n, offset: r.left - hr.left, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
            })
        }

        measure()
        if (document.fonts?.ready) document.fonts.ready.then(measure)
        window.addEventListener('resize', measure)
        window.addEventListener('scroll', measure, { passive: true })

        let raf = 0
        let last = 0
        const t0 = performance.now()

        const paint = (now) => {
            raf = requestAnimationFrame(paint)
            /* The camera drifts slowly; twenty times a second is well
               past the point anyone can tell. */
            if (now - last < 50) return
            last = now

            const elapsed = (now - t0) / 1000
            /* One pass of light every eleven seconds, crossing quickly. */
            const cycle = (elapsed % 11) / 11
            const sheenX = (cycle < 0.34 ? cycle / 0.34 : 1.4) * (wordWidth + 400) - 200

            const s = field.ready && !reduced ? field.strength : 0

            for (const b of boxes) {
                const dx = b.cx - field.x
                const dy = b.cy - field.y
                const dist = Math.hypot(dx, dy) || 1

                /* Light bends toward the mass, so the image of a thing
                   appears pushed away from it — and stretched across
                   the pull, which is what lensing does to a shape. */
                const push = Math.min(PULL_MAX, PULL / Math.max(dist, 110)) * s * reach
                const near = Math.min(1, NEAR / dist) * s * reach

                /* Three things at once, which is what turns a shift into
                   a bend: pushed out along the radius, stretched across
                   it, and rotated to stay square to the field — so the
                   word curves around the mass instead of sliding past. */
                const tilt = -(dx / dist) * (dy / dist) * near * 36

                b.n.style.transform = s
                    ? `translate(${((dx / dist) * push).toFixed(2)}px, ${((dy / dist) * push).toFixed(2)}px) ` +
                      `rotate(${tilt.toFixed(2)}deg) ` +
                      `scale(${(1 + near * 0.07).toFixed(3)}, ${(1 + near * 0.19).toFixed(3)})`
                    : 'none'

                /* Two layers: the travelling highlight, then the letter's
                   own slice of the one gradient laid across the word. */
                b.n.style.backgroundSize = `220px 100%, ${wordWidth}px 100%`
                b.n.style.backgroundPosition =
                    `${(sheenX - b.offset).toFixed(1)}px 0, ${(-b.offset).toFixed(1)}px 0`
            }
        }

        raf = requestAnimationFrame(paint)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', measure)
            window.removeEventListener('scroll', measure)
        }
    }, [handedOff, letters])

    /* ── the assembly ───────────────────────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current
        const wrap = wrapRef.current
        if (!canvas || !wrap || !active) return

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setHandedOff(true)
            onAssembled?.()
            return
        }

        const ctx = canvas.getContext('2d')
        let raf = 0
        let particles = []
        let start = 0
        let dead = false
        let thinned = false
        let lastDraw = 0

        const build = () => {
            const rect = wrap.getBoundingClientRect()
            if (!rect.width || !rect.height) return false

            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(rect.width * dpr)
            canvas.height = Math.round(rect.height * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

            const probe = wrap.querySelector('[data-type-probe]')
            if (!probe) return false
            const cs = getComputedStyle(probe)

            const off = document.createElement('canvas')
            off.width = Math.round(rect.width)
            off.height = Math.round(rect.height)
            const octx = off.getContext('2d', { willReadFrequently: true })

            octx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
            octx.textAlign = 'left'
            octx.textBaseline = 'alphabetic'
            octx.fillStyle = '#fff'

            const pr = probe.getBoundingClientRect()
            octx.fillText(text, pr.left - rect.left,
                pr.bottom - rect.top - parseFloat(cs.fontSize) * 0.19)

            const img = octx.getImageData(0, 0, off.width, off.height).data
            const targets = []
            for (let y = 0; y < off.height; y += SAMPLE_STEP) {
                for (let x = 0; x < off.width; x += SAMPLE_STEP) {
                    if (img[(y * off.width + x) * 4 + 3] > 128) targets.push([x, y])
                }
            }
            if (!targets.length) return false

            /* Thin evenly rather than truncating, so a long word keeps
               its tail. */
            const stride = Math.max(1, Math.ceil(targets.length / MAX_POINTS))
            const kept = targets.filter((_, i) => i % stride === 0)

            /* Thrown from wherever the hole actually is. */
            const ox = field.ready ? field.x - rect.left : rect.width * 0.62
            const oy = field.ready ? field.y - rect.top : rect.height * 0.3

            particles = kept.map(([tx, ty]) => {
                const a = Math.random() * Math.PI * 2
                const d = 40 + Math.random() * 420
                return {
                    tx, ty,
                    sx: ox + Math.cos(a) * d,
                    sy: oy + Math.sin(a) * d * 0.55,
                    delay: Math.random() * 0.3 + (tx / rect.width) * 0.22,
                    dur: 1.05 + Math.random() * 0.6,
                    px: Math.random() * Math.PI * 2,
                    py: Math.random() * Math.PI * 2,
                    amp: 0.4 + Math.random() * 1.5,
                    size: Math.random() < 0.09 ? 1.7 : 1.0,
                    warm: Math.random() < 0.34,
                }
            })
            return true
        }

        const draw = (now) => {
            if (dead) return
            raf = requestAnimationFrame(draw)
            if (!start) start = now
            /* Half rate: the drift is far too slow for anyone to catch
               the difference, and it hands the budget to the shader. */
            if (now - lastDraw < 33) return
            lastDraw = now

            const t = (now - start) / 1000
            const rect = wrap.getBoundingClientRect()
            ctx.clearRect(0, 0, rect.width, rect.height)

            /* The dust is bent by the same field as the letters. */
            const hx = field.ready ? field.x - rect.left : -9999
            const hy = field.ready ? field.y - rect.top : -9999

            let landed = 0

            for (const p of particles) {
                const local = Math.min(1, Math.max(0, (t - p.delay) / p.dur))
                const e = easeOutQuint(local)
                if (local >= 1) landed++

                let x = p.sx + (p.tx - p.sx) * e
                let y = p.sy + (p.ty - p.sy) * e

                if (local >= 1) {
                    x += Math.sin(t * 0.55 + p.px) * p.amp
                    y += Math.cos(t * 0.42 + p.py) * p.amp * 0.7

                    const dx = x - hx
                    const dy = y - hy
                    const dist = Math.hypot(dx, dy) || 1
                    const push = Math.min(PULL_MAX, PULL / Math.max(dist, 110)) * field.strength
                    x += (dx / dist) * push
                    y += (dy / dist) * push
                }

                const alpha = local < 1
                    ? 0.25 + 0.75 * e
                    : 0.5 + 0.5 * Math.sin(t * 0.9 + p.px)

                ctx.fillStyle = p.warm
                    ? `rgba(228,181,93,${(alpha * 0.9).toFixed(3)})`
                    : `rgba(247,244,238,${alpha.toFixed(3)})`
                ctx.fillRect(x, y, p.size, p.size)
            }

            if (!thinned && landed / particles.length >= HANDOFF) {
                thinned = true
                setHandedOff(true)
                onAssembled?.()
                /* The swarm has done its job; a residue is enough to
                   keep shedding off the letterforms. */
                particles = particles.filter((_, i) => i % 9 === 0)
            }
        }

        const begin = () => { if (build()) raf = requestAnimationFrame(draw) }
        if (document.fonts?.ready) document.fonts.ready.then(begin)
        else begin()

        const onResize = () => { start = 0; build() }
        window.addEventListener('resize', onResize)

        return () => {
            dead = true
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onResize)
        }
    }, [active, text, onAssembled])

    return (
        <div className="td-title" ref={wrapRef}>
            <canvas className="td-title__dust" ref={canvasRef} aria-hidden="true" />

            <h1 className={`td-title__text${handedOff ? ' is-live' : ''}`} aria-label={text}>
                {/* The probe is never seen. It exists so the raster is
                    measured from the box the real headline occupies. */}
                <span className="td-title__probe" data-type-probe aria-hidden="true">{text}</span>

                <span className="td-title__word" aria-hidden="true">
                    {letters.map((ch, i) => (
                        <span
                            key={i}
                            className="td-title__glyph"
                            ref={(el) => { glyphsRef.current[i] = el }}
                        >
                            {ch}
                        </span>
                    ))}
                </span>
            </h1>
        </div>
    )
}

export default StardustTitle
