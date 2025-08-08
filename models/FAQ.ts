import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  category: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    category: {
      type: String,
      required: [true, 'Kategori FAQ diperlukan'],
      trim: true,
    },
    question: {
      type: String,
      required: [true, 'Pertanyaan FAQ diperlukan'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Jawaban FAQ diperlukan'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk pencarian
FAQSchema.index({ category: 'text', question: 'text', answer: 'text' });

const FAQ = mongoose.models.FAQ || mongoose.model<IFAQ>('FAQ', FAQSchema);

export default FAQ;
