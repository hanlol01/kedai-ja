# 🚀 Panduan Deployment Google Sheets Integration

## 📋 **Platform yang Didukung**

- ✅ **Vercel** (Recommended)
- ✅ **Netlify**
- ✅ **Railway**
- ✅ **Heroku**
- ✅ **DigitalOcean App Platform**

## 🔧 **1. Deploy ke Vercel**

### **Setup Environment Variables**

```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# Cron Job Configuration
ENABLE_CRON_SYNC=true
ENABLE_REALTIME_SYNC=false

# Database Configuration
MONGODB_URI=your-mongodb-atlas-connection-string

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### **Update Google Sheets Configuration**

```typescript
// lib/googleSheet.ts - Update untuk production
const auth = new google.auth.GoogleAuth({
  credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    : { keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './service-account.json' },
  scopes: SCOPES,
});
```

### **Vercel Cron Jobs (Alternative)**

Jika cron job tidak berjalan di Vercel, gunakan Vercel Cron:

```typescript
// app/api/cron/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { triggerManualSync } from '@/lib/cronJobs';

export async function GET(request: NextRequest) {
  try {
    await triggerManualSync();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
```

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

## 🔧 **2. Deploy ke Netlify**

### **Environment Variables**
```env
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
ENABLE_CRON_SYNC=true
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.netlify.app
```

### **Netlify Functions (Alternative)**
```typescript
// netlify/functions/sync.js
const { triggerManualSync } = require('../../lib/cronJobs');

exports.handler = async (event, context) => {
  try {
    await triggerManualSync();
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
```

## 🔧 **3. Deploy ke Railway**

### **Environment Variables**
```env
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
ENABLE_CRON_SYNC=true
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.railway.app
```

### **Railway Cron Jobs**
Railway mendukung cron jobs natively. Tambahkan di `railway.toml`:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 300

[[cron]]
schedule = "*/1 * * * *"
command = "curl https://your-domain.railway.app/api/sync/trigger"
```

## 🔧 **4. Deploy ke Heroku**

### **Environment Variables**
```bash
heroku config:set GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
heroku config:set GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
heroku config:set ENABLE_CRON_SYNC=true
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set NEXTAUTH_SECRET=your-secret
heroku config:set NEXTAUTH_URL=https://your-domain.herokuapp.com
```

### **Heroku Scheduler**
```bash
# Install Heroku Scheduler
heroku addons:create scheduler:standard

# Add cron job
heroku scheduler:add "curl https://your-domain.herokuapp.com/api/sync/trigger" --frequency=1min
```

## 🔧 **5. Deploy ke DigitalOcean App Platform**

### **Environment Variables**
```env
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
ENABLE_CRON_SYNC=true
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.ondigitalocean.app
```

### **DigitalOcean Cron Jobs**
```yaml
# .do/app.yaml
name: your-app
services:
- name: web
  source_dir: /
  github:
    repo: your-username/your-repo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

jobs:
- name: sync-job
  source_dir: /
  github:
    repo: your-username/your-repo
    branch: main
  run_command: curl https://your-domain.ondigitalocean.app/api/sync/trigger
  schedule: "*/1 * * * *"
```

## 🔧 **6. Update untuk Production**

### **1. Update Google Sheets Configuration**
```typescript
// lib/googleSheet.ts
const auth = new google.auth.GoogleAuth({
  credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
    : { keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || './service-account.json' },
  scopes: SCOPES,
});
```

### **2. Update Cron Jobs untuk Production**
```typescript
// lib/cronJobs.ts - Disable real-time sync di production
export const initializeCronJobs = () => {
  if (process.env.NODE_ENV === 'production') {
    // Use platform-specific cron jobs instead
    console.log('🕐 [PRODUCTION] Using platform cron jobs');
    return;
  }
  
  // Development cron jobs
  const spreadsheetToDBCron = new CronJob(
    '*/1 * * * *',
    syncSpreadsheetToDB,
    null,
    false,
    'Asia/Jakarta'
  );
  
  if (process.env.ENABLE_CRON_SYNC === 'true') {
    spreadsheetToDBCron.start();
  }
};
```

### **3. Add Health Check Endpoint**
```typescript
// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

## 🔧 **7. Service Account Setup untuk Production**

### **1. Convert JSON to Environment Variable**
```bash
# Convert service-account.json to single line
cat service-account.json | jq -c '.' | tr -d '\n'
```

### **2. Update Google Cloud Project**
1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Pilih project Anda
3. Buka "APIs & Services" → "Credentials"
4. Pastikan service account punya permission yang benar
5. Share spreadsheet ke service account email

## 🔧 **8. Testing Production Deployment**

### **1. Test Environment Variables**
```bash
# Test di production
curl https://your-domain.vercel.app/api/sync/test
```

### **2. Test Sync Endpoints**
```bash
# Test manual sync
curl -X POST https://your-domain.vercel.app/api/sync/trigger

# Test spreadsheet sync
curl https://your-domain.vercel.app/api/sync/spreadsheet-to-db
```

### **3. Monitor Logs**
- Vercel: Dashboard → Functions → Logs
- Netlify: Dashboard → Functions → Logs
- Railway: Dashboard → Deployments → Logs

## 🚨 **Important Notes**

### **Security**
- ✅ Jangan commit `service-account.json` ke git
- ✅ Gunakan environment variables untuk credentials
- ✅ Restrict service account permissions
- ✅ Monitor API usage

### **Performance**
- ✅ Cron jobs di production platform lebih reliable
- ✅ Real-time sync hanya untuk development
- ✅ Monitor database connections
- ✅ Set appropriate timeouts

### **Monitoring**
- ✅ Setup error tracking (Sentry, LogRocket)
- ✅ Monitor API quotas
- ✅ Track sync performance
- ✅ Setup alerts untuk failures

## 🎯 **Recommended Setup**

### **Vercel (Recommended)**
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
ENABLE_CRON_SYNC=false  # Use Vercel Cron instead
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://your-domain.vercel.app
```

### **vercel.json**
```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

Apakah Anda ingin saya bantu setup untuk platform tertentu atau ada yang perlu dijelaskan lebih detail?
