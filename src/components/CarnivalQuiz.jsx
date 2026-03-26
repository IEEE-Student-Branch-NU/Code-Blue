import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZapOff, Ticket, Target, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { techQuizData } from '../data/quizData';
import './CarnivalQuiz.css';

const popIn = {
  in: { opacity: 0, scale: 0.8, y: 20 },
  on: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', bounce: 0.5, duration: 0.6 } },
  out: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }
};

const slideLeft = {
  in: { opacity: 0, x: 50 },
  on: { opacity: 1, x: 0, transition: { type: 'spring', bounce: 0.4, duration: 0.6 } },
  out: { opacity: 0, x: -50, transition: { duration: 0.2 } }
};

const MAX_TIME_PER_Q = 12; // 12 seconds per question

/* ═══════════════════════════════════════════════
   MAIN COMPONENT: CARNIVAL TECH QUIZ
   ═══════════════════════════════════════════════ */
const CarnivalQuiz = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('AUTH');
  const [user, setUser] = useState(null);
  const [isNirmaUser, setIsNirmaUser] = useState(false);
  const [hashedVoucher, setHashedVoucher] = useState('');
  
  // Game State
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME_PER_Q);
  
  // Interaction State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef(null);

  const handleLogout = () => { googleLogout(); setUser(null); setIsNirmaUser(false); setPhase('AUTH'); };

  const generateVoucher = async (email) => {
    const secret = "IEEE_CARNIVAL_SBNU_GENERAL_2026";
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

  /* ─── Initialize Game ─── */
  const initGame = () => {
    // Select 8 random questions from the pool
    const shuffledPool = [...techQuizData].sort(() => Math.random() - 0.5);
    const selected8 = shuffledPool.slice(0, 8).map(q => ({
       ...q,
       options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    
    setQuestions(selected8);
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(MAX_TIME_PER_Q);
    setSelectedOption(null);
    setIsLocked(false);
    setPhase('PLAYING');
  };

  /* ─── Timer Logic ─── */
  useEffect(() => {
    if (phase === 'PLAYING' && !isLocked) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, isLocked]);

  const handleTimeOut = () => {
    clearInterval(timerRef.current);
    setIsLocked(true);
    setSelectedOption('TIMEOUT');
    setTimeout(nextQuestion, 1500);
  };

  const handleOptionClick = (option) => {
    if (isLocked) return;
    clearInterval(timerRef.current);
    setIsLocked(true);
    setSelectedOption(option);
    
    if (option === questions[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
      if (navigator.vibrate) navigator.vibrate(12); // Elegant 'Micro-Tick' for Correct
    } else {
      if (navigator.vibrate) navigator.vibrate([40, 40, 40]); // Subtle 'Triple-Tap' for Wrong
    }
    
    setTimeout(nextQuestion, 1500);
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      setPhase('RESULT');
      if (score + 1 === questions.length && navigator.vibrate) {
         navigator.vibrate([40, 30, 40, 30, 80]); // Ultra-Subtle Victory Pattern
      }
    } else {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(MAX_TIME_PER_Q);
      setSelectedOption(null);
      setIsLocked(false);
    }
  };

  /* ─── Reset on Open & Body Scroll Lock ─── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (navigator.vibrate) navigator.vibrate(10); // Nearly silent 'Enter' tap
      if (!user) setPhase('AUTH'); else setPhase('LOBBY');
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      clearInterval(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];
  const pastelColors = ['var(--cq-pink)', 'var(--cq-blue)', 'var(--cq-yellow)', 'var(--cq-green)'];

  return ReactDOM.createPortal(
    <div className="cq-portal">
      <div className="cq-carnival-bg" />

      <div className="cq-main">
        {/* UNIFIED HEADER BAR - Prevents Overlap */}
        <div className="cq-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="cq-score-badge">SCORE: {score}/{questions.length}</div>
          </div>
          <button className="cq-x-mini" onClick={() => setIsOpen(false)}>
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="cq-content">
          <AnimatePresence mode="wait" initial={false}>

            {/* ═══ AUTH ═══ */}
            {phase === 'AUTH' && (
              <motion.div key="auth" variants={popIn} initial="in" animate="on" exit="out" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="cq-title-wrap">
                  <div className="cq-title-top">TECH RUSH CHALLENGE</div>
                  <div className="cq-title-main">CARNIVAL<br/>QUIZ</div>
                </div>

                <div className="cq-neo-card" style={{ background: '#f8fafc', padding: '40px' }}>
                  <div style={{ fontFamily: "'Bungee Inline'", fontSize: '14px', color: '#666', letterSpacing: '2px', marginBottom: '10px' }}>AUTHENTICATION REQUIRED</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: '12px', color: '#000', opacity: 0.6, marginBottom: '20px' }}>TICKETS VALID FOR @NIRMAUNI.AC.IN ONLY</div>
                  {!isNirmaUser && user ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                      <ZapOff size={48} color="#ff0055" />
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: '#ff0055', fontSize: '20px' }}>ACCESS DENIED</div>
                      <button className="cq-neo-btn" style={{ background: '#ff0055' }} onClick={handleLogout}>TRY ANOTHER ACCOUNT</button>
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        useOneTap theme="filled_black" shape="pill" size="large" width="280px"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══ LOBBY ═══ */}
            {phase === 'LOBBY' && (
              <motion.div 
                key="lobby" 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '10px' }}
              >
                {localStorage.getItem(`CQ_ATTEMPT_${user?.email}`) && user?.email !== '24btm032@nirmauni.ac.in' && user?.email !== 'ieee@nirmauni.ac.in' ? (
                  <div className="cq-neo-card" style={{ background: '#fff1f2' }}>
                    <XCircle size={60} color="#ff0055" />
                    <div style={{ fontFamily: "'Rye', serif", fontSize: '32px', color: '#000', lineHeight: 1 }}>LIMIT REACHED</div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 800, color: '#ff0055', opacity: 0.8 }}>
                      YOUR ATTEMPT HAS BEEN RECORDED.
                    </p>
                    <div className="h-px w-full bg-black/10 my-2" />
                    <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5 }}>
                      EXCEPTIONAL PRECISION TEST: ONE ATTEMPT PER STUDENT.
                    </p>
                  </div>
                ) : (
                  <div className="cq-neo-card">
                    <h1 className="cq-title-main">SYSTEM<br/>READY</h1>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                       <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#6366f1', opacity: 0.8 }}>EXCEPTIONAL PRECISION REQUIRED</div>
                       <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', fontWeight: 700, opacity: 0.4, textTransform: 'uppercase', letterSpacing: '1px' }}>Score 8/8 to Win the Master Voucher</div>
                    </div>
                    
                    <div className="cq-lobby-stats">
                      <div className="cq-lobby-stat">
                        <span>POOL</span>
                        <strong>50 Qs</strong>
                      </div>
                      <div className="cq-lobby-stat">
                        <span>PACE</span>
                        <strong>12s / Q</strong>
                      </div>
                      <div className="cq-lobby-stat">
                        <span>STATUS</span>
                        <strong>ELITE</strong>
                      </div>
                    </div>

                    <button 
                       className="cq-neo-btn" 
                       onClick={() => {
                          const isTester = (user?.email === '24btm032@nirmauni.ac.in' || user?.email === 'ieee@nirmauni.ac.in');
                          if (!isTester) {
                             localStorage.setItem(`CQ_ATTEMPT_${user?.email}`, 'DONE');
                          }
                          initGame();
                       }} 
                       style={{ marginTop: '10px' }}
                    >
                      START CHALLENGE
                    </button>
                  </div>
                )}
                <button onClick={handleLogout} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', fontWeight: 700, color: '#fff', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px' }}>
                  Not {user?.name?.split(' ')[0]}? Switch account
                </button>
              </motion.div>
            )}

            {/* ═══ PLAYING ═══ */}
            {phase === 'PLAYING' && currentQ && (
              <motion.div 
                key={`q-${currentIdx}`} 
                initial={{ opacity: 0, scale: 0.9, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotateY: -45 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="cq-play-wrap"
              >
                {/* HUD + TIMER */}
                <div style={{ marginBottom: '15px' }}>
                   <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      <div style={{ fontFamily: "'Rye', serif", fontSize: '32px', color: timeLeft <= 3 ? '#ff0055' : '#000' }}>
                        {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
                      </div>
                   </div>
                   <div className="cq-timer-wrap">
                     <motion.div 
                       className="cq-timer-fill" 
                       initial={{ width: "100%" }}
                       animate={{ width: `${(timeLeft / MAX_TIME_PER_Q) * 100}%` }}
                       style={{ background: timeLeft <= 3 ? '#ff0055' : '#10b981' }} 
                     />
                   </div>
                </div>

                {/* QUESTION CARD */}
                <div className="cq-question-card">
                  <div className="cq-question-number">Q {currentIdx + 1}</div>
                  {currentQ.question}
                </div>

                {/* OPTIONS GRID */}
                <div className="cq-options-grid">
                    {currentQ.options.map((opt, idx) => {
                      let btnClass = "cq-option-btn";
                      let icon = null;
                      
                      if (isLocked) {
                        if (opt === currentQ.correctAnswer) {
                          btnClass += " correct";
                          icon = <CheckCircle2 size={16} />;
                        } else if (selectedOption === opt) {
                          btnClass += " incorrect";
                          icon = <XCircle size={16} />;
                        } else {
                          btnClass += " dim";
                        }
                      }

                      return (
                        <button 
                          key={idx}
                          className={btnClass}
                          onClick={() => handleOptionClick(opt)}
                          disabled={isLocked}
                        >
                          <span style={{ flex: 1 }}>{opt}</span>
                          {icon}
                        </button>
                      );
                    })}
                </div>
              </motion.div>
            )}

            {/* ═══ RESULT ═══ */}
            {phase === 'RESULT' && (
              <motion.div key="result" variants={popIn} initial="in" animate="on" exit="out" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="cq-result-card">
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '-10px' }}>
                    {score === questions.length ? <CheckCircle2 size={48} color="#22c55e" /> : <XCircle size={48} color="#ff0055" />}
                  </div>
                  <div style={{ fontFamily: "'Rye', serif", fontSize: '40px', color: 'var(--cq-black)', lineHeight: 1 }}>
                    {score === questions.length ? 'PERFECT SCORE' : 'QUIZ OVER'}
                  </div>
                  
                  {score === questions.length ? (
                    <div className="cq-ticket">
                      <div className="cq-ticket-tag">MASTER VOUCHER</div>
                      <div className="cq-ticket-code">{hashedVoucher || 'WIN-1234'}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: 700, color: 'rgba(0,0,0,0.6)', borderTop: '2px solid rgba(0,0,0,0.1)', paddingTop: '12px', marginTop: '12px' }}>
                        <strong>{user?.name}</strong><br/>
                        {user?.email}<br/><br/>
                        SCORE: {score}/8 • SHOW TICKET AT BOOTH
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', marginTop: '16px' }}>
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>
                        You scored {score}/{questions.length}. A <strong>perfect score of 8</strong> was required to unlock the Master Voucher!
                      </p>
                      { (user?.email === '24btm032@nirmauni.ac.in' || user?.email === 'ieee@nirmauni.ac.in') ? (
                        <button className="cq-neo-btn" onClick={() => { setPhase('LOBBY'); }}>
                          <RotateCcw size={18} strokeWidth={3} /> RETRY CHALLENGE (TESTER)
                        </button>
                      ) : (
                        <button className="cq-neo-btn" onClick={() => setIsOpen(false)}>
                          <X size={18} strokeWidth={3} /> CLOSE QUIZ
                        </button>
                      )}
                    </div>
                  )}
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

export default CarnivalQuiz;
