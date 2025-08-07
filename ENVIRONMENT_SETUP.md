# Environment Variables Setup Guide

## 📋 Environment Variables yang Diperlukan

### 1. **MongoDB**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### 2. **Google Sheets Integration**
```env
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
# OPSIONAL untuk local development:
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./path/to/service-account.json
```

### 3. **Sync Configuration**
```env
ENABLE_CRON_SYNC=true
ENABLE_REALTIME_SYNC=false
```

### 4. **NextAuth (jika menggunakan authentication)**
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

---

## 🏠 Local Development Setup

### 1. **Buat file `.env.local`**
```bash
# Di root project
touch .env.local
```

### 2. **Isi environment variables**
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Google Sheets
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here

# Pilih salah satu metode untuk service account:
# Metode 1: Menggunakan file JSON (recommended untuk local)
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json

# Metode 2: Menggunakan JSON string (sama seperti Vercel)
# GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}

# Sync Configuration
ENABLE_CRON_SYNC=true
ENABLE_REALTIME_SYNC=false

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. **Pastikan file `service-account.json` ada**
- Download dari Google Cloud Console
- Letakkan di root project
- Pastikan sudah ditambahkan ke `.gitignore`

---

## ☁️ Vercel Deployment Setup

### 1. **Buka Vercel Dashboard**
- Login ke [vercel.com](https://vercel.com)
- Pilih project Anda

### 2. **Tambahkan Environment Variables**
- Buka **Settings** → **Environment Variables**
- Tambahkan satu per satu:

#### **MongoDB URI**
```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/database
Environment: Production, Preview, Development
```

#### **Google Spreadsheet ID**
```
Key: GOOGLE_SPREADSHEET_ID
Value: your-spreadsheet-id-here
Environment: Production, Preview, Development
```

#### **Google Service Account Key**
```
Key: GOOGLE_SERVICE_ACCOUNT_KEY
Value: {"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
Environment: Production, Preview, Development
```

#### **Sync Configuration**
```
Key: ENABLE_CRON_SYNC
Value: true
Environment: Production, Preview, Development
```

```
Key: ENABLE_REALTIME_SYNC
Value: false
Environment: Production, Preview, Development
```

#### **NextAuth (jika menggunakan)**
```
Key: NEXTAUTH_SECRET
Value: your-secret-key-here
Environment: Production, Preview, Development
```

```
Key: NEXTAUTH_URL
Value: https://your-domain.vercel.app
Environment: Production, Preview, Development
```

### 3. **Redeploy Project**
- Setelah menambahkan semua environment variables
- Klik **Deployments** → **Redeploy** pada deployment terbaru

---

## 🧪 Testing Configuration

### 1. **Test Local**
```bash
# Jalankan development server
npm run dev

# Test endpoint
curl http://localhost:3000/api/sync/test
```

### 2. **Test Vercel**
```bash
# Setelah deploy, test endpoint
curl https://your-domain.vercel.app/api/sync/test
```

### 3. **Expected Response (Success)**
```json
{
  "status": "success",
  "message": "All tests passed! Configuration is working correctly.",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "environment": "production",
  "tests": {
    "environmentVariables": {
      "GOOGLE_SPREADSHEET_ID": true,
      "GOOGLE_SERVICE_ACCOUNT_KEY": true,
      "GOOGLE_SERVICE_ACCOUNT_KEY_FILE": false
    },
    "database": true,
    "spreadsheet": true,
    "spreadsheetConfig": {
      "spreadsheetId": "your-spreadsheet-id-here",
      "sheetName": "Sheet1",
      "range": "A:C"
    }
  },
  "errors": []
}
```

---

## ⚠️ Troubleshooting

### **Error: "The incoming JSON object does not contain a client_email field"**
- **Penyebab**: JSON service account key tidak valid atau terpotong
- **Solusi**: 
  1. Copy ulang seluruh isi file `service-account.json`
  2. Pastikan tidak ada spasi/enter di awal/akhir
  3. Test di [jsonlint.com](https://jsonlint.com/)

### **Error: "Spreadsheet not found"**
- **Penyebab**: `GOOGLE_SPREADSHEET_ID` salah atau service account tidak punya akses
- **Solusi**:
  1. Cek spreadsheet ID di URL Google Sheets
  2. Share spreadsheet dengan service account email
  3. Pastikan service account punya permission "Editor"

### **Error: "Database connection failed"**
- **Penyebab**: `MONGODB_URI` salah atau network issue
- **Solusi**:
  1. Cek connection string MongoDB
  2. Pastikan IP address di whitelist (jika menggunakan MongoDB Atlas)
  3. Cek username/password

### **Environment Variables tidak terbaca**
- **Penyebab**: Cache atau perlu restart
- **Solusi**:
  1. Restart development server (`Ctrl+C` lalu `npm run dev`)
  2. Di Vercel: Redeploy project
  3. Cek environment variable sudah disimpan dengan benar

---

## 🔒 Security Notes

1. **Jangan commit file `service-account.json`** ke repository
2. **Gunakan environment variables** untuk semua sensitive data
3. **Restrict service account permissions** di Google Cloud Console
4. **Monitor API usage** untuk mencegah abuse
5. **Rotate keys regularly** untuk security
6. **Jangan pernah expose credentials** di dokumentasi atau kode

---

## 📞 Support

Jika masih mengalami masalah:
1. Cek logs di Vercel Dashboard
2. Test endpoint `/api/sync/test`
3. Share error message lengkap
4. Pastikan semua environment variables sudah benar
