// routes/eventRouter.js
import express from "express";
import { Event } from "../Models/Event.js";

export const eventRouter = express.Router();

// Create a new event
eventRouter.post("/create", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// Get all events
eventRouter.get("/event-fetch", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Get a single event by ID
eventRouter.get("/event/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Error fetching event" });
  }
});

// Update an event
eventRouter.put("/update/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event updated successfully", updatedEvent });
  } catch (err) {
    res.status(500).json({ error: "Error updating event" });
  }
});

// Delete an event
eventRouter.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting event" });
  }
});