import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import EventUpdatecss from "./EventUpdate.module.css";

export const EventUpdate = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events/event-fetch");
        setEvents(response.data);
      } catch (error) {
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event._id?.includes(searchQuery) ||
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handleUpdateClick = async (eventId) => {
    const confirmation = await Swal.fire({
      title: "Proceed to Update?",
      text: "Do you want to edit this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
      confirmButtonColor: "#00e6b8",
      cancelButtonColor: "#e74c3c"
    });

    if (confirmation.isConfirmed) {
      localStorage.setItem("eventId", eventId);
      navigate(`/update-event/${eventId}`);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className={EventUpdatecss.eventContainer}>
      <h2>🛠 Update Events</h2>

      <input
        type="text"
        placeholder="Search by Name, Date, or Location..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // Reset pagination on new search
        }}
        className={EventUpdatecss.searchInput}
      />

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className={EventUpdatecss.error}>{error}</p>
      ) : (
        <>
          <div className={EventUpdatecss.tableContainer}>
            <table className={EventUpdatecss.eventTable}>
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
                {currentItems.length > 0 ? (
                  currentItems.map((event) => (
                    <tr key={event._id}>
                      <td>{event._id}</td>
                      <td>{event.name}</td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                      <td>
                        <button
                          className={EventUpdatecss.updateButton}
                          onClick={() => handleUpdateClick(event._id)}
                        >
                          ✏ Update
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

          {/* 🔄 Pagination Controls */}
          {filteredEvents.length > itemsPerPage && (
            <div className={EventUpdatecss.pagination}>
              <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};