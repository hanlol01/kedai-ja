import mongoose from 'mongoose';
import AboutUs from '@/models/AboutUs';

// Fungsi khusus untuk koneksi database di Vercel
export async function connectToDBWithRetry(maxRetries: number = 3, retryDelayMs: number = 1000): Promise<boolean> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      // Periksa status koneksi mongoose
      if (mongoose.connection.readyState === 1) {
        console.log("MongoDB connection already established");
        return true;
      }
      
      // Coba koneksi ke MongoDB dengan timeout yang lebih lama di Vercel (8 detik)
      await Promise.race([
        mongoose.connect(process.env.MONGODB_URI as string),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 8000))
      ]);
      
      console.log("MongoDB connected successfully");
      return true;
    } catch (err) {
      retries++;
      console.warn(`MongoDB connection attempt ${retries} failed:`, err);
      
      if (retries >= maxRetries) {
        console.error("Max connection retries reached, giving up");
        return false;
      }
      
      // Tunggu sebelum mencoba lagi dengan exponential backoff
      await new Promise(resolve => setTimeout(resolve, retryDelayMs * retries));
    }
  }
  
  return false;
}

// Fungsi untuk memastikan data about-us ada di database
// Ini akan membuat data default jika tidak ada, berguna untuk inisialisasi
export async function ensureAboutUsExists(): Promise<any> {
  try {
    // Cek apakah data about-us sudah ada
    const existingData = await AboutUs.findOne({}).lean();
    
    if (!existingData) {
      console.log("No AboutUs data found, creating default data");
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
      const savedData = await newAboutUs.save();
      return savedData;
    }
    
    return existingData;
  } catch (error) {
    console.error("Error ensuring AboutUs data exists:", error);
    throw error;
  }
}
