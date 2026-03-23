import React, { useEffect, useState } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import { motion, useSpring as useFramerSpring } from 'framer-motion';
import './CarnivalHero.css';

const CarnivalHero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Setup the original React Spring for the "butter smooth" slow-motion physics
  const [{ scrollY }, api] = useSpring(() => ({ 
    scrollY: typeof window !== 'undefined' ? window.scrollY : 0, 
    config: { mass: 2, tension: 120, friction: 50 } 
  }));

  // NEW: Entry settling animation
  const [{ entryProgress }, entryApi] = useSpring(() => ({
    entryProgress: 1, 
    config: { mass: 4, tension: 60, friction: 30 } // Heavy, slow settling
  }));

  const logoRotateX = useFramerSpring(0, { stiffness: 100, damping: 30 });
  const logoRotateY = useFramerSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (imagesLoaded) {
      // Delay settling until the gate transition is ready to reveal
      entryApi.start({ 
        entryProgress: 0,
        delay: 1200 // Increased delay to sync with gate hold
      });
    }
  }, [imagesLoaded, entryApi]);

  const getDeviceType = () => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.innerWidth <= 768) return 'mobile';
    if (window.innerWidth <= 1024) return 'tablet';
    return 'desktop';
  };

  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    setDeviceType(getDeviceType());

    // Preload Images
    const imagesToPreload = [
      "/Carnival/layer1-v2.png",
      "/Carnival/carnival-logo.png",
      "/Carnival/layer2-mobile.png",
      "/Carnival/layer2-tablet.png",
      "/Carnival/layer2-v2.png",
      "/Carnival/layer3-mobile.png",
      "/Carnival/layer3-tablet.png",
      "/Carnival/layer3-v2.png"
    ];

    let loadedCount = 0;
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= imagesToPreload.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= imagesToPreload.length) setImagesLoaded(true);
      };
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.__carnivalParallaxPaused) return;
      const currentY = window.scrollY;
      api.start({ scrollY: currentY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [api]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: imagesLoaded ? 1 : 0 }}
      transition={{ duration: 1.2 }}
      className="carnival-hero origin-center transition-none relative"
      style={{ overflow: 'hidden' }}
    >
      
      {/* Layer 1: Sky (Deep Background) */}
      <animated.img
        src="/Carnival/layer1-v2.png"
        alt="Carnival Background Sky"
        className="parallax-layer l1-bg"
        style={{ 
          transform: to([scrollY, entryProgress], (y, p) => {
            const parallaxY = y * 0.50;
            const entryY = p * -150; // Sky starts further back/up
            const scale = 1.05 + y * 0.0001;
            return `translateY(${parallaxY + entryY}px) scale(${scale})`;
          })
        }}
      />

      {/* Layer 2: Midground (Buildings/Tents) */}
      <animated.img
        src={deviceType === 'mobile' ? "/Carnival/layer2-mobile.png" : deviceType === 'tablet' ? "/Carnival/layer2-tablet.png" : "/Carnival/layer2-v2.png"}
        alt="Carnival Ferris Wheel and Tents"
        className="parallax-layer l2-mid"
        style={{ 
          transform: to([scrollY, entryProgress], (y, p) => {
            const parallaxY = y * 0.35;
            const entryY = p * 400; // Midground starts further down
            const scale = 1 + y * 0.0003;
            return `translateY(${parallaxY + entryY}px) scale(${scale})`;
          })
        }}
      />

      {/* Layer 3: Logo (Focal Point) */}
      <animated.div
        className="parallax-logo-layer l3-logo"
        style={{ 
          transform: to([scrollY, entryProgress], (y, p) => {
             const parallaxY = y * 0.15;
             const entryY = p * 1200; // Increased from 700 to 1200
             const scale = 1 + p * 3; // Increased starting scale for bigger "zoom"
             return `translateY(${parallaxY + entryY}px) scale(${scale})`;
          }),
          perspective: 1000
        }}
      >
        <div className="relative group w-[90%] max-w-[10000px] flex justify-center items-center mx-auto">
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

      {/* Layer 4: Foreground (Props) */}
      <animated.img
        src={deviceType === 'mobile' ? "/Carnival/layer3-mobile.png" : deviceType === 'tablet' ? "/Carnival/layer3-tablet.png" : "/Carnival/layer3-v2.png"}
        alt="Carnival Ticket Booth and Popcorn Cart"
        className="parallax-layer l4-fg"
        style={{ 
          transform: to([scrollY, entryProgress], (y, p) => {
            const parallaxY = y * 0.05;
            const entryY = p * 1200; // Foreground starts WAY down
            const scale = 1 + y * 0.0008;
            return `translateY(${parallaxY + entryY}px) scale(${scale})`;
          }),
          zIndex: 5 
        }}
      />
    </motion.section>
  );
};

export default React.memo(CarnivalHero);
