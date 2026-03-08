import React, { useState, useEffect, useRef } from 'react';
import './Carnival.css';
import Balatro from '../components/Balatro';
import DecryptedText from '../components/DecryptedText';

const Carnival = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDay, setActiveDay] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight = containerRef.current.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scale from 1 to 50
  const scale = 1 + scrollProgress * 50;
  // Radius from 24 to 0
  const radius = Math.max(0, 24 * (1 - scrollProgress * 5));
  // Content opacity fades out as we zoom
  const contentOpacity = Math.max(0, 1 - scrollProgress * 4);
  // Second page fades in at the end
  const secondPageOpacity = Math.max(0, (scrollProgress - 0.8) * 5);

  return (
    <div className="carnival-scroll-container" ref={containerRef}>
      <div className="carnival-sticky-viewport">
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
            style={{
              '--portal-scale': scale,
              '--portal-radius': `${radius}px`,
              '--portal-shadow': scrollProgress * 0.8,
              '--portal-bg': scrollProgress > 0.5 ? '#050505' : 'transparent'
            }}
          >
            <div className="carnival-content" style={{ '--content-opacity': contentOpacity, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
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
            style={{
              '--second-page-opacity': secondPageOpacity,
              '--second-page-events': secondPageOpacity > 0.5 ? 'all' : 'none'
            }}
          >
            <div className="retro-bg-effects">
              <div className="retro-radial-glow" />
              <div className="retro-perspective-grid" />
            </div>

            <div className="schedule-bars-container">
              {[
                { id: 1, label: 'DAY 1', color: '#00f0ff', title: 'CYBER INCEPTION' },
                { id: 2, label: 'DAY 2', color: '#ff00cc', title: 'NEON NEXUS' },
                { id: 3, label: 'DAY 3', color: '#7b2fff', title: 'VIRTUAL VOID' }
              ].map((day) => (
                <div
                  key={day.id}
                  className={`neon-bar ${activeDay === day.id ? 'expanded' : ''} ${activeDay && activeDay !== day.id ? 'shrunken' : ''}`}
                  style={{ '--bar-color': day.color }}
                  onClick={() => setActiveDay(day.id)}
                >
                  <div className="bar-label">{day.label}</div>

                  <div className="bar-content-overlay">
                    <div className="bar-close" onClick={(e) => { e.stopPropagation(); setActiveDay(null); }}>×</div>
                    <div className="expanded-inner-content">
                      <h2 className="expanded-title" style={{ textShadow: `0 0 20px ${day.color}` }}>{day.title}</h2>
                      <div className="expanded-details">
                        <p>Deep dive into the {day.label} experience of IEEE Carnival.</p>
                        <ul className="event-list">
                          <li>10:00 AM - Tech Keynote</li>
                          <li>02:00 PM - Workshop Series</li>
                          <li>06:00 PM - Neon Party</li>
                        </ul>
                      </div>
                      <div className="mini-grid-floor" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="return-button-wrapper" style={{ opacity: activeDay ? 0 : 1 }}>
              <button
                className="date-pill"
                style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Return to Entrance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carnival;
