# 🔧 Setup Checklist - Google Sheets Integration

## ✅ **Langkah-langkah Verifikasi Setup**

### 1. **File Structure Check**
```
project/
├── service-account.json          ← ✅ Harus ada
├── .env.local                    ← ✅ Harus ada
├── lib/
│   ├── googleSheet.ts            ← ✅ Sudah dibuat
│   ├── cronJobs.ts               ← ✅ Sudah dibuat
│   └── init.ts                   ← ✅ Sudah dibuat
└── app/api/sync/
    ├── spreadsheet-to-db/        ← ✅ Sudah dibuat
    ├── db-to-spreadsheet/        ← ✅ Sudah dibuat
    ├── manual/                   ← ✅ Sudah dibuat
    └── test/                     ← ✅ Sudah dibuat
```

### 2. **Environment Variables Check**
File `.env.local` harus berisi:
```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-actual-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json

# Cron Job Configuration
ENABLE_CRON_SYNC=true

# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. **Service Account Setup**
- ✅ File `service-account.json` ada di root project
- ✅ File tidak di-commit ke git (ada di .gitignore)
- ✅ Service account email sudah di-share ke spreadsheet

### 4. **Spreadsheet Setup**
- ✅ Spreadsheet dengan nama `flowise_test`
- ✅ Sheet dengan nama `Sheet1`
- ✅ Header: `Nama menu | Harga | Stok`
- ✅ Service account punya permission "Editor"

### 5. **Dependencies Check**
```bash
npm list googleapis cron
```

### 6. **Test Configuration**
```bash
# Test endpoint
curl http://localhost:3000/api/sync/test
```

## 🧪 **Testing Steps**

### **Step 1: Test Configuration**
1. Restart development server: `npm run dev`
2. Buka: `http://localhost:3000/api/sync/test`
3. Cek response untuk memastikan semua config benar

### **Step 2: Test Database Connection**
1. Buka: `http://localhost:3000/api/sync/spreadsheet-to-db`
2. Seharusnya tidak error (meskipun spreadsheet kosong)

### **Step 3: Test Manual Sync**
1. Buka: `http://localhost:3000/api/sync/manual`
2. Cek status cron job

### **Step 4: Test Admin Panel**
1. Buka: `http://localhost:3000/admin/menu`
2. Coba tambah menu baru
3. Cek apakah otomatis sync ke spreadsheet

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Module not found"**
**Solution:** Pastikan semua dependencies terinstall
```bash
npm install googleapis cron
```

### **Issue 2: "Service account key not found"**
**Solution:** Pastikan file `service-account.json` ada di root project

### **Issue 3: "Spreadsheet not found"**
**Solution:** 
- Cek `GOOGLE_SPREADSHEET_ID` di `.env.local`
- Pastikan service account punya akses ke spreadsheet

### **Issue 4: "Database connection failed"**
**Solution:** 
- Cek `MONGODB_URI` di `.env.local`
- Pastikan MongoDB server berjalan

### **Issue 5: "Cron job not starting"**
**Solution:** 
- Cek `ENABLE_CRON_SYNC=true` di `.env.local`
- Restart development server

## 📋 **Final Verification**

Setelah semua setup selesai, Anda harus melihat:

### **Console Logs:**
```
🚀 System initialized successfully
🕐 [CRON] Spreadsheet to DB sync job started (every 5 minutes)
✅ MongoDB connected successfully
```

### **Test Endpoints:**
- ✅ `/api/sync/test` - Configuration test
- ✅ `/api/sync/spreadsheet-to-db` - Database sync
- ✅ `/api/sync/db-to-spreadsheet` - Spreadsheet sync
- ✅ `/api/sync/manual` - Manual sync

### **Admin Panel:**
- ✅ Menu management berfungsi
- ✅ Auto-sync ke spreadsheet
- ✅ Manual sync control

## 🎯 **Next Steps**

1. **Test dengan data real** di spreadsheet
2. **Monitor console logs** untuk sync activity
3. **Setup monitoring** untuk production
4. **Backup data** sebelum testing

---

**Jika masih ada error, silakan share error message lengkap untuk troubleshooting lebih lanjut.** 