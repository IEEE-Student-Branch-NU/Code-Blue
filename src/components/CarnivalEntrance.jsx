import React, { useState, useCallback, useEffect } from 'react';
import Shuffle from './Shuffle';
import { motion, AnimatePresence } from 'framer-motion';
import './CarnivalEntrance.css';
import './Shuffle.css';

const CarnivalEntrance = ({ onPlayQuiz }) => {
  const [phase, setPhase] = useState('shuffle');
  const [timeLeft, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date('2026-04-03T09:00:00');
    const timer = setInterval(() => {
      const diff = target - new Date();
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      setLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onEnter = useCallback(() => {
    setPhase('igniting');
    // Dispatch global event for App.jsx to handle transition
    window.dispatchEvent(new CustomEvent('start-carnival-transition'));
  }, []);

  return (
    <div className="ce-content">
      <AnimatePresence mode="wait">
        {phase === 'shuffle' && (
          <motion.div
            key="shuffle-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              filter: "blur(20px)",
              transition: { duration: 0.5 } 
            }}
            className="flex flex-col items-center"
          >
            {/* Main Shuffling Header */}
            <Shuffle
              text="IEEE CARNIVAL"
              className="ce-headline-main"
              shuffleTimes={3}
              duration={0.6}
            />

            <Shuffle
              text="IS HERE"
              className="ce-headline-sub"
              shuffleTimes={5}
              duration={0.8}
            />

            {/* Retro Countdown */}
            <div className="ce-countdown">
              <div className="ce-countdown-box">
                <div className="ce-countdown-num">{timeLeft.d.toString().padStart(2, '0')}</div>
                <div className="ce-countdown-label">DAYS</div>
              </div>
              <div className="ce-countdown-sep">:</div>
              <div className="ce-countdown-box">
                <div className="ce-countdown-num">{timeLeft.h.toString().padStart(2, '0')}</div>
                <div className="ce-countdown-label">HOURS</div>
              </div>
              <div className="ce-countdown-sep">:</div>
              <div className="ce-countdown-box">
                <div className="ce-countdown-num">{timeLeft.m.toString().padStart(2, '0')}</div>
                <div className="ce-countdown-label">MINUTES</div>
              </div>
              <div className="ce-countdown-sep">:</div>
              <div className="ce-countdown-box">
                <div className="ce-countdown-num">{timeLeft.s.toString().padStart(2, '0')}</div>
                <div className="ce-countdown-label">SECONDS</div>
              </div>
            </div>

            <div className="ce-sbnu-tag">
              IEEE SBNU • NIRMA UNIVERSITY
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', pointerEvents: 'auto' }}>
              <motion.button
                onClick={onEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ce-enter-btn"
              >
                ENTER <span className="text-xl">→</span>
              </motion.button>

              <motion.button 
                onClick={onPlayQuiz}
                whileHover={{ scale: 1.05, y: -4, boxShadow: '8px 8px 0px #1a1a1a' }}
                whileTap={{ scale: 0.95, y: 4, boxShadow: '0px 0px 0px #1a1a1a' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', background: '#FEF9C3', color: '#1a1a1a', 
                  border: '3px solid #1a1a1a', padding: '0.7rem 2rem', boxShadow: '6px 6px 0px #1a1a1a', 
                  fontFamily: "'Rye', serif", fontSize: 'clamp(14px, 3vw, 18px)', cursor: 'pointer'
                }}
              >
                🚀 PLAY QUIZ
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarnivalEntrance;
