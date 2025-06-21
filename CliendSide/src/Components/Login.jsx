import React, { useState, useEffect } from "react";
import loginstylecss from "./Login.module.css";
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
          withCredentials: true,
        });
        if (response.data.loggedIn) navigate("/dashboard");
      } catch (err) {
        console.error("Error checking authentication:", err);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: name === "email" ? value.toLowerCase() : value });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const checkEmailExistence = async (email) => {
    if (isValidEmail(email)) {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/check-email", { email });
        if (response.data.exists) {
          setEmailStatus("");
          setEmailChecked(true);
        } else {
          setEmailStatus("📭 Email not registered.");
          setEmailChecked(false);
        }
      } catch (err) {
        console.error("Error checking email:", err);
        setEmailStatus("⚠️ An error occurred while checking email.");
        setEmailChecked(false);
      }
    } else {
      setEmailStatus("");
      setEmailChecked(false);
    }
  };

  useEffect(() => {
    if (formData.email) {
      checkEmailExistence(formData.email);
    } else {
      setEmailStatus("");
      setEmailChecked(false);
    }
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("❗ All fields are required!");
      triggerShake();
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("📧 Please enter a valid email address.");
      triggerShake();
      return;
    }

    if (formData.password.length < 8) {
      setError("🔒 Password must be at least 8 characters long.");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
        withCredentials: true,
      });

      const { message } = response.data;

      setFormData({ email: "", password: "" });
      setError("");

      await Swal.fire({
        icon: "success",
        title: "🎉 Success!",
        text: message || "Logged in successfully!",
        confirmButtonText: "Continue",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
      });

      navigate("/");
    } catch (err) {
      if (err.response?.data?.error === "Email not found!") {
        setError("📭 Email not registered.");
        setEmailChecked(false);
      } else {
        setError(err.response?.data?.error || "⚠️ An unexpected error occurred.");
      }
      triggerShake();
      setFormData({ email: "", password: "" });
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={loginstylecss.loginContainer}>
      <h1>👋 Welcome Back</h1>
      <p>🔑 Log in to continue your journey!</p>

      <form
        className={`${loginstylecss.loginForm} ${shake ? loginstylecss.shake : ""}`}
        onSubmit={handleSubmit}
      >
        <div className={loginstylecss.inputGroup}>
          <FaEnvelope className={loginstylecss.icon} />
          <input
            type="email"
            name="email"
            placeholder="📧 Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {emailStatus && (
          <p className={loginstylecss.errorText} aria-live="assertive">
            {emailStatus}
          </p>
        )}
        {emailChecked && !emailStatus && (
          <p className={loginstylecss.successText}>✅ Email is registered</p>
        )}

        <div className={loginstylecss.inputGroup}>
          <FaLock className={loginstylecss.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="🔒 Your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={loginstylecss.toggleButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && (
          <p className={loginstylecss.errorText} aria-live="assertive">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={loginstylecss.submitButton}
          disabled={loading || !emailChecked}
        >
          <FaSignInAlt /> {loading ? "⏳ Processing..." : "🚀 Login"}
        </button>

        <div className={loginstylecss.forgotPasswordContainer}>
          <a href="/forgot-password" className={loginstylecss.forgotPasswordLink}>
            🔑 Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};