import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ SweetAlert2 import
import EventDeletecss from "./EventDelete.module.css";

export const EventDelete = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleDelete = async (eventId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
      confirmButtonColor: "#00e6b8",
      cancelButtonColor: "#e74c3c",
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/events/delete/${eventId}`);
        setEvents(events.filter((event) => event._id !== eventId));

        await Swal.fire({
          title: "Deleted!",
          text: "Event has been deleted.",
          icon: "success",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00e6b8",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete event. Please try again.",
          icon: "error",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00e6b8",
        });
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredEvents = events.filter((event) => {
    return (
      event._id?.toString().includes(searchQuery) ||
      event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
    <div className={EventDeletecss.eventContainer}>
      <h2>🗑 Delete Events</h2>

      <input
        type="text"
        placeholder="Search by ID, Name, Date, or Location..."
        value={searchQuery}
        onChange={handleSearchChange}
        className={EventDeletecss.searchInput}
      />

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className={EventDeletecss.error}>{error}</p>
      ) : (
        <div className={EventDeletecss.tableContainer}>
          <table className={EventDeletecss.eventTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Action</th>
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
                    <td>
                      <button
                        className={EventDeletecss.deleteButton}
                        onClick={() => handleDelete(event._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No events found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className={EventDeletecss.pagination}>
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};
