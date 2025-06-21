import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AttendeeLogincss from "./AttendeeLogin.module.css";
import axios from "axios";
import Swal from "sweetalert2";

export const AttendeeLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!formData.email) {
      setEmailExists(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      checkEmailExists(formData.email);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.email]);

  // UPDATED: use POST instead of GET here
  const checkEmailExists = async (email) => {
    setCheckingEmail(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendees/attendee-check-email",
        { email },
        { withCredentials: true }
      );
      setEmailExists(res.data.exists);
    } catch (err) {
      setEmailExists(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailExists(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (emailExists === false) {
      setError("Email is not registered.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/attendees/login", formData, {
        withCredentials: true,
      });

      if (res.data.user) {
        localStorage.setItem("attendeeId", res.data.user.id);
        localStorage.setItem("attendeeEmail", res.data.user.email);
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: res.data.message || "Welcome back!",
        background: "#002b36",
        color: "white",
        timer: 2000,
      });

      navigate("/attendee-dashboard");
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 403 || err.response.status === 401)
      ) {
        setError(err.response.data.message);
      } else {
        setError("Login failed.");
      }
    }
  };

  return (
    <div className={AttendeeLogincss.loginContainer}>
      <h1 className={AttendeeLogincss.title}>🔐 Attendee Login</h1>
      <form className={AttendeeLogincss.loginForm} onSubmit={handleSubmit}>
        <div className={AttendeeLogincss.inputGroup}>
          <FaEnvelope className={AttendeeLogincss.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {checkingEmail && (
          <p>Checking email...</p>
        )}
        {emailExists === false && (
          <p className={AttendeeLogincss.errorText}>Email not registered</p>
        )}
        {emailExists === true && (
          <p>Email Registered</p>
        )}

        <div className={AttendeeLogincss.inputGroup} style={{ position: "relative" }}>
          <FaLock className={AttendeeLogincss.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={AttendeeLogincss.passwordToggle}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className={AttendeeLogincss.error}>{error}</p>}

        <button type="submit" className={AttendeeLogincss.submitButton}>
          Login
        </button>

        <p className={AttendeeLogincss.registerLink}>
          Don't have an account?{" "}
          <Link to="/register-attendee" className={AttendeeLogincss.link}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};
