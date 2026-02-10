import React, { useLayoutEffect, useRef } from 'react'
import DomeGallery from '../components/DomeGallery'
import gsap from 'gsap'

const Gallery = () => {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

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
    }, []);

    return (
        <div ref={containerRef} style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#000',
            pointerEvents: 'auto',
            overflow: 'hidden'
        }}>
            <div className="revealers">
                <div className="revealer r-1"></div>
                <div className="revealer r-2"></div>
            </div>

            <DomeGallery
                fit={0.95}
                minRadius={950}
                maxVerticalRotationDeg={10}
                segments={34}
                dragDampening={3}
                grayscale={false}
            />
        </div>
    )
}

export default Gallery
