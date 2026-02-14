import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridDistortion from '../components/GridDistortion'
import ScrollVelocity from '../components/ScrollVelocity'
import Footer from '../components/Footer'
import Squares from '../components/Backgrounds/Squares/Squares'
import SubChapterCard from '../components/SubchapterCard'
import confetti from 'canvas-confetti'


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
        logo: "/ieee-cs-logo.jpeg",
        content: "Focuses on advancing computer science and technology through global collaboration, technical excellence, and professional standards.",
        variant: "cs"
    },
    {
        title: "IEEE Special Interest Group on Humanitarian Technology (SIGHT)",
        logo: "/ieee-sight-logo.jpeg",
        content: "Leverages technology for sustainable development and humanitarian efforts, partnering with underserved communities worldwide.",
        variant: "sight"
    },
    {
        title: "IEEE Signal Processing Society (SPS)",
        logo: "/ieee-sps-logo.jpeg",
        content: "Advances state-of-the-art signal processing technologies that power modern communication, healthcare, and autonomous systems.",
        variant: "sps"
    },
    {
        title: "IEEE Intelligent Transportation Systems Society (ITSS)",
        logo: "/ieee-itss-logo.jpg",
        content: "Drives innovation in intelligent transportation systems, focusing on autonomous vehicles, smart infrastructure, and traffic safety.",
        variant: "itss"
    }
]


const cardStyles = {
    card: {
        backgroundColor: '#111',
        border: '3px solid #fff',
        boxShadow: '8px 8px 0px #5eb8ff',
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
        borderBottom: '4px solid #5eb8ff',
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

const Home = () => {
    const cardsRef = useRef([])
    const [gridCols, setGridCols] = React.useState(window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))')

    useEffect(() => {
        const handleResize = () => {
            setGridCols(window.innerWidth >= 1024 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))');
        };
        window.addEventListener('resize', handleResize);

        // Initial setup
        handleResize();

        // One-time celebratory confetti
        const hasCelebrated = sessionStorage.getItem('hasCelebrated');
        if (!hasCelebrated) {
            const duration = 3 * 1000;
            const end = Date.now() + duration;
            const colors = ['#bb0000', '#ffffff', '#00f7ff', '#e9ff00', '#00ff00', '#fe00f6'];

            (function frame() {
                confetti({
                    particleCount: 4,
                    angle: 60,
                    spread: 100,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 4,
                    angle: 120,
                    spread: 100,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());

            sessionStorage.setItem('hasCelebrated', 'true');
        }

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
        <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000' }}>
            {/* GridDistortion Hero Section */}
            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100dvh',
                overflow: 'hidden',
            }}>
                <GridDistortion
                    imageSrc="/hero.png"
                    grid={20}
                    mouse={0.15}
                    strength={0.1}
                    relaxation={0.9}
                />
            </div>

            {/* Combined Grid Section */}
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

            {/* Scroll Velocity Section */}
            <div style={{ padding: '60px 0 20px 0', backgroundColor: '#000' }}>
                <ScrollVelocity
                    texts={[
                        "IEEE SBNU • OUR SUBCHAPTERS •",
                        "IEEE SPS • IEEE ITSS • IEEE CS • IEEE SIGHT •"
                    ]}
                    velocity={100}
                    className="custom-scroll-text"
                />
            </div>

            {/* Sub-Chapters Section */}
            <div style={{ position: 'relative', backgroundColor: '#000', overflow: 'hidden', paddingBottom: '80px', paddingTop: '40px' }}>
                {/* Section Background (Same as top section) */}
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
                                width: '100%',
                                maxWidth: '560px',
                                margin: 0,
                                opacity: 0, // Initial state for GSAP
                                transform: 'translateY(60px)' // Initial state for GSAP
                            }}
                        >
                            <SubChapterCard
                                title={card.title}
                                logo={card.logo}
                                content={card.content}
                                variant={card.variant}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Scroll Velocity Section */}
            <div style={{ padding: '0 0 60px 0', backgroundColor: '#000' }}>
                <ScrollVelocity
                    texts={[
                        "LIVE IN FUTURE • JOIN THE REVOLUTION •",
                        "IEEE SBNU • ESTD 2002 • NIRMA UNIVERSITY •"
                    ]}
                    velocity={100}
                    className="custom-scroll-text"
                />
            </div>

            <Footer />
        </div>
    )
}

export default Home
