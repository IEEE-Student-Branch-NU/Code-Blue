import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carnival.css';
import CarnivalHero from '../components/CarnivalHero';
import Footer from './Footer';

const Carnival = () => {
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();

  // Day-wise timeline data
  const scheduleData = {
    27: {
      label: '27th',
      color: 'blue',
      dayTitle: 'Day 1',
      timeline: [
        { time: '3:00 - 3:30', events: [{ name: 'Inauguration', type: 'highlight' }] },
        { time: '4:30 - 6:30', events: [
          { name: 'Technical Setups, Pre Screening & Introductory Briefings' },
          { name: 'Next Gen ITSS' },
          { name: 'Lumisense' }
        ]}
      ]
    },
    28: {
      label: '28th',
      color: 'green',
      dayTitle: 'Day 2',
      timeline: [
        { time: '9:30 - 10:30', events: [
          { name: 'FPGA Forge' },
          { name: 'Forged in Wire' },
          { name: 'AgentVerse' }
        ]},
        { time: '10:30 - 11:30', events: [
          { name: 'FPGA Forge' },
          { name: 'Forged in Wire' },
          { name: 'AgentVerse' }
        ]},
        { time: '11:30 - 12:30', events: [
          { name: 'FPGA Forge' },
          { name: 'Forged in Wire' },
          { name: 'AI Competition' }
        ]},
        { time: '12:30 - 1:30', events: [{ name: 'Lunch', type: 'break' }] },
        { time: '1:30 - 2:30', events: [
          { name: 'Lambda Genie' },
          { name: 'Forged in Wire' },
          { name: 'Prompt Verse' }
        ]},
        { time: '2:30 - 3:30', events: [
          { name: 'Lambda Genie' },
          { name: 'Forged in Wire' },
          { name: 'Prompt Verse' }
        ]}
      ]
    },
    29: {
      label: '29th',
      color: 'yellow',
      dayTitle: 'Day 3',
      timeline: [
        { time: '9:30 - 10:30', events: [
          { name: 'FPGA Forge' },
          { name: 'Robosumo' },
          { name: '' }
        ]},
        { time: '10:30 - 11:30', events: [
          { name: 'FPGA Forge' },
          { name: 'Robosumo' },
          { name: '' }
        ]},
        { time: '11:30 - 12:30', events: [
          { name: 'FPGA Forge' },
          { name: 'Robosumo' },
          { name: '' }
        ]},
        { time: '12:30 - 1:30', events: [
          { name: '' },
          { name: '' },
          { name: '' }
        ]},
        { time: '1:30 - 2:30', events: [{ name: 'Lunch', type: 'break' }] },
        { time: '2:30 - 3:30', events: [
          { name: 'Hire Your Research Agent' },
          { name: 'Robosumo' },
          { name: 'Bot Talks' }
        ]},
        { time: '3:30 - 4:30', events: [
          { name: 'Hire Your Research Agent' },
          { name: 'Robosumo' },
          { name: 'Bot Talks' }
        ]},
        { time: '4:30 - 5:30', events: [
          { name: 'Hire Your Research Agent' },
          { name: 'Robosumo' },
          { name: 'Bot Talks' }
        ]},
        { time: '5:30 - 6:30', events: [{ name: 'Prize Distribution & Closing Ceremony', type: 'highlight' }] }
      ]
    },
  };

  const activeDay = scheduleData[activeTab];

  // Color palette for event cards per tab
  const eventColors = {
    27: ['#93c5fd', '#bfdbfe', '#dbeafe'],
    28: ['#bbf7d0', '#a7f3d0', '#d1fae5'],
    29: ['#fde68a', '#fef08a', '#fef9c3'],
  };

  // Global list of all events with registration links
  const allPosters = [
    { id: 1, img: '/Carnival/ITSS.webp', title: 'ITSS', link: '#' },
    { id: 2, img: '/Carnival/LUMISENSE.webp', title: 'Lumisense', link: '#' },
    { id: 5, img: '/Carnival/FGPA WS.webp', title: 'FGPA WS', link: '#' },
    { id: 6, img: '/Carnival/DECODE THE CIRCUIT_FORGED IN WIRES.webp', title: 'Decode the Circuit', link: '#' },
    { id: 7, img: '/Carnival/AGENTVERSE.webp', title: 'Agentverse', link: '#' },
    { id: 8, img: '/Carnival/LAMBDA-GENIE.webp', title: 'Lambda Genie', link: '#' },
    { id: 10, img: '/Carnival/ROBOWARS.webp', title: 'Robowars', link: '#' },
    { id: 11, img: '/Carnival/HIRE_YR_RESEARCH_AGENT.webp', title: 'Hire Your Research Agent', link: '#' },
    { id: 12, img: '/Carnival/BOT-TALKS.webp', title: 'Bot Talks', link: '#' },
    { id: 13, img: '/Carnival/2.webp', title: 'Poster 5', link: '#' }
  ];

  return (
    <div className="carnival-page min-h-screen text-[#1a1a1a] font-sans">
      
      {/* 1. Hero Section (Top) */}
      <CarnivalHero />

      {/* Main Content Container */}
      <main className="carnival-main-content w-full max-w-[1400px] mx-auto px-4 md:px-12 py-6 md:py-12 flex flex-col gap-8 md:gap-12 relative z-10">
        
        {/* 2. Information Section */}
        <section className="info-section neo-panel">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black mb-6 tracking-[0.1em] md:tracking-widest text-white uppercase bg-[#ff6b6b] border-2 md:border-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] inline-block px-4 md:px-6 py-2 rotate-[-1deg] mx-auto flex w-fit">
            The Extraordinary Awaits
          </h2>
          <p className="text-center text-lg md:text-xl text-gray-800 font-bold leading-relaxed max-w-4xl mx-auto mt-4">
            Welcome to the IEEE Carnival. Experience a dazzling fusion of technology, innovation, and entertainment. 
            Join us for three unforgettable days featuring exclusive technical workshops, 
            immersive networking events, and spectacular nighttime celebrations. 
            Step right up, the future is now.
          </p>
        </section>

        {/* 3. Schedule Section */}
        <section className="schedule-section neo-panel">
          <div className="text-center mb-6 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#1a1a1a] border-b-2 md:border-b-4 border-[#1a1a1a] inline-block pb-1 md:pb-2">
              Schedule
            </h3>
          </div>
          
          {/* Day Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-8 mb-8 md:mb-12">
            {[27, 28, 29].map((day) => (
              <button
                key={day}
                onClick={() => setActiveTab(activeTab === day ? null : day)}
                className={`schedule-tab font-black text-lg md:text-2xl px-6 py-2 md:px-10 md:py-3 ${activeTab === day ? `active-${scheduleData[day].color}` : 'inactive-tab'}`}
              >
                {scheduleData[day].label}
              </button>
            ))}
          </div>

          {activeTab && (
          <>
          {/* Day Title */}
          <div className="text-center mb-8">
            <span className={`inline-block text-xl md:text-2xl font-black uppercase tracking-widest px-6 py-2 border-3 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] rounded-xl`}
              style={{ background: eventColors[activeTab][0] }}
            >
              {activeDay.dayTitle} &bull; {activeDay.label} March
            </span>
          </div>

          {/* Timeline */}
          <div className="timeline-container w-full max-w-4xl mx-auto">
            {activeDay.timeline.map((slot, slotIdx) => (
              <div key={slotIdx} className="timeline-item">
                {/* Dot & Line */}
                <div className="timeline-track">
                  <div className="timeline-dot" style={{ background: eventColors[activeTab][0], borderColor: '#1a1a1a' }}></div>
                  {slotIdx < activeDay.timeline.length - 1 && <div className="timeline-line"></div>}
                </div>

                {/* Content */}
                <div className="timeline-content">
                  {/* Time Label */}
                  <div className="timeline-time font-black text-sm md:text-base uppercase tracking-wider text-gray-600 mb-2">
                    {slot.time}
                  </div>

                  {/* Event Cards */}
                  {slot.events.length === 1 && (slot.events[0].type === 'highlight' || slot.events[0].type === 'break') ? (
                    <div
                      className={`timeline-event-card timeline-event-full font-black text-base md:text-xl uppercase tracking-wider text-center ${slot.events[0].type === 'break' ? 'timeline-break' : 'timeline-highlight'}`}
                      style={slot.events[0].type === 'highlight' ? { background: eventColors[activeTab][0] } : {}}
                    >
                      {slot.events[0].name}
                    </div>
                  ) : (
                    <div className="timeline-events-row">
                      {slot.events.map((evt, evtIdx) => (
                        <div
                          key={evtIdx}
                          className={`timeline-event-card ${evt.name ? '' : 'timeline-event-empty'}`}
                          style={evt.name ? { background: eventColors[activeTab][evtIdx % 3] } : {}}
                        >
                          {evt.name && (
                            <span className="font-bold text-sm md:text-base text-[#1a1a1a]">{evt.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </section>

        {/* 4. Global Posters Section */}
        <section className="posters-section neo-panel">
          <div className="text-center mb-6 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[#1a1a1a] border-b-2 md:border-b-4 border-[#1a1a1a] inline-block pb-1 md:pb-2">
              Featured Events
            </h3>
          </div>
          
          <div className="posters-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full mx-auto">
            {allPosters.map((poster) => (
              <div 
                key={poster.id} 
                onClick={() => navigate(`/carnival/${poster.id}`)}
                className="poster-card relative group aspect-[1132/1600] overflow-hidden flex flex-col items-center justify-center cursor-pointer"
              >
                {poster.img ? (
                  <img 
                    src={poster.img} 
                    alt={poster.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  /* Foreground textual content */
                  <div className="text-center z-10 p-4 md:p-6">
                    <h4 className="text-2xl md:text-4xl font-black text-[#1a1a1a] mb-2 tracking-wide uppercase">
                      {poster.title}
                    </h4>
                    <p className="text-gray-800 font-bold tracking-wider md:tracking-widest uppercase text-sm md:text-lg bg-white border-2 border-black inline-block px-2 py-1 md:px-3 shadow-[2px_2px_0px_#1a1a1a] transform -rotate-2">
                      Coming Soon
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 5. Footer (Bottom) */}
      <Footer />
    </div>
  );
};

export default Carnival;
