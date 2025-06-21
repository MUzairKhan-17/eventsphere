import React, { useState } from "react";
import styles from "./AdminLogin.module.css";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setError("");
      setEmailChecked(false);
    }
  };

  const checkEmailExists = async () => {
    if (!formData.email) return;

    try {
      const response = await fetch("http://localhost:5000/api/admin/check-admin-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (data.exists) {
        setError("");
        setEmailChecked(true);
      } else {
        setError("Email is not registered");
        setEmailChecked(false);
      }
    } catch {
      setError("Error checking email");
      setEmailChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      setSuccess(data.message);

      setTimeout(() => navigate("/user-fetch"), 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginAdmin}>
      <h1>Admin Login</h1>
      <p>Sign in to access the admin panel</p>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <FaUser className={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onKeyUp={checkEmailExists}
            required
          />
        </div>

        {error === "Email is not registered" && (
          <p className={styles.emailError}>{error}</p>
        )}
        {emailChecked && !error && (
          <p className={styles.emailValid}>✓ Email is registered</p>
        )}

        <div className={styles.inputGroup}>
          <FaLock className={styles.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && error !== "Email is not registered" && (
          <p className={styles.errorText}>{error}</p>
        )}
        {success && <p className={styles.successText}>{success}</p>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={
            loading || 
            !emailChecked || 
            error === "Email is not registered" || 
            !formData.email || 
            !formData.password
          }
        >
          {loading ? "Logging in..." : <><FaSignInAlt /> Login</>}
        </button>
      </form>
    </div>
  );
};
