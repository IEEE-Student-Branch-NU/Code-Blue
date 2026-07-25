import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
    EffectComposer,
    RenderPass,
    EffectPass,
    BloomEffect,
    ChromaticAberrationEffect,
    NoiseEffect,
    VignetteEffect,
    BlendFunction,
} from 'postprocessing'
import { gsap } from 'gsap'
import { vertexShader, fragmentShader } from './blackHoleShader'
import { PULSE_EVENT } from './pulse'
import { field, projectHole } from './field'

/* ─── The anomaly ─────────────────────────────────────────────────
 * Plain three.js on purpose. This is one fullscreen quad running one
 * shader — a reconciler and a scene graph would be pure overhead, and
 * react-three-fiber v9 wants React 19 which this site is not on.
 *
 * Owns the cold open. Nothing exists at t=0 — no stars, no hole, flat
 * spacetime — and the whole birth is four uniforms driven by one
 * timeline. The shader has no notion of an "intro"; it renders
 * whatever spacetime it is handed.
 * ---------------------------------------------------------------- */

const tier = () => {
    const narrow = window.innerWidth < 820
    const weak = (navigator.hardwareConcurrency || 8) <= 4
    /* The march is the entire cost. Type is DOM and stays sharp
       whatever this renders at, so resolution is the first thing to
       give up on a slow device. */
    return narrow || weak
        ? { steps: 40, scale: 0.46 }
        : { steps: 54, scale: 0.55 }
}

const Anomaly = ({ onFormed }) => {
    const hostRef = useRef(null)
    const formedRef = useRef(onFormed)
    formedRef.current = onFormed

    useEffect(() => {
        const host = hostRef.current
        if (!host) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const { steps, scale } = tier()

        let renderer
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
            })
        } catch {
            /* No WebGL: the hero still has its type, on black. */
            return
        }

        /* The shader outputs display-ready sRGB, so three must not
           convert it a second time. */
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace
        renderer.setClearColor(0x000000, 1)
        host.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

        const uniforms = {
            uResolution: { value: new THREE.Vector2(1, 1) },
            uTime: { value: 0 },
            uCamPos: { value: new THREE.Vector3(0, 3.4, 40) },
            uCamTarget: { value: new THREE.Vector3(2.4, -0.35, 0) },
            uFov: { value: 1.5 },
            uFormation: { value: reduced ? 1 : 0 },
            uReveal: { value: reduced ? 1 : 0 },
            uSeed: { value: 0 },
            uDisk: { value: reduced ? 1 : 0 },
            uPulse: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
        }

        const material = new THREE.ShaderMaterial({
            vertexShader,
            /* STEPS has to be a compile-time constant in GLSL, so the
               quality tier is prepended rather than passed. */
            fragmentShader: `#define STEPS ${steps}\n${fragmentShader}`,
            uniforms,
            depthWrite: false,
            depthTest: false,
        })

        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
        quad.frustumCulled = false
        scene.add(quad)

        const composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))

        if (!reduced) {
            const bloom = new BloomEffect({
                luminanceThreshold: 0.3,
                luminanceSmoothing: 0.5,
                intensity: 1.05,
                mipmapBlur: true,
                radius: 0.8,
            })
            /* Barely there — enough to read as glass, not as a fault. */
            const aberration = new ChromaticAberrationEffect({
                offset: new THREE.Vector2(0.0006, 0.0009),
                radialModulation: true,
                modulationOffset: 0.35,
            })
            const grain = new NoiseEffect({
                blendFunction: BlendFunction.OVERLAY,
                premultiply: true,
            })
            grain.blendMode.opacity.value = 0.14

            const vignette = new VignetteEffect({ offset: 0.32, darkness: 0.62 })

            composer.addPass(new EffectPass(camera, bloom, aberration, grain, vignette))
        }

        /* ── size ───────────────────────────────────────────────── */
        const resize = () => {
            const w = host.clientWidth || window.innerWidth
            const h = host.clientHeight || window.innerHeight
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * scale)
            renderer.setSize(w, h, false)
            composer.setSize(w, h)
            uniforms.uResolution.value.set(w, h)
        }
        resize()
        window.addEventListener('resize', resize)

        /* ── pointer: space lags behind the cursor, never tracks it ─ */
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
        const onMove = (e) => {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2
        }
        if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })

        /* ── the ripple ─────────────────────────────────────────── */
        const onPulse = () => {
            gsap.fromTo(uniforms.uPulse,
                { value: 0.001 },
                { value: 1, duration: 1.9, ease: 'power2.out' })
        }
        window.addEventListener(PULSE_EVENT, onPulse)

        /* ── the birth ──────────────────────────────────────────── */
        let tl = null
        if (reduced) {
            formedRef.current?.()
        } else {
            tl = gsap.timeline()

            /* Darkness holds, but only just — the pause has to register
               without becoming a wait. */
            tl.to(uniforms.uReveal, { value: 1, duration: 2.6, ease: 'power1.inOut' }, 0.55)

            /* A distant point, brightening as it runs out of fuel. */
            tl.to(uniforms.uSeed, { value: 3.1, duration: 1.5, ease: 'power2.in' }, 1.25)

            /* The collapse accelerates the way a collapse does: barely
               moving, then all at once. power4.in is the whole
               difference between a fade-in and an implosion. */
            tl.to(uniforms.uFormation, { value: 1, duration: 2.5, ease: 'power4.in' }, 2.1)

            /* The seed is gone the instant the horizon closes over it. */
            tl.to(uniforms.uSeed, { value: 0, duration: 0.5, ease: 'power3.in' }, 4.05)

            /* Then matter finds its orbits and lights. */
            tl.to(uniforms.uDisk, { value: 1, duration: 1.9, ease: 'power2.out' }, 4.3)

            tl.call(() => formedRef.current?.(), null, 4.75)
        }

        /* ── loop ───────────────────────────────────────────────── */
        const clock = new THREE.Clock()
        let raf = 0
        let running = true

        const frame = () => {
            if (!running) return
            raf = requestAnimationFrame(frame)

            const delta = Math.min(clock.getDelta(), 0.05)
            const t = clock.elapsedTime
            uniforms.uTime.value = t

            const k = Math.min(1, delta * 1.7)
            mouse.x += (mouse.tx - mouse.x) * k
            mouse.y += (mouse.ty - mouse.y) * k
            uniforms.uMouse.value.set(mouse.x, mouse.y)

            /* The camera never stops. Sines at unrelated periods, so
               the drift has no loop the eye can catch. */
            const driftX = Math.sin(t * 0.047) * 1.5 + Math.sin(t * 0.019) * 0.7
            const driftY = Math.sin(t * 0.031) * 0.55 + Math.cos(t * 0.013) * 0.3
            const breathe = Math.sin(t * 0.023) * 0.9

            const portrait = uniforms.uResolution.value.x / uniforms.uResolution.value.y < 0.85

            /* The hole holds the right of the frame, so the camera is
               offset rather than the object moved off its own axis. */
            uniforms.uCamPos.value.set(
                driftX + mouse.x * 1.2,
                3.35 + driftY - mouse.y * 0.7,
                40.0 + breathe * 1.6
            )
            uniforms.uCamTarget.value.set(
                (portrait ? 0.2 : 2.4) + mouse.x * 0.32,
                portrait ? -0.1 : -0.35,
                0
            )
            uniforms.uFov.value = portrait ? 1.02 : 1.5

            /* Publish where the mass is, so the type can bend around it. */
            const proj = projectHole(uniforms.uCamPos.value, uniforms.uCamTarget.value,
                uniforms.uFov.value, host.clientWidth, host.clientHeight)
            if (proj) {
                field.x = proj.x
                field.y = proj.y
                field.strength = uniforms.uFormation.value
                field.ready = true
            }

            composer.render()
        }
        raf = requestAnimationFrame(frame)

        /* A hidden tab should not be marching photons. */
        const onVisibility = () => {
            if (document.hidden) {
                running = false
                cancelAnimationFrame(raf)
            } else if (!running) {
                running = true
                clock.getDelta()
                raf = requestAnimationFrame(frame)
            }
        }
        document.addEventListener('visibilitychange', onVisibility)

        return () => {
            running = false
            cancelAnimationFrame(raf)
            tl?.kill()
            window.removeEventListener('resize', resize)
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener(PULSE_EVENT, onPulse)
            document.removeEventListener('visibilitychange', onVisibility)
            composer.dispose()
            quad.geometry.dispose()
            material.dispose()
            renderer.dispose()
            if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
        }
    }, [])

    return <div className="td-anomaly" ref={hostRef} aria-hidden="true" />
}

export default Anomaly
