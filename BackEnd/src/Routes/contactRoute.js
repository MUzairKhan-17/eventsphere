// routes/contactRouter.js
import express from "express";
import { Contact } from "../Models/Contact.js";

export const contactRouter = express.Router();

// Submit a contact form
contactRouter.post("/submit", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: "Contact form submitted successfully", contact });
  } catch (err) {
    res.status(500).json({ error: "Error submitting contact form" });
  }
});

// Get all contact messages (for admin view)
contactRouter.get("/fetch", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching contact messages" });
  }
});

// Get a specific contact message by ID
contactRouter.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: "Contact message not found" });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving contact message" });
  }
});

// Delete a contact message
contactRouter.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Contact message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting contact message" });
  }
});