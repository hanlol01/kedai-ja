import mongoose from 'mongoose';

export interface IMenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  image?: string;
  available: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Makanan', 'Minuman'],
  },
  image: {
    type: String,
    default: '',
  },
  available: {
    type: Boolean,
    default: true,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);