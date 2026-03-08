import React, { useEffect, useRef } from 'react';

const Starfield = ({ 
  starCount = 1000, 
  speed = 0.05, 
  colors = ['#FF00FF', '#5EB8FF', '#9933FF'] 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const stars = [];

    const createStar = () => {
      return {
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2
      };
    };

    for (let i = 0; i < starCount; i++) {
      stars.push(createStar());
    }

    const moveStars = () => {
      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        s.z -= speed * w * 0.1;

        if (s.z <= 1) {
          stars[i] = createStar();
          stars[i].z = w;
        }
      }
    };

    const drawStars = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        
        const x = (s.x / s.z) * w + w / 2;
        const y = (s.y / s.z) * h + h / 2;
        const radius = (1 - s.z / w) * s.size * 2;

        if (x < 0 || x > w || y < 0 || y > h) continue;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();

        // Add a subtle glow/tail
        ctx.shadowBlur = radius * 2;
        ctx.shadowColor = s.color;
      }
    };

    const animate = () => {
      moveStars();
      drawStars();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount, speed, colors]);

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
        background: '#000'
      }}
    />
  );
};

export default Starfield;
