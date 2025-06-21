import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Attendeecss from "./Attendee.module.css";

export const Attendee = () => {
  const [attendeeInfo, setAttendeeInfo] = useState({
    name: "Uzair Khan",
    registeredExpos: [
      { name: "Tech Expo 2025", date: "2025-09-10", location: "Karachi" },
      { name: "Health & Wellness Expo", date: "2025-10-21", location: "Islamabad" }
    ],
    bookmarkedSessions: ["AI & The Future", "Wellness Trends 2025"],
  });

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add(Attendeecss.fadeIn);
    }
  }, []);

  return (
    <div ref={containerRef} className={Attendeecss.attendeeContainer}>
      <h1 className={Attendeecss.title}>🎟️ Attendee Dashboard</h1>

      <div className={Attendeecss.card}>
        <h2 className={Attendeecss.welcomeText}>
          Welcome, I'm {attendeeInfo.name}! 👋
        </h2>

        <h3>📅 Registered Expos:</h3>
        <ul className={Attendeecss.list}>
          {attendeeInfo.registeredExpos.map((expo, index) => (
            <li key={index} className={Attendeecss.listItem}>
              <strong>{expo.name}</strong><br />
              📅 {expo.date} | 📍 {expo.location}
            </li>
          ))}
        </ul>

        <h3>🔖 Bookmarked Sessions:</h3>
        <ul className={Attendeecss.list}>
          {attendeeInfo.bookmarkedSessions.map((session, index) => (
            <li key={index} className={Attendeecss.listItem}>
              {session}
            </li>
          ))}
        </ul>

        <div className={Attendeecss.registerSection}>
          <p>Not registered yet?</p>
          <Link to="/register-attendee" className={Attendeecss.registerLink}>
            📝 Register as an Attendee
          </Link>
        </div>
      </div>
    </div>
  );
};