import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpoListStyle from "./ExpoList.module.css"; // Renamed for clarity

export const ExpoList = () => {
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🎯 Fetch Expos from Backend
  useEffect(() => {
    const fetchExpos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events/event-fetch");
        setExpos(response.data); // Set data from backend
      } catch (error) {
        setError("Failed to fetch expos. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpos();
  }, []);

  return (
    <div className={ExpoListStyle.expoListContainer}>
      <h1 className={ExpoListStyle.title}>🌟 Upcoming Expos in Pakistan 🌟</h1>

      {/* Display Loading & Error Messages */}
      {loading ? (
        <p>Loading expos...</p>
      ) : error ? (
        <p className={ExpoListStyle.error}>{error}</p>
      ) : (
        <div className={ExpoListStyle.expoGrid}>
          {expos.length > 0 ? (
            expos.map((expo) => (
              <div key={expo._id} className={ExpoListStyle.expoItem}>
                <h2>{expo.name}</h2>
                <p><strong>📅 Date:</strong> {expo.date}</p>
                <p><strong>📍 Location:</strong> {expo.location}</p>
              </div>
            ))
          ) : (
            <p>No expos available.</p>
          )}
        </div>
      )}
    </div>
  );
};