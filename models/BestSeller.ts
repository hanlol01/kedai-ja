import mongoose from 'mongoose';

export interface IBestSeller {
  _id?: string;
  menuId: string;
  createdAt?: Date;
}

const BestSellerSchema = new mongoose.Schema({
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
    unique: true, // Pastikan satu menu hanya bisa jadi best seller sekali
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index untuk performa yang lebih baik
BestSellerSchema.index({ createdAt: -1 });
BestSellerSchema.index({ menuId: 1 });

export default mongoose.models.BestSeller || mongoose.model<IBestSeller>('BestSeller', BestSellerSchema);