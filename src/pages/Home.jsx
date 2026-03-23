import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridScan from '../components/GridScan'
import ScrollVelocity from '../components/ScrollVelocity'
import Footer from './Footer'
import Squares from '../components/Backgrounds/Squares/Squares'
import SubChapterCard from '../components/SubChapterCard'
import CarnivalEntrance from '../components/CarnivalEntrance'
import { motion } from 'framer-motion'







gsap.registerPlugin(ScrollTrigger)

const infoCards = [
    {
        title: "What is IEEE ?",
        content: "IEEE, the Institute Of Electrical and Electronics Engineers, is a premier technical and world's leading professional institution. IEEE stands for advancement of technology for the benefit of humanity, at the same time bringing members access to the industry's most essential technical information, networking opportunities, career development tools, and many other exclusive benefits. Providing students with an opportunity to interact with academicians and professionals, so as to benefit from their knowledge."
    },
    {
        title: "Why Choose IEEE SBNU ?",
        content: "IEEE Student Branch Nirma University (SBNU) offers a dynamic platform for students to grow technically, professionally, and personally. We empower members with opportunities to learn beyond classrooms through hands-on workshops, industry interactions, technical competitions, and real-world projects. By joining IEEE SBNU, you become part of a global IEEE network, gain access to valuable learning resources, develop leadership and teamwork skills, and build a strong foundation for your future career in engineering and technology."
    }
]

const subChapterCards = [
    {
        title: "IEEE Computer Society (CS)",
        logo: "/ieee-cs-logo.webp",
        content: "Focuses on advancing computer science and technology through global collaboration, technical excellence, and professional standards.",
        variant: "cs"
    },
    {
        title: "IEEE Special Interest Group on Humanitarian Technology (SIGHT)",
        logo: "/ieee-sight-logo.webp",
        content: "Leverages technology for sustainable development and humanitarian efforts, partnering with underserved communities worldwide.",
        variant: "sight",
        link: "https://ignite-humanity-web.vercel.app/"
    },
    {
        title: "IEEE Signal Processing Society (SPS)",
        logo: "/ieee-sps-logo.webp",
        content: "Advances state-of-the-art signal processing technologies that power modern communication, healthcare, and autonomous systems.",
        variant: "sps"
    },
    {
        title: "IEEE Intelligent Transportation Systems Society (ITSS)",
        logo: "/ieee-itss-logo.webp",
        content: "Drives innovation in intelligent transportation systems, focusing on autonomous vehicles, smart infrastructure, and traffic safety.",
        variant: "itss"
    },
    {
        title: "IEEE Women in Engineering (WIE)",
        logo: "/Docs/ieee-wie-logo.webp",
        content: "Promotes women engineers and scientists, inspiring young women to follow their academic interests to a career in engineering.",
        variant: "wie"
    }
]


const cardStyles = {
    card: {
        backgroundColor: '#111',
        border: '3px solid #fff',
        boxShadow: '8px 8px 0px #00629B',
        padding: 'clamp(20px, 5vw, 40px)',
        marginBottom: '0',
        maxWidth: '100%',
        width: '100%',
        borderRadius: '0',
        opacity: 0,
        transform: 'translateY(60px)',
        transition: 'transform 0.2s ease',
        display: 'flex',
        flexDirection: 'column'
    },
    logoContainer: {
        width: '80px',
        height: '80px',
        backgroundColor: '#222',
        border: '2px solid #5eb8ff',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    logo: {
        maxWidth: '90%',
        maxHeight: '90%',
        objectFit: 'contain'
    },
    title: {
        color: '#fff',
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: '900',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'inline-block',
        borderBottom: '4px solid #00629B',
        paddingBottom: '5px',
        alignSelf: 'start'
    },
    content: {
        color: '#fff',
        fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
        lineHeight: '1.6',
        textAlign: 'left'
    }
}

const Home = ({ isPageTransitioning }) => {
    const cardsRef = useRef([])
    const [gridCols, setGridCols] = React.useState(window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))')
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024)
    const [gridScanHeight, setGridScanHeight] = React.useState(
        window.innerWidth >= 1024 ? '100vh' : window.innerWidth >= 640 ? '600px' : '100vh'
    )

    useEffect(() => {
        const handleResize = () => {
            setGridCols(window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))');
            setIsDesktop(window.innerWidth >= 1024);
            setGridScanHeight(
                window.innerWidth >= 1024 ? '100vh' : window.innerWidth >= 640 ? '600px' : '100vh'
            );
        };
        window.addEventListener('resize', handleResize);

        // Initial setup
        handleResize();



        cardsRef.current.forEach((card) => {

            if (!card) return

            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 80,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 50%',
                        toggleActions: 'play none none reverse'
                    }
                }
            )
        })

        return () => {
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    return (
        <motion.div 
      initial={{ opacity: 1, scale: 1 }}
      className="relative z-10"
          style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000' }}
        >
            
            {/* 1. IEEE CARNIVAL ENTRANCE - PROMOTED TO TOP */}
            <div style={{ width: '100%', height: gridScanHeight, position: 'relative' }}>
                <GridScan
                    sensitivity={0.5}
                    lineThickness={1}
                    linesColor="#1a0033"
                    gridScale={0.1}
                    scanColor="#FF00F5"
                    scanOpacity={0.5}
                    enablePost={!isPageTransitioning}
                    bloomIntensity={0.9}
                    chromaticAberration={0.002}
                    noiseIntensity={0.015}
                />
                <CarnivalEntrance />
            </div>

            {/* 2. Combined Grid Section */}
            <div style={{ position: 'relative', backgroundColor: '#000', overflow: 'hidden' }}>
                {/* Section Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <Squares
                        direction="diagonal"
                        speed={0.15}
                        borderColor="#333"
                        squareSize={40}
                        hoverFillColor="#111"
                    />
                </div>

                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    gap: 'clamp(30px, 8vw, 60px)',
                    padding: 'clamp(40px, 10vw, 80px) clamp(20px, 5vw, 40px)',
                    maxWidth: '1300px',
                    margin: '0 auto',
                    pointerEvents: 'auto',
                    justifyItems: 'center',
                    alignItems: 'stretch'
                }}>
                    {/* Info Cards - Top Row (automatically by order) */}
                    {infoCards.map((card, index) => (
                        <div
                            key={index}
                            ref={el => cardsRef.current[index] = el}
                            style={{
                                ...cardStyles.card,
                                width: '100%',
                                maxWidth: '560px',
                                margin: 0
                            }}
                        >
                            <h2 className="info-card-title" style={cardStyles.title}>{card.title}</h2>
                            <p className="info-card-content" style={cardStyles.content}>{card.content}</p>
                        </div>
                    ))}

                    {/* Mission & Vision - Bottom Row */}
                    <div
                        ref={el => cardsRef.current[infoCards.length] = el}
                        style={{
                            ...cardStyles.card,
                            width: '100%',
                            maxWidth: '560px',
                            margin: 0
                        }}
                    >
                        <h4 style={cardStyles.title}>
                            Our Mission
                        </h4>
                        <p style={cardStyles.content}>
                            To cultivate a culture of innovation, technical excellence, and continuous learning among students by organizing impactful technical activities, workshops, and collaborative projects. We strive to bridge the gap between academia and industry, nurture leadership and professional skills, and encourage members to apply technology for solving real-world problems and contributing positively to society.
                        </p>
                    </div>

                    <div
                        ref={el => cardsRef.current[infoCards.length + 1] = el}
                        style={{
                            ...cardStyles.card,
                            width: '100%',
                            maxWidth: '560px',
                            margin: 0
                        }}
                    >
                        <h4 style={cardStyles.title}>
                            Our Vision
                        </h4>
                        <p style={cardStyles.content}>
                            To be recognized as a leading and inclusive student technical community that fosters innovation, encourages lifelong learning, and nurtures future technology leaders. We envision creating a dynamic environment where students collaborate, explore emerging technologies, and develop solutions that address real-world challenges, making a positive and lasting impact at local, national, and global levels.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Scroll Velocity Section */}
            <div style={{ padding: '60px 0 20px 0', backgroundColor: '#000' }}>
                <ScrollVelocity
                    texts={[
                        "IEEE SBNU • OUR SUBCHAPTERS • IEEE SBNU • OUR SUBCHAPTERS •",
                        "IEEE SPS • IEEE ITSS • IEEE CS • IEEE SIGHT • IEEE WIE • IEEE SPS • IEEE ITSS • IEEE CS • IEEE SIGHT • IEEE WIE •"
                    ]}
                    velocity={100}
                    className="custom-scroll-text"
                />
            </div>

            {/* 4. Sub-Chapters Section */}
            <div style={{ position: 'relative', backgroundColor: '#000', overflow: 'hidden', paddingBottom: '80px', paddingTop: '40px' }}>
                {/* Section Background (Same as top section) */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <Squares
                        direction="diagonal"
                        speed={0.15}
                        borderColor="rgba(214, 86, 246, 0.15)"
                        squareSize={40}
                        hoverFillColor="rgba(214, 86, 246, 0.08)"
                    />
                </div>

                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    gridAutoRows: isDesktop ? '1fr' : 'auto',
                    gap: 'clamp(30px, 8vw, 60px)',
                    padding: '0 clamp(20px, 5vw, 40px)',
                    maxWidth: '1300px',
                    margin: '0 auto',
                    pointerEvents: 'auto',
                    justifyItems: 'center',
                    alignItems: 'stretch'
                }}>
                    {subChapterCards.map((card, index) => (
                        <div
                            key={index}
                            ref={el => cardsRef.current[infoCards.length + 2 + index] = el}
                            style={{
                                width: (isDesktop && subChapterCards.length % 2 !== 0 && index === subChapterCards.length - 1) 
                                    ? 'calc(50% - clamp(15px, 4vw, 30px))' 
                                    : '100%',
                                maxWidth: '560px',
                                margin: 0,
                                opacity: 0, // Initial state for GSAP
                                transform: 'translateY(60px)', // Initial state for GSAP
                                ...(isDesktop && subChapterCards.length % 2 !== 0 && index === subChapterCards.length - 1 ? { gridColumn: '1 / -1' } : {})
                            }}
                        >
                            <SubChapterCard
                                title={card.title}
                                logo={card.logo}
                                content={card.content}
                                variant={card.variant}
                                link={card.link}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Final Scroll Velocity Section */}
            <div style={{ padding: '0 0 60px 0', backgroundColor: '#000' }}>
                <ScrollVelocity
                    texts={[
                        "LIVE IN FUTURE • JOIN THE REVOLUTION • LIVE IN FUTURE • JOIN THE REVOLUTION •",
                        "IEEE SBNU • ESTD 2002 • NIRMA UNIVERSITY • IEEE SBNU • ESTD 2002 • NIRMA UNIVERSITY •"
                    ]}
                    velocity={100}
                    className="custom-scroll-text"
                />
            </div>

            <Footer />
        </motion.div>
    );
};

export default Home
