import React, { useState, useEffect } from "react";
import axios from "axios";
import Eventfetchcss from "./EventFetch.module.css"; // Importing CSS Module

export const EventFetch = () => {
  const [events, setEvents] = useState([]); // State for storing fetched events
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  // 🎯 Fetch Events from Backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events/event-fetch");
        setEvents(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.error : "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []); 
   // Runs only once when the component mounts

  // 🔍 Search Function
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

// 🔍 Filtering Events Based on Search Query
const filteredEvents = events.filter((event) => {
  return (
    event._id?.toString().includes(searchQuery) ||
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );
});

  // 📄 Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={Eventfetchcss.eventContainer}>
      <h2 className={Eventfetchcss.h2}>🚀 Upcoming Events in Pakistan 🇵🇰</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search by ID, Name, Date, or Location..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={Eventfetchcss.searchInput}
      />

      {/* 📋 Events Table */}
      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className={Eventfetchcss.error}>{error}</p>
      ) : (
        <div className={Eventfetchcss.tableContainer}>
          <table className={Eventfetchcss.eventTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => (
                  <tr key={event._id}>
                    <td>{event._id}</td>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>{event.location}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No events found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔄 Pagination */}
      <div className={Eventfetchcss.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};
