# 🚀 Panduan Deploy ke Vercel dengan Google Sheets Integration

## 📋 **Prerequisites**

- ✅ Vercel account
- ✅ Google Cloud Project dengan service account
- ✅ Google Spreadsheet yang sudah disetup
- ✅ MongoDB database (Atlas atau lainnya)

## 🔧 **Setup Environment Variables di Vercel**

### **1. Buka Vercel Dashboard**
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Buka tab **"Settings"** → **"Environment Variables"**

### **2. Tambahkan Environment Variables**

```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json

# Cron Job Configuration
ENABLE_CRON_SYNC=true
ENABLE_REALTIME_SYNC=false

# Database Configuration
MONGODB_URI=your-mongodb-atlas-connection-string

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### **3. Setup Service Account untuk Production**

**Option A: Environment Variable (Recommended)**
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Option B: Upload File (Alternative)**
1. Upload `service-account.json` ke Vercel
2. Set `GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./service-account.json`

## 🔄 **Update Google Sheets Configuration**

### **1. Update lib/googleSheet.ts untuk Production**
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
search_replace
