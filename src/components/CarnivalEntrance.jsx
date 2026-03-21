import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Shuffle from './Shuffle';
import './CarnivalEntrance.css';
import './Shuffle.css';

const CarnivalEntrance = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('April 3, 2026 09:00:00').getTime();
    const tick = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleEnter = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('playing');
    setTimeout(() => navigate('/carnival'), 300);
  }, [phase, navigate]);

  const pad = n => String(n).padStart(2, '0');

  return (
    <>
      <div className="ce-content">

        {/* ── Main Event Headline ── */}
        <Shuffle
          text="IEEE CARNIVAL"
          tag="h1"
          className="ce-headline-main"
          shuffleDirection="down"
          animationMode="evenodd"
          stagger={0.03}
          duration={0.6}
          scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          shuffleTimes={1}
          triggerOnHover={true}
          triggerOnce={false}
          loop={false}
          threshold={0.1}
          rootMargin="0px"
          textAlign="center"
        />

        {/* ── Sub Label ── */}
        <Shuffle
          text="IS HERE"
          tag="h2"
          className="ce-headline-sub"
          shuffleDirection="down"
          animationMode="evenodd"
          stagger={0.04}
          duration={0.5}
          scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
          shuffleTimes={1}
          triggerOnHover={true}
          triggerOnce={false}
          loop={false}
          threshold={0.1}
          rootMargin="0px"
          textAlign="center"
        />

        {/* ── Countdown ── */}
        <div className="ce-countdown">
          {[
            { label: 'Days',    value: timeLeft.days },
            null,
            { label: 'Hours',   value: timeLeft.hours },
            null,
            { label: 'Minutes', value: timeLeft.minutes },
            null,
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="ce-countdown-sep">:</div>
            ) : (
              <div key={i} className="ce-countdown-box">
                <div className="ce-countdown-num">{pad(item.value)}</div>
                <div className="ce-countdown-label">{item.label}</div>
              </div>
            )
          )}
        </div>

        {/* ── IEEE SBNU Branding ── */}
        <div className="ce-sbnu-tag">IEEE SBNU • NIRMA UNIVERSITY</div>

        {/* ── Enter Button ── */}
        <button
          className="ce-enter-btn"
          onClick={handleEnter}
          disabled={phase !== 'idle'}
          aria-label="Enter IEEE Carnival"
        >
          <span>ENTER</span>
          <span>→</span>
        </button>

      </div>

      {phase === 'playing' && (
        <div className="ce-video-overlay ce-video-overlay--active bg-black" />
      )}
    </>
  );
};

export default CarnivalEntrance;
