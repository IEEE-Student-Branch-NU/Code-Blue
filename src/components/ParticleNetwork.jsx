import React, { useEffect, useRef } from 'react';

const ParticleNetwork = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const init = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            createParticles();
        };

        const createParticles = () => {
            // Optimization: Limit max particles and density
            let count = Math.floor(width * height / 40000);
            if (count > 60) count = 60; // Cap at 60 for performance

            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2, // Slower movement
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 2 + 0.5
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(94, 184, 255, 0.08)'; // Lower opacity
            ctx.fillStyle = 'rgba(94, 184, 255, 0.3)';

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 70) { // Reduced connection distance
                        ctx.lineWidth = (1 - dist / 70) * 0.5; // Thinner lines
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(draw);
        };

        init();
        const anim = requestAnimationFrame(draw);

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(anim);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                opacity: 0.6,
                zIndex: 0
            }}
        />
    );
};

export default ParticleNetwork;
