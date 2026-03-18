import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import StaggeredMenu from './components/StaggeredMenu'
import CarnivalTransition from './components/CarnivalTransition'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import BoardMembers from './pages/BoardMembers'
import JoinUs from './pages/JoinUs'
import { Analytics } from "@vercel/analytics/react"

const CodeBlue = React.lazy(() => import('./pages/CodeBlue'))
const Carnival = React.lazy(() => import('./pages/Carnival'))
const EventDetails = React.lazy(() => import('./pages/EventDetails'))

const menuItems = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Join Us", link: "/join-us" },
  { label: "Carnival", link: "/carnival", style: { color: '#9B59B6' } },
  { label: "Contact", link: "/contact" },
  { label: "Board Members", link: "/board-members" },
  { label: "Gallery", link: "/gallery" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/ieeenirma" },
  { label: "LinkedIn", link: "https://www.linkedin.com/company/ieee-student-branch-nirma-university" },
];

const App = () => {
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);


  // Intercept clicks on the Carnival menu link
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href="/carnival"]');
      if (anchor && location.pathname !== '/carnival') {
        e.preventDefault();
        e.stopPropagation();
        menuRef.current?.closeMenu();
        setShowTransition(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [location.pathname]);

  const handleTransitionComplete = useCallback(() => {
    setShowTransition(false);
    navigate('/carnival');
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', position: 'relative' }}>
      <Analytics />

      <AnimatePresence>
        {showTransition && (
          <CarnivalTransition 
            isPlaying={showTransition} 
            onComplete={handleTransitionComplete} 
          />
        )}
      </AnimatePresence>

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

      {/* Routes */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
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
          <Route path="/carnival/:eventId" element={
            <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f5eedc' }} />}>
              <EventDetails />
            </Suspense>
          } />

        </Routes>
      </div>
    </div>
  )
}

export default App


