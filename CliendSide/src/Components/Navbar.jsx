import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import navbarstylecss from "./Navbar.module.css";
import logo from "/logo.jpg";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const currentPath = location.pathname;

  // 🚀 Scroll-based hide/show logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false); // scroll down → hide
      } else {
        setShowNavbar(true); // scroll up → show
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`${navbarstylecss.navbar} ${showNavbar ? navbarstylecss.show : navbarstylecss.hide}`}>
      <div className={navbarstylecss.logoContainer}>
        <img src={logo} alt="EventSphere Logo" className={navbarstylecss.logoImage} />
        <Link to="/" className={navbarstylecss.logoText}>EventSphere</Link>
      </div>

      <div
        className={`${navbarstylecss.hamburger} ${isOpen ? navbarstylecss.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={navbarstylecss.bar}></div>
        <div className={navbarstylecss.bar}></div>
        <div className={navbarstylecss.bar}></div>
      </div>

      <ul className={`${navbarstylecss.navLinks} ${isOpen ? navbarstylecss.active : ""}`}>
        {[
          ["Home", "/"],
          ["Expos", "/expos"],
          ["Exhibitor", "/exhibitor-dashboard"],
          ["Attendee", "/attendee"],
          ["Contact", "/contact"],
          ["Sign Up", "/signup"],
          ["Login", "/login"],
          ["Profile", "/profile"]
        ].map(([label, path]) => (
          <li key={label}>
            <Link
              to={path}
              onClick={() => setIsOpen(false)}
              className={`${navbarstylecss.navLink} ${currentPath === path ? navbarstylecss.activeLink : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
