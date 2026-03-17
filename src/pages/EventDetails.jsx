import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Undo2 } from 'lucide-react';

// Global events data with registration links
const allEvents = [
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

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Find the matching event
  const currentEvent = allEvents.find(e => e.id === parseInt(eventId));

  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5eedc] relative flex items-center justify-center p-6 md:p-12 font-sans text-[#1a1a1a] overflow-x-hidden">
      
      {/* Back Button Top Left */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 md:top-8 md:left-12 z-50 bg-[#e5e5e5] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] p-3 rounded-xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_#1a1a1a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
      >
        <Undo2 size={32} strokeWidth={3} className="text-[#1a1a1a]" />
      </button>

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 xl:gap-14 mt-16 md:mt-0">
        
        {/* Left Side: Poster (A4 size aspect ratio) */}
        <div className="w-full flex justify-center md:justify-end">
          <div className="w-full max-w-[450px] aspect-[1132/1600] bg-[#ffb3ba] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] rounded-3xl flex flex-col items-center justify-center overflow-hidden transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#1a1a1a]">
            {currentEvent && currentEvent.img ? (
              <img src={currentEvent.img} alt={currentEvent.title} className="w-full h-full object-cover" />
            ) : (
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-wide p-8 text-center">
                {currentEvent ? currentEvent.title : `Poster ${eventId}`}
              </h2>
            )}
          </div>
        </div>

        {/* Right Side: Details & Register Stack */}
        <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[500px] mx-auto md:mx-0">
          
          {/* Top Panel: Event Details (Green) */}
          <div className="flex-grow bg-[#bbf7d0] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] rounded-3xl p-8 md:p-12 flex flex-col justify-center items-center text-center transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_#1a1a1a]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 tracking-wide leading-tight">
              {currentEvent ? currentEvent.title : 'Event Details'}
            </h1>
            <div className="space-y-4">
              <p className="text-lg md:text-xl font-bold text-gray-800">
                Join us for an unforgettable experience at {currentEvent ? currentEvent.title : `Event #${eventId}`}. 
              </p>
              <p className="text-md md:text-lg font-bold text-gray-700 font-mono bg-white border-2 border-black inline-block px-3 py-1 shadow-[2px_2px_0px_#1a1a1a] transform rotate-1">
                More info coming soon...
              </p>
            </div>
          </div>

          {/* Bottom Panel: Register Button (Yellow) */}
          <a 
            href={currentEvent?.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#fde047] border-4 border-[#1a1a1a] shadow-[8px_8px_0px_#1a1a1a] rounded-2xl p-6 md:p-8 text-2xl md:text-3xl font-black uppercase tracking-[0.2em] transform hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[14px_14px_0px_#1a1a1a] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all cursor-pointer text-center no-underline text-[#1a1a1a] block"
          >
            Register
          </a>
          
        </div>
      </div>

    </div>
  );
};

export default EventDetails;
