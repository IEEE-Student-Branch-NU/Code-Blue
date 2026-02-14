import React from 'react';
import { Linkedin } from 'lucide-react';
import Footer from '../components/Footer';
import Squares from '../components/Backgrounds/Squares/Squares';

const boardMembers = [
    {
        id: 1,
        name: "Madhav Maheshwari",
        role: "Chair",
        image: "/Board/Madhav Maheshwari.jpeg",
        description: "Leading the core committee with a focus on strategic growth and innovation.",
        socials: {
            linkedin: "https://www.linkedin.com/in/madhav-maheshwari-aa959225b"
        }
    },
    {
        id: 2,
        name: "Himay Shah",
        role: "Vice Chair",
        image: "/Board/Himay Shah.jpeg",
        description: "Assisting the Chair in strategic operations and organizational development.",
        socials: {
            linkedin: "https://www.linkedin.com/in/himay-shah-43484a241"
        }
    },
    {
        id: 3,
        name: "Prachit Bhavsar",
        role: "General Secretary",
        image: "/Board/Prachit.PNG",
        description: "Overseeing general administration and coordinating between various departments.",
        socials: {
            linkedin: "https://www.linkedin.com/in/prachitbhavsar"
        }
    },
    {
        id: 4,
        name: "Tanay Vora",
        role: "Joint Secretary",
        image: "/Board/Tanay Vora.jpeg",
        description: "Supporting the General Secretary in administrative tasks and communication.",
        socials: {
            linkedin: "https://www.linkedin.com/in/tanay-vora-04543a288"
        }
    },
    {
        id: 5,
        name: "Tanay Parikh",
        role: "Treasurer",
        image: "/Board/Tanay Parikh.jpeg",
        description: "Managing financial records and ensuring fiscal accountability for the organization.",
        socials: {
            linkedin: "https://www.linkedin.com/in/tanay-m-parikh"
        }
    },
    {
        id: 6,
        name: "Dweep Patel",
        role: "Joint Treasurer",
        image: "/Board/Dweep Patel.jpeg",
        description: "Assisting the Treasurer in financial planning and budget management.",
        socials: {
            linkedin: "https://www.linkedin.com/in/dweeppatel92"
        }
    },
    {
        id: 7,
        name: "Vraj Talati",
        role: "Technical Head",
        image: "/Board/Vraj Talati.jpeg",
        description: "Leading the technical strategy and overseeing the development of core infrastructure.",
        socials: {
            linkedin: "https://www.linkedin.com/in/vrajtalati"
        }
    },
    {
        id: 8,
        name: "Rudra Patel",
        role: "Technical Head",
        image: "/Board/Rudra Patel.jpeg",
        description: "Driving architectural decisions and ensuring technical excellence across projects.",
        socials: {
            linkedin: "https://www.linkedin.com/in/rudra-patel-045b20335"
        }
    },
    {
        id: 9,
        name: "Dharm Mankad",
        role: "Technical Head",
        image: "/Board/Dharm Mankad.jpeg",
        description: "Managing technical teams and implementing scalable technology solutions.",
        socials: {
            linkedin: "https://www.linkedin.com/in/dharmmankad"
        }
    },
    {
        id: 10,
        name: "Kashvi Patel",
        role: "Social Media Head",
        image: "/Board/Kashvi Patel.jpeg",
        description: "Leading social media strategy and enhancing the organization's digital presence.",
        socials: {
            linkedin: "https://www.linkedin.com/in/kashvi-patel-74b58b339"
        }
    },
    {
        id: 11,
        name: "Anany Kelotra",
        role: "Social Media Head",
        image: "/Board/Anany Kelotra.jpeg",
        description: "Coordinating social media campaigns and engaging with our global community.",
        socials: {
            linkedin: "https://www.linkedin.com/in/anany-kelotra-49ab6a237"
        }
    },
    {
        id: 12,
        name: "Prathama Gajjar",
        role: "Creative Head",
        image: "/Board/Prathama.jpeg",
        description: "Shaping the visual identity and driving creative excellence across all platforms.",
        socials: {
            linkedin: "https://www.linkedin.com/in/prathama-gajjar-523432322"
        }
    },
    {
        id: 13,
        name: "Kanak Agarwal",
        role: "Creative Head",
        image: "/Board/Kanak.jpeg",
        description: "Leading design innovation and crafting immersive user experiences.",
        socials: {
            linkedin: "https://www.linkedin.com/in/kanak-agrawal-47411333a"
        }
    },
    {
        id: 14,
        name: "Vaidehi Vora",
        role: "Creative Head",
        image: "/Board/Vaidehi.jpeg",
        description: "Managing creative workflows and ensuring brand consistency in every asset.",
        socials: {
            linkedin: "https://www.linkedin.com/in/vaidehi-vora"
        }
    },
    {
        id: 15,
        name: "Rishwa Chhaya",
        role: "Content & Editorial Head",
        image: "/Board/Rishwa Chhaya.jpeg",
        description: "Overseeing content strategy and ensuring editorial excellence across all publications.",
        socials: {
            linkedin: "https://www.linkedin.com/in/rishwa-u-chhaya-720401334"
        }
    },
    {
        id: 16,
        name: "Divy Prajapati",
        role: "Content & Editorial Head",
        image: "/Board/Divy Prajapati.jpeg",
        description: "Managing editorial workflows and delivering high-quality content for our community.",
        socials: {
            linkedin: "#",
            email: "mailto:divy@example.com"
        }
    },
    {
        id: 17,
        name: "Angel Shukla",
        role: "Student Branch Representative",
        image: "/Board/Angel Shukla.jpeg",
        description: "Representing the student branch and fostering engagement between students and the management board.",
        socials: {
            linkedin: "https://www.linkedin.com/in/angel-shukla-145213322"
        }
    },
    {
        id: 18,
        name: "Dev Shah",
        role: "Student Branch Representative",
        image: "/Board/Dev Shah.jpeg",
        description: "Facilitating communication within the student branch and supporting organizational initiatives.",
        socials: {
            linkedin: "https://www.linkedin.com/in/devshah-ds"
        }
    },
    {
        id: 19,
        name: "Lakshya Jain",
        role: "Membership & Sponsorship Head",
        image: "/Board/Lakshya Jain.jpeg",
        description: "Leading membership development and coordinating sponsorship operations for the organization.",
        socials: {
            linkedin: "https://www.linkedin.com/in/lakshya-jain-402473369"
        }
    },
    {
        id: 20,
        name: "Malhar S Ugrejeeya",
        role: "Membership & Sponsorship Head",
        image: "/Board/Malhar S Ugrejeeya.jpeg",
        description: "Driving growth through membership initiatives and optimizing sponsorship workflows.",
        socials: {
            linkedin: "https://www.linkedin.com/in/malhar-ugrejeeya-b17b00279"
        }
    }
];

const MemberCard = ({ member }) => {
    const nameParts = member.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <div className="brutalist-card group">
            <div className="brutalist-card-inner">
                {/* Image Section */}
                <div className="brutalist-img-container">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="brutalist-img"
                    />
                    <div className="brutalist-img-overlay"></div>
                </div>

                {/* Content Section */}
                <div className="brutalist-content">
                    <div className="brutalist-header">
                        <h3 className="brutalist-name">
                            <span className="first-name">{firstName}</span>
                            <span className="last-name">{lastName}</span>
                        </h3>
                        <div className="brutalist-role-container">
                            <p className="brutalist-role">{member.role}</p>
                        </div>
                    </div>

                    <div className="brutalist-desc-container">
                        <p className="brutalist-desc">{member.description}</p>
                    </div>

                    <div className="brutalist-footer">
                        <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="brutalist-social-link"
                        >
                            <Linkedin size={20} />
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ title }) => (
    <div className="brutalist-section-header">
        <h2 className="brutalist-section-title">{title}</h2>
        <div className="brutalist-section-line"></div>
    </div>
);

const BoardMembers = () => {
    const administrativeBoard = boardMembers.slice(0, 2);
    const secretaries = boardMembers.slice(2, 4);
    const coreCommittee = boardMembers.slice(4, 6);
    const technicalHeads = boardMembers.slice(6, 9);
    const socialMediaHeads = boardMembers.slice(9, 11);
    const creativeHeads = boardMembers.slice(11, 14);
    const editorialHeads = boardMembers.slice(14, 16);
    const studentReps = boardMembers.slice(16, 18);
    const membershipSponsorship = boardMembers.slice(18);

    return (
        <div className="brutalist-page">
            <style>{`
                .brutalist-page {
                    min-height: 100vh;
                    background-color: #000;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                }

                .brutalist-container {
                    padding: clamp(6rem, 8rem, 8rem) 4vw 0 4vw;
                    position: relative;
                    z-index: 10;
                }

                .brutalist-hero {
                    width: 100%;
                    margin: 0 0 8rem 0;
                    text-align: left;
                }

                .brutalist-hero-tag {
                    color: #5eb8ff;
                    font-size: clamp(0.7rem, 1vw, 1vw);
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.4em;
                    margin-bottom: 1.5rem;
                    display: block;
                    white-space: nowrap;
                }

                .brutalist-hero-title {
                    font-size: clamp(3rem, 8vw, 8rem);
                    font-weight: 950;
                    line-height: 0.9;
                    text-transform: uppercase;
                    letter-spacing: -0.04em;
                    margin-bottom: 2.5rem;
                }

                .brutalist-hero-title span.outline {
                    color: #5eb8ff;
                }

                .brutalist-hero-title span.stagger {
                    display: block;
                    margin-left: 10vw;
                }

                @media (min-width: 768px) {
                    .brutalist-hero-title span.stagger {
                        margin-left: 9vw;
                    }
                }

                .brutalist-hero-desc {
                    font-size: clamp(1rem, 1.5vw, 1.5rem);
                    color: #aaa;
                    max-width: 650px;
                    font-weight: 600;
                    line-height: 1.4;
                    text-transform: uppercase;
                }

                .brutalist-section-header {
                    max-width: 1200px;
                    margin: 0 auto 4rem auto;
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .brutalist-section-title {
                    font-size: clamp(1.2rem, 2vw, 2vw);
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #5eb8ff;
                    white-space: nowrap;
                }

                .brutalist-section-line {
                    height: 2px;
                    flex-grow: 1;
                    background: #222;
                }

                .brutalist-grid {
                    max-width: 1200px;
                    margin: 0 auto 6rem auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 3rem;
                    justify-content: center;
                    justify-items: center;
                }

                .brutalist-card {
                    position: relative;
                    background: #000;
                    border: 2px solid #fff;
                    box-shadow: 10px 10px 0px #5eb8ff;
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    width: 100%;
                    max-width: 400px;
                }

                .brutalist-card:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 14px 14px 0px #5eb8ff;
                    border-color: #5eb8ff;
                }

                .brutalist-card-inner {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .brutalist-img-container {
                    position: relative;
                    height: 400px;
                    overflow: hidden;
                    border-bottom: 2px solid #222;
                    background: #111;
                }

                .brutalist-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: grayscale(100%) contrast(1.1);
                    transition: all 0.4s ease;
                }

                .brutalist-card:hover .brutalist-img {
                    filter: grayscale(0%) contrast(1);
                    scale: 1.05;
                }

                .brutalist-content {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .brutalist-name {
                    font-size: 2rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    line-height: 1.1;
                    margin-bottom: 0.5rem;
                    display: flex;
                    flex-direction: column;
                }

                .brutalist-name .first-name {
                    color: #fff;
                }

                .brutalist-name .last-name {
                    color: #5eb8ff;
                }

                .brutalist-role-container {
                    height: 2.4rem; /* Standardizing for 2 lines */
                    display: flex;
                    align-items: flex-start;
                    overflow: hidden;
                }

                .brutalist-role {
                    font-size: 0.8rem;
                    font-weight: 800;
                    color: #5eb8ff;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    line-height: 1.2;
                }

                .brutalist-desc-container {
                    height: 4.5rem; /* Standardizing for 3 lines */
                    overflow: hidden;
                }

                .brutalist-desc {
                    font-size: 0.95rem;
                    color: #aaa;
                    font-weight: 600;
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .brutalist-footer {
                    margin-top: auto;
                }

                .brutalist-social-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 0.8rem 1.2rem;
                    background: #111;
                    border: 2px solid #fff;
                    box-shadow: 4px 4px 0px #5eb8ff;
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 700;
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .brutalist-social-link:hover {
                    transform: translate(-3px, -3px);
                    box-shadow: 8px 8px 0px #5eb8ff;
                    border-color: #5eb8ff;
                }

                .brutalist-social-link svg {
                    color: #5eb8ff;
                }

                @media (max-width: 768px) {
                    .brutalist-container {
                        padding: 8rem 4vw 2rem 4vw;
                    }

                    .brutalist-grid {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                    }

                    .brutalist-hero {
                        margin-bottom: 3.5rem;
                    }

                    .brutalist-hero-title span.stagger {
                        margin-left: 10vw;
                    }

                    .brutalist-img-container {
                        height: 350px;
                    }

                    .brutalist-card {
                        margin: 0 auto;
                    }
                }
            `}</style>

            {/* Background */}
            <div className="fixed inset-0 z-0">
                <Squares
                    direction="diagonal"
                    speed={0.15}
                    borderColor="#333"
                    squareSize={50}
                    hoverFillColor="#222"
                />
            </div>

            <div className="brutalist-container relative z-10">
                <div className="brutalist-hero">
                    <span className="brutalist-hero-tag">/// MANAGEMENT BOARD</span>
                    <h1 className="brutalist-hero-title">
                        The <span className="outline">Board</span> <br />
                        <span className="stagger">Members</span>
                    </h1>
                    <p className="brutalist-hero-desc">
                        Visionary leaders driving Code-Blue forward with expertise, dedication, and a passion for technology.
                    </p>
                </div>

                <SectionHeader title="The Chairs" />
                <div className="brutalist-grid">
                    {administrativeBoard.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Secretaries" />
                <div className="brutalist-grid">
                    {secretaries.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Treasurers" />
                <div className="brutalist-grid">
                    {coreCommittee.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Technical" />
                <div className="brutalist-grid">
                    {technicalHeads.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Social Media" />
                <div className="brutalist-grid">
                    {socialMediaHeads.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Creative" />
                <div className="brutalist-grid">
                    {creativeHeads.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Editorial" />
                <div className="brutalist-grid">
                    {editorialHeads.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="SB Representatives" />
                <div className="brutalist-grid">
                    {studentReps.map(member => <MemberCard key={member.id} member={member} />)}
                </div>

                <SectionHeader title="Growth" />
                <div className="brutalist-grid">
                    {membershipSponsorship.map(member => <MemberCard key={member.id} member={member} />)}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BoardMembers;
