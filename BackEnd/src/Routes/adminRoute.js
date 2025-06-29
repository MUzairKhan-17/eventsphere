// routes/adminRouter.js
import express from "express";
import bcrypt from "bcrypt";
import { Admin } from "../Models/Admin.js";
import { User } from "../Models/User.js";
import { Event } from "../Models/Event.js";
import { Attendee } from "../Models/Attendee.js";
import { Contact } from "../Models/Contact.js";

export const adminRouter = express.Router();

// GET /api/admin/stats/totals
adminRouter.get("/stats/totals", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const eventCount = await Event.countDocuments();
    const attendeeCount = await Attendee.countDocuments();
    const contactCount = await Contact.countDocuments();

    res.json({
      users: userCount,
      events: eventCount,
      attendees: attendeeCount,
      contacts: contactCount,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Admin Login
adminRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password!" });
    }

    req.session.adminId = admin._id;
    res.json({ message: "Login successful!", adminId: admin._id, email });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
});

// Check Admin Session
adminRouter.get("/check-session", (req, res) => {
  res.json({ loggedIn: !!req.session.adminId, adminId: req.session.adminId });
});

// Admin Logout
adminRouter.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed.");
    res.clearCookie("connect.sid");
    res.send("Logged out successfully.");
  });
});

// Get All Users
adminRouter.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Check Admin Email Exists
adminRouter.post("/check-admin-email", async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    res.json({ exists: !!admin });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while checking email." });
  }
});

// Delete User by ID
adminRouter.delete("/user-delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Toggle User Active Status
adminRouter.put("/user-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.userstatus = user.userstatus === 1 ? 0 : 1;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.userstatus === 1 ? "Activated" : "Deactivated"} successfully`,
      status: user.userstatus,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get Admin Profile
adminRouter.get("/profile/me", async (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const admin = await Admin.findById(req.session.adminId).select("+password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

(async () => {
  try {
    const defaultEmail = "admin@eventsphere.com";
    const defaultPassword = "admin123";

    const existingAdmin = await Admin.findOne({ email: defaultEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await Admin.create({
        email: defaultEmail,
        password: hashedPassword,
        fullname: "Default Admin",
        phone: "0000000000", // <-- You can customize this
      });
      console.log("✅ Default admin created.");
    } else {
      console.log("ℹ️ Default admin already exists.");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
})();
