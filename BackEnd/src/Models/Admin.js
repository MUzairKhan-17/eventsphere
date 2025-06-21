import { mongoose } from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
});

export const Admin = mongoose.model('admins', adminSchema);