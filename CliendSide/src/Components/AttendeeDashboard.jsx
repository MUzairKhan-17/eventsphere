import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AttendeeDashboardcss from "./AttendeeDashboard.module.css";
import { Link, useNavigate } from "react-router-dom";

export const AttendeeDashboard = () => {
  const navigate = useNavigate();
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchAttendeeInfo = async () => {
      setLoading(true);
      setError("");
      try {
        // Call backend session-based endpoint to get current attendee info
        const response = await axios.get("http://localhost:5000/api/attendees/attendee-profile", {
          withCredentials: true, // IMPORTANT: send cookies
        });
        setAttendeeInfo(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Login required",
            text: "Please login first to access the dashboard.",
            confirmButtonText: "OK",
            background: "linear-gradient(135deg, #001f1f, #004d4d)",
            color: "white",
            confirmButtonColor: "#00e6b8",
          }).then(() => {
            navigate("/login-attendee");
          });
        } else {
          setError("Failed to load attendee info.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendeeInfo();
  }, [navigate]);

  useEffect(() => {
    const container = document.querySelector(`.${AttendeeDashboardcss.attendeeContainer}`);
    if (container) {
      container.classList.add(AttendeeDashboardcss.fadeIn);
    }
  }, []);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/attendees/logout", {}, { withCredentials: true });
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been successfully logged out.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00e6b8",
      }).then(() => {
        navigate("/login-attendee");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Logout failed",
        text: "Unable to log you out at the moment. Please try again.",
        confirmButtonColor: "#ff004d",
      });
    }
  };

  if (loading) return <p>Loading attendee info...</p>;
  if (error) return <p>{error}</p>;
  if (!attendeeInfo) return <p>No attendee information found.</p>;

  return (
    <div className={AttendeeDashboardcss.attendeeContainer}>
      <h1 className={AttendeeDashboardcss.title}>🎟️ Attendee Dashboard</h1>

      <div className={AttendeeDashboardcss.card}>
        <h2 className={AttendeeDashboardcss.welcomeText}>Welcome, {attendeeInfo.fullname}! 👋</h2>

        <div className={AttendeeDashboardcss.infoList}>
          <div className={AttendeeDashboardcss.infoItem}>
            <strong>Full Name:</strong> <span>{attendeeInfo.fullname}</span>
          </div>
          <div className={AttendeeDashboardcss.infoItem}>
            <strong>Email:</strong> <span>{attendeeInfo.email}</span>
          </div>
          <div className={AttendeeDashboardcss.infoItem}>
            <strong>Phone:</strong> <span>{attendeeInfo.phone}</span>
          </div>
          <div className={AttendeeDashboardcss.infoItem}>
            <strong>Password:</strong>{" "}
            <span>{showPassword ? attendeeInfo.password : "••••••••"}</span>
            <button
              onClick={togglePasswordVisibility}
              className={AttendeeDashboardcss.togglePasswordBtn}
              aria-label={showPassword ? "Hide password" : "Show password"}
              type="button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className={AttendeeDashboardcss.infoItem}>
            <strong>Status:</strong>{" "}
            <span>
              {attendeeInfo.attendeestatus === 1
                ? "Active"
                : attendeeInfo.attendeestatus === 2
                ? "Pending"
                : "Deactivated"}
            </span>
          </div>
        </div>

        <div className={AttendeeDashboardcss.registerSection}>
          <p>Want to join more events?</p>
          <Link to="/register-event" className={AttendeeDashboardcss.registerLink}>
            📝 Register for an Event
          </Link>
        </div>

        {/* New buttons */}
        <div className={AttendeeDashboardcss.actionButtons}>
          <button
            onClick={() => navigate("/attendee-update")}
            className={AttendeeDashboardcss.updateProfileBtn}
            type="button"
          >
            Update Profile
          </button>

          <button
            onClick={handleLogout}
            className={AttendeeDashboardcss.logoutBtn}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
