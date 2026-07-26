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

/* A smooth bell rather than 1/distance behind a hard cap. The cap
   pinned most letters to the same magnitude while their directions
   still differed, so neighbours slid into each other and the word
   collapsed on itself — measured at 5px of overlap by the last letter.
   This falls off continuously, so adjacent letters always move almost
   identically and the kerning survives the bend. */
const PULL_MAX = 26      // px at the centre of the field

const NEAR = 340         // px, where the tangential stretch dies off

/* The falloff width has to scale with the type. Fixed at 300px it was
 * wider than a phone's entire wordmark, so every letter sat at
 * effectively the same field strength and the whole word shifted as one
 * block — a translation, not a bend. Tied to the word, the field varies
 * across it at any size and the arc reads the same on both. */
const softFor = (wordWidth) => Math.max(105, wordWidth * 0.45)

const lensPush = (dist, soft) => (PULL_MAX * soft * soft) / (dist * dist + soft * soft)

/* The push is radial, so with the mass above the word the letters left
 * of centre go left and the ones right of centre go right — the word
 * splits down the middle. A wide screen absorbs that; a phone, where the
 * word nearly spans the viewport, does not.
 *
 * So the two halves are treated separately. Sideways is damped hard as
 * the screen narrows, because that is the half that breaks kerning.
 * Vertical is *boosted* on narrow screens instead — it cannot separate
 * letters, and differing drop across the word is what the eye actually
 * reads as gravity bending the type. */
const hDampFor = (reach) => Math.min(1, Math.max(0.1, (reach - 0.3) / 0.5))
const vGainFor = (reach) => 0.58 + 0.42 * reach

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
           law would throw the letters far too far sideways — but it
           wants *more* vertical drop, not less, to read as a bend. */
        let reach = 1
        let hDamp = 1
        let vGain = 1
        let soft = 300

        const measure = () => {
            const nodes = glyphsRef.current.filter(Boolean)
            if (!nodes.length) return
            const host = nodes[0].parentElement
            if (!host) return

            const hr = host.getBoundingClientRect()
            wordWidth = hr.width || 1
            reach = Math.min(1, window.innerWidth / 1180)
            hDamp = hDampFor(reach)
            vGain = vGainFor(reach)
            soft = softFor(wordWidth)

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
                const push = lensPush(dist, soft) * s
                const near = Math.min(1, NEAR / dist) * s * vGain

                /* Three things at once, which is what turns a shift into
                   a bend: pushed out along the radius, stretched across
                   it, and rotated to stay square to the field — so the
                   word curves around the mass instead of sliding past. */
                const tilt = -(dx / dist) * (dy / dist) * near * 18

                /* Scrolling draws the word in and stretches it along the
                   line to the mass. That is what a tidal field does to
                   anything falling: pulled out lengthwise, squeezed
                   across. The letters go the way the light does. */
                /* Reduced motion opts out of the fall as well as the drift. */
                const fall = reduced ? 0 : field.fall
                const drawIn = fall * fall * 34
                const stretch = 1 + fall * 1.05
                const squeeze = 1 - fall * 0.26

                /* Rotate into the field's frame, stretch along it, rotate
                   back — so the pull runs toward the hole at any angle,
                   not merely down the screen. */
                const ang = (Math.atan2(dy, dx) * 180) / Math.PI

                b.n.style.transform = s
                    ? `translate(${((dx / dist) * (push * hDamp * reach - drawIn)).toFixed(2)}px, ` +
                      `${((dy / dist) * (push * vGain - drawIn)).toFixed(2)}px) ` +
                      `rotate(${ang.toFixed(2)}deg) ` +
                      `scale(${stretch.toFixed(3)}, ${squeeze.toFixed(3)}) ` +
                      `rotate(${(-ang).toFixed(2)}deg) ` +
                      `rotate(${tilt.toFixed(2)}deg) ` +
                      `scale(${(1 + near * 0.05).toFixed(3)}, ${(1 + near * 0.13).toFixed(3)})`
                    : 'none'

                b.n.style.opacity = fall > 0.55
                    ? Math.max(0, 1 - (fall - 0.55) / 0.4).toFixed(3)
                    : '1'

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
        let glyphGeom = []
        let start = 0
        let dead = false
        let thinned = false
        let retireAt = 0
        let culled = false
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

            /* Every sampled point is assigned to the letter it belongs
               to, so the swarm can be bent by exactly the transform that
               letter will be wearing. Landing on the flat raster and
               then letting the type snap into its curve was the mismatch. */
            glyphGeom = glyphsRef.current.filter(Boolean).map((n) => {
                const prev = n.style.transform
                n.style.transform = 'none'
                const gr = n.getBoundingClientRect()
                n.style.transform = prev
                return {
                    x0: gr.left - rect.left,
                    x1: gr.right - rect.left,
                    cx: gr.left - rect.left + gr.width / 2,
                    cy: gr.top - rect.top + gr.height / 2,
                }
            })

            const glyphAt = (x) => {
                for (let i = 0; i < glyphGeom.length; i++) {
                    if (x >= glyphGeom[i].x0 && x <= glyphGeom[i].x1) return i
                }
                /* between letters — nearest wins */
                let best = 0
                let bestD = Infinity
                for (let i = 0; i < glyphGeom.length; i++) {
                    const d = Math.abs(x - glyphGeom[i].cx)
                    if (d < bestD) { bestD = d; best = i }
                }
                return best
            }

            /* Thin evenly rather than truncating, so a long word keeps
               its tail. */
            const stride = Math.max(1, Math.ceil(targets.length / MAX_POINTS))
            const kept = targets.filter((_, i) => i % stride === 0)

            /* Thrown from wherever the hole actually is. */
            const ox = field.ready ? field.x - rect.left : rect.width * 0.62
            const oy = field.ready ? field.y - rect.top : rect.height * 0.3

            particles = kept.map(([tx, ty], i) => {
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
                    /* the ninth that stays behind as drifting dust */
                    residue: i % 9 === 0,
                    gi: glyphAt(tx),
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

            /* Rebuild each letter's transform once per frame, using the
               same law and the same constants the DOM letters use, so
               the dust flies to exactly where the type will be. */
            const s = field.ready ? field.strength : 0
            const reach = Math.min(1, window.innerWidth / 1180)
            const hDamp = hDampFor(reach)
            const vGain = vGainFor(reach)
            /* Measured off the letters themselves, matching what the bend
               loop derives from the word box. */
            const soft = softFor(glyphGeom.length
                ? glyphGeom[glyphGeom.length - 1].x1 - glyphGeom[0].x0
                : rect.width)

            const gt = glyphGeom.map((g) => {
                const dx = rect.left + g.cx - field.x
                const dy = rect.top + g.cy - field.y
                const dist = Math.hypot(dx, dy) || 1

                const push = lensPush(dist, soft) * s
                const near = Math.min(1, NEAR / dist) * s * vGain
                const tilt = -(dx / dist) * (dy / dist) * near * 18 * (Math.PI / 180)

                return {
                    cx: g.cx, cy: g.cy,
                    tdx: (dx / dist) * push * hDamp * reach, tdy: (dy / dist) * push * vGain,
                    c: Math.cos(tilt), s: Math.sin(tilt),
                    sx: 1 + near * 0.05, sy: 1 + near * 0.13,
                }
            })

            /* The extras leave over most of a second while the real type
               fades up, so the two cross rather than swap. Culling them
               in a single frame was an eight-ninths drop in ink between
               two frames — that was the pop. */
            const retire = thinned ? Math.max(0, 1 - (t - retireAt) / 0.95) : 1

            let landed = 0

            for (const p of particles) {
                const local = Math.min(1, Math.max(0, (t - p.delay) / p.dur))
                const e = easeOutQuint(local)
                if (local >= 1) landed++

                /* The destination is the letter's bent position, not its
                   flat one, so the swarm converges onto the curve
                   instead of arriving straight and jumping into it. */
                const g = gt[p.gi] || gt[0]
                let rx = (p.tx - g.cx) * g.sx
                let ry = (p.ty - g.cy) * g.sy
                const bx = g.cx + (rx * g.c - ry * g.s) + g.tdx
                const by = g.cy + (rx * g.s + ry * g.c) + g.tdy

                let x = p.sx + (bx - p.sx) * e
                let y = p.sy + (by - p.sy) * e

                if (local >= 1) {
                    x += Math.sin(t * 0.55 + p.px) * p.amp
                    y += Math.cos(t * 0.42 + p.py) * p.amp * 0.7
                }

                const alpha = local < 1
                    ? 0.25 + 0.75 * e
                    : 0.5 + 0.5 * Math.sin(t * 0.9 + p.px)

                const a = p.residue ? alpha : alpha * retire
                if (a <= 0.004) continue

                ctx.fillStyle = p.warm
                    ? `rgba(228,181,93,${(a * 0.9).toFixed(3)})`
                    : `rgba(247,244,238,${a.toFixed(3)})`
                ctx.fillRect(x, y, p.size, p.size)
            }

            if (!thinned && landed / particles.length >= HANDOFF) {
                thinned = true
                retireAt = t
                setHandedOff(true)
                onAssembled?.()
            }

            /* Only once they are genuinely invisible is it safe to stop
               paying to draw them. */
            if (thinned && !culled && retire <= 0) {
                culled = true
                particles = particles.filter((q) => q.residue)
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
