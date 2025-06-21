import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: String,
  phone: String,
  email: String,
  password: { type: String, required: true, select: false }, // Hidden by default
  userstatus: { type: Number, default: 1 }
});

export const User = mongoose.model('users', userSchema);