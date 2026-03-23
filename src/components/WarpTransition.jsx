import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WarpTransition = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const flashRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Resize Handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Starfield Setup
    const numStars = 600;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width,
            pz: Math.random() * canvas.width,
            color: Math.random() > 0.8 ? '#FF00F5' : Math.random() > 0.6 ? '#00d2ff' : '#ffffff' // Cybernetic colors
        });
    }

    let animationFrameId;
    let speed = 1.0;
    let isWarping = false;

    // Render Loop
    const render = () => {
      // Create trailing effect for warp lines
      ctx.fillStyle = isWarping ? 'rgba(0, 8, 20, 0.2)' : 'rgba(0, 8, 20, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < numStars; i++) {
          const star = stars[i];
          
          star.pz = star.z;
          star.z -= speed;

          if (star.z < 1) {
              star.z = canvas.width;
              star.pz = star.z;
              star.x = Math.random() * canvas.width - cx;
              star.y = Math.random() * canvas.height - cy;
          }

          const sx = (star.x / star.z) * canvas.width + cx;
          const sy = (star.y / star.z) * canvas.height + cy;
          const px = (star.x / star.pz) * canvas.width + cx;
          const py = (star.y / star.pz) * canvas.height + cy;

          const size = Math.max(0.1, (1 - star.z / canvas.width) * 3);
          
          ctx.beginPath();
          if (isWarping) {
            ctx.lineWidth = size * 2;
            ctx.strokeStyle = star.color;
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          } else {
            ctx.fillStyle = star.color;
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
          }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // GSAP Orchestration
    const tl = gsap.timeline({
       onComplete: onComplete 
    });

    // 1. Initial State
    gsap.set(textRef.current, { scale: 0, opacity: 0, rotationX: 45 });
    gsap.set(flashRef.current, { opacity: 0 });

    // 2. Text Appears & Pulses
    tl.to(textRef.current, {
      scale: 1,
      opacity: 1,
      rotationX: 0,
      duration: 1,
      ease: "power4.out"
    })
    .to(textRef.current, { // Gentle floating
      scale: 1.05,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut"
    })
    
    // 3. Initiate Warp Speed
    .call(() => {
      isWarping = true;
      gsap.to({ val: 1.0 }, {
        val: 180, // Huge warp speed multiplier
        duration: 2.0,
        ease: "power2.inOut",
        onUpdate: function() {
          speed = this.targets()[0].val;
        }
      });
    }, null, "-=1.5")
    
    // 4. Text Shoots Past Camera
    .to(textRef.current, {
      scale: 30, // Extremely fast zoom past camera
      opacity: 0,
      filter: "blur(30px)",
      duration: 1.0,
      ease: "power4.in"
    }, "-=1.0") // Overlap with warp buildup

    // 5. Bright Flash Obscures Everything
    .to(flashRef.current, {
      opacity: 1,
      duration: 0.2, // Sudden bright flash
      ease: "power2.in",
      onComplete: () => {
         // Stop canvas rendering to save perf behind the flash
         cancelAnimationFrame(animationFrameId);
         gsap.set(canvasRef.current, { display: 'none' }); 
      }
    })
    
    // 6. Fade Whole Component to Reveal Page
    .to(wrapperRef.current, {
      opacity: 0,
      duration: 1.5, // Slow, beautiful fade revealing the carnival
      ease: "power3.inOut"
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={wrapperRef}
      className="fixed inset-0 z-[10000] bg-[#000814] flex items-center justify-center pointer-events-none overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen"
      />
      
      {/* Immersive Text Overlay */}
      <div 
        ref={textRef}
        className="relative z-10 flex flex-col items-center"
        style={{ perspective: '800px' }}
      >
        <div className="text-center p-8 md:p-16 border-[3px] border-[#00d2ff]/30 bg-[#00d2ff]/5 rounded-[3rem] backdrop-blur-md shadow-[0_0_100px_rgba(0,210,255,0.2)]">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-white via-[#00d2ff] to-[#FF00F5] font-black italic uppercase text-5xl md:text-8xl tracking-tighter mb-6 drop-shadow-[0_0_30px_rgba(0,210,255,0.8)]">
            Carnival
          </h2>
          <div className="flex items-center gap-6 justify-center text-[#FF00F5] font-mono text-sm md:text-xl font-bold tracking-[0.5em] uppercase">
            <span>Initiating</span>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#FF00F5] to-transparent"></div>
            <span>Warp</span>
          </div>
        </div>
      </div>

      {/* The Blinding Final Flash */}
      <div 
        ref={flashRef}
        className="absolute inset-0 z-20 bg-white"
        style={{ opacity: 0 }}
      />
    </div>
  );
};

export default WarpTransition;
