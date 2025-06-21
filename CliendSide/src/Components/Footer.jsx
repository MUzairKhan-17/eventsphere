import React from "react";
import loginstylecss from "./Footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className={loginstylecss.footer}>
      <div className={loginstylecss.container}>
        {/* Left Section - Company Info */}
        <div className={loginstylecss.companyInfo}>
          <h2>EventSphere</h2>
          <p>Bringing expos to life with seamless organization and connectivity.</p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className={loginstylecss.quickLinks}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/expos">Expos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/attendee">Attendee Dashboard</Link></li>
            <li><Link to="/exhibitor-dashboard">Exhibitor Dashboard</Link></li>
          </ul>
        </div>

        {/* Right Section - Social Media */}
        <div className={loginstylecss.socialMedia}>
          <h3>Follow Us</h3>
          <div className={loginstylecss.icons}>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={loginstylecss.bottomBar}>
        <p>&copy; {new Date().getFullYear()} EventSphere. All Rights Reserved.</p>
      </div>
    </footer>
  );
};