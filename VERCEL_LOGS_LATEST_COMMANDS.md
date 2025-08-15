# 📊 Cara Melihat Logs di Vercel - Command Terbaru

## ❌ **Error yang Ditemukan:**

```bash
$ vercel logs --follow --function=api/menu/best-seller
Vercel CLI 46.0.0
Error: unknown or unexpected option: --function
```

## ✅ **Command yang Benar untuk Vercel CLI 46.0.0:**

### **1. Melihat Semua Logs:**
```bash
# Melihat semua logs
vercel logs

# Melihat logs dengan filter waktu
vercel logs --since=1h

# Melihat logs real-time
vercel logs --follow
```

### **2. Melihat Logs dengan Filter:**
```bash
# Melihat logs error saja
vercel logs --error

# Melihat logs dengan limit
vercel logs --limit=100

# Melihat logs dengan output JSON
vercel logs --output=json
```

### **3. Melihat Logs dengan Filter Waktu:**
```bash
# Logs 1 jam terakhir
vercel logs --since=1h

# Logs 24 jam terakhir
vercel logs --since=24h

# Logs 7 hari terakhir
vercel logs --since=7d

# Logs sejak tanggal tertentu
vercel logs --since=2024-01-01
```

## 🔧 **Cara Monitor Best Seller API:**

### **1. Monitor Semua Logs dan Filter:**
```bash
# Monitor semua logs real-time
vercel logs --follow

# Monitor error real-time
vercel logs --follow --error

# Monitor logs 1 jam terakhir
vercel logs --since=1h
```

### **2. Filter dengan grep (untuk function tertentu):**
```bash
# Monitor best-seller API (filter dengan grep)
vercel logs --follow | grep "best-seller"

# Monitor error best-seller
vercel logs --error | grep "best-seller"

# Monitor timeout errors
vercel logs --since=24h | grep -i "timeout"

# Monitor cache hits
vercel logs --since=24h | grep "fromCache"
```

### **3. Monitor Performance:**
```bash
# Cek response times
vercel logs --since=1h | grep "200\|500"

# Cek cache effectiveness
vercel logs --since=24h | grep "fromCache\|fromDatabase"

# Cek timeout errors
vercel logs --since=24h | grep -i "timeout"
```

## 📱 **Melalui Vercel Dashboard (Recommended):**

### **1. Buka Vercel Dashboard:**
- Kunjungi: https://vercel.com/dashboard
- Pilih project `kedai-ja`

### **2. Lihat Logs:**
- Klik tab **"Functions"**
- Pilih function `api/menu/best-seller`
- Klik **"View Logs"**

### **3. Real-time Monitoring:**
- Klik **"Live"** untuk melihat logs real-time
- Filter berdasarkan **"Error"** untuk melihat error saja

### **4. Filter Logs:**
- Gunakan search box untuk filter: `best-seller`
- Filter berdasarkan status: `Error`, `Warning`, `Info`
- Filter berdasarkan waktu

## 🛠️ **Troubleshooting Commands:**

### **1. Cek Status Deployment:**
```bash
# Cek status deployment terbaru
vercel ls

# Cek detail deployment
vercel inspect [deployment-url]
```

### **2. Cek Environment Variables:**
```bash
# Lihat environment variables
vercel env ls

# Cek variable tertentu
vercel env ls | grep MONGODB
```

### **3. Cek Project Info:**
```bash
# Lihat info project
vercel project ls

# Cek detail project
vercel project inspect
```

## 📊 **Monitoring Best Practices:**

### **1. Regular Monitoring:**
```bash
# Setiap jam
vercel logs --since=1h

# Setiap hari
vercel logs --since=24h

# Setiap minggu
vercel logs --since=7d
```

### **2. Error Alerting:**
```bash
# Monitor error real-time
vercel logs --follow --error

# Monitor timeout khusus
vercel logs --follow | grep -i "timeout"

# Monitor best-seller errors
vercel logs --error | grep "best-seller"
```

### **3. Performance Monitoring:**
```bash
# Monitor response times
vercel logs --since=1h | grep "200\|500"

# Monitor cache effectiveness
vercel logs --since=24h | grep "fromCache\|fromDatabase"

# Monitor specific function
vercel logs --since=1h | grep "api/menu/best-seller"
```

## 🎯 **Expected Log Output:**

### **Cache Hit:**
```
✅ Served from cache (age: 3600s)
```

### **Database Success:**
```
✅ Served from database (1.2s)
```

### **Fallback:**
```
⚠️ Served from fallback due to timeout
```

### **Error:**
```
❌ Best seller query failed, serving fallback/cache: timeout
```

## 🚀 **Quick Commands:**

### **Untuk Debugging Cepat:**
```bash
# Cek error terbaru
vercel logs --error --since=1h

# Cek best-seller performance
vercel logs --since=1h | grep "best-seller"

# Monitor real-time
vercel logs --follow
```

### **Untuk Monitoring Rutin:**
```bash
# Daily check
vercel logs --since=24h --error

# Weekly report
vercel logs --since=7d | grep "best-seller"

# Performance check
vercel logs --since=1h | grep "fromCache\|fromDatabase"
```

## 🔍 **Advanced Filtering:**

### **1. Filter dengan Multiple Keywords:**
```bash
# Monitor best-seller dan timeout
vercel logs --since=1h | grep -E "best-seller|timeout"

# Monitor cache dan database
vercel logs --since=24h | grep -E "fromCache|fromDatabase|fromFallback"
```

### **2. Filter dengan Exclude:**
```bash
# Monitor semua kecuali cache hits
vercel logs --since=1h | grep -v "fromCache"

# Monitor error kecuali timeout
vercel logs --error | grep -v "timeout"
```

### **3. Count Logs:**
```bash
# Hitung error dalam 24 jam
vercel logs --since=24h --error | wc -l

# Hitung cache hits
vercel logs --since=24h | grep "fromCache" | wc -l
```

## 📋 **Monitoring Checklist:**

### **Daily Monitoring:**
- [ ] **Check Errors**: `vercel logs --error --since=24h`
- [ ] **Check Best Seller**: `vercel logs --since=24h | grep "best-seller"`
- [ ] **Check Timeout**: `vercel logs --since=24h | grep -i "timeout"`
- [ ] **Check Cache**: `vercel logs --since=24h | grep "fromCache"`

### **Weekly Monitoring:**
- [ ] **Performance Review**: `vercel logs --since=7d | grep "fromDatabase"`
- [ ] **Error Analysis**: `vercel logs --error --since=7d`
- [ ] **Cache Effectiveness**: `vercel logs --since=7d | grep "fromCache" | wc -l`

## 🎉 **Kesimpulan:**

Sekarang Anda bisa menggunakan command yang benar untuk Vercel CLI 46.0.0:

1. **✅ No more `--function` error**: Gunakan filter dengan grep
2. **✅ Real-time monitoring**: Monitor logs secara real-time
3. **✅ Error tracking**: Track error dan timeout dengan mudah
4. **✅ Performance monitoring**: Monitor cache dan database performance
5. **✅ Dashboard alternative**: Gunakan Vercel Dashboard untuk monitoring yang lebih mudah

**Recommended Approach:**
- **CLI**: Untuk quick checks dan automation
- **Dashboard**: Untuk detailed monitoring dan debugging

Gunakan command ini untuk memantau API best-seller dan memastikan tidak ada lagi timeout! 🚀✨
