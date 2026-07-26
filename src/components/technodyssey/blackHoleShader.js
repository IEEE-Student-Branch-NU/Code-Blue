/* ─── Schwarzschild black hole ────────────────────────────────────
 * Not geometry with a distortion filter over it. Each pixel fires a
 * photon and integrates its path through curved spacetime, so the
 * bending is computed rather than faked:
 *
 *   - stars behind the hole genuinely curve around it
 *   - the far side of the disk genuinely wraps over the top, because
 *     those photons really do come back around
 *   - the photon ring falls out of the physics; nothing draws it
 *
 * Units are Schwarzschild radii. The conserved quantity h² lets the
 * geodesic collapse to one line of acceleration — the standard
 * compact form of the null geodesic equation.
 * ---------------------------------------------------------------- */

export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
    vUv = uv;
    /* Fullscreen regardless of camera: the ray basis is built from
       uniforms, so the scene camera plays no part. */
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2  uResolution;
uniform float uTime;
uniform vec3  uCamPos;
uniform vec3  uCamTarget;
uniform float uFov;

uniform float uFormation;   // curvature: how hard spacetime bends
uniform float uHorizon;     // the black disc, which lags the bending
uniform float uReveal;      // 0 → void, 1 → full star field
uniform float uSeed;        // brightness of the pre-collapse point
uniform float uDisk;        // accretion disk brightness
uniform float uPulse;       // ripple from the launch control
uniform vec2  uMouse;       // -1..1, eased

const float PI = 3.14159265359;

/* ── noise ──────────────────────────────────────────────────────── */
float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
}

vec3 hash33(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453);
}

float noise3(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(mix(hash13(i + vec3(0, 0, 0)), hash13(i + vec3(1, 0, 0)), f.x),
            mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x),
            mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
        f.z);
}

float fbm(vec3 p) {
    float a = 0.5, sum = 0.0, norm = 0.0;
    for (int i = 0; i < 3; i++) {
        sum += a * noise3(p);
        norm += a;
        a *= 0.5;
        p *= 2.03;
    }
    return sum / norm;
}

float fbm2(vec3 p) {
    return (0.5 * noise3(p) + 0.25 * noise3(p * 2.03)) / 0.75;
}

/* ── accretion disk ─────────────────────────────────────────────── */
const float R_IN  = 2.7;
const float R_OUT = 13.0;

vec3 diskEmission(vec3 p, vec3 rd) {
    /* Matter arrives from far out and spirals in, so the disk contracts
       to its final radius as it lights rather than fading up in place. */
    float dScale = mix(2.25, 1.0, clamp(uDisk, 0.0, 1.0));
    float rIn = R_IN * dScale;
    float rOut = R_OUT * dScale;

    /* Cheapest rejections first — most steps never touch the disk and
       must not pay for noise to find that out. */
    if (abs(p.y) > 0.95 * dScale) return vec3(0.0);

    float r = length(p.xz);
    if (r < rIn || r > rOut) return vec3(0.0);

    float t = (r - rIn) / (rOut - rIn);

    /* Thin and hot at the inner edge, flaring outward — a real disk
       is not a sheet of paper. */
    float h = (0.15 + 0.62 * t * t) * dScale;
    float vert = exp(-(p.y * p.y) / (2.0 * h * h));
    if (vert < 0.006) return vec3(0.0);

    /* Keplerian shear: the inside laps the outside, which is what
       draws the spiral banding without any spiral being authored. */
    float ang = atan(p.z, p.x);
    float rk = max(r, 0.85);
    float w = uTime * 2.15 * inversesqrt(rk) / rk;

    vec3 q = vec3(cos(ang + w), sin(ang + w), r * 0.52 + uTime * 0.055) * (1.5 + r * 0.3);
    float n1 = fbm2(q * 1.55);

    float dens = vert
        * smoothstep(0.0, 0.22, t)
        * (1.0 - smoothstep(0.6, 1.0, t))
        * (0.22 + 1.05 * n1);

    /* Temperature falls with radius: white-hot, then gold, then a
       deep ember at the rim. */
    vec3 hot   = vec3(1.00, 0.97, 0.92);
    vec3 gold  = vec3(1.00, 0.71, 0.30);
    vec3 ember = vec3(0.66, 0.24, 0.08);

    vec3 col = mix(hot, gold, smoothstep(0.0, 0.4, t));
    col = mix(col, ember, smoothstep(0.4, 1.0, t));

    /* Relativistic beaming — the limb rotating toward the camera is
       brighter and bluer than the one rotating away. This asymmetry
       is most of what makes a disk read as real. */
    vec3 vel = normalize(vec3(-p.z, 0.0, p.x));
    float beta = 0.44 / sqrt(max(r, 1.0));
    float dop = 1.0 / (1.0 - beta * dot(vel, -rd));
    col *= pow(clamp(dop, 0.3, 2.8), 2.1);

    /* Gravitational redshift — the deeper the emission started, the
       more energy it loses climbing out. This is what darkens and
       reddens the inner edge instead of it being the brightest part. */
    float g = sqrt(max(1.0 - 1.0 / max(r, 1.02), 0.0));
    col *= pow(g, 1.5);
    col.b *= mix(0.62, 1.0, g);
    col.g *= mix(0.84, 1.0, g);

    return col * dens * (1.05 / (1.0 + t * 4.6));
}

/* ── deep field ─────────────────────────────────────────────────── */
vec3 starLayer(vec3 d, float scale, float cut, float bright) {
    vec3 p = d * scale;
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 r = hash33(i);

    if (r.x < cut) return vec3(0.0);

    vec3 c = vec3(0.5) + (r - 0.5) * 0.7;
    float s = smoothstep(0.09, 0.0, length(f - c));
    s *= 0.7 + 0.3 * sin(uTime * (0.5 + r.y * 1.5) + r.z * 6.28);

    vec3 tint = mix(vec3(0.76, 0.85, 1.0), vec3(1.0, 0.93, 0.82), r.y);
    return tint * s * bright * (0.3 + r.z);
}

vec3 background(vec3 d) {
    vec3 col = vec3(0.0);
    col += starLayer(d, 44.0, 0.952, 1.0);
    col += starLayer(d, 96.0, 0.970, 0.5);
    col += starLayer(d, 190.0, 0.982, 0.26);

    /* Domain-warped gas: sampling the noise at coordinates that are
       themselves noise is what makes filaments instead of blobs. */
    vec3 q = d * 1.65 + vec3(0.0, 0.0, uTime * 0.006);
    float w1 = fbm(q + fbm(q * 1.55) * 1.35);
    float w2 = fbm(q * 2.2 + 5.0);

    float dens = smoothstep(0.4, 0.85, w1);
    vec3 neb = mix(vec3(0.045, 0.075, 0.22), vec3(0.20, 0.17, 0.46), w2);
    neb = mix(neb, vec3(0.05, 0.19, 0.30), smoothstep(0.3, 0.9, w2));

    return col + neb * dens * 0.8;
}

/* ── tone ───────────────────────────────────────────────────────── */
vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;

    vec3 ro = uCamPos;
    vec3 fwd = normalize(uCamTarget - ro);
    vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(rgt, fwd);

    vec3 rd = normalize(fwd * uFov + rgt * uv.x + up * uv.y);

    vec3 pos = ro;
    vec3 dir = rd;

    /* Angular momentum is conserved along the path, so the whole
       geodesic reduces to one term. Scaled by formation so spacetime
       is flat before the hole exists. */
    vec3 l = cross(pos, dir);
    float h2 = dot(l, l) * uFormation;

    float horizon = mix(0.02, 1.0, uHorizon);
    float minR = 1e9;

    vec3 col = vec3(0.0);
    float trans = 1.0;
    bool captured = false;

    for (int i = 0; i < STEPS; i++) {
        float r = length(pos);
        minR = min(minR, r);

        if (r < horizon) { captured = true; break; }
        if (r > 65.0 && dot(dir, pos) > 0.0) break;

        /* Big strides out in flat space, short ones where the
           curvature actually matters. */
        float dt = clamp(r * 0.125, 0.035, 1.7);

        vec3 e = diskEmission(pos, dir);
        if (e.r + e.g + e.b > 0.0) {
            col += e * trans * dt * uDisk;
            trans *= exp(-dt * 0.5 * length(e));
        }

        float r2 = r * r;
        dir += (-1.5 * h2 * pos / (r2 * r2 * r)) * dt;
        pos += dir * dt;
    }

    if (!captured) {
        col += background(normalize(dir)) * trans * uReveal;
    }

    /* Photon ring: rays that grazed the photon sphere and came back.
       Emphasised, not invented — minR already knows who they are. */
    float ring = smoothstep(0.075, 0.0, abs(minR - 1.5 * horizon));
    col += vec3(1.0, 0.88, 0.70) * ring * 0.62 * uFormation * uDisk;

    /* The seed: one distant point of light, before it collapses. */
    float align = max(dot(rd, normalize(-ro)), 0.0);
    col += vec3(1.0, 0.95, 0.88) * pow(align, mix(14000.0, 1400.0, uFormation)) * uSeed;

    /* Launch pulse — a ring of light leaving the hole on click. */
    if (uPulse > 0.001) {
        float ang2 = acos(clamp(align, -1.0, 1.0));
        float wave = smoothstep(0.06, 0.0, abs(ang2 - uPulse * 0.9));
        col += vec3(1.0, 0.82, 0.55) * wave * (1.0 - uPulse) * 0.5;
    }

    col = aces(col * 0.8);
    col = pow(col, vec3(0.4545));

    /* Vignette, so the frame falls away rather than ending. */
    vec2 v = vUv - 0.5;
    col *= 1.0 - dot(v, v) * 0.85;

    gl_FragColor = vec4(col, 1.0);
}
`
