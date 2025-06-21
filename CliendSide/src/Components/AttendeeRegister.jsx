// AttendeeRegister.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import AttendeeRegistercss from "./AttendeeRegister.module.css";
import axios from "axios";
import Swal from "sweetalert2";

export const AttendeeRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState({ email: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "email" ? value.toLowerCase() : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const checkEmail = async (email) => {
    if (!isValidEmail(email)) {
      setAvailability((prev) => ({ ...prev, email: "" }));
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/attendees/attendee-check-email", {
        params: { email },
      });
      setAvailability((prev) => ({
        ...prev,
        email: res.data.exists ? "Email already registered." : "",
      }));
    } catch (err) {
      console.error("Email check failed", err);
    }
  };

  const checkPhone = async (phone) => {
    if (!isValidPhone(phone)) {
      setAvailability((prev) => ({ ...prev, phone: "" }));
      return;
    }
    try {
      const res = await axios.get("http://localhost:5000/api/attendees/attendee-check-phone", {
        params: { phone },
      });
      setAvailability((prev) => ({
        ...prev,
        phone: res.data.exists ? "Phone already registered." : "",
      }));
    } catch (err) {
      console.error("Phone check failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { fullname, email, phone, password } = formData;
    if (!fullname || !email || !phone || !password) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Phone must be 11 digits.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (availability.email || availability.phone) {
      setError("Please resolve the email or phone conflict first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/attendees/register", formData);
      await Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: res.data.message || "Welcome aboard!",
        background: "#002b36",
        color: "white",
        confirmButtonColor: "#00b894",
      });
      navigate("/login-attendee");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className={AttendeeRegistercss.registerContainer}>
      <h1 className={AttendeeRegistercss.title}>📝 Attendee Registration</h1>
      <form className={AttendeeRegistercss.registerForm} onSubmit={handleSubmit}>
        <div className={AttendeeRegistercss.inputGroup}>
          <FaUser className={AttendeeRegistercss.icon} />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div className={AttendeeRegistercss.inputGroup}>
          <FaEnvelope className={AttendeeRegistercss.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            onKeyUp={() => checkEmail(formData.email)}
            required
          />
        </div>
        {availability.email && <p className={AttendeeRegistercss.error}>{availability.email}</p>}

        <div className={AttendeeRegistercss.inputGroup}>
          <FaPhone className={`${AttendeeRegistercss.icon} ${AttendeeRegistercss.phone}`} />
          <input
            type="text"
            name="phone"
            placeholder="Phone (11 digits)"
            value={formData.phone}
            onChange={handleChange}
            onKeyUp={() => checkPhone(formData.phone)}
            required
            maxLength="11"
            pattern="\d{11}"
          />
        </div>
        {availability.phone && <p className={AttendeeRegistercss.error}>{availability.phone}</p>}

        <div className={AttendeeRegistercss.inputGroup} style={{ position: "relative" }}>
          <FaLock className={AttendeeRegistercss.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={AttendeeRegistercss.passwordToggle}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className={AttendeeRegistercss.error}>{error}</p>}

        <button type="submit" className={AttendeeRegistercss.submitButton}>
          Register Now
        </button>

        <p className={AttendeeRegistercss.loginLink}>
          Already have an account?{" "}
          <Link to="/login-attendee" className={AttendeeRegistercss.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
