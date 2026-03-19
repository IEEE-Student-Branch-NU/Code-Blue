import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Undo2, Download, Share2, Ticket } from 'lucide-react';

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Invitation Link Copied! Send it to your friends! 🔗🚀");
    } catch (err) {
      console.error('Copy Link Error:', err);
    }
  };

  const handleShare = async () => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(ticketRef.current, { 
        quality: 1.0, 
        pixelRatio: 3,
        backgroundColor: '#000000'
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `IEEE_Carnival_Post_${name || 'Delegate'}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'IEEE Carnival Delegate Pass',
          text: `I'm attending ${eventTitle} at Nirma University! Join me! 🎡 #IEEECarnival`,
        });
      } else {
        const link = document.createElement('a');
        link.download = `IEEE_Carnival_Post_${name || 'Delegate'}.png`;
        link.href = dataUrl;
        link.click();
        alert("Post saved! Upload it to your story/status and tag us! 🚀");
      }
    } catch (err) {
      console.error('Viral Share Engine Error:', err);
      handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 p-4 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-[450px] w-full flex flex-col gap-8 my-auto py-10">
        {/* --- COMPACT BACK BUTTON (Responsive Neo-Brutalist) --- */}
        <button 
          onClick={onClose}
          className="fixed top-4 left-4 md:top-8 md:left-8 z-[210] bg-white border-[3px] md:border-[4px] border-black shadow-[4px_4px_0px_black] md:shadow-[10px_10px_0px_black] p-2.5 md:p-4 rounded-xl md:rounded-2xl hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[14px_14px_0px_black] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all group flex items-center justify-center cursor-pointer"
        >
          <Undo2 className="text-black group-hover:scale-110 transition-transform w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
        </button>

        {/* Branding & Status Header */}
        <div className="w-full text-center space-y-2">
           <h2 className="text-4xl font-[1000] text-white uppercase tracking-tighter italic">BROADCAST YOUR STATUS!</h2>
           <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">EXCLUSIVE TO REGISTERED DELEGATES</p>
        </div>

        {/* Name Input Group (Neo-Brutalist Focus) */}
        <div className="w-full space-y-4 relative z-20">
          <input 
            type="text" 
            placeholder="TYPE YOUR NAME HERE..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-5 rounded-[2.5rem] border-[4px] border-black shadow-[12px_12px_0px_#FFD700] focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all outline-none font-black text-xl bg-white text-black placeholder:text-gray-300"
          />
        </div>

        {/* Ticket Canvas (The Ultimate Shareable Delegate "Post") */}
        <div className="w-full flex justify-center pb-4 scale-[0.85] sm:scale-100">
          <div 
            ref={ticketRef}
            className="w-[380px] aspect-[9/16] bg-black border-[10px] border-black shadow-[35px_35px_0px_#D656F6] rounded-[4.5rem] relative overflow-hidden flex flex-col items-center"
          >
            {/* Background Poster (High-Contrast Cinematic) */}
            <div className="absolute inset-0 z-0 scale-105">
               <img src={posterImg} alt="BG" className="w-full h-full object-cover saturate-[1.6] grayscale-[5%]" />
               <div className="absolute inset-0 bg-black/75 transition-colors"></div>
               {/* Industrial Noise Pattern */}
               <div className="absolute inset-0 opacity-[0.08] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            {/* Stage 1: Official Header (Full Branding) */}
            <div className="w-full pt-16 pb-2 px-8 relative z-20 flex flex-col items-center">
               <div className="w-full bg-black border-4 border-white py-3 px-6 flex flex-col items-center shadow-[6px_6px_0px_white]">
                  <span className="text-[12px] font-[1000] text-white uppercase tracking-[0.4em] leading-none mb-1">
                     IEEE STUDENT BRANCH
                  </span>
                  <div className="h-[2px] w-28 bg-[#FFD700] mb-1"></div>
                  <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest leading-none">
                     NIRMA UNIVERSITY
                  </span>
               </div>
            </div>

            {/* Stage 2: Event Information (The Showcase) */}
            <div className="w-full px-8 relative z-20 flex flex-col items-center mt-6">
               <div className="px-6 py-1.5 bg-[#FFD700] border-4 border-black shadow-[6px_6px_0px_black] rotate-[-2deg] mb-3">
                  <span className="text-[12px] font-[1000] text-black uppercase tracking-widest leading-none block italic">CARNIVAL 2026 EDITION</span>
               </div>
               <h3 className="text-6xl font-[1000] text-white uppercase leading-[0.75] tracking-tighter drop-shadow-[8px_8px_0px_black] text-center w-full max-w-[300px]">
                 {eventTitle}
               </h3>
               <div className="mt-4 px-5 py-2 bg-[#D656F6] border-4 border-black rotate-[5deg] shadow-[6px_6px_0px_black] z-50">
                  <span className="text-[11px] font-[1000] text-black uppercase tracking-widest leading-none block">SEE YOU THERE! 🎫</span>
               </div>
            </div>

            {/* Stage 3: Participant Identity (The Focal Flex) */}
            <div className="w-full px-6 flex-grow flex flex-col justify-center relative z-20 py-8">
               <div className="w-full relative py-12 px-8 bg-white border-[12px] border-black rounded-[4rem] shadow-[25px_25px_0px_black] flex flex-col items-center group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-black flex items-center justify-center border-b-[8px] border-black">
                     <span className="text-[11px] font-[1000] text-white uppercase tracking-[0.4em]">OFFICIAL DELEGATE</span>
                  </div>

                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 mt-8">EXCLUSIVELY FOR</span>
                  <h4 className="text-5xl font-[1000] text-black uppercase tracking-tighter text-center leading-[0.8] w-full break-words px-4 italic skew-x-[-8deg] mb-2">
                    {name || 'EXC DELEGATE'}
                  </h4>

                  <div className="mt-8 flex items-center gap-4 opacity-70">
                     <div className="w-5 h-5 rounded-md bg-black"></div>
                     <div className="w-5 h-5 rounded-md bg-[#FFD700] border-4 border-black rotate-12"></div>
                     <div className="w-5 h-5 rounded-md bg-[#D656F6] border-4 border-black rotate-[-12deg]"></div>
                  </div>
               </div>
            </div>

            {/* Stage 4: Official Verification Footer */}
            <div className="w-full py-10 px-10 mt-auto relative z-20 bg-black border-t-[8px] border-black flex items-center justify-between">
               <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-6">
                     <span className="text-6xl font-black text-white leading-none tracking-tighter opacity-15">#{(dayEventsHash || 0) + 72}</span>
                     <div className="bg-white border-4 border-black py-2 px-5 rotate-[-3deg] shadow-[6px_6px_0px_#FFD700]">
                        <span className="text-[10px] font-[1000] text-black uppercase tracking-widest block italic">INVITATION GRANTED</span>
                     </div>
                  </div>
                  <div className="px-4 py-1.5 bg-[#FFD700] border-4 border-black skew-x-[-12deg] shadow-[6px_6px_0px_white]">
                     <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none block">NIRMA UNIVERSITY CAMPUS</span>
                  </div>
               </div>
               
               {/* Professional QR Signature */}
               <div className="w-20 h-20 bg-white border-[8px] border-black p-1.5 shadow-[12px_12px_0px_#D656F6] rotate-[10deg] rounded-[2.5rem]">
                  <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1 animate-pulse">
                     {[...Array(25)].map((_, i) => (
                       <div key={i} className={`rounded-sm ${(i*13 + (dayEventsHash || 0)) % 4 === 0 ? 'bg-black' : 'bg-transparent'}`}></div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Side Die-Cut Detailing */}
            <div className="absolute left-[-25px] top-[74%] w-12 h-12 rounded-full bg-white border-[8px] border-black z-30 shadow-inner"></div>
            <div className="absolute right-[-25px] top-[74%] w-12 h-12 rounded-full bg-white border-[8px] border-black z-30 shadow-inner"></div>

            {/* Status Trace Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.2] bg-[radial-gradient(circle_at_top_right,#FFD700,transparent_70%),radial-gradient(circle_at_bottom_left,#03E9F4,transparent_70%)]"></div>
          </div>
        </div>

        {/* Triple Action Social Distribution Hub */}
        <div className="w-full flex flex-col gap-4 px-2">
           <div className="flex gap-4">
             <button 
               disabled={!name || isGenerating}
               onClick={handleShare}
               className="flex-[2] bg-[#FFD700] hover:bg-[#ffc107] text-black border-[4px] border-black shadow-[10px_10px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none py-5 px-6 rounded-[2.5rem] font-[1000] uppercase tracking-widest transition-all text-sm disabled:opacity-50"
             >
               {isGenerating ? 'GENERATING POST...' : 'GET YOUR POST 🚀'}
             </button>
             <button 
               disabled={!name || isGenerating}
               onClick={handleDownload}
               className="flex-1 bg-white hover:bg-gray-100 text-black border-[4px] border-black shadow-[10px_10px_0px_black] active:translate-x-1 active:translate-y-1 active:shadow-none py-5 px-6 rounded-[2.5rem] font-[1000] uppercase tracking-widest transition-all text-xs disabled:opacity-50"
             >
               SAVE 🎫
             </button>
           </div>
           
           <button 
             onClick={handleCopyLink}
             className="w-full bg-black/40 hover:bg-black/60 text-white/60 hover:text-white border-[2px] border-white/10 py-3 rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-[10px] transition-all"
           >
             COPY INVITATION LINK 🔗
           </button>
        </div>

        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] text-center w-full max-w-[300px] mx-auto leading-relaxed">
          BROADCAST YOUR EXCLUSIVE STATUS & INVITE YOUR PEERS!
        </p>
      </div>
    </div>
  );
}

export default TicketModal;
