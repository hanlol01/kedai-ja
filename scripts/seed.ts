import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../lib/db';
import Admin from '../models/Admin';
import MenuItem from '../models/MenuItem';
import Settings from '../models/Settings';
import BestSeller from '../models/BestSeller';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await MenuItem.deleteMany({});
    await Settings.deleteMany({});
    await BestSeller.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      email: 'admin@kedai-ja.com',
      password: hashedPassword,
      name: 'Admin Kedai J.A'
    });
    await admin.save();
    console.log('👤 Created admin account: admin@kedai-ja.com / admin123');

    // Create menu items
    const menuItems = [
      {
        name: 'Es Teh Manis',
        description: 'Teh manis segar dengan es batu, minuman tradisional yang menyegarkan',
        price: 5000,
        category: 'Minuman',
        image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg',
        available: true
      },
      {
        name: 'Mie Goreng',
        description: 'Mie goreng spesial dengan bumbu rahasia, dilengkapi sayuran segar dan telur',
        price: 12000,
        category: 'Makanan',
        image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
        available: true
      },
      {
        name: 'Sate Ayam',
        description: 'Sate ayam bakar dengan bumbu kacang khas, disajikan dengan lontong dan lalapan',
        price: 15000,
        category: 'Makanan',
        image: 'https://images.pexels.com/photos/4518669/pexels-photo-4518669.jpeg',
        available: true
      },
      {
        name: 'Nasi Gudeg',
        description: 'Nasi gudeg khas Yogyakarta dengan ayam dan telur, cita rasa manis yang autentik',
        price: 18000,
        category: 'Makanan',
        image: 'https://images.pexels.com/photos/4518669/pexels-photo-4518669.jpeg',
        available: true
      },
      {
        name: 'Es Cendol',
        description: 'Es cendol segar dengan santan dan gula merah, minuman penutup yang sempurna',
        price: 8000,
        category: 'Minuman',
        image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg',
        available: true
      },
      {
        name: 'Gado-Gado',
        description: 'Gado-gado dengan sayuran segar dan bumbu kacang yang kaya rasa',
        price: 14000,
        category: 'Makanan',
        image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
        available: true
      }
    ];

    const createdMenuItems = [];
    for (const item of menuItems) {
      const menuItem = new MenuItem(item);
      const savedItem = await menuItem.save();
      createdMenuItems.push(savedItem);
    }
    console.log('🍽️  Created menu items:', menuItems.length);

    // Create some best sellers (first 4 menu items untuk demo yang lebih baik)
    for (let i = 0; i < Math.min(4, createdMenuItems.length); i++) {
      const bestSeller = new BestSeller({
        menuId: createdMenuItems[i]._id
      });
      await bestSeller.save();
    }
    console.log('⭐ Created best sellers: 4 items');

    // Create settings
    const settings = new Settings({
      restaurantName: 'Kedai J.A',
      description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
      address: 'Jl. Raya Leles No.45, Garut',
      contact: '081234567890',
      hours: 'Senin - Minggu, 09.00 - 21.00',
      email: 'info@kedai-ja.com'
    });
    await settings.save();
    console.log('⚙️  Created restaurant settings');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Admin: admin@kedai-ja.com / admin123');
    console.log('- Menu items: 6 items created');
    console.log('- Best sellers: 4 items created');
    console.log('- Restaurant settings: configured');
    console.log('\n🚀 You can now start the application with: npm run dev');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedDatabase();