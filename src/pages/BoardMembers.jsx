import React from 'react';
import { motion } from 'framer-motion';

const boardMembers = [
    {
        id: 1,
        name: "Dr. John Doe",
        role: "President",
        image: "https://via.placeholder.com/300x400?text=John+Doe",
        description: "Expert in Computer Science and Engineering with 15+ years of experience."
    },
    {
        id: 2,
        name: "Jane Smith",
        role: "Vice President",
        image: "https://via.placeholder.com/300x400?text=Jane+Smith",
        description: "Passionate about innovation and leadership in technology."
    },
    {
        id: 3,
        name: "Michael Brown",
        role: "Secretary",
        image: "https://via.placeholder.com/300x400?text=Michael+Brown",
        description: "Specializes in organizational management and strategic planning."
    },
    {
        id: 4,
        name: "Sarah Johnson",
        role: "Treasurer",
        image: "https://via.placeholder.com/300x400?text=Sarah+Johnson",
        description: "Financial expert with a focus on sustainable growth and budgeting."
    }
];

const BoardMembers = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-black text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
                    Our Board Members
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                    Meet the visionary leaders driving Code-Blue forward with expertise and dedication.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {boardMembers.map((member, index) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="bg-gray-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                    >
                        <div className="aspect-[3/4] overflow-hidden">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                            <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {member.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default BoardMembers;
