import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import Sidebarcss from "./Sidebar.module.css";
import { FaRegUser } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import Swal from "sweetalert2";
import logo from "/logo.jpg"; // Adjust path if needed

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen && window.innerWidth <= 768 ? "hidden" : "auto";
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");

      Swal.fire({
        title: "Logged out successfully!",
        icon: "success",
        timer: 2000,
        background: "linear-gradient(135deg, #001f1f, #004d4d)",
        color: "white",
        showConfirmButton: false,
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Logout failed", text: err.message });
    }
  };

  return (
    <div className={Sidebarcss.sidebarContainer}>
      {isOpen && (
        <div className={`${Sidebarcss.overlay} ${Sidebarcss.open}`} onClick={() => setIsOpen(false)} />
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={Sidebarcss.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>

      <motion.div
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260 }}
        transition={{ duration: 0.5 }}
        className={`${Sidebarcss.sidebar} ${isOpen ? "" : Sidebarcss.closed}`}
      >
        <div className={Sidebarcss.logoContainer}>
          <img src={logo} alt="Logo" className={Sidebarcss.logoImage} />
          <span className={Sidebarcss.logoText}>EventSphere</span>
        </div>

        <h2 className={Sidebarcss.sidebarTitle}>Admin Panel</h2>
        <ul className={Sidebarcss.sidebarMenu}>
          <div className={Sidebarcss.dashboardButtonWrapper}>
            <button
              className={Sidebarcss.dashboardButton}
              onClick={() => navigate("/dashboard")}
            >
              <Home size={18} style={{ marginRight: "8px" }} />
              Go to Dashboard
            </button>
          </div>

          <Dropdown
            open={dropdownOpen}
            toggle={() => setDropdownOpen(!dropdownOpen)}
            icon={<FaRegUser />}
            label="Users"
            items={[
              { to: "/user-fetch", label: "Fetch Users" },
              { to: "/user-delete", label: "Delete Users" },
              { to: "/user-activedeactive", label: "Active/Deactivate Users" },
            ]}
          />

          <Dropdown
            open={dropdownOpen1}
            toggle={() => setDropdownOpen1(!dropdownOpen1)}
            icon={<GrUserAdmin size={24} />}
            label="Events"
            items={[
              { to: "/event-fetch", label: "Fetch Events" },
              { to: "/event-create", label: "Create Event" },
              { to: "/event-delete", label: "Delete Events" },
              { to: "/event-update", label: "Update Events" },
            ]}
          />

          <Dropdown
            open={dropdownOpen2}
            toggle={() => setDropdownOpen2(!dropdownOpen2)}
            icon={<FaRegUser />}
            label="Attendees"
            items={[
              { to: "/attendee-fetch", label: "Fetch Attendees" },
              { to: "/attendee-Approve", label: "Pending Attendee" },
              { to: "/attendee-delete", label: "Delete Attendee" },
            ]}
          />

          <Dropdown
            open={dropdownOpen3}
            toggle={() => setDropdownOpen3(!dropdownOpen3)}
            icon={<FaRegUser />}
            label="Contact"
            items={[
              { to: "/View-Message", label: "View Messages" },
              { to: "/Delete-Message", label: "Delete Messages" },
            ]}
          />

          <li className={Sidebarcss.profileItem}>
            <Link to="/profile" className={Sidebarcss.profileLink}>
              <FaRegUser size={22} />
              <span className={Sidebarcss.sidebarLabel}>Admin Profile</span>
            </Link>
          </li>

          <li
            className={Sidebarcss.sidebarItem}
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "red" }}
          >
            <LogOut size={24} />
            <span className={Sidebarcss.sidebarLabel}>Logout</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <li className={Sidebarcss.sidebarItem}>
    <Link to={to} className={Sidebarcss.sidebarLink}>
      {icon && <span className={Sidebarcss.icon}>{icon}</span>}
      <span className={Sidebarcss.sidebarLabel}>{label}</span>
    </Link>
  </li>
);

const Dropdown = ({ open, toggle, icon, label, items }) => {
  return (
    <li className={Sidebarcss.dropdown} onClick={toggle}>
      <div className={Sidebarcss.dropdownHeader}>
        {icon}
        <span>{label}</span>
        <ChevronDown size={18} className={open ? Sidebarcss.rotate : ""} />
      </div>
      {open && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={Sidebarcss.dropdownMenu}
        >
          {items.map(({ to, label }, i) => (
            <li key={i}>
              <Link to={to} className={Sidebarcss.sidebarLink}>
                {label}
              </Link>
            </li>
          ))}
        </motion.ul>
      )}
    </li>
  );
};
