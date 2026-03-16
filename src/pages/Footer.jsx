import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-info">
                    <h2 className="footer-logo">
                        IEEE <span>SBNU</span>
                    </h2>
                    <p className="footer-tagline">
                        ADVANCING TECHNOLOGY FOR HUMANITY.
                        EMPOWERING INNOVATORS, BUILDING THE FUTURE.
                    </p>


                    <div className="footer-socials">
                        <a href="https://www.linkedin.com/company/ieee-student-branch-nirma-university" className="footer-social-item" target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LINKEDIN
                        </a>
                        <a
                            href="mailto:ieee@nirmauni.ac.in"
                            className="footer-social-item"
                            onClick={(e) => {
                                window.location.href = "mailto:ieee@nirmauni.ac.in";
                                e.preventDefault();
                            }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            MAIL
                        </a>
                    </div>
                </div>

                <div className="footer-nav-card">
                    <div className="footer-nav-grid">
                        <div className="footer-nav-group">
                            <h3 className="footer-group-label">NAVIGATION</h3>
                            <ul className="footer-nav-list">
                                <li><Link to="/">HOME</Link></li>
                                <li><Link to="/about">ABOUT</Link></li>
                                <li><Link to="/join-us">JOIN US</Link></li>

                                <li><Link to="/board-members">BOARD MEMBERS</Link></li>
                                <li><Link to="/gallery">GALLERY</Link></li>
                                <li><Link to="/contact">CONTACT</Link></li>
                            </ul>
                        </div>

                        <div className="footer-nav-group">
                            <h3 className="footer-group-label">LOCATION</h3>
                            <p className="footer-location-text">
                                NIRMA UNIVERSITY,<br />
                                AHMEDABAD, GUJARAT,<br />
                                INDIA - 382481
                            </p>
                        </div>
                    </div>

                    <div className="footer-bottom-bar">
                        <p className="footer-copy">&copy; {currentYear} IEEE SBNU. ALL RIGHTS RESERVED.</p>
                        <div className="footer-credit">
                            MADE WITH PASSION BY <Link to="/code-blue" className="footer-codeblue-link">TEAM CODE BLUE</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
