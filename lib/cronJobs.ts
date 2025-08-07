import { CronJob } from 'cron';
import connectDB from './db';
import MenuItem from '@/models/MenuItem';
import { readSpreadsheetData } from './googleSheet';

// Fungsi untuk sync dari spreadsheet ke database
const syncSpreadsheetToDB = async () => {
  try {
    console.log('🕐 [CRON] Starting scheduled sync from spreadsheet to database...');
    
    await connectDB();
    const spreadsheetData = await readSpreadsheetData();
    
    if (spreadsheetData.length === 0) {
      console.log('🕐 [CRON] No data found in spreadsheet');
      return;
    }
    
    let updatedCount = 0;
    let createdCount = 0;
    
    for (const row of spreadsheetData) {
      try {
        const existingItem = await MenuItem.findOne({
          name: { $regex: new RegExp(`^${row.name}$`, 'i') }
        });
        
        if (existingItem) {
          // Update existing item
          await MenuItem.findByIdAndUpdate(
            existingItem._id,
            {
              price: row.price,
              available: row.available,
              updatedAt: new Date()
            }
          );
          updatedCount++;
        } else {
          // Create new item
          const newItem = new MenuItem({
            name: row.name,
            description: `Deskripsi untuk ${row.name}`,
            price: row.price,
            category: 'Makanan',
            available: row.available,
            image: '',
            isBestSeller: false
          });
          await newItem.save();
          createdCount++;
        }
      } catch (error) {
        console.error(`🕐 [CRON] Error processing "${row.name}":`, error);
      }
    }
    
    console.log(`🕐 [CRON] Sync completed: ${updatedCount} updated, ${createdCount} created`);
  } catch (error) {
    console.error('🕐 [CRON] Sync error:', error);
  }
};

// Inisialisasi cron jobs
export const initializeCronJobs = () => {
  // Sync dari spreadsheet ke database setiap 1 menit
  const spreadsheetToDBCron = new CronJob(
    '*/1 * * * *', // Setiap 1 menit
    syncSpreadsheetToDB,
    null,
    false, // Don't start automatically
    'Asia/Jakarta'
  );
  
  // Start cron job jika environment variable diaktifkan
  if (process.env.ENABLE_CRON_SYNC === 'true') {
    spreadsheetToDBCron.start();
    console.log('🕐 [CRON] Spreadsheet to DB sync job started (every 1 minute)');
  } else {
    console.log('🕐 [CRON] Cron jobs disabled (ENABLE_CRON_SYNC not set to true)');
  }
  
  return {
    spreadsheetToDBCron
  };
};

// Manual trigger function
export const triggerManualSync = async () => {
  console.log('🔄 Manual sync triggered...');
  await syncSpreadsheetToDB();
}; 