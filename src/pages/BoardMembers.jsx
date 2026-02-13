import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import LiquidEther from '../components/Backgrounds/LiquidEther/LiquidEther';

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
        id: 15,
        name: "Vraj Talati",
        role: "Technical Head",
        image: "/Board/Vraj Talati.jpeg",
        description: "Leading the technical strategy and overseeing the development of core infrastructure.",
        socials: {
            linkedin: "https://www.linkedin.com/in/vrajtalati"
        }
    },
    {
        id: 16,
        name: "Rudra Patel",
        role: "Technical Head",
        image: "/Board/Rudra Patel.jpeg",
        description: "Driving architectural decisions and ensuring technical excellence across projects.",
        socials: {
            linkedin: "https://www.linkedin.com/in/rudra-patel-045b20335"
        }
    },
    {
        id: 17,
        name: "Dharm Mankad",
        role: "Technical Head",
        image: "/Board/Dharm Mankad.jpeg",
        description: "Managing technical teams and implementing scalable technology solutions.",
        socials: {
            linkedin: "https://www.linkedin.com/in/dharmmankad"
        }
    },
    {
        id: 18,
        name: "Kashvi Patel",
        role: "Social Media Head",
        image: "/Board/Kashvi Patel.jpeg",
        description: "Leading social media strategy and enhancing the organization's digital presence.",
        socials: {
            linkedin: "https://www.linkedin.com/in/kashvi-patel-74b58b339"
        }
    },
    {
        id: 19,
        name: "Anany Kelotra",
        role: "Social Media Head",
        image: "/Board/Anany Kelotra.jpeg",
        description: "Coordinating social media campaigns and engaging with our global community.",
        socials: {
            linkedin: "https://www.linkedin.com/in/anany-kelotra-49ab6a237"
        }
    },
    {
        id: 20,
        name: "Prathama Gajjar",
        role: "Creative Head",
        image: "/Board/Prathama.jpeg",
        description: "Shaping the visual identity and driving creative excellence across all platforms.",
        socials: {
            linkedin: "https://www.linkedin.com/in/prathama-gajjar-523432322"
        }
    },
    {
        id: 21,
        name: "Kanak Agarwal",
        role: "Creative Head",
        image: "/Board/Kanak.jpeg",
        description: "Leading design innovation and crafting immersive user experiences.",
        socials: {
            linkedin: "https://www.linkedin.com/in/kanak-agrawal-47411333a"
        }
    },
    {
        id: 22,
        name: "Vaidehi Vora",
        role: "Creative Head",
        image: "/Board/Vaidehi.jpeg",
        description: "Managing creative workflows and ensuring brand consistency in every asset.",
        socials: {
            linkedin: "https://www.linkedin.com/in/vaidehi-vora"
        }
    },
    {
        id: 23,
        name: "Rishwa Chhaya",
        role: "Content & Editorial Head",
        image: "/Board/Rishwa Chhaya.jpeg",
        description: "Overseeing content strategy and ensuring editorial excellence across all publications.",
        socials: {
            linkedin: "https://www.linkedin.com/in/rishwa-u-chhaya-720401334"
        }
    },
    {
        id: 24,
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
        id: 25,
        name: "Angel Shukla",
        role: "Student Branch Representative",
        image: "/Board/Angel Shukla.jpeg",
        description: "Representing the student branch and fostering engagement between students and the management board.",
        socials: {
            linkedin: "https://www.linkedin.com/in/angel-shukla-145213322"
        }
    },
    {
        id: 26,
        name: "Dev Shah",
        role: "Student Branch Representative",
        image: "/Board/Dev Shah.jpeg",
        description: "Facilitating communication within the student branch and supporting organizational initiatives.",
        socials: {
            linkedin: "https://www.linkedin.com/in/devshah-ds"
        }
    },
    {
        id: 27,
        name: "Lakshya Jain",
        role: "Membership & Sponsorship Head",
        image: "/Board/Lakshya Jain.jpeg",
        description: "Leading membership development and coordinating sponsorship operations for the organization.",
        socials: {
            linkedin: "https://www.linkedin.com/in/lakshya-jain-402473369"
        }
    },
    {
        id: 28,
        name: "Malhar S Ugrejeeya",
        role: "Membership & Sponsorship Head",
        image: "/Board/Malhar S Ugrejeeya.jpeg",
        description: "Driving growth through membership initiatives and optimizing sponsorship workflows.",
        socials: {
            linkedin: "https://www.linkedin.com/in/malhar-ugrejeeya-b17b00279"
        }
    }
];

const MemberCard = ({ member, index, isLarge = false }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Reduced 3D Tilt values for smoother interaction
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [25, -25]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), { stiffness: 300, damping: 30 });

    function onMouseMove(event) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
        const spotlightX = event.clientX - rect.left;
        const spotlightY = event.clientY - rect.top;
        cardRef.current.style.setProperty("--x", `${spotlightX}px`);
        cardRef.current.style.setProperty("--y", `${spotlightY}px`);
    }

    return (
        <div style={{ perspective: "1500px" }}>
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={onMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    mouseX.set(0);
                    mouseY.set(0);
                }}
                className="group relative bg-white/5 backdrop-blur-xl rounded-md p-[1.5px] overflow-hidden border-[1.5px] border-white/10 transition-all duration-500 hover:border-[#7ebbce]/50 shadow-[0_0_20px_rgba(126,187,206,0.15)] hover:shadow-[0_0_40px_rgba(126,187,206,0.4)]"
            >
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(600px circle at var(--x) var(--y), rgba(126, 187, 206, 0.15), transparent 40%)`
                    }}
                />

                <div className="relative bg-[#050a28]/80 backdrop-blur-xl rounded-[4px] p-8 h-full flex flex-col items-center text-center z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-[#7ebbce]/10 rounded-full blur-3xl group-hover:bg-[#7ebbce]/20 transition-colors duration-500" />

                    <div className="relative mb-6" style={{ transform: "translateZ(50px)" }}>
                        <div className={`relative ${isLarge ? "w-48 h-48" : "w-32 h-32"} rounded-sm overflow-hidden p-[2px] bg-gradient-to-br from-[#7ebbce] via-white/50 to-[#7ebbce] group-hover:scale-105 transition-transform duration-500 shadow-2xl`}>
                            <div className="absolute inset-0 bg-[#050a28] rounded-sm" />
                            <img
                                src={member.image}
                                alt={member.name}
                                className="relative w-full h-full rounded-sm object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 mb-6" style={{ transform: "translateZ(40px)" }}>
                        <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#7ebbce] transition-colors duration-300">
                            {member.name}
                        </h3>
                        <p className="text-[#7ebbce] font-medium text-xs uppercase tracking-[0.2em]">
                            {member.role}
                        </p>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3" style={{ transform: "translateZ(30px)" }}>
                        {member.description}
                    </p>

                    <div className="flex items-center gap-4 mt-auto" style={{ transform: "translateZ(60px)" }}>
                        <a href={member.socials.linkedin} className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-gray-400 hover:text-[#7ebbce] hover:border-[#7ebbce]/50 hover:bg-[#7ebbce]/10 transition-all duration-300">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

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
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-[#020617] text-white relative overflow-hidden font-inter">
            {/* Liquid Ether Background */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <LiquidEther
                    colors={['#7ebbce', '#ffffff', '#e2f1f5']}
                    autoIntensity={1.5}
                    mouseForce={15}
                    resolution={0.4}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto text-center mb-16 relative z-10"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-block py-1 px-3 rounded-full bg-[#7ebbce]/10 border border-[#7ebbce]/20 text-[#7ebbce] text-xs font-bold tracking-widest uppercase mb-6"
                >
                    Management Board
                </motion.span>
                <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                    The <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-[#7ebbce]">Board</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                    Visionary leaders driving Code-Blue forward with expertise, dedication, and a passion for technology.
                </p>
            </motion.div>

            {/* 1. Administrative Board */}
            <div className="max-w-5xl mx-auto mb-20 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {administrativeBoard.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 2. Secretaries */}
            <div className="max-w-5xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/30 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-80 px-4">Secretaries</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/30 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {secretaries.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 2} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 3. Treasurers */}
            <div className="max-w-5xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4">Treasurers</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {coreCommittee.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 4} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 4. Technical Heads */}
            <div className="max-w-7xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4">Technical Heads</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {technicalHeads.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 6} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 5. Social Media Heads */}
            <div className="max-w-5xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4">Social Media Heads</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {socialMediaHeads.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 9} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 6. Creative Heads */}
            <div className="max-w-7xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4">Creative Heads</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {creativeHeads.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 11} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 7. Content & Editorial Heads */}
            <div className="max-w-5xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4">Content & Editorial Heads</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {editorialHeads.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 14} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 8. Student Branch Representatives */}
            <div className="max-w-5xl mx-auto mb-24 relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4">Student Branch Representatives</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {studentReps.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 16} isLarge={true} />
                    ))}
                </div>
            </div>

            {/* 9. Membership Development and Sponsorship Operation */}
            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                    <span className="text-xs font-bold text-[#7ebbce] uppercase tracking-[0.4em] opacity-50 px-4 text-center">Membership Development and Sponsorship Operation</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-transparent via-[#7ebbce]/10 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:px-20">
                    {membershipSponsorship.map((member, index) => (
                        <MemberCard key={member.id} member={member} index={index + 18} isLarge={true} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BoardMembers;
