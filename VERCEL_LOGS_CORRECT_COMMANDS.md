# 📊 Cara Melihat Logs di Vercel - Command yang Benar

## ❌ **Error yang Ditemukan:**

```bash
$ vercel logs --prod --follow --function=api/menu/best-seller
Vercel CLI 44.7.3
Error: unknown or unexpected option: --prod
```

## ✅ **Command yang Benar:**

### **1. Melihat Semua Logs:**
```bash
# Melihat semua logs (production)
vercel logs

# Melihat logs dengan filter
vercel logs --since=1h

# Melihat logs real-time
vercel logs --follow
```

### **2. Melihat Logs Function Spesifik:**
```bash
# Melihat logs untuk function tertentu
vercel logs --function=api/menu/best-seller

# Melihat logs real-time untuk function
vercel logs --follow --function=api/menu/best-seller

# Melihat logs error saja
vercel logs --error --function=api/menu/best-seller
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

### **4. Melihat Logs dengan Filter:**
```bash
# Melihat logs error saja
vercel logs --error

# Melihat logs dengan limit
vercel logs --limit=100

# Melihat logs dengan output JSON
vercel logs --output=json
```

## 🔧 **Command untuk Monitoring Best Seller API:**

### **Monitor Real-time:**
```bash
# Monitor best-seller API real-time
vercel logs --follow --function=api/menu/best-seller

# Monitor dengan filter error
vercel logs --follow --error --function=api/menu/best-seller
```

### **Monitor Performance:**
```bash
# Cek response times
vercel logs --since=1h --function=api/menu/best-seller

# Cek cache hit rate
vercel logs --since=24h --function=api/menu/best-seller | grep "fromCache"

# Cek timeout errors
vercel logs --since=24h --function=api/menu/best-seller | grep "timeout"
```

### **Monitor Errors:**
```bash
# Melihat semua error
vercel logs --error --since=24h

# Melihat error best-seller khusus
vercel logs --error --function=api/menu/best-seller --since=24h
```

## 📱 **Melalui Vercel Dashboard:**

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

### **3. Cek Function Status:**
```bash
# Lihat semua functions
vercel functions ls

# Cek function tertentu
vercel functions inspect api/menu/best-seller
```

## 📊 **Monitoring Best Practices:**

### **1. Regular Monitoring:**
```bash
# Setiap jam
vercel logs --since=1h --function=api/menu/best-seller

# Setiap hari
vercel logs --since=24h --function=api/menu/best-seller

# Setiap minggu
vercel logs --since=7d --function=api/menu/best-seller
```

### **2. Error Alerting:**
```bash
# Monitor error real-time
vercel logs --follow --error --function=api/menu/best-seller

# Monitor timeout khusus
vercel logs --follow --function=api/menu/best-seller | grep -i "timeout"
```

### **3. Performance Monitoring:**
```bash
# Monitor response times
vercel logs --since=1h --function=api/menu/best-seller | grep "200\|500"

# Monitor cache effectiveness
vercel logs --since=24h --function=api/menu/best-seller | grep "fromCache\|fromDatabase"
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
vercel logs --function=api/menu/best-seller --since=1h

# Monitor real-time
vercel logs --follow --function=api/menu/best-seller
```

### **Untuk Monitoring Rutin:**
```bash
# Daily check
vercel logs --since=24h --error

# Weekly report
vercel logs --since=7d --function=api/menu/best-seller

# Performance check
vercel logs --since=1h --function=api/menu/best-seller | grep "fromCache\|fromDatabase"
```

## 🎉 **Kesimpulan:**

Sekarang Anda bisa menggunakan command yang benar untuk monitoring:

1. **✅ No more `--prod` error**: Gunakan command yang benar
2. **✅ Real-time monitoring**: Monitor logs secara real-time
3. **✅ Error tracking**: Track error dan timeout dengan mudah
4. **✅ Performance monitoring**: Monitor cache dan database performance

Gunakan command ini untuk memantau API best-seller dan memastikan tidak ada lagi timeout! 🚀✨
