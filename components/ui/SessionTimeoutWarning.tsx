'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function SessionTimeoutWarning() {
  const { showTimeoutWarning, extendSession, logout } = useAdmin();
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (showTimeoutWarning) {
      setCountdown(300); // Reset to 5 minutes
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            logout(); // Auto logout when countdown reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showTimeoutWarning, logout]);

  if (!showTimeoutWarning) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Sesi Akan Berakhir
          </h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Sesi Anda akan berakhir dalam:
          </p>
          <div className="flex items-center justify-center bg-orange-50 rounded-lg p-4">
            <Clock className="h-6 w-6 text-orange-500 mr-2" />
            <span className="text-2xl font-bold text-orange-600">
              {formatTime(countdown)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            Klik "Perpanjang Sesi" untuk melanjutkan atau "Logout" untuk keluar sekarang.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={logout}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Logout Sekarang
          </button>
          <button
            onClick={extendSession}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
          >
            Perpanjang Sesi
          </button>
        </div>
      </div>
    </div>
  );
}