import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextPressure from '../components/TextPressure'

gsap.registerPlugin(ScrollTrigger)

const infoCards = [
    {
        title: "What is IEEE?",
        content: "IEEE, the Institute Of Electrical and Electronics Engineers, is a premier technical and world's leading professional institution. IEEE stands for advancement of technology for the benefit of humanity, at the same time bringing members access to the industry's most essential technical information, networking opportunities, career development tools, and many other exclusive benefits. Providing students with an opportunity to interact with academicians and professionals, so as to benefit from their knowledge."
    },
    {
        title: "Why SBNU?",
        content: "SBNU hosts a variety of workshops, seminars, webinars, technical talks, competitions, and events throughout the semester, aiming to support its members in achieving comprehensive development aligned with the latest technological advancements."
    }
]

const cardStyles = {
    card: {
        background: 'linear-gradient(135deg, rgba(0, 98, 155, 0.15) 0%, rgba(0, 50, 80, 0.25) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 98, 155, 0.3)',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        maxWidth: '900px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        opacity: 0,
        transform: 'translateY(60px)'
    },
    title: {
        color: '#5eb8ff',
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '20px',
        textShadow: '0 0 20px rgba(0, 98, 155, 0.5)'
    },
    content: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '1.1rem',
        lineHeight: '1.8',
        textAlign: 'justify'
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
            {/* TextPressure Content */}
            <div
                className="text-pressure-container"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '350px',
                    padding: '25px 50px 25px 50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
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

            {/* Info Cards Section */}
            <div
                className="cards-section"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '60px 20px',
                    pointerEvents: 'auto'
                }}>
                {infoCards.map((card, index) => (
                    <div
                        key={index}
                        ref={el => cardsRef.current[index] = el}
                        className="info-card"
                        style={cardStyles.card}
                    >
                        <h2 className="info-card-title" style={cardStyles.title}>{card.title}</h2>
                        <p className="info-card-content" style={cardStyles.content}>{card.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home
