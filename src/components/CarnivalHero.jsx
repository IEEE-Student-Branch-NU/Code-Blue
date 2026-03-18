import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion, useSpring as useFramerSpring } from 'framer-motion';
import './CarnivalHero.css';

const CarnivalHero = ({ skewSpring, xSpring }) => {
  // Setup a spring reacting to scrollY for buttery smooth parallax
  const [{ scrollY }, api] = useSpring(() => ({ 
    scrollY: 0,
    config: { mass: 1, tension: 120, friction: 40 }
  }));

  const logoRotateX = useFramerSpring(0, { stiffness: 100, damping: 30 });
  const logoRotateY = useFramerSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      api.start({ scrollY: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [api]);

  return (
    <motion.section 
      style={{ 
        skewY: skewSpring, x: xSpring,
        willChange: 'transform',
        transform: 'translate3d(0,0,0)'
      }}
      className="carnival-hero origin-center transition-none"
    >
      
      {/* Layer 1: Background Layer */}
      <animated.img
        src="/Carnival/layer1-v2.png"
        alt="Carnival Background Sky"
        className="parallax-layer l1-bg"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.45}px) scale(1.1)`) }}
      />

      {/* Layer 2: Midground Layer (Ferris Wheel + Tents) */}
      <animated.img
        src="/Carnival/layer2-v2.png"
        alt="Carnival Ferris Wheel and Tents"
        className="parallax-layer l2-mid"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.35}px)`) }}
      />

      {/* Layer 3: Logo Layer with Interactive Tilt */}
      <animated.div
        className="parallax-logo-layer l3-logo"
        style={{ 
          transform: scrollY.to(y => `translateY(${y * 0.25}px)`),
          perspective: 1000
        }}
      >
        <div className="relative group w-[90%] max-w-[1000px] flex justify-center items-center mx-auto">
          <motion.img
            src="/Carnival/carnival-logo.png"
            alt="IEEE Carnival Logo"
            className="carnival-logo"
            whileHover={{ scale: 1.05 }}
            onMouseMove={(e) => {
              const { clientX, clientY } = e;
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = (clientX - (left + width / 2)) / (width / 2) * 15;
              const y = (clientY - (top + height / 2)) / (height / 2) * -15;
              logoRotateX.set(y);
              logoRotateY.set(x);
            }}
            onMouseLeave={() => {
              logoRotateX.set(0);
              logoRotateY.set(0);
            }}
            style={{ 
              rotateX: logoRotateX,
              rotateY: logoRotateY,
              transformStyle: "preserve-3d"
            }}
          />
        </div>
      </animated.div>

      {/* Layer 4: Foreground Layer */}
      <animated.img
        src="/Carnival/layer3-v2.png"
        alt="Carnival Ticket Booth and Popcorn Cart"
        className="parallax-layer l4-fg"
        style={{ 
          transform: scrollY.to(y => `translateY(${y * 0.15}px)`),
          zIndex: 5 
        }}
      />
    </motion.section>
  );
};

export default CarnivalHero;
