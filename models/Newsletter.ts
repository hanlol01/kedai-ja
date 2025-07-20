import mongoose, { Schema, model, models } from 'mongoose';

const NewsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Newsletter = models.Newsletter || model('Newsletter', NewsletterSchema);

export default Newsletter; 