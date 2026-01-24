import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/tubelight-navbar'
import FaultyTerminal from './components/FaultyTerminal'
import CurvedLoop from './components/CurvedLoop'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', position: 'relative' }}>
      {/* FaultyTerminal Background - Only on Home page */}
      {isHome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
          <FaultyTerminal
            scale={2.0}
            digitSize={1.2}
            scanlineIntensity={0.5}
            glitchAmount={0.5}
            flickerAmount={0.6}
            noiseAmp={1}
            chromaticAberration={0.005}
            dither={0.25}
            curvature={0.05}
            tint="#00629b"
            mouseReact
            mouseStrength={0.5}
            brightness={0.8}
          />
        </div>
      )}

      {/* NavBar - Tubelight Navbar */}
      <NavBar items={items} />

      {/* Curved Loop only on Home Page, has higher z-index to stay on top */}
      {isHome && (
        <div style={{ position: 'relative', zIndex: 10, marginTop: '5px' }}>
          <CurvedLoop
            marqueeText=" Sampark' 26  ✦"
            speed={1.5}
            curveAmount={100}
            interactive={true}
          />
        </div>
      )}

      {/* Routes */}
      <div style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

