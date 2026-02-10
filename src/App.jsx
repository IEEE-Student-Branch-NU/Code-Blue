import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import StaggeredMenu from './components/StaggeredMenu'
import CurvedLoop from './components/CurvedLoop'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'

const menuItems = [
  { label: "Home", link: "/" },
  { label: "About", link: "/about" },
  { label: "Contact", link: "/contact" },
  { label: "Gallery", link: "/gallery" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

const App = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', position: 'relative' }}>

      {/* StaggeredMenu Navigation */}
      <StaggeredMenu
        items={menuItems}
        socialItems={socialItems}
        colors={['#00629b', '#004d7a']}
        accentColor="#00629b"
        isFixed={true}
        position="right"
        displaySocials={true}
        displayItemNumbering={true}
        logoUrl=""
      />

      {/* Routes */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </div>
  )
}

export default App

