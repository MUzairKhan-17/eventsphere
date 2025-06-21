import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import EventUpdateformcss from "./EventUpdateform.module.css"; // Renamed import

export const EventUpdateForm = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const eventId = localStorage.getItem("eventId");

  // Helper to format date string for <input type="date">
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        Swal.fire({
          icon: "warning",
          title: "No Event Selected",
          text: "Redirecting to event list...",
          background: "#1a1a1a",
          color: "#ffffff",
        });
        navigate("/event-update");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/events/event/${eventId}`);
        setEventData(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: "Failed to load event details.",
          background: "#1a1a1a",
          color: "#ffffff",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleUpdateEvent = async () => {
    if (!eventData.name || !eventData.date || !eventData.location) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "All fields are required.",
        background: "#1f1f1f",
        color: "#ffffff",
      });
      return;
    }

    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/api/events/update/${eventId}`, eventData);

      // ✅ SweetAlert2 Success Popup
      await Swal.fire({
        icon: "success",
        title: "Event Updated!",
        text: "The event details were successfully updated.",
        confirmButtonColor: "#00e6b8",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
      });

      navigate("/event-update");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update event. Please try again.",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/event-update");
  };

  return (
    <div className={EventUpdateformcss.eventContainer}>
      <h2>📝 Update Event</h2>

      {loading ? (
        <p>Loading event details...</p>
      ) : eventData ? (
        <div className={EventUpdateformcss.updateFormContainer}>
          <label>Event Name:</label>
          <input
            type="text"
            name="name"
            value={eventData.name || ""}
            onChange={handleChange}
            className={EventUpdateformcss.inputField}
          />

          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formatDateForInput(eventData.date)}
            onChange={handleChange}
            className={EventUpdateformcss.inputField}
          />

          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={eventData.location || ""}
            onChange={handleChange}
            className={EventUpdateformcss.inputField}
          />

          <div className={EventUpdateformcss.buttonGroup}>
            <button
              className={EventUpdateformcss.updateButton}
              onClick={handleUpdateEvent}
              disabled={updating}
            >
              💾 {updating ? "Saving..." : "Save Changes"}
            </button>
            <button className={EventUpdateformcss.cancelButton} onClick={handleCancel}>
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>⚠ Event not found!</p>
      )}
    </div>
  );
};
