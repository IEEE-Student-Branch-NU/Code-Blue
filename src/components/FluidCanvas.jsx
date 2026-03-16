import React, { useRef, useEffect } from 'react';

const FluidCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height;
        let time = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Configuration for the fluid effect
        const config = {
            baseColor: [8, 0, 15], // #08000f - deep dark purple/black
            waveColor: [21, 0, 37], // #150025 - dark violet
            layerCount: 3,
            speed: 0.002,
            complexity: 3
        };

        const draw = () => {
            // Clear with base color with a slight trailing effect
            ctx.fillStyle = `rgba(${config.baseColor.join(',')}, 0.1)`;
            ctx.fillRect(0, 0, width, height);

            time += config.speed;

            for (let layer = 0; layer < config.layerCount; layer++) {
                ctx.beginPath();
                for (let x = 0; x <= width; x += 20) {
                    // Calculate complex sine waves for swirling liquid effect
                    const y1 = Math.sin(x * 0.005 + time + layer) * (height * 0.2);
                    const y2 = Math.cos(x * 0.003 - time * 0.8 + layer * 2) * (height * 0.15);
                    const y3 = Math.sin(x * 0.01 + time * 1.5) * (height * 0.1);

                    const y = height / 2 + y1 + y2 + y3 + Math.sin(time + layer) * 50;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                // Connect the wave to the bottom to fill it
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();

                // Use a gradient for the wave to blend magenta and purple
                const gradient = ctx.createLinearGradient(0, height / 2 - 200, 0, height);
                const alpha = 0.05 + (layer * 0.02);

                // Deep atmospheric purple to indigo gradient
                gradient.addColorStop(0, `rgba(13, 0, 26, ${alpha})`); // #0d001a
                gradient.addColorStop(0.5, `rgba(21, 0, 37, ${alpha * 1.5})`); // #150025
                gradient.addColorStop(1, `rgba(40, 0, 70, ${alpha * 2})`); // #280046 (indigo/violet)

                ctx.fillStyle = gradient;
                ctx.fill();

                ctx.strokeStyle = `rgba(${config.waveColor.join(',')}, ${alpha * 0.5})`; // Faint subtle swirl lines
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };

        const animationId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
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
                zIndex: 0,
                pointerEvents: 'none',
                background: '#08000f' // base dark background
            }}
        />
    );
};

export default FluidCanvas;
