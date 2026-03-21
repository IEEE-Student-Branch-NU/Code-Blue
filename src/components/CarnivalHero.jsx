import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion, useSpring as useFramerSpring } from 'framer-motion';
import './CarnivalHero.css';

const CarnivalHero = () => {
  const [imagesLoaded, setImagesLoaded] = useState(true);
  
  // Setup the original React Spring for the "butter smooth" slow-motion physics
  const [{ scrollY }, api] = useSpring(() => ({ 
    scrollY: typeof window !== 'undefined' ? window.scrollY : 0, 
    config: { mass: 2, tension: 120, friction: 50 } // Extremely smooth, heavy trailing spring
  }));

  const logoRotateX = useFramerSpring(0, { stiffness: 100, damping: 30 });
  const logoRotateY = useFramerSpring(0, { stiffness: 100, damping: 30 });

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
        if (loadedCount === imagesToPreload.length) setImagesLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) setImagesLoaded(true);
      };
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.__carnivalParallaxPaused) return;
      
      const currentY = window.scrollY;
      const snap = window.__carnivalParallaxSnap === true;
      
      api.start({ 
        scrollY: currentY, 
        immediate: snap
      });

      if (snap) {
        window.__carnivalParallaxSnap = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // No need to call handleScroll() immediately here because we initialized the spring with the current value!

    return () => window.removeEventListener('scroll', handleScroll);
  }, [api]);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: imagesLoaded ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="carnival-hero origin-center transition-none relative"
      style={{ overflow: 'hidden' }}
    >
      
      <animated.img
        src="/Carnival/layer1-v2.png"
        alt="Carnival Background Sky"
        className="parallax-layer l1-bg"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.50}px) scale(${1.05 + y * 0.0001})`) }} /* Background trails deeply and zooms slightly */
      />

      <animated.img
        src={deviceType === 'mobile' ? "/Carnival/layer2-mobile.png" : deviceType === 'tablet' ? "/Carnival/layer2-tablet.png" : "/Carnival/layer2-v2.png"}
        alt="Carnival Ferris Wheel and Tents"
        className="parallax-layer l2-mid"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.35}px) scale(${1 + y * 0.0003})`) }} /* Midground zooms to "grow" the buildings */
      />

      {/* Layer 3: Logo Layer with Interactive Tilt */}
      <animated.div
        className="parallax-logo-layer l3-logo"
        style={{ 
          transform: scrollY.to(y => `translateY(${y * 0.15}px)`), 
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

      <animated.img
        src={deviceType === 'mobile' ? "/Carnival/layer3-mobile.png" : deviceType === 'tablet' ? "/Carnival/layer3-tablet.png" : "/Carnival/layer3-v2.png"}
        alt="Carnival Ticket Booth and Popcorn Cart"
        className="parallax-layer l4-fg"
        style={{ 
          transform: scrollY.to(y => `translateY(${y * 0.05}px) scale(${1 + y * 0.0008})`), /* Foreground stays close and zooms out heavily "growing" past camera */
          zIndex: 5 
        }}
      />
    </motion.section>
  );
};

export default React.memo(CarnivalHero);
