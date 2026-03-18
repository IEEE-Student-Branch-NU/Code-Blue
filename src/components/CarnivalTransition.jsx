import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, X } from 'lucide-react';
import './CarnivalTransition.css';

const CarnivalTransition = ({ isPlaying, onComplete }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playback
    video.currentTime = 0;
    video.play().catch(() => {
      // If autoplay with sound is blocked, fallback to muted
      video.muted = true;
      setIsMuted(true);
      video.play();
    });

    const handleTimeUpdate = () => {
      // Seamless handoff: Start fading before the video fully ends
      if (video.duration > 0 && video.currentTime >= video.duration - 0.7) {
        onComplete?.();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onComplete]);

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
       video.muted = !isMuted;
       setIsMuted(!isMuted);
    }
  };

  const handleSkip = (e) => {
    e.stopPropagation();
    onComplete?.();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="carnival-transition-overlay"
    >
      <div className="fixed inset-0 z-[999999] bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/Carnival/Transistion video.mp4"
          playsInline
          muted={isMuted}
          preload="auto"
          onEnded={onComplete}
        />

        {/* Control Buttons - Bottom Right - FORCED VISIBILITY */}
        <div className="absolute bottom-16 md:bottom-12 right-6 md:right-12 flex items-center gap-3 md:gap-6 z-[1000001] pointer-events-auto">
          <button 
            onClick={toggleMute}
            className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl bg-black/60 backdrop-blur-xl border-2 border-white/40 text-white hover:bg-black/80 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group pointer-events-auto cursor-pointer"
          >
            <span className="text-[10px] md:text-sm font-black tracking-widest uppercase opacity-80 group-hover:opacity-100">{isMuted ? 'Unmute' : 'Mute'}</span>
            {isMuted ? <VolumeX size={20} className="md:w-7 md:h-7 text-[#ff6b6b]" /> : <Volume2 size={20} className="md:w-7 md:h-7 text-[#00d2ff]" />}
          </button>
          <button 
            onClick={handleSkip}
            className="flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-[#ff6b6b] border-2 border-white/40 text-white hover:bg-[#ff5252] hover:scale-105 transition-all font-black tracking-[0.1em] md:tracking-[0.2em] shadow-[0_0_25px_rgba(255,107,107,0.6)] uppercase text-xs md:text-base pointer-events-auto cursor-pointer"
          >
            Skip Intro <X size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CarnivalTransition;
