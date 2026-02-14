import React from 'react';
import { motion } from 'framer-motion';
import SubChapterBackgrounds from './SubChapterBackgrounds';
import './SubChapterCard.css';

const SubChapterCard = ({ title, logo, content, variant }) => {

    // Simple brutalist entry — slide up and fade in
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                staggerChildren: 0.1,
                delayChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    };

    return (
        <motion.div
            className="sub-chapter-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            {/* Subtle Background Effect */}
            <SubChapterBackgrounds variant={variant} />

            {/* Content */}
            <motion.div className="sc-logo-container" variants={itemVariants}>
                <img
                    src={logo}
                    alt={`${title} Logo`}
                    className="sc-logo"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span style="color: #5eb8ff; font-weight: 900;">LOGO</span>';
                    }}
                />
            </motion.div>

            <motion.h2 className="sc-title" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }} variants={itemVariants}>
                {title}
            </motion.h2>

            <motion.p className="sc-content" variants={itemVariants}>
                {content}
            </motion.p>
        </motion.div>
    );
};

export default SubChapterCard;
