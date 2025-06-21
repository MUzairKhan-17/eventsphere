import React, { useState } from 'react';
import AttendeeEventcss from './AttendeeEvent.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';  // Import SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';

export const AttendeeEvent = () => {

  const Navigate = useNavigate();

  const [form, setForm] = useState({ name: '', date: '', location: '' });
  
  // Get today's date in yyyy-mm-dd format for min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/events/create', form);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.data.message,
        background: '#001f1f',
        color: '#00ffcc',
        timer: 2000,
      });
      setForm({ name: '', date: '', location: '' });
      Navigate('/attendee-dashboard'); // Redirect to events page after successful registration
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.error || 'Something went wrong',
        background: '#001f1f',
        color: '#00ffcc',
        confirmButtonColor: '#00b3b3',
      });
    }
  };

  return (
    <div className={AttendeeEventcss.registerContainer}>
      <h2 className={AttendeeEventcss.title}>📅 Register New Event</h2>
      <form onSubmit={handleSubmit} className={AttendeeEventcss.registerForm}>
        <div className={AttendeeEventcss.inputGroup}>
          <label htmlFor="name">🎉 Event Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter event name 🎈"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={AttendeeEventcss.inputGroup}>
          <label htmlFor="date">📆 Date</label>
          <input
            type="date"
            name="date"
            min={today}
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={AttendeeEventcss.inputGroup}>
          <label htmlFor="location">📍 Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location 📌"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={AttendeeEventcss.submitButton}>
          🚀 Create Event
        </button>
      </form>
    </div>
  );
};
