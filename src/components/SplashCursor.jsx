/* eslint-disable */
import { useEffect, useRef } from 'react';

function pointerPrototype() {
    return {
        id: -1, texcoordX: 0, texcoordY: 0,
        prevTexcoordX: 0, prevTexcoordY: 0,
        deltaX: 0, deltaY: 0, down: false, moved: false,
        color: { r: 0, g: 0, b: 0 }
    };
}

export default function SplashCursor({
    SIM_RESOLUTION = 64, DYE_RESOLUTION = 512, CAPTURE_RESOLUTION = 256,
    DENSITY_DISSIPATION = 3.2, VELOCITY_DISSIPATION = 2, PRESSURE = 0.5,
    PRESSURE_ITERATIONS = 10, CURL = 10, SPLAT_RADIUS = 0.2, SPLAT_FORCE = 4000,
    SHADING = true, COLOR_UPDATE_SPEED = 10,
    BACK_COLOR = { r: 0, g: 0, b: 0 }, TRANSPARENT = true
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let pointers = [pointerPrototype()];
        let config = {
            SIM_RESOLUTION, DYE_RESOLUTION, CAPTURE_RESOLUTION,
            DENSITY_DISSIPATION, VELOCITY_DISSIPATION, PRESSURE,
            PRESSURE_ITERATIONS, CURL, SPLAT_RADIUS, SPLAT_FORCE,
            SHADING, COLOR_UPDATE_SPEED, PAUSED: false, BACK_COLOR, TRANSPARENT
        };

        const { gl, ext } = getWebGLContext(canvas);
        if (!gl || !ext) return;
        if (!ext.supportLinearFiltering) { config.DYE_RESOLUTION = 256; config.SHADING = false; }

        function getWebGLContext(canvas) {
            const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
            let gl = canvas.getContext('webgl2', params);
            if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
            if (!gl) return { gl: null, ext: null };
            const isWebGL2 = !!gl.drawBuffers || (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext);
            let supportLinearFiltering = false;
            let halfFloat = null;
            if (isWebGL2) {
                gl.getExtension('EXT_color_buffer_float');
                supportLinearFiltering = !!gl.getExtension('OES_texture_float_linear');
            } else {
                halfFloat = gl.getExtension('OES_texture_half_float');
                supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear');
            }
            gl.clearColor(0, 0, 0, 0);
            const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;
            let formatRGBA, formatRG, formatR;
            if (isWebGL2) {
                formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
                formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
                formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
            } else {
                formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
                formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
                formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            }
            return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
        }

        function getSupportedFormat(gl, internalFormat, format, type) {
            if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
                const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
                if (isWebGL2) {
                    switch (internalFormat) {
                        case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                        case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                        default: return null;
                    }
                }
                return null;
            }
            return { internalFormat, format };
        }

        function supportRenderTextureFormat(gl, internalFormat, format, type) {
            const texture = gl.createTexture();
            if (!texture) return false;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
            const fbo = gl.createFramebuffer();
            if (!fbo) return false;
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        }

        function hashCode(s) {
            let hash = 0;
            for (let i = 0; i < s.length; i++) { hash = (hash << 5) - hash + s.charCodeAt(i); hash |= 0; }
            return hash;
        }

        function addKeywords(source, keywords) {
            if (!keywords) return source;
            return keywords.map(k => `#define ${k}\n`).join('') + source;
        }

        function compileShader(type, source, keywords = null) {
            source = addKeywords(source, keywords);
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        function createProgram(vs, fs) {
            if (!vs || !fs) return null;
            const p = gl.createProgram();
            gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
            return p;
        }

        function getUniforms(program) {
            const u = {};
            const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < count; i++) {
                const info = gl.getActiveUniform(program, i);
                if (info) u[info.name] = gl.getUniformLocation(program, info.name);
            }
            return u;
        }

        class Program {
            constructor(vs, fs) { this.program = createProgram(vs, fs); this.uniforms = this.program ? getUniforms(this.program) : {}; }
            bind() { gl.useProgram(this.program); }
        }

        class Material {
            constructor(vs, fragmentSrc) { this.vertexShader = vs; this.fragmentShaderSource = fragmentSrc; this.programs = {}; this.activeProgram = null; this.uniforms = {}; }
            setKeywords(keywords) {
                let hash = 0;
                for (const kw of keywords) hash += hashCode(kw);
                let prog = this.programs[hash];
                if (!prog) { prog = createProgram(this.vertexShader, compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords)); this.programs[hash] = prog; }
                if (prog === this.activeProgram) return;
                this.uniforms = prog ? getUniforms(prog) : {};
                this.activeProgram = prog;
            }
            bind() { gl.useProgram(this.activeProgram); }
        }

        const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

        const splatShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
      uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () {
        vec2 p = vUv - point.xy; p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

        const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
      uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

        const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

        const curlShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }
    `);

        const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt; velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

        const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
      }
    `);

        const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
      uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

        const copyShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }
    `);

        const clearShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float; precision mediump sampler2D;
      varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

        const displayShaderSource = `
      precision highp float; precision highp sampler2D;
      varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uTexture; uniform vec2 texelSize;
      vec3 linearToGamma(vec3 color) { color = max(color, vec3(0)); return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0)); }
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb; vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb; vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc); float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

        const blit = (() => {
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
            const elem = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);
            return (target, clear = false) => {
                if (!target) { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
                else { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
                if (clear) { gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); }
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            };
        })();

        let dye, velocity, divergence, curl, pressure;

        const copyProgram = new Program(baseVertexShader, copyShader);
        const clearProgram = new Program(baseVertexShader, clearShader);
        const splatProgram = new Program(baseVertexShader, splatShader);
        const advectionProgram = new Program(baseVertexShader, advectionShader);
        const divergenceProgram = new Program(baseVertexShader, divergenceShader);
        const curlProgram = new Program(baseVertexShader, curlShader);
        const vorticityProgram = new Program(baseVertexShader, vorticityShader);
        const pressureProgram = new Program(baseVertexShader, pressureShader);
        const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
        const displayMaterial = new Material(baseVertexShader, displayShaderSource);

        function createFBO(w, h, internalFormat, format, type, param) {
            gl.activeTexture(gl.TEXTURE0);
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
            const fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
            return { texture, fbo, width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h, attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
        }

        function createDoubleFBO(w, h, iF, f, t, p) {
            const fbo1 = createFBO(w, h, iF, f, t, p);
            const fbo2 = createFBO(w, h, iF, f, t, p);
            return { width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY, read: fbo1, write: fbo2, swap() { [this.read, this.write] = [this.write, this.read]; } };
        }

        function resizeFBO(target, w, h, iF, f, t, p) {
            const n = createFBO(w, h, iF, f, t, p);
            copyProgram.bind();
            gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
            blit(n); return n;
        }

        function resizeDoubleFBO(target, w, h, iF, f, t, p) {
            if (target.width === w && target.height === h) return target;
            target.read = resizeFBO(target.read, w, h, iF, f, t, p);
            target.write = createFBO(w, h, iF, f, t, p);
            target.width = w; target.height = h;
            target.texelSizeX = 1 / w; target.texelSizeY = 1 / h;
            return target;
        }

        function getResolution(res) {
            const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight;
            let aspect = w / h; if (aspect < 1) aspect = 1 / aspect;
            const min = Math.round(res), max = Math.round(res * aspect);
            return w > h ? { width: max, height: min } : { width: min, height: max };
        }

        function initFramebuffers() {
            const simRes = getResolution(config.SIM_RESOLUTION);
            const dyeRes = getResolution(config.DYE_RESOLUTION);
            const texType = ext.halfFloatTexType;
            const rgba = ext.formatRGBA, rg = ext.formatRG, r = ext.formatR;
            const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
            gl.disable(gl.BLEND);
            if (!dye) dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
            else dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
            if (!velocity) velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
            else velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
            divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
            curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
            pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        }

        function updateKeywords() {
            const kw = [];
            if (config.SHADING) kw.push('SHADING');
            displayMaterial.setKeywords(kw);
        }

        const scaleByPixelRatio = (v) => Math.floor(v * (window.devicePixelRatio || 1));

        updateKeywords();
        initFramebuffers();

        let lastUpdateTime = Date.now();
        let colorUpdateTimer = 0;

        function updateFrame() {
            const dt = calcDeltaTime();
            if (resizeCanvas()) initFramebuffers();
            updateColors(dt); applyInputs(); step(dt); render(null);
            requestAnimationFrame(updateFrame);
        }

        function calcDeltaTime() {
            const now = Date.now(); let dt = (now - lastUpdateTime) / 1000;
            dt = Math.min(dt, 0.016666); lastUpdateTime = now; return dt;
        }

        function resizeCanvas() {
            const w = scaleByPixelRatio(canvas.clientWidth), h = scaleByPixelRatio(canvas.clientHeight);
            if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
            return false;
        }

        function updateColors(dt) {
            colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
            if (colorUpdateTimer >= 1) { colorUpdateTimer = wrap(colorUpdateTimer, 0, 1); pointers.forEach(p => { p.color = generateColor(); }); }
        }

        function applyInputs() { pointers.forEach(p => { if (p.moved) { p.moved = false; splatPointer(p); } }); }

        function step(dt) {
            gl.disable(gl.BLEND);
            curlProgram.bind();
            gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
            blit(curl);

            vorticityProgram.bind();
            gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
            gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
            gl.uniform1f(vorticityProgram.uniforms.dt, dt);
            blit(velocity.write); velocity.swap();

            divergenceProgram.bind();
            gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
            blit(divergence);

            clearProgram.bind();
            gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
            gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
            blit(pressure.write); pressure.swap();

            pressureProgram.bind();
            gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
            for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
                gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
                blit(pressure.write); pressure.swap();
            }

            gradienSubtractProgram.bind();
            gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
            gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
            blit(velocity.write); velocity.swap();

            advectionProgram.bind();
            gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
            const velId = velocity.read.attach(0);
            gl.uniform1i(advectionProgram.uniforms.uVelocity, velId);
            gl.uniform1i(advectionProgram.uniforms.uSource, velId);
            gl.uniform1f(advectionProgram.uniforms.dt, dt);
            gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
            blit(velocity.write); velocity.swap();

            if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
            gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
            gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
            gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
            blit(dye.write); dye.swap();
        }

        function render(target) {
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
            displayMaterial.bind();
            if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
            gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
            blit(target);
        }

        function splatPointer(p) {
            splat(p.texcoordX, p.texcoordY, p.deltaX * config.SPLAT_FORCE, p.deltaY * config.SPLAT_FORCE, p.color);
        }

        function clickSplat(p) {
            const c = generateColor(); c.r *= 10; c.g *= 10; c.b *= 10;
            splat(p.texcoordX, p.texcoordY, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), c);
        }

        function splat(x, y, dx, dy, color) {
            splatProgram.bind();
            gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
            gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
            gl.uniform2f(splatProgram.uniforms.point, x, y);
            gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
            gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
            blit(velocity.write); velocity.swap();
            gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
            gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
            blit(dye.write); dye.swap();
        }

        function correctRadius(r) { const a = canvas.width / canvas.height; if (a > 1) r *= a; return r; }
        function correctDeltaX(d) { const a = canvas.width / canvas.height; if (a < 1) d *= a; return d; }
        function correctDeltaY(d) { const a = canvas.width / canvas.height; if (a > 1) d /= a; return d; }

        function updatePointerDownData(p, id, posX, posY) {
            p.id = id; p.down = true; p.moved = false;
            p.texcoordX = posX / canvas.width; p.texcoordY = 1 - posY / canvas.height;
            p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
            p.deltaX = 0; p.deltaY = 0; p.color = generateColor();
        }

        function updatePointerMoveData(p, posX, posY, color) {
            p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
            p.texcoordX = posX / canvas.width; p.texcoordY = 1 - posY / canvas.height;
            p.deltaX = correctDeltaX(p.texcoordX - p.prevTexcoordX);
            p.deltaY = correctDeltaY(p.texcoordY - p.prevTexcoordY);
            p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
            p.color = color;
        }

        function generateColor() {
            const c = HSVtoRGB(Math.random(), 1.0, 1.0);
            c.r *= 0.15; c.g *= 0.15; c.b *= 0.15; return c;
        }

        function HSVtoRGB(h, s, v) {
            let r = 0, g = 0, b = 0;
            const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break; case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break; case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
            }
            return { r, g, b };
        }

        function wrap(v, min, max) { const r = max - min; return r === 0 ? min : ((v - min) % r) + min; }

        // Event listeners
        const onMouseDown = (e) => {
            const p = pointers[0];
            updatePointerDownData(p, -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY));
            clickSplat(p);
        };

        const onMouseMove = (e) => {
            const p = pointers[0];
            updatePointerMoveData(p, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY), p.color);
        };

        const onTouchStart = (e) => {
            const touches = e.targetTouches; const p = pointers[0];
            for (let i = 0; i < touches.length; i++) {
                updatePointerDownData(p, touches[i].identifier, scaleByPixelRatio(touches[i].clientX), scaleByPixelRatio(touches[i].clientY));
            }
        };

        const onTouchMove = (e) => {
            const touches = e.targetTouches; const p = pointers[0];
            for (let i = 0; i < touches.length; i++) {
                updatePointerMoveData(p, scaleByPixelRatio(touches[i].clientX), scaleByPixelRatio(touches[i].clientY), p.color);
            }
        };

        const onTouchEnd = () => { pointers[0].down = false; };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchstart', onTouchStart, false);
        window.addEventListener('touchmove', onTouchMove, false);
        window.addEventListener('touchend', onTouchEnd);

        updateFrame();

        return () => {
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none', width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
        </div>
    );
}
