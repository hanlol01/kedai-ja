import mongoose from 'mongoose';

export interface IAboutUs {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  secondDescription: string;
  companyDescription: string;
  yearsOfExperience: number;
  masterChefs: number;
  images: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    lingkunganKedai: string[];
    spotTempatDuduk: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const AboutUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'About Us'
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true,
    default: 'Welcome to Kedai J.A'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    default: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos erat ipsum et lorem et sit, sed stet lorem sit.'
  },
  secondDescription: {
    type: String,
    required: [true, 'Second description is required'],
    trim: true,
    default: 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet'
  },
  companyDescription: {
    type: String,
    required: [true, 'Company description is required'],
    trim: true,
    default: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Didirikan dengan visi untuk melestarikan warisan kuliner nusantara, kami berkomitmen menyajikan hidangan berkualitas tinggi menggunakan bahan-bahan segar pilihan dan resep turun-temurun yang telah diwariskan dari generasi ke generasi.'
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years must be positive'],
    default: 7
  },
  masterChefs: {
    type: Number,
    required: [true, 'Master chefs count is required'],
    min: [0, 'Master chefs must be positive'],
    default: 25
  },
  images: {
    image1: {
      type: String,
      default: ''
    },
    image2: {
      type: String,
      default: ''
    },
    image3: {
      type: String,
      default: ''
    },
    image4: {
      type: String,
      default: ''
    },
    lingkunganKedai: {
      type: [String],
      default: []
    },
    spotTempatDuduk: {
      type: [String],
      default: []
    }
  }
}, {
  timestamps: true,
});

export default mongoose.models.AboutUs || mongoose.model<IAboutUs>('AboutUs', AboutUsSchema);