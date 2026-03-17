import React, { useEffect, useRef } from 'react';
import './CarnivalTransition.css';

const CarnivalTransition = ({ isPlaying, onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // If video fails to play, skip to navigation
        onComplete?.();
      });
    }
  }, [isPlaying, onComplete]);

  const handleVideoEnd = () => {
    onComplete?.();
  };

  if (!isPlaying) return null;

  return (
    <div className="carnival-transition-overlay">
      <video
        ref={videoRef}
        className="carnival-transition-video"
        src="/Carnival/Transistion video.mp4"
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
      />
    </div>
  );
};

export default CarnivalTransition;
