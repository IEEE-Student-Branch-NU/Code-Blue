import React, { useEffect, useRef } from 'react';

/* ─── Shared canvas style ─────────────────────────────────────── */
const canvasStyle = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
};

/* ─── CS: Falling Binary Code (0/1) ───────────────────────────── */
const CSBinary = () => {
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

        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = Array(columns).fill(0).map(() => Math.random() * -50);

        const draw = () => {
            ctx.fillStyle = 'rgba(17, 17, 17, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.5 ? '1' : '0';
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                const alpha = Math.random() * 0.15 + 0.05;
                ctx.fillStyle = `rgba(94, 184, 255, ${alpha})`;
                ctx.fillText(text, x, y);
                if (y > canvas.height && Math.random() > 0.99) drops[i] = 0;
                drops[i] += 0.35;
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

            ctx.strokeStyle = 'rgba(94, 184, 255, 0.2)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let x = 0; x <= w; x += 2) {
                const y = h / 2 + Math.sin(x * 0.02 + t) * (h * 0.2)
                    + Math.sin(x * 0.005 + t * 0.5) * (h * 0.1);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            ctx.strokeStyle = 'rgba(94, 184, 255, 0.05)';
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

/* ─── SIGHT: Network Mesh Globe ───────────────────────────────── */
const SIGHTGlobe = () => {
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

        const R = 85;
        let angle = 0;
        const tilt = 20 * Math.PI / 180;

        // Generate sphere points (mesh vertices)
        const points = [];
        for (let lat = -80; lat <= 80; lat += 12) {
            const latRad = lat * Math.PI / 180;
            const circumPts = Math.max(6, Math.round(Math.cos(latRad) * 20));
            for (let i = 0; i < circumPts; i++) {
                const lon = (360 / circumPts) * i;
                points.push({ lat, lon });
            }
        }
        // Add poles
        points.push({ lat: 90, lon: 0 });
        points.push({ lat: -90, lon: 0 });

        // Project a point
        const project = (latDeg, lonDeg, rot) => {
            const lat = latDeg * Math.PI / 180;
            const lon = (lonDeg + rot) * Math.PI / 180;
            let x = Math.cos(lat) * Math.sin(lon) * R;
            let y = -Math.sin(lat) * R;
            let z = Math.cos(lat) * Math.cos(lon) * R;
            // Tilt
            const ct = Math.cos(tilt), st = Math.sin(tilt);
            const y2 = y * ct - z * st;
            const z2 = y * st + z * ct;
            return { x, y: y2, z: z2 };
        };

        // Pre-compute edges: connect nearby points
        const edges = [];
        const maxDist = 35; // max angular distance to connect
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const a = points[i], b = points[j];
                const dLat = a.lat - b.lat;
                const dLon = Math.min(
                    Math.abs(a.lon - b.lon),
                    360 - Math.abs(a.lon - b.lon)
                );
                const dist = Math.sqrt(dLat * dLat + dLon * dLon * Math.cos(a.lat * Math.PI / 180) * Math.cos(a.lat * Math.PI / 180));
                if (dist < maxDist && dist > 0) {
                    edges.push([i, j]);
                }
            }
        }

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            ctx.clearRect(0, 0, w, h);
            angle += 0.25;

            // Project all points
            const projected = points.map(p => project(p.lat, p.lon, angle));

            // Draw edges (mesh lines)
            edges.forEach(([i, j]) => {
                const a = projected[i];
                const b = projected[j];
                if (a.z > 0 && b.z > 0) {
                    const avgDepth = (a.z + b.z) / (2 * R);
                    const alpha = 0.04 + avgDepth * 0.12;
                    ctx.strokeStyle = `rgba(94, 184, 255, ${alpha})`;
                    ctx.lineWidth = 0.5 + avgDepth * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(cx + a.x, cy + a.y);
                    ctx.lineTo(cx + b.x, cy + b.y);
                    ctx.stroke();
                }
            });

            // Draw nodes (vertices)
            projected.forEach(p => {
                if (p.z > 0) {
                    const depth = p.z / R;
                    const alpha = 0.15 + depth * 0.5;
                    const size = 1 + depth * 1.2;
                    ctx.fillStyle = `rgba(94, 184, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(cx + p.x, cy + p.y, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Orbital rings
            ctx.strokeStyle = 'rgba(94, 184, 255, 0.1)';
            ctx.lineWidth = 0.8;
            ctx.setLineDash([4, 6]);

            // Ring 1 - tilted ellipse
            ctx.beginPath();
            for (let a = 0; a <= 360; a += 2) {
                const aRad = a * Math.PI / 180;
                const rx = R + 15;
                const ry = (R + 15) * 0.35;
                const ox = Math.cos(aRad) * rx;
                const oy = Math.sin(aRad) * ry;
                // Rotate ring
                const ringAngle = angle * 0.5 * Math.PI / 180;
                const fx = ox * Math.cos(ringAngle) - oy * Math.sin(ringAngle);
                const fy = ox * Math.sin(ringAngle) + oy * Math.cos(ringAngle);
                if (a === 0) ctx.moveTo(cx + fx, cy + fy);
                else ctx.lineTo(cx + fx, cy + fy);
            }
            ctx.stroke();

            // Ring 2 - different angle
            ctx.beginPath();
            for (let a = 0; a <= 360; a += 2) {
                const aRad = a * Math.PI / 180;
                const rx = R + 22;
                const ry = (R + 22) * 0.25;
                const ox = Math.cos(aRad) * rx;
                const oy = Math.sin(aRad) * ry;
                const ringAngle = (angle * 0.3 + 60) * Math.PI / 180;
                const fx = ox * Math.cos(ringAngle) - oy * Math.sin(ringAngle);
                const fy = ox * Math.sin(ringAngle) + oy * Math.cos(ringAngle);
                if (a === 0) ctx.moveTo(cx + fx, cy + fy);
                else ctx.lineTo(cx + fx, cy + fy);
            }
            ctx.stroke();

            ctx.setLineDash([]);

            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} style={canvasStyle} />;
};

/* ─── ITSS: Subtle Road Network with Data Flow ────────────────── */
const ITSSNetwork = () => {
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

        const nodes = [
            { x: 0.2, y: 0.3 }, { x: 0.5, y: 0.2 }, { x: 0.8, y: 0.3 },
            { x: 0.2, y: 0.6 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.6 },
            { x: 0.2, y: 0.8 }, { x: 0.5, y: 0.8 }, { x: 0.8, y: 0.8 }
        ];

        const edges = [
            [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
            [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8]
        ];

        const packets = [];

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(94, 184, 255, 0.1)';
            ctx.lineWidth = 1;
            edges.forEach(([i, j]) => {
                ctx.beginPath();
                ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
                ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
                ctx.stroke();
            });

            nodes.forEach(node => {
                ctx.fillStyle = 'rgba(94, 184, 255, 0.2)';
                ctx.beginPath();
                ctx.arc(node.x * w, node.y * h, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            if (Math.random() < 0.02 && packets.length < 8) {
                const edge = edges[Math.floor(Math.random() * edges.length)];
                packets.push({
                    from: edge[0], to: edge[1],
                    progress: 0, speed: 0.005 + Math.random() * 0.01
                });
            }

            for (let i = packets.length - 1; i >= 0; i--) {
                const p = packets[i];
                p.progress += p.speed;
                if (p.progress >= 1) { packets.splice(i, 1); continue; }

                const from = nodes[p.from];
                const to = nodes[p.to];
                const x = from.x + (to.x - from.x) * p.progress;
                const y = from.y + (to.y - from.y) * p.progress;

                ctx.fillStyle = 'rgba(94, 184, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(x * w, y * h, 2.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowColor = '#5eb8ff';
                ctx.shadowBlur = 2;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.beginPath();
                ctx.arc(x * w, y * h, 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            requestAnimationFrame(draw);
        };

        const animId = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={canvasStyle} />;
};

/* ─── Switcher ────────────────────────────────────────────────── */
const SubChapterBackgrounds = ({ variant }) => {
    switch (variant) {
        case 'cs':
            return <CSBinary />;
        case 'sps':
            return <SPSWave />;
        case 'sight':
            return <SIGHTGlobe />;
        case 'itss':
            return <ITSSNetwork />;
        default:
            return null;
    }
};

export default SubChapterBackgrounds;
