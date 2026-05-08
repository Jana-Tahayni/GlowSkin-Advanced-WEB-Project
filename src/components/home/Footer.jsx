import React from 'react';
import './footer.css';

const Footer = ({ setPage }) => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        
        <div className="footer-brand">
          <h2 className="footer-logo">GlowSkin</h2>
          <p>
            An AI-powered platform for skin analysis and personalized 
            skincare routines, reviewed by professional dermatologists.
          </p>
        </div>

        <div className="footer-links">
          <h3>Services</h3>
          <ul>
            <li onClick={() => setPage("analysis")}>AI Skin Analysis </li>
            <li onClick={() => setPage("products")}>Product Analyzer </li>
            <li onClick={() => setPage("pricing")}>Pricing & Plans </li>
            <li onClick={() => {setPage("home"); setTimeout(() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100); 
                }}>
                FAQ
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@glowskin.com</p>
          <div className="social-icons">
            <a href="https://www.facebook.com/share/g/189W5zusN4/" target="_blank" rel="noreferrer" className="social-link">
                Facebook
            </a>
            <a href="https://www.facebook.com/share/g/189W5zusN4/" target="_blank" rel="noreferrer" className="social-link">
                Twitter
            </a>
            <a href="https://www.facebook.com/share/g/189W5zusN4/" target="_blank" rel="noreferrer" className="social-link">
                Instagram
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 GlowSkin - Advanced Web Development Project </p>
      </div>
    </footer>
  );
};

export default Footer;