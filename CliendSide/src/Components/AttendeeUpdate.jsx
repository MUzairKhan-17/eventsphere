import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaSave, } from "react-icons/fa";
import attendeeupdatecss from "./AttendeeUpdate.module.css";

export const AttendeeUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailTimer = useRef(null);
  const phoneTimer = useRef(null);

  // Keep original email and phone to compare during checks
  const originalEmail = useRef("");
  const originalPhone = useRef("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/attendees/attendee-profile", {
          withCredentials: true,
        });
        setFormData({
          fullname: res.data.fullname || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          password: "",
        });
        originalEmail.current = res.data.email || "";
        originalPhone.current = res.data.phone || "";
      } catch (err) {
        if (err.response?.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Login required",
            text: "Please login to update your profile.",
            background: "linear-gradient(135deg, #001f1f, #004d4d)",
            color: "white",
          }).then(() => navigate("/login-attendee"));
        } else {
          setError("❌ Failed to load your profile.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "email" ? value.toLowerCase() : value;
    if (name === "phone" && /[^0-9]/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "email") handleEmailCheck(newValue);
    if (name === "phone") handlePhoneCheck(newValue);
  };

  const handleEmailCheck = (email) => {
    clearTimeout(emailTimer.current);
    if (!email || !isValidEmail(email)) {
      setEmailStatus("");
      return;
    }
    if (email === originalEmail.current) {
      setEmailStatus("");
      return;
    }
    emailTimer.current = setTimeout(() => {
      axios
        .post(
          "http://localhost:5000/api/attendees/attendee-check-email",
          { email },
          { withCredentials: true }
        )
        .then((res) => {
          setEmailStatus(res.data.exists ? "📧 Email already registered" : "");
        })
        .catch(() => setEmailStatus(""));
    }, 400);
  };

  const handlePhoneCheck = (phone) => {
    clearTimeout(phoneTimer.current);
    if (!phone || !isValidPhone(phone)) {
      setPhoneStatus("");
      return;
    }
    if (phone === originalPhone.current) {
      setPhoneStatus("");
      return;
    }
    phoneTimer.current = setTimeout(() => {
      axios
        .post(
          "http://localhost:5000/attendees/api/attendee-check-phone",
          { phone },
          { withCredentials: true }
        )
        .then((res) => {
          setPhoneStatus(
            res.data.exists ? "📞 Phone number already registered" : ""
          );
        })
        .catch(() => setPhoneStatus(""));
    }, 400);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullname || !formData.email || !formData.phone) {
      setError("⚠️ Please fill all required fields.");
      triggerShake();
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("✉️ Enter a valid email address.");
      triggerShake();
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError("📱 Enter a valid 11-digit phone number.");
      triggerShake();
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setError("🔒 Password must be at least 8 characters.");
      triggerShake();
      return;
    }

    if (emailStatus || phoneStatus) {
      setError("❗ Please resolve email/phone issues before submitting.");
      triggerShake();
      return;
    }

    try {
      setSaving(true);
      await axios.put(
        "http://localhost:5000/api/attendees/attendee-profile",
        {
          fullname: formData.fullname,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password ? { password: formData.password } : {}),
        },
        { withCredentials: true }
      );

      await Swal.fire({
        icon: "success",
        title: "✅ Profile Updated",
        text: "Your profile has been updated successfully.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
      });

      navigate("/attendee-dashboard");
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Update failed."));
      triggerShake();
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={attendeeupdatecss.loading}>⏳ Loading profile...</p>;

  return (
    <div className={`${attendeeupdatecss.updateContainer} ${shake ? attendeeupdatecss.shake : ""}`}>
      <h1>🔧 Update Profile</h1>
      <form onSubmit={handleSubmit} className={attendeeupdatecss.updateForm}>
        <label>
          <div className={attendeeupdatecss.inputGroup}>
            <FaUser className={attendeeupdatecss.icon} />
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>
        </label>

        <label>
          <div className={attendeeupdatecss.inputGroup}>
            <FaPhone className={`${attendeeupdatecss.icon} ${attendeeupdatecss.phone}`} />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength="11"
              required
            />
          </div>
          {phoneStatus && <p className={attendeeupdatecss.errorText}>{phoneStatus}</p>}
        </label>

        <label>
          <div className={attendeeupdatecss.inputGroup}>
            <FaEnvelope className={attendeeupdatecss.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {emailStatus && <p className={attendeeupdatecss.errorText}>{emailStatus}</p>}
        </label>

        <label>
          <div className={attendeeupdatecss.inputGroup}>
            <FaLock className={attendeeupdatecss.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className={attendeeupdatecss.toggleButton}
              onClick={togglePasswordVisibility}
              title={showPassword ? "Hide password 🙈" : "Show password 👁️"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>

        {error && <p className={attendeeupdatecss.errorText}>{error}</p>}

        <button type="submit" disabled={saving} className={attendeeupdatecss.submitButton}>
          <FaSave /> {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};
