import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZapOff, Hammer, Ticket, Coins, RotateCcw } from 'lucide-react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './PowerSmash.css';

const popIn = {
  in: { opacity: 0, scale: 0.8, y: 20 },
  on: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.5, duration: 0.6 } },
  out: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }
};

const slideUp = {
  in: { opacity: 0, y: 50 },
  on: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4, duration: 0.6 } },
  out: { opacity: 0, y: 50, transition: { duration: 0.2 } }
};

// Target range (85% to 95% of the bar)
const WIN_MIN = 85;
const WIN_MAX = 95;
// Speed configuration (ms to complete one full bottom-to-top sweep)
// 600ms makes it fast and genuinely challenging, guaranteeing not everyone wins on their first try.
const SWEEP_DUR = 600;

/* ═══════════════════════════════════════════════
   MAIN COMPONENT: POWER SMASH (HIGH STRIKER)
   ═══════════════════════════════════════════════ */
const PowerSmash = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('AUTH');
  const [user, setUser] = useState(null);
  const [isNirmaUser, setIsNirmaUser] = useState(false);
  const [hashedVoucher, setHashedVoucher] = useState('');
  
  // High Striker Game State
  const [credits, setCredits] = useState(3); // 3 attempts
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isOscillating, setIsOscillating] = useState(false);
  const [hasSmashed, setHasSmashed] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  
  const reqRef = useRef();
  const startTimeRef = useRef();

  const handleLogout = () => { googleLogout(); setUser(null); setIsNirmaUser(false); setPhase('AUTH'); };

  const generateVoucher = async (email) => {
    const secret = "IEEE_CARNIVAL_SBNU_2026";
    const msgUint8 = new TextEncoder().encode(email.toLowerCase() + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return "TKT-" + hashHex.slice(0, 8).toUpperCase();
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;
      const isNirma = email.endsWith('@nirmauni.ac.in');
      setUser(decoded);
      setIsNirmaUser(isNirma);
      if (isNirma) {
        setPhase('LOBBY');
        const code = await generateVoucher(email);
        setHashedVoucher(code);
      }
    } catch (err) { console.error("Auth Decode Error:", err); }
  };

  /* ─── Animation Loop ─── */
  const animateMeter = (timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    
    // Triangle wave oscillation logic
    const cyclePos = (elapsed % (SWEEP_DUR * 2)) / (SWEEP_DUR * 2); 
    // cyclePos goes 0 -> 1. We want 0->1->0 behavior.
    let currentScale = 0;
    if (cyclePos <= 0.5) {
       // Moving up
       currentScale = cyclePos * 2;
    } else {
       // Moving down
       currentScale = 1 - ((cyclePos - 0.5) * 2);
    }
    
    // Exaggerate easing at top and bottom using sine wave curve
    const easedProgress = (Math.sin((currentScale - 0.5) * Math.PI) + 1) / 2 * 100;
    
    setProgress(easedProgress);
    
    // We bind it directly to state, so it's accurate at the exact ms the user clicks.
    reqRef.current = requestAnimationFrame(animateMeter);
  };

  const startMeter = () => {
    setHasSmashed(false);
    setProgress(0);
    setResultMsg('');
    startTimeRef.current = null;
    setIsOscillating(true);
    reqRef.current = requestAnimationFrame(animateMeter);
  };

  /* ─── SMASH LOGIC ─── */
  const handleSmash = () => {
    if (!isOscillating || hasSmashed) return;
    
    // Stop the meter EXACTLY where it is.
    cancelAnimationFrame(reqRef.current);
    setIsOscillating(false);
    setHasSmashed(true);
    
    // Calculate win based on exact progress captured.
    const finalScore = progress;
    
    if (finalScore >= WIN_MIN && finalScore <= WIN_MAX) {
      // WIN!
      setResultMsg('PERFECT STRIKE!');
      setTimeout(() => setPhase('RESULT_WIN'), 1500);
    } else {
      // LOSE!
      const isOver = finalScore > WIN_MAX;
      setResultMsg(isOver ? 'TOO FAR!' : 'TOO WEAK!');
      const newCredits = credits - 1;
      setCredits(newCredits);
      
      setTimeout(() => {
         if (newCredits <= 0) {
            setPhase('RESULT_LOSE');
         } else {
            // Give them a moment to see their failure, then reset the bar.
            startMeter();
         }
      }, 1500);
    }
  };

  /* ─── Reset on Open ─── */
  useEffect(() => {
    if (isOpen) {
      if (!user) setPhase('AUTH'); else setPhase('LOBBY');
      setCredits(3);
      setHasSmashed(false);
      setProgress(0);
      setIsOscillating(false);
    }
    return () => cancelAnimationFrame(reqRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="ps-portal">
      <div className="ps-carnival-bg">
        {Array.from({ length: 12 }).map((_, i) => <div key={i} className="ps-confetti" />)}
      </div>

      <div className="ps-main">
        <div className="ps-head">
          <button className="ps-x" onClick={onClose}><X size={24} strokeWidth={3} /></button>
        </div>

        <div className="ps-content">
          <AnimatePresence mode="wait">

            {/* ═══ AUTH ═══ */}
            {phase === 'AUTH' && (
              <motion.div key="auth" variants={popIn} initial="in" animate="on" exit="out" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="ps-title-wrap">
                  <div className="ps-title-top">TEST OF STRENGTH</div>
                  <div className="ps-title-main">POWER<br/>SMASH</div>
                </div>

                <div className="ps-neo-card">
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '14px', color: 'var(--cb-black)' }}>TICKETS FOR @NIRMAUNI.AC.IN</div>
                  {!isNirmaUser && user ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                      <ZapOff size={40} color="var(--cb-danger)" />
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: 'var(--cb-danger)', fontSize: '18px' }}>ACCESS DENIED</div>
                      <button className="ps-neo-btn ps-btn-red" onClick={handleLogout}>TRY ANOTHER ACCOUNT</button>
                    </div>
                  ) : (
                    <div style={{ width: '100%' }}>
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        useOneTap theme="filled_black" shape="pill" size="large" width="100%"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ LOBBY ═══ */}
            {phase === 'LOBBY' && (
              <motion.div key="lobby" variants={popIn} initial="in" animate="on" exit="out" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="ps-neo-card">
                  <div style={{ fontFamily: "'Rye', serif", fontSize: '48px', color: 'var(--cb-black)', lineHeight: 1 }}>READY?</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>Hit GREEN to Win Voucher</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ flex: 1, background: 'var(--cb-purple)', border: '3px solid var(--cb-black)', borderRadius: '12px', padding: '12px 4px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '11px', boxShadow: '3px 3px 0px var(--cb-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <Hammer size={20} /> REFLEX TIMING
                    </div>
                    <div style={{ flex: 1, background: 'var(--cb-purple)', border: '3px solid var(--cb-black)', borderRadius: '12px', padding: '12px 4px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '11px', boxShadow: '3px 3px 0px var(--cb-black)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <Coins size={20} /> 3 ATTEMPTS
                    </div>
                  </div>

                  <button 
                     className="ps-neo-btn ps-btn-yellow" 
                     onClick={() => { setPhase('PLAYING'); startMeter(); }} 
                     style={{ fontSize: '24px', padding: '20px' }}
                  >
                    GRAB HAMMER
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══ PLAYING ═══ */}
            {phase === 'PLAYING' && (
              <motion.div key="play" variants={slideUp} initial="in" animate="on" exit="out" className="ps-meter-container">
                
                {/* HUD */}
                <div className="ps-hud" style={{ width: '100%', marginBottom: 0 }}>
                  <div className="ps-score-badge">
                    <Coins size={18} /> {credits} TRIES LEFT
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 900, color: 'var(--cb-danger)' }}>
                     {resultMsg}
                  </div>
                </div>

                {/* THE METER */}
                <div className="ps-meter-track">
                   <div className="ps-meter-bell" />
                   <div className="ps-meter-target" />
                   <div className="ps-meter-fill" style={{ transform: `scaleY(${progress / 100})` }} />
                </div>

                {/* BIG SMASH BUTTON */}
                <div className="ps-action-area">
                  <button 
                     className="ps-smash-btn"
                     onClick={handleSmash}
                     disabled={hasSmashed}
                  >
                    SMASH <Hammer size={32} style={{ display: 'inline', marginLeft: '8px' }} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══ RESULT (WIN) ═══ */}
            {phase === 'RESULT_WIN' && (
              <motion.div key="win" variants={popIn} initial="in" animate="on" exit="out" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="ps-result-card">
                  <div style={{ fontSize: '64px', margin: '-10px 0' }}>🔔</div>
                  <div style={{ fontFamily: "'Rye', serif", fontSize: '48px', color: 'var(--cb-black)', lineHeight: 1 }}>RING! RING!</div>
                  
                  <div className="ps-ticket">
                    <div className="ps-ticket-tag">MASTER VOUCHER</div>
                    <div className="ps-ticket-code">{hashedVoucher || 'WIN-1234'}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.6)', borderTop: '2px solid rgba(0,0,0,0.1)', paddingTop: '12px', marginTop: '12px' }}>
                      <strong>{user?.name}</strong><br/>
                      {user?.email}<br/><br/>
                      SHOW LANYARD AT BOOTH
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ RESULT (LOSE) ═══ */}
            {phase === 'RESULT_LOSE' && (
               <motion.div key="lose" variants={popIn} initial="in" animate="on" exit="out" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                 <div className="ps-result-card">
                   <div style={{ fontSize: '64px', margin: '-10px 0' }}>🥀</div>
                   <div style={{ fontFamily: "'Rye', serif", fontSize: '40px', color: 'var(--cb-black)', lineHeight: 1 }}>NOT STRONG ENOUGH</div>
                   
                   <div style={{ width: '100%', marginTop: '16px' }}>
                     <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
                       You ran out of attempts. You missed the Jackpot Zone!
                     </p>
                     <button className="ps-neo-btn ps-btn-yellow" onClick={() => { setCredits(3); setPhase('LOBBY'); }}>
                       <RotateCcw size={18} strokeWidth={3} /> PLAY AGAIN
                     </button>
                   </div>
                 </div>
               </motion.div>
             )}

          </AnimatePresence>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PowerSmash;
