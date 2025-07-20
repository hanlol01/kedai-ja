import mongoose from 'mongoose';

export interface ISettings {
  _id?: string;
  restaurantName: string;
  description: string;
  address: string;
  contact: string;
  hours: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SettingsSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    default: 'Kedai J.A'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    default: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi'
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    default: 'Jl. Raya Leles No.45, Garut'
  },
  contact: {
    type: String,
    required: [true, 'Contact is required'],
    trim: true,
    default: '081234567890'
  },
  hours: {
    type: String,
    required: [true, 'Hours is required'],
    trim: true,
    default: 'Senin - Minggu, 09.00 - 21.00'
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    default: 'admin@email.com'
  },
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);