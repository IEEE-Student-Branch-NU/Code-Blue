import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GridDistortion from '../components/GridDistortion'

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
        cardsRef.current.forEach((card, index) => {
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
        <div style={{ position: 'relative', minHeight: '100vh' }}>
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
            <div style={{
                display: 'grid',
                gridTemplateColumns: gridCols,
                gap: 'clamp(30px, 8vw, 60px)',
                padding: 'clamp(40px, 10vw, 80px) clamp(20px, 5vw, 40px)',
                backgroundColor: '#000',
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
    )
}

export default Home
