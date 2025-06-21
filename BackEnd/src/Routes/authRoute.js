import express from "express";
import nodemailer from "nodemailer";
import { User } from "../Models/User.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now resolve the logo path reliably
const logoPath = resolve(__dirname, "../images/logo.jpg"); // Adjust path as needed

export const authRouter = express.Router();

const otpStore = new Map();
const verifiedEmails = new Set();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

authRouter.post("/signup", async (req, res) => {
  const { email, phone } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

  if (existingUser) {
    return res.status(400).json({
      error: existingUser.email === email
        ? "Email already taken!" : "Phone number already taken!"
    });
  }

  await User.create(req.body);
  res.send("Sign Up Successfully!");
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || user.password !== password)
    return res.status(400).json({ error: "Invalid email or password!" });

  if (user.userstatus === 0)
    return res.status(403).json({ error: "Account deactivated." });

  req.session.userId = user._id;
  res.json({ message: "Login successful!", userId: user._id, email });
});

authRouter.get("/check-session", (req, res) => {
  res.json({ loggedIn: !!req.session.userId, userId: req.session.userId });
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Logout failed.");
    res.clearCookie("connect.sid");
    res.send("Logged out successfully.");
  });
});

authRouter.post("/check-email", async (req, res) => {
  const exists = await User.exists({ email: req.body.email });
  res.json({ exists: !!exists });
});

authRouter.post("/check-phone", async (req, res) => {
  const exists = await User.exists({ phone: req.body.phone });
  res.json({ exists: !!exists });
});

authRouter.post("/forgot-password/send", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "🔐 Your OTP Code - Action Required",
  text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
  html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #001f1f; padding: 30px;">
    <div style="max-width: 550px; margin: auto; background: rgba(0, 255, 204, 0.2); border-radius: 12px; padding: 35px; color: white; box-shadow: 0 0 20px rgba(0, 255, 204, 0.3); border: 1px solid #00ffcc;">
      
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:eventsphereLogo" alt="EventSphere Logo" style="height: 80px; margin-bottom: 10px;" />
        <h1 style="margin: 0; font-size: 28px; border-radius: 10px; border: 2px solid white; background: linear-gradient(to right, #00ffcc, #00bfa6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          🔐 Verify Your Email
        </h1>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #e0ffff;">
        Hello there,
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #ccf2f2;">
        We're excited to help you verify your account. Please use the following One-Time Password (OTP) to complete your email verification:
      </p>

      <div style="text-align: center; margin: 35px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: 600; background: #00ffcc; color: #001f1f; padding: 14px 28px; border-radius: 10px; letter-spacing: 3px; box-shadow: 0 0 12px #00ffcc;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 15px; color: #b2fefa;">
        ⚠️ This code will expire in <strong>10 minutes</strong>. Do not share this OTP with anyone, including our team.
      </p>

      <p style="font-size: 15px; color: #b2fefa;">
        If you did not request this verification, feel free to ignore this email — no action is needed.
      </p>

      <hr style="border: none; border-top: 1px solid #00ffcc; margin: 35px 0;">

      <p style="font-size: 14px; text-align: center; color: #00ffcc;">Thanks for being with us!<br><strong>— EventSphere Team</strong></p>
    </div>
  </div>
  `,
  attachments: [{
    filename: 'logo.jpg',
    path: logoPath,
    cid: 'eventsphereLogo'
  }]
});
  res.json({ message: "OTP sent" });
});

authRouter.post("/forgot-password/verify", (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt)
    return res.status(400).json({ error: "Invalid or expired OTP" });

  verifiedEmails.add(email);
  otpStore.delete(email);
  res.json({ message: "OTP verified successfully" });
});

authRouter.post("/forgot-password/reset", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!verifiedEmails.has(email))
    return res.status(403).json({ error: "OTP not verified or expired" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  user.password = newPassword;
  await user.save();
  verifiedEmails.delete(email);
  res.json({ message: "Password reset successful" });
});

// server.js or routes/auth.js (wherever you handle auth)
authRouter.get('/check-session', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.json({ loggedIn: false });
  }
});

authRouter.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out.');
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      return res.status(200).send('Logged out successfully.');
    });
  } else {
    res.status(400).send('No active session found.');
  }
});

// 📌 USER PROFILE ROUTE (GET)
authRouter.get("/Profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// 📌 UPDATE PROFILE ROUTE (PUT)
authRouter.put("/profile/update/:id", async (req, res) => {
  try {
    const { email, phone } = req.body;
    const userId = req.params.id;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: userId },
    });

    if (existingUser) {
      if (existingUser.email === email)
        return res.status(400).json({ message: "Email already taken" });
      if (existingUser.phone === phone)
        return res.status(400).json({ message: "Phone number already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// 📌 DELETE ACCOUNT ROUTE (DELETE)
authRouter.delete("/profile/delete/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Error deleting user." });
  }
});