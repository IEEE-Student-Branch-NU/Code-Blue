import React, { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Shuffle from './Shuffle';
import './CarnivalEntrance.css';
import './Shuffle.css';

const CarnivalEntrance = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | playing | done

  const handleEnter = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('playing');
    // slight delay so state paint happens before video plays
    requestAnimationFrame(() => {
      const vid = videoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {
          // autoplay blocked – navigate anyway
          navigate('/carnival');
        });
      }
    });
  }, [phase, navigate]);

  const handleVideoEnd = useCallback(() => {
    setPhase('done');
    setTimeout(() => navigate('/carnival'), 100);
  }, [navigate]);

  return (
    <>
      {/* Text + button overlay on top of GridScan */}
      <div className="ce-content">
        <div className="ce-tag">IEEE CARNIVAL</div>

        <Shuffle
          text="IS HERE"
          tag="h2"
          className="ce-headline-1"
          shuffleDirection="down"
          animationMode="evenodd"
          stagger={0.04}
          duration={0.4}
          scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          shuffleTimes={2}
          triggerOnHover={true}
          triggerOnce={false}
          loop={false}
          threshold={0.1}
          rootMargin="0px"
          textAlign="center"
        />

        <p className="ce-headline-2">
          DRIVE INTO THE NEW REALM
          <span className="ce-subtitle-glitch" aria-hidden="true">DRIVE INTO THE NEW REALM</span>
        </p>

        <button
          className="ce-enter-btn"
          onClick={handleEnter}
          disabled={phase !== 'idle'}
          aria-label="Enter IEEE Carnival"
        >
          <span className="ce-btn-text">ENTER</span>
          <span className="ce-btn-arrow">→</span>
        </button>
      </div>

      {/* Full-screen video transition overlay */}
      <div
        ref={overlayRef}
        className={`ce-video-overlay ${phase === 'playing' || phase === 'done' ? 'ce-video-overlay--active' : ''}`}
      >
        <video
          ref={videoRef}
          className="ce-transition-video"
          src="/Carnival/Transistion video.mp4"
          playsInline
          muted={false}
          preload="none"
          onEnded={handleVideoEnd}
        />
      </div>
    </>
  );
};

export default CarnivalEntrance;
