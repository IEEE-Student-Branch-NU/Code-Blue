import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Carnival.css';
import Balatro from '../components/Balatro';
import DecryptedText from '../components/DecryptedText';
import FluidCanvas from '../components/FluidCanvas'; // Ensure you import the new component

const Carnival = () => {
  const [activeDay, setActiveDay] = useState(null);

  const containerRef = useRef(null);
  const portalRef = useRef(null);
  const contentRef = useRef(null);
  const secondPageRef = useRef(null);

  const rafId = useRef(null);
  const isIntersecting = useRef(false);

  const getBarStyles = (id) => {
    const isExpanded = activeDay === id;

    let right = '0px';
    let width = '70px'; // base width (increased from 60px)
    let zIndex = 10;

    if (!activeDay) {
      if (id === 1) right = '140px';
      if (id === 2) right = '70px';
      if (id === 3) right = '0px';
    } else {
      if (isExpanded) {
        width = 'calc(100vw - 140px)'; // Account for the two shrunken bars (2 * 70px)
        right = '140px';
        zIndex = 20;
      } else {
        const shrunkenIds = [1, 2, 3].filter(x => x !== activeDay);
        width = '70px';
        if (id === shrunkenIds[0]) right = '70px';
        if (id === shrunkenIds[1]) right = '0px';
      }
    }

    return { right, width, zIndex };
  };

  // The buttery smooth requestAnimationFrame loop
  const updateScroll = useCallback(() => {
    if (!isIntersecting.current || !containerRef.current) return;

    const scrollTop = window.scrollY;
    // Calculate document height mapping robustly
    const docHeight = Math.max(containerRef.current.offsetHeight - window.innerHeight, 1);

    // Clamp progress strictly between 0 and 1
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    // Calculate transforms
    const scale = 1 + progress * 50;
    const radius = Math.max(0, 24 * (1 - progress * 5));
    const contentOpacity = Math.max(0, 1 - progress * 4);

    // Smoothly fade in second page later in the scroll
    const secondPageOpacity = Math.min(Math.max(0, (progress - 0.7) * 5), 1);

    // Apply styles directly to refs for maximum performance (bypassing React render cycle)
    if (portalRef.current) {
      portalRef.current.style.transform = `scale(${scale}) translateZ(0)`;
      portalRef.current.style.borderRadius = `${radius}px`;
      // Darken background dynamically based on progress
      portalRef.current.style.background = progress > 0.5 ? '#050505' : 'transparent';
      portalRef.current.style.boxShadow = `0 0 100px rgba(0, 0, 0, ${progress * 0.8})`;
    }

    if (contentRef.current) {
      contentRef.current.style.opacity = contentOpacity;
    }

    if (secondPageRef.current) {
      secondPageRef.current.style.opacity = secondPageOpacity;
      secondPageRef.current.style.pointerEvents = secondPageOpacity > 0.5 ? 'all' : 'none';
    }

    rafId.current = requestAnimationFrame(updateScroll);
  }, []);

  useEffect(() => {
    // Force a scroll to top on mount so the animation starts correctly
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          // Kickstart the rAF loop when container is visible
          rafId.current = requestAnimationFrame(updateScroll);
        } else if (rafId.current) {
          // Pause rAF when out of view
          cancelAnimationFrame(rafId.current);
        }
      },
      { threshold: 0 } // Trigger as soon as 1px is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Force an initial update
    isIntersecting.current = true;
    updateScroll();

    return () => {
      observer.disconnect();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateScroll]);

  return (
    <div className="carnival-scroll-container" ref={containerRef}>
      <div className="carnival-sticky-viewport">
        {/* We keep Balatro as the initial entrance background */}
        <Balatro
          color1="#241138"
          color2="#3A1B5C"
          color3="#000000"
          uContrast={3.5}
          uSpinSpeed={0.2}
        />

        <div className="carnival-container">
          <div
            className="portal-card-wrapper"
            ref={portalRef}
            style={{ willChange: 'transform, border-radius', transform: 'translateZ(0)' }}
          >
            <div
              className="carnival-content"
              ref={contentRef}
              style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none', willChange: 'opacity' }}
            >
              <h1 className="carnival-title-new">
                <DecryptedText
                  text="IEEE"
                  animateOn="view"
                  revealDirection="center"
                  className="ieee-pink"
                  encryptedClassName="encrypted"
                />
                <DecryptedText
                  text="CARNIVAL"
                  animateOn="view"
                  revealDirection="center"
                  className="carnival-blue"
                  encryptedClassName="encrypted"
                />
              </h1>
            </div>
          </div>

          <div
            className="second-page-content"
            ref={secondPageRef}
            style={{ willChange: 'opacity' }}
          >
            {/* New Fluid Marble Background Effect */}
            <div className="retro-bg-effects">
              <FluidCanvas />
            </div>

            <div className="hero-text-block">
              <h2 className="hero-main-text">Three Days of the Extraordinary</h2>
              <div className="hero-sub-text">27th – 29th March · IEEE Carnival</div>
            </div>

            <div className="schedule-bars-container">
              {[
                { id: 1, label: 'DAY 1', color: '#ff1a6e', title: 'CYBER INCEPTION' },
                { id: 2, label: 'DAY 2', color: '#ff1a6e', title: 'LIQUID DREAMS' },
                { id: 3, label: 'DAY 3', color: '#ff1a6e', title: 'VIRTUAL VOID' }
              ].map((day) => {
                const styles = getBarStyles(day.id);
                return (
                  <div
                    key={day.id}
                    className={`neon-bar ${activeDay === day.id ? 'expanded' : ''} ${activeDay && activeDay !== day.id ? 'shrunken' : ''}`}
                    style={{
                      '--bar-color': day.color,
                      right: styles.right,
                      width: styles.width,
                      zIndex: styles.zIndex
                    }}
                    onClick={() => setActiveDay(day.id)}
                  >
                    <div className="bar-label">{day.label}</div>

                    <div className="bar-content-overlay">
                      <div className="bar-close" onClick={(e) => { e.stopPropagation(); setActiveDay(null); }}>×</div>
                      <div className="expanded-inner-content">
                        <h2 className="expanded-title">{day.title}</h2>
                        <div className="expanded-details">
                          <p>Deep dive into the {day.label} experience of IEEE Carnival.</p>
                          <ul className="event-list">
                            <li>10:00 AM - Tech Keynote</li>
                            <li>02:00 PM - Workshop Series</li>
                            <li>06:00 PM - Neon Party</li>
                          </ul>
                        </div>
                        <div className="panel-return-wrapper">
                          <button
                            className="return-link"
                            onClick={(e) => { e.stopPropagation(); setActiveDay(null); }}
                          >
                            ← Back to Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="return-button-wrapper" style={{ opacity: activeDay ? 0 : 1 }}>
              <button
                className="return-link"
                style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ← Return to Entrance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carnival;

