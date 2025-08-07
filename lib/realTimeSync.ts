import connectDB from './db';
import MenuItem from '@/models/MenuItem';
import { readSpreadsheetData } from './googleSheet';

// Real-time sync dengan polling setiap 10 detik
export class RealTimeSync {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private lastSyncTime = new Date();

  // Start real-time sync
  start(intervalSeconds: number = 10) {
    if (this.isRunning) {
      console.log('🔄 Real-time sync already running');
      return;
    }

    this.isRunning = true;
    console.log(`🚀 Starting real-time sync (every ${intervalSeconds} seconds)`);

    this.intervalId = setInterval(async () => {
      await this.performSync();
    }, intervalSeconds * 1000);

    // Perform initial sync
    this.performSync();
  }

  // Stop real-time sync
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('⏹️ Real-time sync stopped');
  }

  // Perform sync operation
  private async performSync() {
    try {
      console.log('🔄 [REAL-TIME] Checking for spreadsheet updates...');
      
      await connectDB();
      const spreadsheetData = await readSpreadsheetData();
      
      if (spreadsheetData.length === 0) {
        console.log('🔄 [REAL-TIME] No data found in spreadsheet');
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
            // Check if data actually changed
            if (existingItem.price !== row.price || existingItem.available !== row.available) {
              await MenuItem.findByIdAndUpdate(
                existingItem._id,
                {
                  price: row.price,
                  available: row.available,
                  updatedAt: new Date()
                }
              );
              updatedCount++;
              console.log(`🔄 [REAL-TIME] Updated: ${row.name} - Price: ${row.price}, Available: ${row.available}`);
            }
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
            console.log(`🆕 [REAL-TIME] Created: ${row.name} - Price: ${row.price}, Available: ${row.available}`);
          }
        } catch (error) {
          console.error(`🔄 [REAL-TIME] Error processing "${row.name}":`, error);
        }
      }
      
      if (updatedCount > 0 || createdCount > 0) {
        this.lastSyncTime = new Date();
        console.log(`✅ [REAL-TIME] Sync completed: ${updatedCount} updated, ${createdCount} created`);
      }
    } catch (error) {
      console.error('🔄 [REAL-TIME] Sync error:', error);
    }
  }

  // Get sync status
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastSyncTime: this.lastSyncTime,
      intervalId: this.intervalId ? 'active' : 'inactive'
    };
  }
}

// Export singleton instance
export const realTimeSync = new RealTimeSync(); 