import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.css";
import { FaUsers, FaCalendarAlt, FaUserCheck, FaEnvelopeOpenText } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ Import Link

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    attendees: 0,
    contacts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats/totals");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        Welcome to the Admin Dashboard
      </motion.h1>

      <div className={styles.grid}>
        <Link to="/user-fetch" className={styles.link}>
          <motion.div
            className={styles.card}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.2 }}
          >
            <FaUsers size={32} />
            <h2>{stats.users}</h2>
            <p>Total Users</p>
          </motion.div>
        </Link>

        <Link to="/event-fetch" className={styles.link}>
          <motion.div
            className={styles.card}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.3 }}
          >
            <FaCalendarAlt size={32} />
            <h2>{stats.events}</h2>
            <p>Total Events</p>
          </motion.div>
        </Link>

        <Link to="/attendee-fetch" className={styles.link}>
          <motion.div
            className={styles.card}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.4 }}
          >
            <FaUserCheck size={32} />
            <h2>{stats.attendees}</h2>
            <p>Total Attendees</p>
          </motion.div>
        </Link>

        <Link to="/view-message" className={styles.link}>
          <motion.div
            className={styles.card}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.5 }}
          >
            <FaEnvelopeOpenText size={32} />
            <h2>{stats.contacts}</h2>
            <p>Total Messages</p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};
