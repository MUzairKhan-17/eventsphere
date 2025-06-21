// routes/attendeeRouter.js
import express from "express";
import { Attendee } from "../Models/Attendee.js";

export const attendeeRouter = express.Router();

attendeeRouter.post("/attendee-check-email", async (req, res) => {
  const { email } = req.body;
  const exists = await Attendee.findOne({ email: email.toLowerCase() });
  return res.json({ exists: !!exists });
});

attendeeRouter.post("/attendee-check-phone", async (req, res) => {
  const { phone } = req.body;
  const exists = await Attendee.findOne({ phone });
  return res.json({ exists: !!exists });
});

attendeeRouter.post("/register", async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;

    if (!fullname || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailExists = await Attendee.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const phoneExists = await Attendee.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone already registered." });
    }

    const newUser = new Attendee({
      fullname,
      email: email.toLowerCase(),
      phone,
      password, // ⚠️ Storing plain text password (for demo only)
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login attendee
attendeeRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Missing email or password' });

    const user = await Attendee.findOne({ email: email.toLowerCase() }).select('+password attendeestatus');

    if (!user)
      return res.status(401).json({ message: 'Email not registered' });

    if (user.attendeestatus === 2) {
      return res.status(403).json({ message: 'Your application is pending admin approval.' });
    }

    if (user.attendeestatus === 0) {
      return res.status(403).json({ message: 'Your account has been deactivated by admin.' });
    }

    if (password !== user.password)
      return res.status(401).json({ message: 'Invalid password' });

    req.session.attendeeId = user._id;

    res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    next(err);  // Pass error to Express error middleware
  }
});

attendeeRouter.get("/fetch", async (req, res) => {
  try {
    const attendees = await Attendee.find(); // ✅ Add "await" to properly fetch events
    res.json(attendees);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ error: "❌ Internal Server Error", details: err.message });
  }
});

attendeeRouter.patch('/attendee-approve/:id', async (req, res) => {
  const { id } = req.params;
  const { attendeestatus } = req.body; // will be 1 on approval

  try {
    const updatedAttendee = await Attendee.findByIdAndUpdate(
      id,
      { attendeestatus },
      { new: true }
    );

    if (!updatedAttendee) return res.status(404).json({ error: "Attendee not found" });

    res.json(updatedAttendee); // send back updated attendee
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE attendee by ID
attendeeRouter.delete('/attendee-delete/:id', async (req, res) => {
  const attendeeId = req.params.id;

  try {
    const deleted = await Attendee.findByIdAndDelete(attendeeId);

    if (!deleted) {
      return res.status(404).json({ message: 'Attendee not found' });
    }

    res.status(200).json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendee:', error);
    res.status(500).json({ message: 'Server error deleting attendee' });
  }
});

// GET /attendee-profile - Fetch logged-in attendee info using session attendeeId
attendeeRouter.get('/attendee-profile', async (req, res) => {
  if (!req.session || !req.session.attendeeId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    // Explicitly select needed fields including fullname, phone, email, password, attendeestatus
    const attendee = await Attendee.findById(req.session.attendeeId).select('+password attendeestatus fullname phone email');
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }

    res.json(attendee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Attendee Profile

// PUT /attendee-profile - Update logged-in attendee profile
attendeeRouter.put('/attendee-profile', async (req, res) => {
  if (!req.session || !req.session.attendeeId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { fullname, email, phone, password } = req.body;

  try {
    const attendee = await Attendee.findById(req.session.attendeeId);

    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    attendee.fullname = fullname || attendee.fullname;
    attendee.email = email || attendee.email;
    attendee.phone = phone || attendee.phone;

    if (password && password.trim() !== "") {
      attendee.password = password; // Ideally, hash the password before saving
    }

    await attendee.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout attendee
attendeeRouter.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid"); // default session cookie name
      return res.json({ message: "Logout successful" });
    });
  } else {
    res.status(200).json({ message: "No active session" });
  }
});
