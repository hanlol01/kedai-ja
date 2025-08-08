# 🔧 Perbaikan Environment Variables Vercel

## ⚠️ Masalah yang Ditemukan:

### **ENABLE_CRON_SYNC = false** ❌
Ini akan **MENONAKTIFKAN** sync otomatis dari spreadsheet ke database!

## ✅ Perbaikan yang Diperlukan:

### **1. Update ENABLE_CRON_SYNC**
```
Key: ENABLE_CRON_SYNC
Value: true
Environment: Production, Preview, Development
```

### **2. Verifikasi Environment Variables Lainnya**
```
✅ GOOGLE_SPREADSHEET_ID = 1BBdNJ6B1DfftCmZxj8sq_tXaM03t-Y8...
✅ GOOGLE_SERVICE_ACCOUNT_KEY = {"type":"service_account",...}
✅ MONGODB_URI = mongodb+srv://mhmdfarhan900:Bebas0...
✅ JWT_SECRET = super_secret_key_kedai_ja_2024
✅ ENABLE_REALTIME_SYNC = false
❌ ENABLE_CRON_SYNC = false (PERLU DIUBAH KE true)
```

## 🚀 Langkah Perbaikan:

### **1. Buka Vercel Dashboard**
- Login ke [vercel.com](https://vercel.com)
- Pilih project Anda

### **2. Update ENABLE_CRON_SYNC**
- Buka **Settings** → **Environment Variables**
- Cari `ENABLE_CRON_SYNC`
- Klik **Edit** (icon pensil)
- Ubah value dari `false` menjadi `true`
- Klik **Save**

### **3. Redeploy Project**
- Setelah mengubah environment variable
- Klik **Deployments** → **Redeploy** pada deployment terbaru

## 🧪 Test Setelah Perbaikan:

### **1. Test Sync Otomatis**
```bash
# Tunggu 1-2 menit setelah deploy
# Cek apakah sync berjalan otomatis
curl https://your-domain.vercel.app/api/sync/test
```

### **2. Expected Response**
```json
{
  "status": "success",
  "message": "All tests passed! Configuration is working correctly.",
  "tests": {
    "environmentVariables": {
      "GOOGLE_SPREADSHEET_ID": true,
      "GOOGLE_SERVICE_ACCOUNT_KEY": true,
      "ENABLE_CRON_SYNC": true  // ← Ini harus true
    },
    "database": true,
    "spreadsheet": true
  }
}
```

## 📋 Checklist Lengkap:

- [ ] `GOOGLE_SPREADSHEET_ID` = spreadsheet ID Anda
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` = JSON service account key
- [ ] `MONGODB_URI` = connection string MongoDB
- [ ] `JWT_SECRET` = secret key untuk authentication
- [ ] `ENABLE_CRON_SYNC` = **true** (PENTING!)
- [ ] `ENABLE_REALTIME_SYNC` = false (opsional)

## ⚡ Dampak Jika ENABLE_CRON_SYNC = false:

1. **Tidak ada sync otomatis** dari spreadsheet ke database
2. **Perubahan di spreadsheet** tidak akan masuk ke database
3. **Hanya manual sync** yang akan bekerja
4. **Cron job tidak berjalan** di background

## 🔄 Cara Manual Sync (jika diperlukan):

```bash
# Trigger manual sync
curl -X POST https://your-domain.vercel.app/api/sync/manual

# Check sync status
curl https://your-domain.vercel.app/api/sync/manual
```

---

**Segera update `ENABLE_CRON_SYNC` ke `true` agar sync otomatis berfungsi!** 🚀
