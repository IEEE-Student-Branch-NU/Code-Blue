import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export function NavBar({
  items,
  className
}) {
  const [activeTab, setActiveTab] = useState(items[0].label)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return (
    <div
      className={`navbar-container ${className || ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        paddingTop: '1.5rem'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          padding: '0.25rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
        {items.map((item) => {
          const isActive = activeTab === item.label

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setActiveTab(item.label)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                transition: 'color 0.2s',
                color: isActive ? '#00a9ff' : 'rgba(255, 255, 255, 0.8)',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                textDecoration: 'none'
              }}>
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    borderRadius: '9999px',
                    zIndex: -1
                  }}>
                  {/* Tubelight bar */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #00a9ff, #00d4ff, #00a9ff)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: '0 0 10px #00a9ff, 0 0 20px #00a9ff, 0 0 30px #00a9ff',
                    animation: 'tubeGlow 2s ease-in-out infinite'
                  }}>
                    {/* Outer glow */}
                    <div style={{
                      position: 'absolute',
                      width: '60px',
                      height: '30px',
                      background: 'radial-gradient(ellipse at center, rgba(0, 169, 255, 0.4) 0%, transparent 70%)',
                      borderRadius: '50%',
                      top: '-15px',
                      left: '-10px',
                      filter: 'blur(8px)',
                      animation: 'tubeGlow 2s ease-in-out infinite'
                    }} />
                    {/* Inner glow */}
                    <div style={{
                      position: 'absolute',
                      width: '40px',
                      height: '20px',
                      background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.6) 0%, transparent 70%)',
                      borderRadius: '50%',
                      top: '-10px',
                      left: '0px',
                      filter: 'blur(5px)',
                      animation: 'tubeGlow 2s ease-in-out infinite 0.5s'
                    }} />
                    {/* Light beam down */}
                    <div style={{
                      position: 'absolute',
                      width: '30px',
                      height: '40px',
                      background: 'linear-gradient(180deg, rgba(0, 169, 255, 0.3) 0%, transparent 100%)',
                      top: '4px',
                      left: '5px',
                      filter: 'blur(10px)'
                    }} />
                  </div>
                </motion.div>
              )}
              <style>{`
                @keyframes tubeGlow {
                  0%, 100% {
                    opacity: 1;
                    filter: brightness(1);
                  }
                  50% {
                    opacity: 0.8;
                    filter: brightness(1.3);
                  }
                }
              `}</style>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default NavBar;
