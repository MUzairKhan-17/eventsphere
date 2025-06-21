import React, { useState, useEffect } from "react";
import profilecss from "./Profile.module.css";
import { FaPhone, FaEnvelope, FaLock, FaUser, FaSignOutAlt } from "react-icons/fa";
import profileImage from '/logo.jpg';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/check-session", { withCredentials: true });
        
        if (response.data.loggedIn) {
          const userId = response.data.userId;
          fetchUser(userId);
        } else {
          await Swal.fire({
            icon: "error",
            title: "🚫 Not Logged In",
            text: "Please login first! 🔐",
            background: "linear-gradient(135deg, #001f1f, #004d4d)",
            color: "white",
            confirmButtonColor: "#00b894"
          });
          setLoading(false);
          navigate("/login");
        }
      } catch (err) {
        console.error("Error checking session:", err);
        await Swal.fire({
          icon: "error",
          title: "⚠️ Error",
          text: "Error checking session. Please try again.",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00b894"
        });
        setLoading(false);
      }
    };

    const fetchUser = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/Profile/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError("❌ Error fetching user data.");
        await Swal.fire({
          icon: "error",
          title: "⚠️ Error",
          text: "Error fetching user data.",
          background: "linear-gradient(135deg, #001f1f, #004d4d)",
          color: "white",
          confirmButtonColor: "#00b894"
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      await Swal.fire({
        icon: "success",
        title: "👋 Logged Out",
        text: "Logged out successfully! See you soon! 😊",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894"
      });
      navigate("/login");
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "⚠️ Error",
        text: "Error logging out. Please try again.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894"
      });
    }
  };

  const handleDelete = async () => {
    const userId = user?._id;

    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: "User not found!",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894"
      });
      return;
    }

    const result = await Swal.fire({
      title: "⚠️ Are you sure?",
      text: "Do you really want to delete your account? This action cannot be undone. 🛑",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#00e6b8",
      confirmButtonText: "Yes, delete it! 🗑️",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/auth/profile/delete/${userId}`);
      await Swal.fire({
        icon: "success",
        title: "✅ Deleted!",
        text: response.data.message,
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894"
      });
      navigate("/signup");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "⚠️ Error",
        text: "Error deleting account. Please try again.",
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        confirmButtonColor: "#00b894"
      });
      navigate("/login");
    }
  };

  const handleUpdate = async () => {
    await Swal.fire({
      icon: "info",
      title: "✏️ Update Profile",
      text: "You are about to update your profile. Continue?",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
      background: "linear-gradient(135deg, #001f1f, #004d4d)",
      color: "white",
      confirmButtonColor: "#00b894",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/update-profile");
      }
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (loading) return <p>⏳ Loading profile...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <div className={profilecss.profileContainer}>
      <h1 className={profilecss.profileHeading}>🧑🏻 My Profile</h1>
      <div className={profilecss.profileCard}>
        <img src={profileImage} alt="Profile" className={profilecss.profileImage} />
        <p className={profilecss.profileRole}>🛡️ Role: User</p>
        <div className={profilecss.profileDetail}>
          <p><strong><FaUser /> </strong> {user?.fullname}</p>
          <p><strong><FaPhone className={profilecss.phone} /> </strong> {user?.phone}</p>
          <p><strong><FaEnvelope /> </strong> {user?.email}</p>

          <p className={profilecss.passwordContainer}>
            <strong><FaLock /> </strong>
            {user && user.password ? (showPassword ? user.password : "********") : "N/A"}
          </p>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button onClick={togglePasswordVisibility} className={profilecss.toggleButton}>
              {showPassword ? "🙈 Hide" : "👁️ Show"}
            </button>
          </div>
        </div>

        <div className={profilecss.socialIcons}>
          <a onClick={logout} className={profilecss.icon} aria-label="Logout">
            <FaSignOutAlt /> 🚪
          </a>
        </div>

        <div className={profilecss.buttonContainer}>
          <button className={profilecss.updateButton} onClick={handleUpdate}>✏️ Update</button>
          <button className={profilecss.deleteButton} onClick={handleDelete}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
};