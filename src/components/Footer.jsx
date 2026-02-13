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
                        SOPHISTICATED GLASSMORPHISM & BOLD BRUTALISM.
                        ENGINEERING THE FUTURE OF DIGITAL IDENTITY.
                    </p>

                    <div className="footer-socials">
                        <a href="https://linkedin.com" className="footer-social-item" target="_blank" rel="noopener noreferrer">
                            LINKEDIN
                        </a>
                        <a href="mailto:ieeesbnu.contact@gmail.com" className="footer-social-item">
                            GMAIL
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
                        <div className="footer-legal-links">
                            <Link to="/privacy">PRIVACY</Link>
                            <Link to="/terms">TERMS</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
