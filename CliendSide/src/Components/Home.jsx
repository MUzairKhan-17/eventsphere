import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaUsers, FaBuilding, FaEnvelope } from "react-icons/fa";
import Homecss from "./Home.module.css"; // Your existing theme
import { Typewriter } from "react-simple-typewriter";

export const Home = () => {
  const [expos, setExpos] = useState([]);

  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events/event-fetch");
        setExpos(res.data.slice(0, 3)); // Show only top 3
      } catch (err) {
        console.error("Failed to load expos", err);
      }
    };
    fetchExpos();
  }, []);

  return (
    <div className={Homecss.homeContainer}>
      {/* Hero */}
      <header className={`${Homecss.hero} ${Homecss.fadeIn}`}>
        
        <h1 className={Homecss.typewriterText}>
            🎉{" "}
          <Typewriter
            words={['Welcome to EventSphere', 'Uzair Arif', 'World of Expos']}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={10}
            deleteSpeed={4}
            delaySpeed={3000}
          />
        </h1>

        <p>✨ Experience seamless event management for organizers, exhibitors, and attendees.</p>
        <Link to="/expos" className={Homecss.ctaButton}>🌐 Explore Expos</Link>
      </header>

      {/* About */}
      <section className={`${Homecss.about} ${Homecss.fadeInUp}`}>
        <h2>ℹ️ About EventSphere</h2>
        <p>🧠 EventSphere is a powerful event management platform that streamlines the process for organizers, exhibitors, and attendees.</p>
      </section>

      {/* Features */}
      <section className={`${Homecss.features} ${Homecss.fadeInUp}`}>
        <div className={Homecss.featureCard}>
          <FaCalendarAlt className={Homecss.icon} />
          <h3>📅 Manage Events</h3>
          <p>Organize and oversee expos with ease.</p>
        </div>
        <div className={Homecss.featureCard}>
          <FaUsers className={Homecss.icon} />
          <h3>🤝 Engage Attendees</h3>
          <p>Connect with attendees and exhibitors effortlessly.</p>
        </div>
        <div className={Homecss.featureCard}>
          <FaBuilding className={Homecss.icon} />
          <h3>🏢 Exhibitor Support</h3>
          <p>Showcase your brand and manage booth spaces.</p>
        </div>
      </section>

      {/* 🌟 Featured Expos Section */}
      <section className={Homecss.featuredExpos}>
        <h2>🌟 Featured Expos</h2>
        <div className={Homecss.expoPreviewGrid}>
          {expos.map((expo) => (
            <div key={expo._id} className={Homecss.expoPreviewCard}>
              <h3>{expo.name}</h3>
              <p><strong>📅 Date:</strong> {expo.date}</p>
              <p><strong>📍 Location:</strong> {expo.location}</p>
            </div>
          ))}
        </div>
        <Link to="/expos" className={Homecss.viewAllLink}>🔍 View All Expos</Link>
      </section>

      {/* Contact */}
      <section className={`${Homecss.contact} ${Homecss.fadeInUp}`}>
        <h2>📬 Contact Us</h2>
        <p>❓ Have questions? Reach out to us for more details.</p>
        <Link to="/contact" className={Homecss.contactButton}><FaEnvelope /> Contact Us</Link>
      </section>
    </div>
  );
};