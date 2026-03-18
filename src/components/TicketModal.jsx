import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Ticket } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, eventTitle, eventDate, posterImg, eventId }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const ticketRef = useRef(null);

  // Generate a pseudo-random hash for the QR pattern based on time/event
  const dayEventsHash = (parseInt(eventId) || 0) + 123;

  const handleDownload = useCallback(() => {
    if (ticketRef.current === null) return;
    setIsGenerating(true);
    
    // Give it a tiny delay to ensure heavy layout/fonts are ready
    setTimeout(() => {
      toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `IEEE-Carnival-${eventTitle.replace(/\s+/g, '-')}-Ticket.png`;
          link.href = dataUrl;
          link.click();
          setIsGenerating(false);
        })
        .catch((err) => {
          console.error('Oops, something went wrong!', err);
          setIsGenerating(false);
        });
    }, 100);
  }, [ticketRef, eventTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white border-4 border-black shadow-[16px_16px_0px_black] rounded-[2rem] overflow-hidden flex flex-col items-center p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Build Your Ticket! 🎟️</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            Personalize your attendee post & share the hype on WhatsApp/Instagram!
          </p>
        </div>

        {/* Input Field */}
        <div className="w-full mb-10 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-2 text-gray-400">Enter Your Name</label>
          <input 
            type="text" 
            placeholder="Jane Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_black] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-black text-lg bg-[#fafafa]"
          />
        </div>

        {/* Ticket Canvas (What will be downloaded) */}
        <div className="w-full flex justify-center mb-8">
          <div 
            ref={ticketRef}
            className="w-[360px] aspect-[10/16] bg-white border-[6px] border-black shadow-[16px_16px_0px_black] rounded-[2.5rem] relative overflow-hidden flex flex-col items-center"
          >
            {/* Top Pattern Header */}
            <div className="w-full h-12 bg-black flex items-center justify-between px-6">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">IEEE CARNIVAL 2026</span>
              <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>)}
              </div>
            </div>

            {/* Event Header Section */}
            <div className="w-full p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-black bg-[#D656F6] mb-4 flex items-center justify-center shadow-[4px_4px_0px_black] rotate-[-5deg]">
                 <Ticket className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-black uppercase leading-[0.9] tracking-tighter mb-2 break-words max-w-[280px]">
                {eventTitle}
              </h3>
              <div className="px-4 py-1.5 rounded-full border-2 border-black bg-[#BAE1FF] shadow-[3px_3px_0px_black] scale-90">
                <span className="text-[9px] font-black uppercase tracking-widest leading-none block">Nirma University Campus</span>
              </div>
            </div>

            {/* Poster Slice (Cinematic) */}
            <div className="w-full h-32 border-y-4 border-black relative overflow-hidden bg-gray-900 group">
              <img src={posterImg} alt="Event" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-6">
                <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">{eventDate}</p>
              </div>
            </div>

            {/* Personalization Section */}
            <div className="w-full p-8 flex-grow flex flex-col items-center justify-center">
              <div className="w-full relative py-8 border-2 border-dashed border-black/20 rounded-2xl bg-[#fafafa]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-md">Validated For</span>
                <span className="text-3xl font-black uppercase tracking-tighter text-center block px-4 truncate">
                  {name || 'YOUR NAME'}
                </span>
                <div className="mt-4 flex flex-col items-center">
                   <div className="px-3 py-1 bg-[#A7F3D0] border-2 border-black rounded shadow-[2px_2px_0px_black] rotate-[1deg]">
                      <span className="text-[10px] font-black uppercase leading-none">VIP ACCESS • ALL TRACKS</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: QR & Admi One */}
            <div className="w-full bg-gray-50 border-t-4 border-black p-6 flex items-center gap-6 justify-between">
               <div className="flex flex-col gap-1 items-start">
                  <span className="text-[9px] font-black opacity-30 uppercase tracking-widest leading-none">Authenticity</span>
                  <div className="text-sm font-black uppercase leading-none border-b-2 border-black pb-1">ADMIT ONE 🎟️</div>
                  <div className="text-[8px] font-bold opacity-40 uppercase tracking-widest mt-1">Ref: NRM89172-C109</div>
               </div>

               {/* Stylized QR placeholder */}
               <div className="w-16 h-16 bg-white border-2 border-black p-1 shadow-[4px_4px_0px_black]">
                  <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-0.5 opacity-80">
                     {[...Array(16)].map((_, i) => (
                       <div key={i} className={`rounded-sm ${(i*7+dayEventsHash)%2 === 0 ? 'bg-black' : 'bg-transparent'}`}></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Ticket Notches */}
            <div className="absolute left-0 top-[22rem] -translate-x-1/2 w-10 h-10 rounded-full border-4 border-black bg-[#f8f0ff] z-20"></div>
            <div className="absolute right-0 top-[22rem] translate-x-1/2 w-10 h-10 rounded-full border-4 border-black bg-[#f8f0ff] z-20"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-4">
          <button 
            onClick={handleDownload}
            disabled={!name || isGenerating}
            className="flex-grow flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.4)] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[8px_8px_0px_#A7F3D0]"
          >
            {isGenerating ? 'Generating...' : <><Download className="w-5 h-5" /> Generate VIP Pass</>}
          </button>
          <button className="flex items-center justify-center w-20 bg-[#BAE1FF] border-4 border-black rounded-[1.5rem] hover:bg-[#A3D1F3] transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center max-w-xs leading-relaxed">
          The download works best on modern browsers. You can also screenshot your customized ticket above!
        </p>

      </div>
    </div>
  );
};

export default TicketModal;
