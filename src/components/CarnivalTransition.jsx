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
      style={{ 
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <video
        ref={videoRef}
        className="carnival-transition-video"
        src="/Carnival/Transistion video.mp4"
        playsInline
        muted={isMuted}
        preload="auto"
        onEnded={onComplete}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Control Buttons - Bottom Right */}
      <div className="absolute bottom-12 right-12 flex items-center gap-6 z-[10000]">
        <button 
          onClick={toggleMute}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-black/60 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] group"
        >
          <span className="text-sm font-black tracking-widest uppercase opacity-80 group-hover:opacity-100">{isMuted ? 'Unmute' : 'Mute'}</span>
          {isMuted ? <VolumeX size={28} className="text-[#ff6b6b]" /> : <Volume2 size={28} className="text-[#00d2ff]" />}
        </button>
        <button 
          onClick={handleSkip}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#ff6b6b] border-2 border-white/30 text-white hover:bg-[#ff5252] hover:scale-105 transition-all font-black tracking-[0.2em] shadow-[0_0_25px_rgba(255,107,107,0.4)] uppercase text-base"
        >
          Skip Intro <X size={22} />
        </button>
      </div>
    </motion.div>
  );
};

export default CarnivalTransition;
