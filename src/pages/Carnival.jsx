import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useScroll, useTransform, useVelocity } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Carnival.css';
import CarnivalHero from '../components/CarnivalHero';
import Footer from './Footer';
import { scheduleData as externalScheduleData, getEventById } from '../data/carnivalData';

// --- Tabular Itinerary ---
const CarnivalItineraryTable = ({ navigate }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEventClick = (id) => {
    if (id && id < 100) navigate(`/carnival/${id}`);
  };

  const cClass = "cursor-pointer hover:brightness-105 hover:scale-[1.02] active:scale-95 transition-all outline outline-0 hover:outline-4 hover:outline-black relative z-0 hover:z-10 shadow-none hover:shadow-[4px_4px_0px_#1a1a1a] shadow-inner";
  const headerClass = "border-[3px] border-[#1a1a1a] p-3 md:p-4 font-black uppercase tracking-wider text-[#1a1a1a]";
  const cellClass = "border-[3px] border-[#1a1a1a] p-2 md:p-3 text-[#1a1a1a] font-bold text-xs md:text-sm";

  if (isMobile) {
    return (
      <div className="space-y-16 px-2">
        {[27, 28, 29].map((day) => {
          const dayEvents = Array.from(new Map(externalScheduleData[day].events.map(item => [item.title, item])).values());
          const dayColor = day === 27 ? '#0ea5e9' : day === 28 ? '#eab308' : '#22c55e';
          
          return (
            <div key={day} className="space-y-8">
              <div className="relative flex flex-col items-center">
                 <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: dayColor }}></div>
                 <div className="relative px-8 py-3 rounded-full border-2 border-black/10 bg-white/40 backdrop-blur-md shadow-xl">
                    <span className="font-black uppercase tracking-[0.3em] text-sm" style={{ color: dayColor }}>
                      Day {day - 26} • {day}th March
                    </span>
                 </div>
              </div>

              <div className="space-y-5">
                {dayEvents.map((evt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => evt.id < 100 ? handleEventClick(evt.id) : null}
                    className={`group relative p-6 rounded-[2rem] border-2 border-black/5 bg-white/60 backdrop-blur-lg shadow-sm flex justify-between items-center transition-all duration-300 ${evt.id < 100 ? 'cursor-pointer active:scale-[0.98] active:bg-white/80' : ''}`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dayColor }}></span>
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{evt.time}</span>
                      </div>
                      <span className="font-black text-xl text-[#1a1a1a] uppercase leading-none tracking-tight">{evt.title}</span>
                    </div>
                    {evt.id < 100 && (
                      <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-lg shadow-black/10">
                        <ArrowRight size={24} strokeWidth={3} />
                      </div>
                    )}
                    {evt.id < 100 && <div className="absolute inset-0 rounded-[2rem] bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
      <div className="p-2 md:p-8 overflow-x-auto w-full rounded-xl md:rounded-[2rem] bg-white border-[3px] md:border-[4px] border-[#1a1a1a] shadow-[6px_6px_0px_#1a1a1a] md:shadow-[12px_12px_0px_#1a1a1a]">
        <table className="w-full min-w-[600px] border-collapse text-center text-xs md:text-base bg-white">
          <tbody>
            {/* Day 1 */}
            <tr className="bg-[#BAE1FF]">
              <td colSpan="4" className={`${headerClass} text-xl bg-[#BAE1FF]`}>Day 1 (27th) - The Beginning</td>
            </tr>
            <tr>
              <td className={`${cellClass} w-1/4 bg-[#f0fbff]`}>3:00 - 3:30</td>
              <td colSpan="3" className={`${cellClass} uppercase tracking-widest bg-[#BAE1FF]`}>Inauguration</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#f0fbff]`}>4:30 - 6:30</td>
              <td className={`${cellClass} bg-[#E0F2FE]`}>Setup & Briefings</td>
              <td className={`${cellClass} bg-[#BAE1FF] ${cClass}`} onClick={() => handleEventClick(1)}>Next gen ITSS</td>
              <td className={`${cellClass} bg-[#D1FAE5] ${cClass}`} onClick={() => handleEventClick(2)}>Lumisense</td>
            </tr>
            <tr className="h-6"><td colSpan="4" className="border-none"></td></tr>

            {/* Day 2 */}
            <tr className="bg-[#FEF9C3]">
              <td colSpan="4" className={`${headerClass} text-xl bg-[#FEF9C3]`}>Day 2 (28th) - The Core</td>
            </tr>
             <tr>
              <td className={`${cellClass} bg-[#FFFDF2]`}>9:30 - 10:30</td>
              <td rowSpan="3" className={`${cellClass} bg-[#FEF9C3] ${cClass}`} onClick={() => handleEventClick(5)}>FPGA FORGE</td>
              <td rowSpan="2" className={`${cellClass} bg-[#BAE1FF] ${cClass}`} onClick={() => handleEventClick(6)}>Forged in Wire</td>
              <td className={`${cellClass} bg-[#E9D5FF] ${cClass}`} onClick={() => handleEventClick(7)}>AgentVerse</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#FFFDF2]`}>10:30 - 11:30</td>
              <td rowSpan="2" className={`${cellClass} bg-[#D1FAE5] ${cClass}`} onClick={() => handleEventClick(14)}>Ai Competition</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#FFFDF2]`}>11:30 - 12:30</td>
              <td className={`${cellClass} bg-gray-50 uppercase text-[10px] opacity-30`}>Parallel Session</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#FFFDF2]`}>12:30 - 1:30</td>
              <td colSpan="3" className={`${cellClass} uppercase tracking-widest bg-gray-100`}>Lunch Break</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#FFFDF2]`}>1:30 - 2:30</td>
              <td rowSpan="2" className={`${cellClass} bg-[#E9D5FF] ${cClass}`} onClick={() => handleEventClick(8)}>Lambda Genie</td>
              <td rowSpan="2" className={`${cellClass} bg-[#BAE1FF] ${cClass}`} onClick={() => handleEventClick(6)}>Forged in Wire</td>
              <td rowSpan="2" className={`${cellClass} bg-[#FEF9C3] ${cClass}`} onClick={() => handleEventClick(13)}>Prompt Verse</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#FFFDF2]`}>2:30 - 3:30</td>
            </tr>
            <tr className="h-6"><td colSpan="4" className="border-none"></td></tr>

            {/* Day 3 */}
            <tr className="bg-[#D1FAE5]">
              <td colSpan="4" className={`${headerClass} text-xl bg-[#D1FAE5]`}>Day 3 (29th) - The Finale</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#F0FDF4]`}>9:30 - 10:30</td>
              <td rowSpan="3" className={`${cellClass} bg-[#FEF9C3] ${cClass}`} onClick={() => handleEventClick(9)}>FPGA FORGE</td>
              <td rowSpan="4" className={`${cellClass} bg-[#BAE1FF] ${cClass}`} onClick={() => handleEventClick(10)}>ROBOSUMO</td>
              <td rowSpan="3" className={`${cellClass} bg-[#BAE1FF] uppercase text-[10px] opacity-30 text-center`}>Workshop Final</td>
            </tr>
            <tr><td className={`${cellClass} bg-[#F0FDF4]`}>10:30 - 11:30</td></tr>
            <tr><td className={`${cellClass} bg-[#F0FDF4]`}>11:30 - 12:30</td></tr>
             <tr>
              <td className={`${cellClass} bg-[#F0FDF4]`}>12:30 - 1:30</td>
              <td colSpan="2" className={`${cellClass} bg-gray-50 uppercase text-[10px] opacity-30 text-center`}>--</td>
            </tr>
             <tr>
              <td className={`${cellClass} bg-[#F0FDF4]`}>1:30 - 2:30</td>
              <td colSpan="3" className={`${cellClass} uppercase tracking-widest bg-gray-100`}>Lunch Break</td>
            </tr>
            <tr>
              <td className={`${cellClass} bg-[#F0FDF4]`}>2:30 - 3:30</td>
              <td rowSpan="3" className={`${cellClass} bg-[#BAE1FF] ${cClass}`} onClick={() => handleEventClick(11)}>Hire Your Agent</td>
              <td rowSpan="3" className={`${cellClass} bg-[#D1FAE5] ${cClass}`} onClick={() => handleEventClick(10)}>ROBOSUMO</td>
              <td className={`${cellClass} bg-[#E9D5FF] ${cClass}`} onClick={() => handleEventClick(12)}>Bot Talks</td>
            </tr>
             <tr>
              <td className={`${cellClass} bg-[#F0FDF4]`}>3:30 - 4:30</td>
              <td rowSpan="2" className={`${cellClass} bg-[#BAE1FF] uppercase text-[10px] opacity-30 text-center`}>Expo Walk</td>
            </tr>
             <tr><td className={`${cellClass} bg-[#F0FDF4]`}>4:30 - 5:30</td></tr>
             <tr>
              <td className={`${cellClass} bg-[#F0FDF4]`}>5:30 - 6:30</td>
              <td colSpan="3" className={`${cellClass} uppercase tracking-widest bg-[#BAE1FF]`}>Prize Distribution & Closing Ceremony</td>
             </tr>
          </tbody>
        </table>
      </div>
  );
};

const Carnival = () => {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = sessionStorage.getItem('carnival-active-tab');
    if (saved && saved !== 'itinerary') return parseInt(saved);
    return saved || 'itinerary';
  });
  const navigate = useNavigate();

  // Scroll Restoration Logic
  useEffect(() => {
    sessionStorage.setItem('carnival-active-tab', activeTab.toString());
    
    const savedPos = sessionStorage.getItem(`carnival-scroll-${activeTab}`);
    if (savedPos && parseInt(savedPos) > 0) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedPos), behavior: 'instant' });
      }, 100);
    }
    
    const handleScrollSave = () => {
      if (window.scrollY > 10) {
        sessionStorage.setItem(`carnival-scroll-${activeTab}`, window.scrollY.toString());
      }
    };
    window.addEventListener('scroll', handleScrollSave);
    return () => window.removeEventListener('scroll', handleScrollSave);
  }, [activeTab]);

  const scheduleData = externalScheduleData;

  // Pro Tech Pastel Carnival Palette
  const eventColors = {
    27: ['#BAE1FF', '#E0F2FE', '#F0F9FF'],
    28: ['#FEF9C3', '#FFFBEB', '#FFFDF2'],
    29: ['#D1FAE5', '#ECFDF5', '#F0FDF4'],
    'extra': ['#E9D5FF', '#F3E8FF', '#FAF5FF']
  };

  // Build posters from the ACTUAL data structure: scheduleData[day].events
  const rawPosters = [
    ...scheduleData[27].events.filter(e => e.id < 100).map(e => ({ ...e, day: 27, name: e.title })),
    ...scheduleData[28].events.filter(e => e.id < 100).map(e => ({ ...e, day: 28, name: e.title })),
    ...scheduleData[29].events.filter(e => e.id < 100).map(e => ({ ...e, day: 29, name: e.title }))
  ];
  
  // Deduplicate by name (title)
  const allPosters = Array.from(new Map(rawPosters.map(item => [item.name, item])).values());

  // Build day-wise event list for timeline view
  const getDayEvents = (dayNum) => {
    if (!scheduleData[dayNum]) return [];
    return scheduleData[dayNum].events || [];
  };

  const activeDayEvents = activeTab !== 'itinerary' ? getDayEvents(activeTab) : [];

  return (
    <div 
      className="carnival-page min-h-screen text-[#1a1a1a] font-sans relative overflow-x-hidden"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.08) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(132, 204, 22, 0.08) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(214, 86, 246, 0.08) 0px, transparent 50%),
          linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px'
      }}
    >
      <CarnivalHero />

      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24 space-y-24 md:space-y-32">
        
        {/* 1. Navigation Tabs */}
        <section className="tabs-navigation sticky top-4 z-[90] flex justify-center">
          <div className="bg-white/80 backdrop-blur-md border-[3px] border-black p-1.5 md:p-2 rounded-xl md:rounded-3xl shadow-[8px_8px_0px_#1a1a1a] flex gap-1.5 md:gap-4 overflow-x-auto no-scrollbar max-w-full">
            {['itinerary', 27, 28, 29].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-8 py-2 md:py-3 rounded-lg md:rounded-2xl font-black text-xs md:text-lg uppercase tracking-wider transition-all whitespace-nowrap border-2 border-transparent ${
                  activeTab === tab 
                  ? (tab === 'itinerary' ? 'bg-[#ff6b6b] text-white border-black scale-105' : 'active-blue border-black scale-105')
                  : 'hover:bg-gray-100'
                }`}
              >
                {tab === 'itinerary' ? 'Itinerary' : `Day ${tab - 26}`}
              </button>
            ))}
          </div>
        </section>

        <section className="info-section neo-panel p-4 md:p-8 bg-[#fdf2f8] border-[3px] md:border-4 border-black box-border shadow-[6px_6px_0px_#1a1a1a] md:shadow-[10px_10px_0px_#1a1a1a] rounded-xl">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black mb-6 tracking-widest text-white uppercase bg-[#ff6b6b] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] inline-block px-6 py-2 rotate-[-1deg] mx-auto flex w-fit">
            The Extraordinary Awaits
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-bold leading-relaxed text-[#1a1a1a] max-w-4xl mx-auto text-center">
            Brace yourselves for the IEEE Carnival! Three days of pure technical adrenaline, 
            creative chaos, and groundbreaking innovation. From high-stakes hackathons to 
            mind-bending robotic showdowns, this is where the brightest minds converge to 
            rewrite the future. Experience tech like never before.
          </p>
        </section>

        {/* 3. Schedule Section */}
        <section className="schedule-section neo-panel p-3 md:p-8 bg-[#f0fbff] border-[3px] md:border-4 border-black box-border shadow-[6px_6px_0px_#1a1a1a] md:shadow-[10px_10px_0px_#1a1a1a] rounded-xl">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-[#1a1a1a] border-b-4 border-[#1a1a1a] inline-block pb-2">
              {activeTab === 'itinerary' ? 'Program Guide' : `Day ${activeTab - 26} Timeline`}
            </h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {activeTab === 'itinerary' ? (
                <CarnivalItineraryTable navigate={navigate} />
              ) : (
                /* Day-wise: render each event as a card */
                <div className="space-y-6 md:space-y-8">
                  {activeDayEvents.map((evt, idx) => (
                    <div key={idx} className="timeline-slot flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                      <div className="time-badge md:w-48 shrink-0 bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-base md:text-xl shadow-[6px_6px_0px_#BAE1FF] rotate-[-2deg]">
                        {evt.time}
                      </div>

                      <div 
                        onClick={() => evt.id < 100 ? navigate(`/carnival/${evt.id}`) : null}
                        className={`flex-1 w-full rounded-2xl md:rounded-3xl border-[4px] border-[#1a1a1a] p-5 md:p-6 shadow-[6px_6px_0px_#1a1a1a] ${
                          evt.type === 'break' || evt.type === 'special' 
                            ? 'bg-gray-100' 
                            : `${evt.id < 100 ? 'cursor-pointer hover:brightness-105 hover:scale-[1.02] active:scale-95' : ''} transition-all`
                        }`}
                        style={evt.type === 'session' ? { background: eventColors[activeTab]?.[idx % 3] || '#f5f5f5' } : {}}
                      >
                        <div className="space-y-1">
                          <div className="text-xs md:text-sm font-black opacity-50 mb-1 uppercase tracking-widest">
                            {evt.type === 'session' ? '🔧 SESSION' : evt.type === 'special' ? '⭐ SPECIAL' : '☕ BREAK'}
                          </div>
                          <div className="font-black text-lg md:text-2xl leading-tight">{evt.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* 4. Global Posters Section */}
        <section className="posters-section neo-panel p-4 md:p-8 bg-[#fdfdf3] border-[3px] md:border-4 border-black box-border shadow-[6px_6px_0px_#1a1a1a] md:shadow-[10px_10px_0px_#1a1a1a] rounded-xl">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-[#1a1a1a] border-b-4 border-[#1a1a1a] inline-block pb-2">
              Featured Events
            </h3>
          </div>
          
          <div className={`posters-grid grid ${activeTab === 'itinerary' ? 'grid-cols-2 md:grid-cols-3 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10'} w-full mx-auto`}>
            {allPosters
              .filter(poster => {
                if (activeTab === 'itinerary') return true;
                return poster.day === activeTab;
              })
              .map(poster => (
                <div 
                  key={poster.id} 
                  onClick={() => navigate(`/carnival/${poster.id}`)}
                  className="poster-card relative group aspect-[1132/1600] overflow-hidden rounded-2xl md:rounded-3xl border-[4px] border-black shadow-[8px_8px_0px_#1a1a1a] hover:shadow-[12px_12px_0px_#1a1a1a] transition-all cursor-pointer bg-white w-full max-w-none"
                >
                  <img src={poster.img} alt={poster.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-6 py-2 rounded-xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_#1a1a1a]">{poster.time}</span>
                  </div>
                </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Carnival;
