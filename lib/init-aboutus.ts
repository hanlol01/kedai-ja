import mongoose from 'mongoose';
import AboutUs from '@/models/AboutUs';

// Fungsi untuk menginisialisasi data AboutUs jika belum ada
export async function initializeAboutUsCollection() {
  try {
    // Pastikan koneksi DB sudah terbuka
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not established');
    }
    
    // Cek apakah koleksi AboutUs kosong
    const count = await AboutUs.countDocuments();
    
    if (count === 0) {
      console.log('AboutUs collection empty, initializing with default data...');
      
      // Data default
      const defaultData = {
        title: 'Tentang Kami',
        subtitle: 'Selamat Datang di Kedai J.A',
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Kami berkomitmen untuk menyajikan hidangan berkualitas tinggi dengan bahan-bahan segar pilihan.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan. Setiap hidangan dibuat dengan penuh cinta dan keahlian oleh chef berpengalaman kami.',
        companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Didirikan dengan visi untuk melestarikan warisan kuliner nusantara, kami berkomitmen menyajikan hidangan berkualitas tinggi menggunakan bahan-bahan segar pilihan dan resep turun-temurun yang telah diwariskan dari generasi ke generasi.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          image1: '',
          image2: '',
          image3: '',
          image4: '',
          lingkunganKedai: [],
          spotTempatDuduk: []
        }
      };
      
      // Buat dokumen baru
      const newAboutUs = new AboutUs(defaultData);
      const result = await newAboutUs.save();
      
      console.log('AboutUs initialized successfully with ID:', result._id);
      return result;
    } else {
      console.log(`AboutUs collection already has ${count} documents, skipping initialization`);
      return await AboutUs.findOne().lean();
    }
  } catch (error) {
    console.error('Error initializing AboutUs collection:', error);
    throw error;
  }
}
