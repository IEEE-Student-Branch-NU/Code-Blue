import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './CarnivalHero.css';

const CarnivalHero = () => {
  // Setup a spring reacting to scrollY without forcing React re-renders!
  const [{ scrollY }, api] = useSpring(() => ({ 
    scrollY: 0,
    config: { mass: 1.5, tension: 70, friction: 35 } // Buttery smooth spring physics
  }));

  useEffect(() => {
    const handleScroll = () => {
      api.start({ scrollY: window.scrollY });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [api]);

  return (
    <section className="carnival-hero">
      {/* 
        Parallax math with React Spring!
        background = scrollY * 0.8
        midground  = scrollY * 0.7
        logo       = scrollY * 0.6
        foreground = scrollY * 0.5
      */}
      
      {/* Layer 1: Background Layer */}
      <animated.img
        src="/Carnival/layer1-v2.png"
        alt="Carnival Background Sky"
        className="parallax-layer l1-bg"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.8}px)`) }}
      />

      {/* Layer 2: Midground Layer (Ferris Wheel + Tents) */}
      <animated.img
        src="/Carnival/layer2-v2.png"
        alt="Carnival Ferris Wheel and Tents"
        className="parallax-layer l2-mid"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.7}px)`) }}
      />

      {/* Layer 3: Logo Layer */}
      <animated.div
        className="parallax-logo-layer l3-logo"
        style={{ transform: scrollY.to(y => `translateY(${y * 0.6}px)`) }}
      >
        <img
          src="/Carnival/carnival-logo.png"
          alt="IEEE Carnival Logo"
          className="carnival-logo"
        />
      </animated.div>

      {/* Layer 4: Foreground Layer (Popcorn cart, Ticket booth) */}
      <img
        src="/Carnival/layer3-v2.png"
        alt="Carnival Ticket Booth and Popcorn Cart"
        className="parallax-layer l4-fg"
      />
    </section>
  );
};

export default CarnivalHero;
