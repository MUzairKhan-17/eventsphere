import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ SweetAlert2 import
import CreateEventcss from "./EventCreate.module.css";
import { useNavigate } from "react-router-dom";

export const EventCreate = () => {
  const Navigator = useNavigate();

  const [formData, setFormData] = useState({ name: "", date: "", location: "" });
  const [errors, setErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 3) newErrors.name = "Event name must be at least 3 characters.";
    if (!formData.date) newErrors.date = "Please select an event date.";
    else if (formData.date < today) newErrors.date = "Event date cannot be in the past.";
    if (formData.location.trim().length < 3) newErrors.location = "Location must be at least 3 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/events/create", formData);

      // ✅ SweetAlert2 Success
      await Swal.fire({
        title: "Event Created",
        text: response.data.message,
        icon: "success",
        confirmButtonColor: "#00e6b8",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        timer: 2000,
      });

      setFormData({ name: "", date: "", location: "" });
      setErrors({});
      Navigator("/event-fetch");

    } catch (error) {
      // ❌ SweetAlert2 Error
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create event. Please try again.",
        icon: "error",
        confirmButtonColor: "#00e6b8",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
      });
    }
  };

  return (
    <div className={CreateEventcss.eventFormContainer}>
      <h2>✍️ Create a New Event</h2>

      <form onSubmit={handleSubmit} className={CreateEventcss.eventForm}>
        {/* Event Name */}
        <label>Event Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter event name"
          className={errors.name ? CreateEventcss.errorInput : ""}
          required
        />
        {errors.name && <p className={CreateEventcss.error}>{errors.name}</p>}

        {/* Event Date */}
        <label>Event Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
          className={errors.date ? CreateEventcss.errorInput : ""}
          required
        />
        {errors.date && <p className={CreateEventcss.error}>{errors.date}</p>}

        {/* Event Location */}
        <label>Event Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter event location"
          className={errors.location ? CreateEventcss.errorInput : ""}
          required
        />
        {errors.location && <p className={CreateEventcss.error}>{errors.location}</p>}

        {/* Submit Button */}
        <button type="submit" className={CreateEventcss.submitButton}>
          Create Event
        </button>
      </form>
    </div>
  );
};
