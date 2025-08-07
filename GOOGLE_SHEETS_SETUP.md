# 🚀 Integrasi Google Sheets dengan MongoDB

Dokumentasi lengkap untuk setup integrasi dua arah antara Google Spreadsheet dan database MongoDB.

## 📋 Prerequisites

- Google Cloud Project
- Google Sheets API enabled
- Service Account credentials
- MongoDB database
- Next.js application

## 🔧 Setup Google Cloud & Service Account

### 1. Buat Google Cloud Project
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Aktifkan Google Sheets API

### 2. Buat Service Account
1. Buka "IAM & Admin" > "Service Accounts"
2. Klik "Create Service Account"
3. Beri nama: `agent-flowise@top-moment-466804-j6.iam.gserviceaccount.com`
4. Berikan role: "Editor"
5. Buat dan download JSON key file

### 3. Setup Spreadsheet
1. Buat spreadsheet baru dengan nama `flowise_test`
2. Buat sheet dengan nama `Sheet1`
3. Setup header: `Nama menu | Harga | Stok`
4. Share spreadsheet ke email service account dengan permission "Editor"

## 📁 File Structure

```
project/
├── lib/
│   ├── googleSheet.ts          # Google Sheets API functions
│   ├── cronJobs.ts             # Cron job scheduler
│   └── init.ts                 # System initialization
├── app/api/sync/
│   ├── spreadsheet-to-db/      # Sync spreadsheet → database
│   ├── db-to-spreadsheet/      # Sync database → spreadsheet
│   └── manual/                 # Manual sync trigger
└── models/
    └── MenuItem.ts             # MongoDB model
```

## 🔑 Environment Variables

Buat file `.env.local` dengan konfigurasi berikut:

```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json

# Cron Job Configuration
ENABLE_CRON_SYNC=true

# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## 📊 Data Mapping

### Spreadsheet → MongoDB
| Spreadsheet | MongoDB | Type |
|-------------|---------|------|
| Nama menu | name | String |
| Harga | price | Number |
| Stok | available | Boolean |

### MongoDB → Spreadsheet
| MongoDB | Spreadsheet | Type |
|---------|-------------|------|
| name | Nama menu | String |
| price | Harga | Number |
| available | Stok | String ("Tersedia"/"Habis") |

## 🔄 API Endpoints

### 1. Sync Spreadsheet → Database
```
GET/POST /api/sync/spreadsheet-to-db
```
- Membaca data dari spreadsheet
- Update/insert ke database MongoDB
- Response: jumlah item yang diupdate/dibuat

### 2. Sync Database → Spreadsheet
```
GET/POST /api/sync/db-to-spreadsheet
```
- Membaca semua data dari database
- Overwrite spreadsheet dengan data terbaru
- Response: jumlah item yang disync

### 3. Manual Sync Trigger
```
POST /api/sync/manual
```
- Trigger manual sync dari admin panel
- Membutuhkan authentication
- Response: status sync

### 4. Sync Status
```
GET /api/sync/manual
```
- Cek status sistem sync
- Response: cron enabled, last sync time

## ⏰ Cron Jobs

### Auto Sync (Setiap 5 Menit)
- Membaca perubahan dari spreadsheet
- Update database secara otomatis
- Log semua aktivitas sync

### Konfigurasi
```typescript
// Setiap 5 menit
'*/5 * * * *'

// Timezone: Asia/Jakarta
'Asia/Jakarta'
```

## 🎯 Flow Integrasi

### 1. Admin Menambah Menu Baru
```
Panel Admin → POST /api/menu → MongoDB → Auto Append Spreadsheet
```

### 2. Admin Update Menu
```
Panel Admin → PUT /api/menu/[id] → MongoDB → Auto Update Spreadsheet
```

### 3. Admin Delete Menu
```
Panel Admin → DELETE /api/menu/[id] → MongoDB → Auto Rewrite Spreadsheet
```

### 4. Spreadsheet Update
```
Spreadsheet → Cron Job (5 min) → MongoDB Update
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install googleapis cron
```

### 2. Setup Service Account
1. Simpan file `service-account.json` di root project
2. Pastikan file tidak di-commit ke git (tambahkan ke .gitignore)

### 3. Konfigurasi Environment
1. Copy `.env.example` ke `.env.local`
2. Isi dengan nilai yang sesuai
3. Restart development server

### 4. Test Integration
1. Jalankan `npm run dev`
2. Test endpoint `/api/sync/spreadsheet-to-db`
3. Cek log untuk memastikan sync berjalan

## 🔍 Monitoring & Logging

### Console Logs
- `🔄 Starting sync...` - Sync dimulai
- `✅ Updated: [name]` - Item berhasil diupdate
- `🆕 Created: [name]` - Item baru dibuat
- `❌ Sync error` - Error saat sync
- `🕐 [CRON]` - Cron job logs

### Error Handling
- Sync errors tidak menghentikan aplikasi
- Log semua error untuk debugging
- Graceful fallback jika spreadsheet tidak tersedia

## 🚨 Important Notes

### Security
- Service account credentials harus aman
- Jangan commit `service-account.json` ke git
- Gunakan environment variables untuk sensitive data

### Data Consistency
- Nama menu sebagai primary key untuk mapping
- Case-insensitive matching untuk nama menu
- Backup data sebelum testing

### Performance
- Cron job berjalan setiap 5 menit
- Batch processing untuk multiple items
- Error handling untuk network issues

## 🐛 Troubleshooting

### Common Issues

1. **Service Account Error**
   - Pastikan file credentials benar
   - Cek permission di Google Cloud Console
   - Verifikasi spreadsheet sharing

2. **Spreadsheet Not Found**
   - Cek GOOGLE_SPREADSHEET_ID
   - Pastikan service account punya akses
   - Verifikasi sheet name dan range

3. **Cron Job Not Running**
   - Cek ENABLE_CRON_SYNC environment variable
   - Restart aplikasi setelah setup
   - Cek console logs untuk error

4. **Data Not Syncing**
   - Cek format data di spreadsheet
   - Verifikasi mapping field
   - Test manual sync endpoint

### Debug Commands
```bash
# Test spreadsheet connection
curl http://localhost:3000/api/sync/spreadsheet-to-db

# Test database sync
curl http://localhost:3000/api/sync/db-to-spreadsheet

# Check sync status
curl http://localhost:3000/api/sync/manual
```

## 📈 Future Enhancements

- Real-time sync dengan Google Sheets webhook
- Conflict resolution untuk concurrent updates
- Sync history dan audit trail
- Admin panel untuk monitoring sync status
- Email notifications untuk sync errors 