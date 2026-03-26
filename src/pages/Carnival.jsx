import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Ticket, Globe, Zap } from 'lucide-react';
import TicketModal from '../components/TicketModal';
import CarnivalQuiz from '../components/CarnivalQuiz';
import './Carnival.css';
import CarnivalHero from '../components/CarnivalHero';
import Footer from './Footer';
import { scheduleData as externalScheduleData } from '../data/carnivalData';

// --- Official Tabular Itinerary Component ---
const CarnivalItineraryTable = ({ navigate, onTicketOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEventClick = (id) => {
    if (id === 1) {
      window.open('https://ieee-itss-sbnu.vercel.app/', '_blank');
      return;
    }
    if (id && id < 100) navigate(`/carnival/${id}`, { state: { fromTab: 'itinerary' } });
  };

  const headerClass = "border-2 border-[#1a1a1a] p-2 md:p-3 font-black uppercase tracking-wider text-[#1a1a1a] text-sm md:text-base";
  const cellClass = "border-2 border-[#1a1a1a] p-1.5 md:p-2.5 text-[#1a1a1a] font-bold text-[10px] md:text-sm leading-tight";
  const hoverClass = "cursor-pointer hover:bg-gray-50 transition-colors relative group";

  const bgColorMap = {
    101: 'bg-[#BAE1FF]',
    201: 'bg-white',
    1: 'bg-[#E0F2FE]',
    2: 'bg-[#FDF2F8]',
    5: 'bg-[#FEF9C3]',
    6: 'bg-[#D1FAE5]',
    7: 'bg-[#E0F2FE]',
    14: 'bg-[#FBCFE8]',
    8: 'bg-[#E9D5FF]',
    13: 'bg-[#FEF9C3]',
    10: 'bg-[#BAE1FF]',
    11: 'bg-[#E0F2FE]',
    12: 'bg-[#FDF2F8]',
    102: 'bg-[#E9D5FF]',
  };

  if (isMobile) {
    return (
      <div className="relative w-full rounded-[1.5rem] border-[3px] border-[#1a1a1a] p-4 md:p-6 shadow-[8px_8px_0px_#1a1a1a] bg-[#f0f9ff] overflow-hidden">
        
        {/* Pastel Dotted Background */}
        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#1a1a1a 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 space-y-8 px-1 sm:px-2 max-w-[500px] mx-auto">
          {[3, 4, 5].map((day) => (
            <div key={day} className="space-y-4">
              <div className="bg-black text-[#FFD700] p-2.5 rounded-xl border-2 border-black text-center font-black uppercase text-sm tracking-[0.2em] shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                April {day}th • Day {day - 2}
              </div>
              <div className="space-y-3">
                {externalScheduleData[day].events.map((evt, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => evt.id < 100 ? handleEventClick(evt.id) : null}
                    className={`${bgColorMap[evt.id] || 'bg-white'} border-[3px] border-black p-4 rounded-xl shadow-[6px_6px_0px_black] ${evt.id < 100 ? 'active:scale-95 active:shadow-[2px_2px_0px_black] transition-all cursor-pointer' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-xs font-black bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded inline-block border-[2px] border-black uppercase tracking-widest">{evt.time}</span>
                    </div>
                    <h5 className="font-black text-sm uppercase leading-tight">{evt.title}</h5>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[1.5rem] border-[3px] border-[#1a1a1a] bg-white p-4">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-100">
            <th colSpan="4" className={headerClass}>OFFICIAL PROGRAM GUIDE • APRIL 2026</th>
          </tr>
        </thead>
        <tbody>
          {/* Day 1 Section */}
          <tr className="bg-blue-50/50"><td colSpan="4" className={`${cellClass} font-black py-2`}>DAY 1</td></tr>
          <tr>
            <td className={`${cellClass} w-32`}>3:00 - 3:30</td>
            <td colSpan="3" className={`${cellClass} bg-[#BAE1FF] uppercase`}>INNAUGRATION</td>
          </tr>
          <tr>
            <td className={cellClass}>4:30 - 6:30</td>
            <td className={`${cellClass} text-xs font-bold leading-tight px-1 py-1`}>Technical Setups for Participants,<br/>Pre Screening for Competitions<br/>and Introductory Briefings</td>
            <td className={`${cellClass} ${hoverClass} bg-[#E0F2FE]`} onClick={() => handleEventClick(1)}>Next gen ITSS</td>
            <td className={`${cellClass} ${hoverClass} bg-[#FDF2F8]`} onClick={() => handleEventClick(2)}>Lumisense</td>
          </tr>

          {/* Day 2 Section */}
          <tr className="bg-yellow-50/50"><td colSpan="4" className={`${cellClass} font-black py-2`}>DAY 2</td></tr>
          <tr>
            <td className={cellClass}>9:30 - 10:30</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#FEF9C3]`} onClick={() => handleEventClick(5)}>FPGA FORGE</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#D1FAE5]`} onClick={() => handleEventClick(6)}>Forged in Wire</td>
            <td className={`${cellClass} ${hoverClass} bg-[#E0F2FE]`} onClick={() => handleEventClick(7)}>Swarm Agentic AI</td>
          </tr>
          <tr>
            <td className={cellClass}>10:30 - 11:30</td>
            <td rowSpan="2" className={`${cellClass} ${hoverClass} bg-[#FBCFE8]`} onClick={() => handleEventClick(14)}>Ideathon</td>
          </tr>
          <tr><td className={cellClass}>11:30 - 12:30</td></tr>
          <tr>
            <td className={cellClass}>12:30 - 1:30</td>
            <td colSpan="3" className={`${cellClass} bg-gray-50 uppercase tracking-[0.3em]`}>LUNCH</td>
          </tr>
          <tr>
            <td className={cellClass}>1:30 - 2:30</td>
            <td rowSpan="2" className={`${cellClass} ${hoverClass} bg-[#E9D5FF]`} onClick={() => handleEventClick(8)}>Lambda Genie</td>
            <td rowSpan="2" className={`${cellClass} ${hoverClass} bg-[#D1FAE5]`} onClick={() => handleEventClick(6)}>Forged in Wire</td>
            <td rowSpan="2" className={`${cellClass} ${hoverClass} bg-[#FEF9C3]`} onClick={() => handleEventClick(13)}>Prompt Verse</td>
          </tr>
          <tr><td className={cellClass}>2:30 - 3:30</td></tr>

          {/* Day 3 Section */}
          <tr className="bg-emerald-50/50"><td colSpan="4" className={`${cellClass} font-black py-2`}>DAY 3</td></tr>
          <tr>
            <td className={cellClass}>9:30 - 10:30</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#FEF9C3]`} onClick={() => handleEventClick(5)}>FPGA FORGE</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#BAE1FF]`} onClick={() => handleEventClick(10)}>ROBOSUMO</td>
            <td rowSpan="3" className={`${cellClass} opacity-10 bg-gray-50`}></td>
          </tr>
          <tr><td className={cellClass}>10:30 - 11:30</td></tr>
          <tr><td className={cellClass}>11:30 - 12:30</td></tr>
          <tr>
            <td className={cellClass}>12:30 - 1:30</td>
            <td colSpan="3" className={cellClass}></td>
          </tr>
          <tr>
            <td className={cellClass}>1:30 - 2:30</td>
            <td colSpan="3" className={`${cellClass} bg-gray-50 uppercase tracking-[0.3em]`}>LUNCH</td>
          </tr>
          <tr>
            <td className={cellClass}>2:30 - 3:30</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#E0F2FE]`} onClick={() => handleEventClick(11)}>Hire Your Research Agent</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#BAE1FF]`} onClick={() => handleEventClick(10)}>ROBOSUM</td>
            <td rowSpan="3" className={`${cellClass} ${hoverClass} bg-[#FDF2F8]`} onClick={() => handleEventClick(12)}>Bot Talks</td>
          </tr>
          <tr><td className={cellClass}>3:30 - 4:30</td></tr>
          <tr><td className={cellClass}>4:30 - 5:30</td></tr>
          <tr>
            <td className={cellClass}>5:30 - 6:30</td>
            <td colSpan="3" className={`${cellClass} bg-[#BAE1FF] uppercase tracking-widest`}>Prize Distribution & Closing Ceremony</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Carnival = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'itinerary');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: 'IEEE CARNIVAL', hash: 42, img: '' });
  const navigate = useNavigate();

  const handleOpenGame = () => {
    setIsPortalOpen(true);
    setTimeout(() => {
      setIsQuizOpen(true);
      setTimeout(() => setIsPortalOpen(false), 500);
    }, 800);
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync state with URL for persistence on back button
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const handleOpenTicket = (e, title, id, img) => {
    e.stopPropagation();
    setModalData({ title, hash: id || 42, img });
    setIsTicketModalOpen(true);
  };

  const scheduleData = externalScheduleData;

  // Derive posters for highlights - DEDUPLICATED BY ID
  const rawPosters = [
    ...(scheduleData[3]?.events.filter(e => e.id < 100).map(e => ({ ...e, day: 3 })) || []),
    ...(scheduleData[4]?.events.filter(e => e.id < 100).map(e => ({ ...e, day: 4 })) || []),
    ...(scheduleData[5]?.events.filter(e => e.id < 100).map(e => ({ ...e, day: 5 })) || [])
  ];
  const allPosters = Array.from(new Map(rawPosters.map(item => [item.id, item])).values());

  const handleEventCardClick = (id) => {
    if (id === 1) {
      window.open('https://ieee-itss-sbnu.vercel.app/', '_blank');
      return;
    }
    if (id && id < 100) navigate(`/carnival/${id}`, { state: { fromTab: activeTab } });
  };

  const activeDayEvents = activeTab !== 'itinerary' ? scheduleData[activeTab]?.events || [] : [];

  // SMART SCROLL: Ensure back button brings user back to the content, not the hero
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const element = document.getElementById('carnival-guide');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [searchParams]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="carnival-page min-h-screen text-[#1a1a1a] relative overflow-x-hidden"
      style={{
        backgroundColor: '#f0f9ff',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(147, 197, 253, 0.25) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(254, 249, 195, 0.35) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(167, 243, 208, 0.25) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(191, 219, 254, 0.3) 0px, transparent 50%),
          linear-gradient(rgba(147, 197, 253, 0.1) 2px, transparent 2px),
          linear-gradient(90deg, rgba(147, 197, 253, 0.1) 2px, transparent 2px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px'
      }}
    >
      <CarnivalHero />

      {/* ─── MARQUEE ─── */}
      <div className="marquee-container bg-black py-2 overflow-hidden relative z-20 border-y-[3px] border-black mt-0">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {[...Array(12)].map((_, i) => (
            <span key={i} className="text-white text-base md:text-2xl font-black uppercase italic tracking-tighter mx-4">
               ★ IEEE CARNIVAL 2026 ★ APRIL 3-5 ★ AHMEDABAD ★ GOING LIVE
            </span>
          ))}
        </motion.div>
      </div>

      <main id="carnival-guide" className="max-w-6xl mx-auto px-4 py-8 md:py-16 space-y-32 scroll-mt-24">
        
        {/* ─── PREMIUM CARNIVAL GAME BOOTH (TENT STYLE) ─── */}
        <section className="relative w-full flex justify-center py-10">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative w-full max-w-5xl group"
           >
              {/* Booth Tent Frame Decorations */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                 <div className="w-10 h-20 bg-[#FF00F5] border-[4px] border-black rounded-full shadow-[6px_6px_0px_black] rotate-[-15deg] hidden md:block" />
                 <div className="bg-[#FF00F5] border-[4px] border-black px-10 py-4 rounded-[2rem] shadow-[8px_8px_0px_black] flex flex-col items-center">
                    <span className="text-white font-['Bungee_Inline'] text-xs md:text-sm uppercase tracking-[0.2em] leading-none">GAME BOOTH</span>
                    <span className="text-[#FEF9C3] font-black text-[10px] uppercase tracking-widest mt-1">OPEN NOW</span>
                 </div>
                 <div className="w-10 h-20 bg-[#FF00F5] border-[4px] border-black rounded-full shadow-[6px_6px_0px_black] rotate-[15deg] hidden md:block" />
              </div>
              
              <div className="bg-white border-[5px] border-black rounded-[3rem] p-8 md:p-14 shadow-[20px_20px_0px_black] relative z-10 flex flex-col lg:flex-row items-center gap-10 md:gap-16 overflow-hidden">
                 {/* Internal Decorative Stripes */}
                 <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '60px 60px' }}></div>
                 
                 <div className="relative z-10 flex-1 text-center lg:text-left space-y-4">
                    <h2 className="font-['Rye'] text-[#1a1a1a] text-4xl md:text-7xl leading-none tracking-tight">TECH RUSH QUIZ</h2>
                    <p className="text-[#1a1a1a] font-['Space_Grotesk'] font-black text-sm md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-black to-[#D656F6] uppercase tracking-widest">
                       Win the IEEE Master Voucher!
                    </p>
                    <div className="h-2 w-32 bg-black rounded-full mx-auto lg:mx-0" />
                    <p className="text-[#1a1a1a] font-bold text-xs md:text-sm opacity-60 uppercase tracking-widest leading-relaxed max-w-lg">
                       Demonstrate your tech excellence! Score 6/8 to unlock the master voucher for all IEEE Carnival 2026 events.
                    </p>
                 </div>

                 <motion.button 
                   onClick={handleOpenGame}
                   whileHover={{ scale: 1.08, rotate: -3 }}
                   whileTap={{ scale: 0.95 }}
                   className="relative group shrink-0"
                 >
                    <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform"></div>
                    <div className="relative bg-[#FEF9C3] border-[4px] border-black px-12 py-8 rounded-[2rem] flex items-center gap-6">
                       <div className="bg-black text-[#FEF9C3] p-4 rounded-full border-2 border-[#FEF9C3] animate-pulse">
                          <Zap size={36} fill="currentColor" />
                       </div>
                       <div className="text-left">
                          <div className="text-xs font-black uppercase opacity-50 mb-[-2px]">TEST YOUR MIND</div>
                          <span className="font-['Rye'] text-2xl md:text-5xl text-black">PLAY NOW</span>
                       </div>
                    </div>
                 </motion.button>
              </div>
           </motion.div>
        </section>

        {/* --- PILL NAVIGATION (Persistent) --- */}
        <section className="tabs-navigation sticky top-4 z-[100] flex justify-center mt-32">
          <div className="bg-white/95 backdrop-blur-md border-[3px] border-black p-1.5 rounded-[2rem] shadow-[8px_8px_0px_#1a1a1a] flex gap-1">
            {['itinerary', '3', '4', '5'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative px-6 md:px-10 py-2.5 md:py-4 rounded-[1.5rem] font-black text-[10px] md:text-sm uppercase transition-all whitespace-nowrap ${
                  activeTab === tab ? 'text-white' : 'text-black hover:bg-gray-50'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="pill-bg-v5"
                    className="absolute inset-0 bg-black rounded-[1.5rem]"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'itinerary' ? 'Overview' : `Day ${parseInt(tab) - 2}`}
                </span>
              </button>
            ))}
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full"
          >
            {activeTab === 'itinerary' ? (
               <div className="space-y-12">
                 <div className="bg-white border-[3px] border-black p-6 rounded-2xl shadow-[6px_6px_0px_black] text-center max-w-2xl mx-auto">
                    <h2 className="text-xl md:text-3xl font-black uppercase mb-4 tracking-tighter italic underline decoration-[#D656F6] decoration-4 underline-offset-4">Event Program Guide</h2>
                    <p className="text-xs md:text-sm font-bold opacity-70 uppercase leading-relaxed">
                       View the complete schedule below. Click any session to get more details and generate your delegate post.
                    </p>
                 </div>
                 <CarnivalItineraryTable navigate={navigate} onTicketOpen={handleOpenTicket} />
               </div>
            ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-center bg-black text-white p-4 md:p-6 rounded-2xl shadow-[8px_8px_0px_black]">
                     <h2 className="text-3xl md:text-6xl font-black italic uppercase leading-none tracking-tighter">April {activeTab}th</h2>
                     <div className="bg-[#FFD700] text-black px-4 py-1.5 rounded-full font-black text-[10px] md:text-xs">
                        DAY {parseInt(activeTab) - 2} LIVE TIMELINE
                     </div>
                  </div>

                  {/* FULL-SIZE CLICKABLE CARDS (No icons as requested) */}
                  <div className="grid grid-cols-1 gap-6">
                    {activeDayEvents.map((evt, idx) => (
                      <motion.div 
                        key={`${evt.id}-${idx}`}
                        whileHover={evt.id < 100 ? { y: -6, x: -6, shadow: "16px 16px 0px black" } : {}}
                        whileActive={evt.id < 100 ? { y: 2, x: 2, shadow: "0px 0px 0px black" } : {}}
                        onClick={() => handleEventCardClick(evt.id)}
                        className={`group flex flex-col md:flex-row gap-4 md:items-center bg-white border-[4px] border-black p-6 md:p-10 rounded-2xl shadow-[10px_10px_0px_black] transition-all relative overflow-hidden z-10 ${evt.id < 100 ? 'cursor-pointer' : 'cursor-default opacity-80 border-gray-100'}`}
                      >
                         <div className={`bg-black text-white px-8 py-4 rounded-xl text-xl font-black min-w-[180px] text-center border-2 border-black ${evt.id < 100 ? 'group-hover:bg-[#FFD700] group-hover:text-black' : ''} transition-colors`}>
                            {evt.time}
                         </div>
                         <div className="flex-1 space-y-1">
                            <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight tracking-tight">{evt.title}</h3>
                            <p className="text-[10px] md:text-xs font-black opacity-30 uppercase tracking-[0.4em] leading-none flex items-center gap-2">
                               {evt.location} <span className="w-1 h-1 bg-black rounded-full opacity-20"></span> {evt.type || 'SESSION'}
                            </p>
                            <p className="text-sm font-bold opacity-70 uppercase leading-snug pt-1 max-w-2xl">{evt.description.slice(0, 100)}...</p>
                         </div>
                         {evt.id < 100 && (
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                              <ArrowRight size={32} strokeWidth={4} />
                           </div>
                         )}
                      </motion.div>
                    ))}
                  </div>
                </div>
            )}
          </motion.div>
        </AnimatePresence>

        <section className="posters-section pt-10">
           <div className={`grid ${activeTab === 'itinerary' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-2'} gap-8 md:gap-12`}>
              {allPosters
                .filter(p => activeTab === 'itinerary' || p.day.toString() === activeTab)
                .map((poster, idx) => (
                <div 
                  key={`${poster.id}-${idx}`}
                  onClick={() => {
                    if (poster.id === 1) window.open('https://ieee-itss-sbnu.vercel.app/', '_blank');
                    else navigate(`/carnival/${poster.id}`);
                  }}
                  className="poster-card relative group aspect-[3/4.2] overflow-hidden rounded-[2.5rem] border-[4px] border-black shadow-[12px_12px_0px_black] cursor-pointer"
                >
                   <img src={poster.img} alt={poster.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                      <h3 className="text-white text-2xl md:text-4xl font-black uppercase leading-none tracking-tighter mb-2">{poster.title}</h3>
                      <div className="flex items-center gap-2 text-[#FFD700] font-black text-[10px] uppercase tracking-widest">
                         APRIL {poster.day}th <span className="w-4 h-[2px] bg-white opacity-20"></span> {poster.time}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

      </main>

      <Footer />

      <TicketModal 
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        eventTitle={modalData.title}
        dayEventsHash={modalData.hash}
        posterImg={modalData.img}
      />

      {/* ─── PORTAL WARP TRANSITION ─── */}
      <AnimatePresence>
        {isPortalOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 150, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8, ease: "anticipate" }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#00FFFF',
              zIndex: 99998,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              boxShadow: '0 0 100px #00FFFF, 0 0 200px #FF00FF'
            }}
          />
        )}
      </AnimatePresence>

      <CarnivalQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </motion.div>
  );
};

export default Carnival;
