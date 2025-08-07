import { initializeCronJobs } from './cronJobs';
import { realTimeSync } from './realTimeSync';

// Inisialisasi sistem saat aplikasi start
export const initializeSystem = () => {
  // Initialize cron jobs
  if (typeof window === 'undefined') {
    // Only run on server side
    try {
      // Initialize cron jobs (setiap 1 menit)
      initializeCronJobs();
      
      // Initialize real-time sync (setiap 10 detik) - OPSIONAL
      if (process.env.ENABLE_REALTIME_SYNC === 'true') {
        realTimeSync.start(10); // Setiap 10 detik
        console.log('🚀 Real-time sync initialized (every 10 seconds)');
      }
      
      console.log('🚀 System initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize system:', error);
    }
  }
};

// Auto-initialize jika file ini di-import
if (typeof window === 'undefined') {
  initializeSystem();
} 