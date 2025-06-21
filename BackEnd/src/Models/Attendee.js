import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  fullname: String,
  phone: String,
  email: String,
  password: { type: String, required: true, select: false },
  attendeestatus: { type: Number, default: 2 }
});

export const Attendee = mongoose.model('Attendees', attendeeSchema);