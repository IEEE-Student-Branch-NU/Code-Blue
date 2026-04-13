import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import StaggeredMenu from './components/StaggeredMenu'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import BoardMembers from './pages/BoardMembers'
import JoinUs from './pages/JoinUs'
import { Analytics } from "@vercel/analytics/react"
import CyberGateTransition from './components/CyberGateTransition'
import VoucherVerifier from './pages/VoucherVerifier'

const CodeBlue = React.lazy(() => import('./pages/CodeBlue'))
const Carnival = React.lazy(() => import('./pages/Carnival'))
const CarnivalGallery = React.lazy(() => import('./pages/CarnivalGallery'))
const EventDetails = React.lazy(() => import('./pages/EventDetails'))

const menuItems = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Join Us", link: "/join-us" },
  { label: "Carnival", link: "/carnival" },
  { label: "Contact", link: "/contact" },
  { label: "Board Members", link: "/board-members" },
  { label: "Gallery", link: "/gallery" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/ieeenirma" },
  { label: "LinkedIn", link: "https://www.linkedin.com/company/ieee-student-branch-nirma-university" },
];

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const targetPathRef = useRef('/carnival');

  useEffect(() => {
    const handleTransition = (e) => {
      if (e.detail && e.detail.path) {
        targetPathRef.current = e.detail.path;
      } else {
        targetPathRef.current = '/carnival';
      }
      setIsTransitioning(prev => {
        if (!prev) return true;
        return prev;
      });
    };
    window.addEventListener('start-carnival-transition', handleTransition);
    return () => window.removeEventListener('start-carnival-transition', handleTransition);
  }, []);

  const handleGateClosed = useCallback(() => {
    navigate(targetPathRef.current);
  }, [navigate]);

  const handleComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative' }}>
      <Analytics />

      {/* Persistent Global Transition - Covers route changes */}
      <CyberGateTransition 
        trigger={isTransitioning}
        onGateClosed={handleGateClosed}
        onComplete={handleComplete}
      />

      {/* StaggeredMenu Navigation */}
      <StaggeredMenu
        ref={menuRef}
        items={menuItems}
        socialItems={socialItems}
        colors={['#00629b', '#004d7a']}
        accentColor="#00629b"
        isFixed={true}
        position="right"
        displaySocials={true}
        displayItemNumbering={true}
        logoUrl=""
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
      />

      {/* Routes Wrapper */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/board-members" element={<BoardMembers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/code-blue" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
                <CodeBlue />
              </Suspense>
            } />
            <Route path="/carnival" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
                <Carnival />
              </Suspense>
            } />
            <Route path="/carnival-gallery" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
                <CarnivalGallery />
              </Suspense>
            } />
            <Route path="/carnival/:eventId" element={
              <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5eedc' }} />}>
                <EventDetails />
              </Suspense>
            } />
            <Route path="/verifier" element={<VoucherVerifier />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
