import React, { useState, useEffect, useRef } from "react";
import signupcss from "./SignUp.module.css";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaPaperPlane, FaEye,FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [phoneStatus, setPhoneStatus] = useState("");

  const emailTimer = useRef(null);
  const phoneTimer = useRef(null);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && /[^0-9]/.test(value)) return;

    const newValue = name === "email" ? value.toLowerCase() : value;
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
    emailTimer.current = setTimeout(() => {
      axios
        .post("http://localhost:5000/api/auth/check-email", { email })
        .then((res) =>
          setEmailStatus(res.data.exists ? "📧 Email Already Taken" : "")
        )
        .catch(() => setEmailStatus(""));
    }, 400);
  };

  const handlePhoneCheck = (phone) => {
    clearTimeout(phoneTimer.current);
    if (!phone || !isValidPhone(phone)) {
      setPhoneStatus("");
      return;
    }
    phoneTimer.current = setTimeout(() => {
      axios
        .post("http://localhost:5000/api/auth/check-phone", { phone })
        .then((res) =>
          setPhoneStatus(res.data.exists ? "📞 Phone No Already Taken" : "")
        )
        .catch(() => setPhoneStatus(""));
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullname || !formData.email || !formData.phone || !formData.password) {
      setError("⚠️ All fields are required!");
      triggerShake();
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("✉️ Please enter a valid email address.");
      triggerShake();
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError("📱 Please enter a valid phone number with 11 digits.");
      triggerShake();
      return;
    }

    if (formData.password.length < 8) {
      setError("🔒 Password must be at least 8 characters long.");
      triggerShake();
      return;
    }

    if (emailStatus || phoneStatus) {
      setError("❗ Please resolve the issues with your email or phone number.");
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setFormData({ fullname: "", email: "", phone: "", password: "" });

      await Swal.fire({
        icon: "success",
        title: "🎉 Success!",
        text: response.data || "You have signed up successfully!",
        confirmButtonText: "Continue",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
        timer: 2000
      });

      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("❌ " + err.response.data.error);
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
      triggerShake();
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
    <div className={`${signupcss.signUpContainer} ${animate ? signupcss.fadeIn : ""}`}>
      <h1>📝 Join Us</h1>
      <p>✨ Sign up now and explore amazing features!</p>
      <form className={`${signupcss.signUpForm} ${shake ? signupcss.shake : ""}`} onSubmit={handleSubmit}>
        <div className={signupcss.inputGroup}>
          <FaUser className={signupcss.icon} />
          <input
            type="text"
            name="fullname"
            placeholder="Your Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div className={signupcss.inputGroup}>
          <FaPhone className={`${signupcss.icon} ${signupcss.phone}`} />
          <input
            type="text"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength="11"
          />
        </div>
        {phoneStatus && <p className={signupcss.warningText}>{phoneStatus}</p>}

        <div className={signupcss.inputGroup}>
          <FaEnvelope className={signupcss.icon} />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {emailStatus && <p className={signupcss.warningText}>{emailStatus}</p>}

        <div className={signupcss.inputGroup}>
          <FaLock className={signupcss.icon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className={signupcss.toggleButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password 🙈" : "Show password 👁️"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className={signupcss.errorText}>{error}</p>}

        <button type="submit" className={signupcss.submitButton} disabled={loading}>
          <FaPaperPlane /> {loading ? "⏳ Processing..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};