import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
});

export const Contact = mongoose.model('contacts', contactSchema);