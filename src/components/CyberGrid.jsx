import React, { useEffect, useRef } from 'react';

const CyberGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const colors = {
      pink: '#FF00FF',
      blue: '#5EB8FF',
      purple: '#9933FF',
      bg: '#050505'
    };

    let offset = 0;
    const speed = 0.5;
    const gridSpacing = 40;

    const draw = () => {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      const horizon = h * 0.4;
      ctx.lineWidth = 1;

      // Draw horizontal lines with perspective
      for (let i = 0; i < 20; i++) {
        const yOffset = (i * gridSpacing + offset) % (h - horizon);
        const y = horizon + yOffset;
        
        // Calculate opacity based on distance from horizon
        const progress = yOffset / (h - horizon);
        const opacity = Math.pow(progress, 2);
        
        ctx.strokeStyle = `rgba(153, 51, 255, ${opacity * 0.5})`; // Purple base
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();

        // Add a "light beam" effect randomly
        if (Math.sin(offset * 0.05 + i) > 0.8) {
             ctx.strokeStyle = `rgba(255, 0, 255, ${opacity})`; // Pink glow
             ctx.lineWidth = 2;
             ctx.stroke();
             ctx.lineWidth = 1;
        }
      }

      // Draw vertical perspective lines
      const verticalCount = 40;
      const spread = w * 2;
      for (let i = 0; i <= verticalCount; i++) {
        const xAtBottom = (i / verticalCount) * spread - spread / 2 + w / 2;
        const xAtHorizon = w / 2;

        const progress = Math.abs((i - verticalCount / 2) / (verticalCount / 2));
        const opacity = 1 - progress;

        ctx.strokeStyle = `rgba(94, 184, 255, ${opacity * 0.3})`; // Blue
        ctx.beginPath();
        ctx.moveTo(xAtHorizon, horizon);
        ctx.lineTo(xAtBottom, h);
        ctx.stroke();
      }

      // Scrolling
      offset += speed;
      if (offset > h) offset = 0;

      // Add some scanlines/noise for tech feel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let i = 0; i < h; i += 4) {
        ctx.fillRect(0, i, w, 1);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
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
        zIndex: 0,
        background: '#050505'
      }}
    />
  );
};

export default CyberGrid;
