import React from "react";
import footercss from "./Footer.module.css";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className={footercss.footer}>
      <div className={footercss.container}>
        
        {/* 🏢 Company Branding */}
        <div className={footercss.brand}>
          <h2>EventSphere</h2>
          <p>Manage & Monitor with Ease</p>
        </div>

        {/* 📌 Quick Navigation Links */}
        <div className={footercss.links}>
          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/user-fetch">Users</Link></li>
            <li><Link to="/user-fetch">Settings</Link></li>
            <li><Link to="/user-fetch">Support</Link></li>
          </ul>
        </div>

        {/* 📞 Support & Admin Contact */}
        <div className={footercss.contact}>
          <p>Support: <a href="mailto:support@eventsphere.com">support@eventsphere.com</a></p>
          <p>&copy; {new Date().getFullYear()} EventSphere. All Rights Reserved.</p>
        </div>
        
      </div>
    </footer>
  );
};
