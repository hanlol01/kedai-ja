import mongoose, { Schema, model, models } from 'mongoose';

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Testimonial = models.Testimonial || model('Testimonial', TestimonialSchema);

export default Testimonial; 