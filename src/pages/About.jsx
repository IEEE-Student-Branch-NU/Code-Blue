import React from 'react'
import ProfileCard from '../components/ProfileCard'
import CircularGallery from '../components/CircularGallery'

const alumniImages = [
    { image: '/Alumini/alay.jpg', text: 'Alay' },
    { image: '/Alumini/chinmay.jpg', text: 'Chinmay' },
    { image: '/Alumini/jaival.png', text: 'Jaival' },
    { image: '/Alumini/kajal.jpg', text: 'Kajal' },
    { image: '/Alumini/khushi-patel.jpg', text: 'Khushi Patel' },
    { image: '/Alumini/khushi-shah.jpg', text: 'Khushi Shah' },
    { image: '/Alumini/lakshin.jpg', text: 'Lakshin' },
    { image: '/Alumini/tanisha.jpg', text: 'Tanisha' },
    { image: '/Alumini/vartika.jpg', text: 'Vartika' },
    { image: '/Alumini/vrushank.jpg', text: 'Vrushank' },
];

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* About IEEE SBNU Section */}
                <div className="mb-20 text-center lg:text-left">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-6">
                        About IEEE SBNU
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            The IEEE Student Branch at Nirma University (SBNU) is a vibrant community of innovators, engineers, and tech enthusiasts. We are dedicated to fostering technical excellence and professional growth among our members.
                        </p>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            Through workshops, hackathons, and guest lectures, we bridge the gap between academia and industry, providing students with the skills and opportunities they need to excel in the ever-evolving world of technology.
                        </p>
                    </div>
                </div>

                {/* Faculty Advisor Section */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-16">
                    <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-start">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white mb-10 text-center lg:text-left w-full leading-tight">
                            Meet Our <br className="hidden lg:block" /> Faculty Advisor
                        </h2>
                        <div className="flex justify-center lg:justify-start w-full">
                            <ProfileCard
                                name="Manisha Shah"
                                title="Assistant Professor"
                                handle="manishashah"
                                status="Faculty Advisor"
                                contactText="LinkedIn"
                                avatarUrl="/manisha-shah-card.png"
                                miniAvatarUrl="/manisha-shah.png"
                                showUserInfo
                                enableTilt={true}
                                enableMobileTilt={true}
                                onContactClick={() => window.open('https://www.linkedin.com/in/manisha-shah-22b94617/', '_blank')}
                                behindGlowEnabled={false}
                                innerGradient="transparent"
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-[60%] flex flex-col items-center lg:items-start text-center lg:text-left pt-8 lg:pt-32">
                        <h3 className="text-2xl md:text-3xl font-semibold text-blue-400 mb-6">Manisha Shah</h3>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-6">
                            Dr. Manisha Shah is working as an assistant professor at the department of electrical engineering, institute of technology, Nirma University. Dr. Shah has published many research papers in international / national journals and conferences.
                        </p>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-6">
                            Her areas of interest are power electronics converters, power supplies, multi-level converters, power quality improved devices and renewable source integration to grid. She is a senior member of IEEE, USA, and a life member of ISTE.
                        </p>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                            She is also serving as Ex-Com member of IEEE Gujarat section from last three years.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Alumni Section */}
            <div className="mt-32 mb-20 w-full">
                <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 text-center">
                        Our Alumni
                    </h2>
                </div>
                <div className="h-[500px] w-full relative">
                    <CircularGallery items={alumniImages} bend={0} borderRadius={0.05} />
                </div>
            </div>
        </div>
    )
}

export default About
