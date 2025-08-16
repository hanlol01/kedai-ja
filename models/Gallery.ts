import mongoose from 'mongoose';

interface IGallery {
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  fileName: string;
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new mongoose.Schema<IGallery>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index untuk performa
GallerySchema.index({ isActive: 1, createdAt: -1 });
GallerySchema.index({ fileType: 1, isActive: 1 });

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
