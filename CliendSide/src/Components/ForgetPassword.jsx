import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import ForgetPasswordcss from "./ForgetPassword.module.css";
import { useNavigate } from "react-router-dom";

export const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(null);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const checkRes = await axios.post("http://localhost:5000/api/auth/check-email", {
        email: email.toLowerCase(),
      });

      if (!checkRes.data.exists) {
        setEmailExists(false);
        setError("This email is not registered.");
        setLoading(false);
        return;
      }

      setEmailExists(true);

      const response = await axios.post("http://localhost:5000/api/auth/forgot-password/send", {
        email: email.toLowerCase(),
      });

      if (response.status === 200) {
        setSuccess("OTP sent to your email.");
        setStep(2);
        Swal.fire({
          icon: "success",
          title: "🎉 Success!",
          text: "Message sent successfully!",
          confirmButtonText: "OK",
          confirmButtonColor: "#00e6b8",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP. Try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to send OTP. Try again.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password/verify", {
        email: email.toLowerCase(),
        otp: otp.join(""),
      });

      setSuccess("OTP verified! Please set your new password.");
      setStep(3);
      Swal.fire({
        icon: "success",
        title: "OTP Verified",
        text: "Please enter your new password.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP. Please try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Invalid OTP. Please try again.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password/reset", {
        email: email.toLowerCase(),
        newPassword,
      });

      if (response.status === 200) {
        setSuccess("Password reset successful! You can now log in.");
        Swal.fire({
          icon: "success",
          title: "Password Reset",
          text: "Your password has been reset successfully!",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00b894",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. Try again.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to reset password. Try again.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={ForgetPasswordcss.forgetPasswordContainer}>
      <h1>Forgot Password?</h1>
      {step === 1 && <p>Enter your email to receive a reset code.</p>}
      {step === 2 && <p>Enter the OTP sent to your email.</p>}
      {step === 3 && <p>Enter your new password.</p>}

      <form
        className={ForgetPasswordcss.forgetPasswordForm}
        onSubmit={
          step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleResetPassword
        }
      >
        {error && <p className={ForgetPasswordcss.errorText}>{error}</p>}
        {success && <p className={ForgetPasswordcss.successText}>{success}</p>}

        {step === 1 && (
          <div className={ForgetPasswordcss.inputGroup}>
            <FaEnvelope className={ForgetPasswordcss.icon} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value.toLowerCase());
                setEmailExists(null);
              }}
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className={ForgetPasswordcss.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={ForgetPasswordcss.otpInput}
                required
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className={ForgetPasswordcss.inputGroup} style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={ForgetPasswordcss.pwdbtn}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}

        <button
          type="submit"
          className={ForgetPasswordcss.submitButton}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send OTP"
            : step === 2
            ? "Verify OTP"
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
};
