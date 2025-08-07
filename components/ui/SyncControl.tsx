'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncStatus {
  success: boolean;
  message: string;
  cronEnabled?: boolean;
  lastSync?: string;
}

export default function SyncControl() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [lastAction, setLastAction] = useState<string>('');

  const triggerSync = async (action: 'spreadsheet-to-db' | 'db-to-spreadsheet' | 'manual') => {
    setIsLoading(true);
    setLastAction(action);
    
    try {
      const response = await fetch(`/api/sync/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      setSyncStatus(data);
      
      if (data.success) {
        // Refresh page after successful sync to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setSyncStatus({
        success: false,
        message: 'Failed to trigger sync',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync/manual');
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      setSyncStatus({
        success: false,
        message: 'Failed to check sync status',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Google Sheets Sync Control
        </CardTitle>
        <CardDescription>
          Kelola sinkronisasi data antara Google Spreadsheet dan database
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Display */}
        {syncStatus && (
          <div className={`p-3 rounded-lg border ${
            syncStatus.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {syncStatus.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                syncStatus.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {syncStatus.message}
              </span>
            </div>
            
            {syncStatus.cronEnabled !== undefined && (
              <div className="mt-2">
                <Badge variant={syncStatus.cronEnabled ? "default" : "secondary"}>
                  Cron Job: {syncStatus.cronEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            )}
            
            {syncStatus.lastSync && (
              <div className="mt-1 text-xs text-gray-600">
                Last Sync: {new Date(syncStatus.lastSync).toLocaleString('id-ID')}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => triggerSync('spreadsheet-to-db')}
            disabled={isLoading}
            variant="outline"
            className="h-auto py-3 px-4"
          >
            {isLoading && lastAction === 'spreadsheet-to-db' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            <div className="text-left">
              <div className="font-medium">Spreadsheet → DB</div>
              <div className="text-xs text-gray-500">Update database dari spreadsheet</div>
            </div>
          </Button>

          <Button
            onClick={() => triggerSync('db-to-spreadsheet')}
            disabled={isLoading}
            variant="outline"
            className="h-auto py-3 px-4"
          >
            {isLoading && lastAction === 'db-to-spreadsheet' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            <div className="text-left">
              <div className="font-medium">DB → Spreadsheet</div>
              <div className="text-xs text-gray-500">Update spreadsheet dari database</div>
            </div>
          </Button>

          <Button
            onClick={() => triggerSync('manual')}
            disabled={isLoading}
            variant="outline"
            className="h-auto py-3 px-4"
          >
            {isLoading && lastAction === 'manual' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            <div className="text-left">
              <div className="font-medium">Manual Sync</div>
              <div className="text-xs text-gray-500">Trigger manual sync</div>
            </div>
          </Button>
        </div>

        {/* Status Check Button */}
        <div className="flex justify-center">
          <Button
            onClick={checkSyncStatus}
            disabled={isLoading}
            variant="ghost"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Sync Status
          </Button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informasi Sync</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Auto sync berjalan setiap 5 menit dari spreadsheet ke database</li>
            <li>• Perubahan di admin panel otomatis sync ke spreadsheet</li>
            <li>• Spreadsheet hanya mengontrol harga dan stok</li>
            <li>• Deskripsi, kategori, dan gambar hanya diatur dari admin panel</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 