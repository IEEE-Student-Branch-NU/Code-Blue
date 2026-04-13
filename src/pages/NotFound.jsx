import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Squares from '../components/Backgrounds/Squares/Squares'

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEF'

const NotFound = () => {
  const navigate = useNavigate()
  const [glitchText, setGlitchText] = useState('404')
  const [statusText, setStatusText] = useState('')
  const timerRef = useRef(null)

  // Glitch effect on the 404 text
  useEffect(() => {
    let frame = 0
    const interval = setInterval(() => {
      frame++
      if (frame % 8 < 3) {
        const chars = Array(3).fill(0).map(() => 
          GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join('')
        setGlitchText(chars)
      } else {
        setGlitchText('404')
      }
    }, 120)

    return () => clearInterval(interval)
  }, [])

  // Terminal-style status messages
  useEffect(() => {
    const messages = [
      '> SCANNING ROUTES...',
      '> PATH_NOT_FOUND IN REGISTRY',
      '> SIGNAL LOST — NO MATCH DETECTED',
      '> RECOMMENDED: RETURN TO BASE',
    ]
    let i = 0

    const typeMessage = (msg, callback) => {
      let charIndex = 0
      setStatusText('')
      const typeInterval = setInterval(() => {
        setStatusText(msg.slice(0, charIndex + 1))
        charIndex++
        if (charIndex >= msg.length) {
          clearInterval(typeInterval)
          if (callback) setTimeout(callback, 1200)
        }
      }, 35)
      return typeInterval
    }

    const runSequence = () => {
      if (i < messages.length) {
        timerRef.current = typeMessage(messages[i], () => {
          i++
          runSequence()
        })
      }
    }

    const startDelay = setTimeout(runSequence, 600)
    return () => {
      clearTimeout(startDelay)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Animated Squares Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Squares
          direction="diagonal"
          speed={0.15}
          borderColor="#1a1a2e"
          squareSize={45}
          hoverFillColor="#00629b10"
        />
      </div>

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '680px',
        }}
      >
        {/* Corner brackets */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: '40px',
          height: '40px',
          borderTop: '3px solid #00629b',
          borderLeft: '3px solid #00629b',
        }} />
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '40px',
          height: '40px',
          borderTop: '3px solid #00629b',
          borderRight: '3px solid #00629b',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-20px',
          width: '40px',
          height: '40px',
          borderBottom: '3px solid #00629b',
          borderLeft: '3px solid #00629b',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          right: '-20px',
          width: '40px',
          height: '40px',
          borderBottom: '3px solid #00629b',
          borderRight: '3px solid #00629b',
        }} />

        {/* Error badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'inline-block',
            padding: '6px 20px',
            border: '2px solid #ff0040',
            backgroundColor: 'rgba(255, 0, 64, 0.1)',
            marginBottom: '2rem',
          }}
        >
          <span style={{
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#ff0040',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            ⚠ SYSTEM ERROR
          </span>
        </motion.div>

        {/* Giant 404 */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Inter', 'Arial Black', sans-serif",
            fontSize: 'clamp(8rem, 20vw, 14rem)',
            fontWeight: 900,
            color: '#fff',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            margin: '0 0 1rem 0',
            position: 'relative',
            textShadow: '0 0 80px rgba(0, 98, 155, 0.4), 0 0 160px rgba(0, 98, 155, 0.2)',
            userSelect: 'none',
          }}
        >
          {glitchText}
          {/* Glitch layers */}
          <span style={{
            position: 'absolute',
            top: '2px',
            left: '4px',
            color: '#00629b',
            opacity: 0.6,
            clipPath: 'polygon(0 15%, 100% 15%, 100% 40%, 0 40%)',
            zIndex: -1,
          }}>
            {glitchText}
          </span>
          <span style={{
            position: 'absolute',
            top: '-2px',
            left: '-3px',
            color: '#ff0040',
            opacity: 0.4,
            clipPath: 'polygon(0 65%, 100% 65%, 100% 85%, 0 85%)',
            zIndex: -1,
          }}>
            {glitchText}
          </span>
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #00629b, #5eb8ff, #00629b, transparent)',
            margin: '0 auto 2rem',
            maxWidth: '300px',
            transformOrigin: 'center',
          }}
        />

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
            fontWeight: 900,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            margin: '0 0 0.8rem 0',
          }}
        >
          PAGE NOT FOUND
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
            color: '#5eb8ff',
            letterSpacing: '0.05em',
            lineHeight: 1.7,
            margin: '0 0 2rem 0',
          }}
        >
          The route you requested does not exist in our system.<br />
          It may have been moved, archived, or never existed.
        </motion.p>

        {/* Terminal status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            backgroundColor: 'rgba(0, 98, 155, 0.08)',
            border: '1px solid rgba(0, 98, 155, 0.25)',
            padding: '1rem 1.5rem',
            marginBottom: '2.5rem',
            textAlign: 'left',
            minHeight: '28px',
          }}
        >
          <span style={{
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontSize: '0.8rem',
            color: '#5eb8ff',
            opacity: 0.9,
          }}>
            {statusText}
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '16px',
              backgroundColor: '#5eb8ff',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'blink 1s step-end infinite',
            }} />
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#000',
              backgroundColor: '#fff',
              border: '3px solid #fff',
              padding: '14px 36px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '6px 6px 0px #00629b',
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = '#00629b'
              e.target.style.color = '#fff'
              e.target.style.borderColor = '#00629b'
              e.target.style.boxShadow = '6px 6px 0px #fff'
              e.target.style.transform = 'translate(-2px, -2px)'
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = '#fff'
              e.target.style.color = '#000'
              e.target.style.borderColor = '#fff'
              e.target.style.boxShadow = '6px 6px 0px #00629b'
              e.target.style.transform = 'translate(0, 0)'
            }}
          >
            Return Home
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#5eb8ff',
              backgroundColor: 'transparent',
              border: '3px solid #00629b',
              padding: '14px 36px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = 'rgba(0, 98, 155, 0.15)'
              e.target.style.borderColor = '#5eb8ff'
              e.target.style.transform = 'translate(-2px, -2px)'
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = '#00629b'
              e.target.style.transform = 'translate(0, 0)'
            }}
          >
            Go Back
          </button>
        </motion.div>

        {/* Footer stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{
            marginTop: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <div style={{
            width: '30px',
            height: '1px',
            backgroundColor: '#333',
          }} />
          <span style={{
            fontFamily: "'Space Mono', 'Courier New', monospace",
            fontSize: '0.65rem',
            color: '#333',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            IEEE SBNU • SYSTEM MONITOR
          </span>
          <div style={{
            width: '30px',
            height: '1px',
            backgroundColor: '#333',
          }} />
        </motion.div>
      </motion.div>

      {/* Cursor blink keyframes */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default NotFound
