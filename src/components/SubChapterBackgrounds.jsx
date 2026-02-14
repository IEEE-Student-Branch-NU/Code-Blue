import React, { useEffect, useRef } from 'react';

/* ─── CS: Subtle grid of dots that slowly pulse ──────────────── */
const CSDots = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let t = 0;
        const draw = () => {
            t += 0.01;
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const spacing = 28;
            for (let x = spacing; x < w; x += spacing) {
                for (let y = spacing; y < h; y += spacing) {
                    const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);
                    const pulse = Math.sin(dist * 0.02 - t * 2) * 0.5 + 0.5;
                    const size = 1 + pulse * 1.5;
                    const alpha = 0.08 + pulse * 0.12;
                    ctx.fillStyle = `rgba(94, 184, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} style={canvasStyle} />;
};

/* ─── SPS: Minimal sine wave line ─────────────────────────────── */
const SPSWave = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let t = 0;
        const draw = () => {
            t += 0.015;
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Single clean wave
            ctx.strokeStyle = 'rgba(94, 184, 255, 0.15)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 2) {
                const y = h / 2 + Math.sin(x * 0.02 + t) * (h * 0.2)
                    + Math.sin(x * 0.005 + t * 0.5) * (h * 0.1);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Second wave offset
            ctx.strokeStyle = 'rgba(94, 184, 255, 0.08)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 2) {
                const y = h / 2 + Math.sin(x * 0.03 + t * 1.5 + 2) * (h * 0.12);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} style={canvasStyle} />;
};

/* ─── SIGHT: Slowly rotating connected nodes ──────────────────── */
const SIGHTNodes = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Fixed nodes
        const nodes = Array.from({ length: 12 }, () => ({
            x: Math.random(),
            y: Math.random(),
            vx: (Math.random() - 0.5) * 0.0003,
            vy: (Math.random() - 0.5) * 0.0003,
        }));

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Move nodes slowly
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0.05 || n.x > 0.95) n.vx *= -1;
                if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;
            });

            // Draw connections
            ctx.strokeStyle = 'rgba(94, 184, 255, 0.08)';
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = (nodes[i].x - nodes[j].x) * w;
                    const dy = (nodes[i].y - nodes[j].y) * h;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
                        ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
                        ctx.stroke();
                    }
                }
            }

            // Draw dots
            nodes.forEach(n => {
                ctx.fillStyle = 'rgba(94, 184, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(n.x * w, n.y * h, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} style={canvasStyle} />;
};

/* ─── ITSS: Minimalist road lanes converging to vanishing point ─ */
const ITSSLines = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let t = 0;
        const draw = () => {
            t += 0.003;
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const vpx = w * 0.5;
            const vpy = h * 0.25;

            // Road edge lines converging to vanishing point
            const lanes = [-0.4, -0.13, 0.13, 0.4];
            lanes.forEach(offset => {
                const bottomX = vpx + w * offset;
                ctx.strokeStyle = 'rgba(94, 184, 255, 0.1)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(bottomX, h);
                ctx.lineTo(vpx, vpy);
                ctx.stroke();
            });

            // Center dashed line
            ctx.strokeStyle = 'rgba(94, 184, 255, 0.12)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([8, 14]);
            ctx.lineDashOffset = -t * 800;
            ctx.beginPath();
            ctx.moveTo(vpx, h);
            ctx.lineTo(vpx, vpy);
            ctx.stroke();
            ctx.setLineDash([]);

            // Horizontal perspective lines moving toward viewer
            for (let i = 0; i < 8; i++) {
                const depth = ((i * 0.125 + t * 2) % 1);
                const perspective = Math.pow(depth, 2);
                const y = vpy + (h - vpy) * perspective;
                const halfW = (w * 0.4) * perspective;
                const alpha = 0.04 * (1 - depth);
                ctx.strokeStyle = `rgba(94, 184, 255, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(vpx - halfW, y);
                ctx.lineTo(vpx + halfW, y);
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} style={canvasStyle} />;
};

/* ─── Shared canvas style ─────────────────────────────────────── */
const canvasStyle = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
};

/* ─── Switcher ────────────────────────────────────────────────── */
const SubChapterBackgrounds = ({ variant }) => {
    switch (variant) {
        case 'cs':
            return <CSDots />;
        case 'sps':
            return <SPSWave />;
        case 'sight':
            return <SIGHTNodes />;
        case 'itss':
            return <ITSSLines />;
        default:
            return null;
    }
};

export default SubChapterBackgrounds;
