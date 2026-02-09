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
        border: '4px solid #fff',
        boxShadow: '12px 12px 0px #5eb8ff',
        padding: '40px',
        marginBottom: '40px',
        maxWidth: '900px',
        width: '90%',
        borderRadius: '0',
        opacity: 0,
        transform: 'translateY(60px)',
        transition: 'transform 0.2s ease'
    },
    title: {
        color: '#fff',
        fontSize: '2.2rem',
        fontWeight: '900',
        marginBottom: '25px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        display: 'inline-block',
        borderBottom: '6px solid #5eb8ff',
        paddingBottom: '5px'
    },
    content: {
        color: '#fff',
        fontSize: '1.1rem',
        lineHeight: '1.8',
        textAlign: 'left'
    }
}

const Home = () => {
    const cardsRef = useRef([])

    useEffect(() => {
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
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
<<<<<<< HEAD
    {/* TextPressure Content */ }
    <div
        className="text-pressure-container"
        style={{
            position: 'relative',
            zIndex: 1,
            height: '350px',
            padding: '25px 50px 25px 50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <TextPressure
            text="IEEE SBNU"
            strokeColor="#00629b"
            textColor="#ffffff"
            stroke={true}
            width={true}
            weight={true}
            italic={true}
        />
    </div>

    {/* Info Cards Section */ }
    <div
        className="cards-section"
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px 20px',
            pointerEvents: 'auto'
        }}>
=======
            {/* GridDistortion Hero Section */}
        <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100vh',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '60px',
            padding: '80px 40px',
            backgroundColor: '#000',
            maxWidth: '1200px',
            margin: '0 auto',
            pointerEvents: 'auto',
            justifyItems: 'center'
        }}>
            {/* Info Cards - Top Row (automatically by order) */}
>>>>>>> dev
            {infoCards.map((card, index) => (
                <div
                    key={index}
                    ref={el => cardsRef.current[index] = el}
<<<<<<< HEAD
                    className="info-card"
                    style={cardStyles.card}
=======
                        style={{
                            ...cardStyles.card,
                            width: '100%',
                            maxWidth: '560px',
                            margin: 0
                        }}
>>>>>>> dev
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
