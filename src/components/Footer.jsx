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
                            MADE WITH PASSION BY TEAM CODE BLUE
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
