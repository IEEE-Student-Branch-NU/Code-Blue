/* ─── Field state ─────────────────────────────────────────────────
 * Where the hole is on screen, and how strongly it is bending things.
 * Written by the shader's frame loop, read by the DOM that has to bend
 * around it. A plain mutable object on purpose — this updates sixty
 * times a second and must never touch React state.
 * ---------------------------------------------------------------- */

export const field = {
    /* viewport pixels; the centre of the frame until the loop starts */
    x: 0.5,
    y: 0.42,
    /* 0 → flat spacetime, 1 → fully formed */
    strength: 0,
    ready: false,

    /* 0 at the top of the hero, 1 once it has been scrolled past.
     * Drives the fall: the camera moves in, the lensing tightens, and
     * the type is drawn toward the hole and stretched along the pull.
     * Written by the hero on scroll, read by the shader and the type. */
    fall: 0,
}

/* Projects the hole (world origin) into screen space using the same
 * basis the shader builds its rays from, so the DOM and the render
 * agree on where the mass is. */
export const projectHole = (camPos, camTarget, fov, width, height) => {
    const fx = camTarget.x - camPos.x
    const fy = camTarget.y - camPos.y
    const fz = camTarget.z - camPos.z
    const fl = Math.hypot(fx, fy, fz) || 1
    const f = [fx / fl, fy / fl, fz / fl]

    /* right = normalize(cross(fwd, worldUp)) */
    let r = [f[2] * 1, 0, -f[0] * 1]
    const rl = Math.hypot(r[0], r[1], r[2]) || 1
    r = [r[0] / rl, r[1] / rl, r[2] / rl]

    /* up = cross(right, fwd) */
    const u = [
        r[1] * f[2] - r[2] * f[1],
        r[2] * f[0] - r[0] * f[2],
        r[0] * f[1] - r[1] * f[0],
    ]

    /* direction from the camera to the origin */
    const dl = Math.hypot(camPos.x, camPos.y, camPos.z) || 1
    const d = [-camPos.x / dl, -camPos.y / dl, -camPos.z / dl]

    const dz = d[0] * f[0] + d[1] * f[1] + d[2] * f[2]
    if (dz <= 0.0001) return null   // behind the camera

    const k = fov / dz
    const su = (d[0] * r[0] + d[1] * r[1] + d[2] * r[2]) * k
    const sv = (d[0] * u[0] + d[1] * u[1] + d[2] * u[2]) * k

    /* the shader stretches x by aspect, so undo it here */
    const aspect = width / height
    return {
        x: (su / aspect + 0.5) * width,
        y: (0.5 - sv) * height,
    }
}
