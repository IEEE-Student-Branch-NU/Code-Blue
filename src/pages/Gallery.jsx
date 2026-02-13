import React, { useLayoutEffect, useRef, useState } from 'react'
import DomeGallery from '../components/DomeGallery'
import gsap from 'gsap'

const Gallery = () => {
    const containerRef = useRef(null);
    const [permissionGranted, setPermissionGranted] = useState(null); // null, true, false
    const audioRef = useRef(null);

    useLayoutEffect(() => {
        if (permissionGranted === null) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Start audio if granted
            if (permissionGranted === true && audioRef.current) {
                audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
            }

            tl.to(".r-1", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                duration: 1.5,
                ease: "power4.inOut",
            })
                .to(".r-2", {
                    clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
                    duration: 1.5,
                    ease: "power4.inOut",
                }, "<")
                .to(".revealers", {
                    display: "none"
                });
        }, containerRef);

        return () => ctx.revert();
    }, [permissionGranted]);

    const handlePermission = (granted) => {
        setPermissionGranted(granted);
    };

    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100dvh',
            backgroundColor: '#000',
            pointerEvents: 'auto',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Audio Element */}
            <audio ref={audioRef} src="/Experience.mp3" loop />

            {/* GSAP Revealars */}
            <div className="revealers">
                <div className="revealer r-1"></div>
                <div className="revealer r-2"></div>
            </div>

            {/* Permission Modal */}
            {permissionGranted === null && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 100,
                    backgroundColor: 'rgba(0,0,0,0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <h2 style={{
                        color: '#fff',
                        fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                        fontWeight: '900',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>Immersive Experience</h2>
                    <p style={{
                        color: '#aaa',
                        fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                        marginBottom: '40px',
                        maxWidth: '600px'
                    }}>Enable sound for the full cinematic journey?</p>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button
                            onClick={() => handlePermission(true)}
                            style={{
                                padding: '15px 40px',
                                backgroundColor: '#5eb8ff',
                                color: '#000',
                                border: 'none',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                letterSpacing: '1px',
                                transition: 'transform 0.2s ease',
                                boxShadow: '4px 4px 0px #fff'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >Yes, Immerse Me</button>
                        <button
                            onClick={() => handlePermission(false)}
                            style={{
                                padding: '15px 40px',
                                backgroundColor: 'transparent',
                                color: '#ff4d4d',
                                border: '2px solid #ff4d4d',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                letterSpacing: '1px',
                                transition: 'all 0.2s ease',
                                boxShadow: '4px 4px 0px #ff4d4d'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,77,77,0.1)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >Skip No Sound</button>
                    </div>
                </div>
            )}

            {/* Gallery Content */}
            {permissionGranted !== null && (
                <DomeGallery
                    fit={0.95}
                    minRadius={950}
                    maxVerticalRotationDeg={10}
                    segments={34}
                    dragDampening={3}
                    grayscale={false}
                />
            )}

            {/* REVEALER STYLES (Inline for simplicity or added to CSS if needed) */}
            <style>{`
                .revealers {
                    position: absolute;
                    inset: 0;
                    z-index: 50;
                    display: flex;
                    flex-direction: column;
                    pointer-events: none;
                }
                .revealer {
                    flex: 1;
                    background-color: #000;
                    z-index: 60;
                }
                .r-1 { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
                .r-2 { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%); }
            `}</style>
        </div>
    )
}

export default Gallery
