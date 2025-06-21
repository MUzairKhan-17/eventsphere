import React, { useState, useEffect } from "react";
import axios from "axios";
import dashboardStyles from "./ExhibitorDashboard.module.css"; // Importing CSS module

export const ExhibitorDashboard = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // 🎯 Fetch Expos from Backend
  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events/event-fetch"); // Fetch expos from API
        const currentDate = new Date().getTime();

        // Filter only upcoming expos and sort them by date
        const upcomingExpos = response.data
          .filter((expo) => new Date(expo.date).getTime() > currentDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3); // Get only the next 3 upcoming expos

        setExpos(upcomingExpos);
        if (upcomingExpos.length > 0) {
          setTimeLeft(calculateTimeLeft(new Date(upcomingExpos[0].date).getTime()));
        }
      } catch (error) {
        setError("❌ Failed to fetch expos. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpos();
  }, []);

  // ⏳ Calculate Countdown Timer for the Next Event
  function calculateTimeLeft(targetDate) {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  // ⏳ Update Countdown Every Second
  useEffect(() => {
    if (expos.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(new Date(expos[0].date).getTime()));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expos]);

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <h1 className={dashboardStyles.fadeIn}>🎪 Exhibitor Dashboard</h1>

      <div className={`${dashboardStyles.card} ${dashboardStyles.slideIn}`}>
        <h2>📍 Upcoming Expos</h2>

        {loading ? (
          <p>⏳ Loading expos...</p>
        ) : error ? (
          <p className={dashboardStyles.error}>{error}</p>
        ) : expos.length === 0 ? (
          <p>😔 No upcoming expos available.</p>
        ) : (
          <>
            {/* ⏳ Countdown for the Next Event */}
            <h3>⏰ Next Event Countdown:</h3>
            <div className={dashboardStyles.countdown}>
              <span>🗓️ {timeLeft?.days}d</span>
              <span>⏰ {timeLeft?.hours}h</span>
              <span>⏳ {timeLeft?.minutes}m</span>
              <span>⏲️ {timeLeft?.seconds}s</span>
            </div>

            {/* 📋 Upcoming Events List */}
            <ul className={dashboardStyles.expoList}>
              {expos.map((expo) => (
                <li key={expo._id} className={`${dashboardStyles.expoItem} ${dashboardStyles.fadeIn}`}>
                  <h2>🎟️ {expo.name}</h2>
                  <p><strong>📅 Date:</strong> {expo.date}</p>
                  <p><strong>📍 Location:</strong> {expo.location}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};