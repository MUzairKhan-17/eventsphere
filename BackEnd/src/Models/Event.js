import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String },
  date: { type: String },
  location: { type: String },
});

export const Event = mongoose.model('events', eventSchema);