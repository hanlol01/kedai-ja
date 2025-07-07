# 📋 Cara Import Database MongoDB untuk Kedai J.A

## 🎯 **Metode 1: Menggunakan Seed Script (RECOMMENDED)**

Ini adalah cara termudah dan sudah otomatis:

### 1. Pastikan MongoDB Running
```bash
# Jika menggunakan MongoDB lokal
mongod

# Atau pastikan MongoDB Atlas connection string sudah benar di .env.local
```

### 2. Jalankan Seed Script
```bash
npm run seed
```

Script ini akan otomatis:
- ✅ Membuat database `kedai-ja`
- ✅ Membuat collections: `admins`, `menuitems`, `settings`
- ✅ Insert data dummy yang sudah siap pakai
- ✅ Hash password admin dengan bcrypt

### 3. Data yang Akan Dibuat:

**Admin Account:**
```json
{
  "email": "admin@kedai-ja.com",
  "password": "admin123", // akan di-hash otomatis
  "name": "Admin Kedai J.A"
}
```

**Menu Items (3 items):**
```json
[
  {
    "name": "Es Teh Manis",
    "description": "Teh manis segar dengan es batu, minuman tradisional yang menyegarkan",
    "price": 5000,
    "category": "Minuman",
    "image": "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg",
    "available": true
  },
  {
    "name": "Mie Goreng",
    "description": "Mie goreng spesial dengan bumbu rahasia, dilengkapi sayuran segar dan telur",
    "price": 12000,
    "category": "Makanan", 
    "image": "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg",
    "available": true
  },
  {
    "name": "Sate Ayam",
    "description": "Sate ayam bakar dengan bumbu kacang khas, disajikan dengan lontong dan lalapan",
    "price": 15000,
    "category": "Makanan",
    "image": "https://images.pexels.com/photos/4518669/pexels-photo-4518669.jpeg",
    "available": true
  }
]
```

**Restaurant Settings:**
```json
{
  "restaurantName": "Kedai J.A",
  "description": "Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi",
  "address": "Jl. Raya Leles No.45, Garut",
  "contact": "081234567890",
  "hours": "Senin - Minggu, 09.00 - 21.00"
}
```

---

## 🛠️ **Metode 2: Manual Import dengan MongoDB Tools**

Jika Anda ingin import manual atau sudah punya file JSON:

### 1. Buat File JSON untuk setiap Collection

**admins.json:**
```json
[
  {
    "email": "admin@kedai-ja.com",
    "password": "$2a$10$rOzJqKqKqKqKqKqKqKqKqOzJqKqKqKqKqKqKqKqKqKqKqKqKqKqKq",
    "name": "Admin Kedai J.A",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**menuitems.json:**
```json
[
  {
    "name": "Es Teh Manis",
    "description": "Teh manis segar dengan es batu, minuman tradisional yang menyegarkan",
    "price": 5000,
    "category": "Minuman",
    "image": "https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg",
    "available": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "name": "Mie Goreng",
    "description": "Mie goreng spesial dengan bumbu rahasia, dilengkapi sayuran segar dan telur",
    "price": 12000,
    "category": "Makanan",
    "image": "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg",
    "available": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "name": "Sate Ayam",
    "description": "Sate ayam bakar dengan bumbu kacang khas, disajikan dengan lontong dan lalapan",
    "price": 15000,
    "category": "Makanan",
    "image": "https://images.pexels.com/photos/4518669/pexels-photo-4518669.jpeg",
    "available": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**settings.json:**
```json
[
  {
    "restaurantName": "Kedai J.A",
    "description": "Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi",
    "address": "Jl. Raya Leles No.45, Garut",
    "contact": "081234567890",
    "hours": "Senin - Minggu, 09.00 - 21.00",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Import dengan mongoimport
```bash
# Import admins
mongoimport --db kedai-ja --collection admins --file admins.json --jsonArray

# Import menu items  
mongoimport --db kedai-ja --collection menuitems --file menuitems.json --jsonArray

# Import settings
mongoimport --db kedai-ja --collection settings --file settings.json --jsonArray
```

---

## 🔧 **Metode 3: Menggunakan MongoDB Compass**

1. **Buka MongoDB Compass**
2. **Connect ke database** (mongodb://localhost:27017)
3. **Buat database baru**: `kedai-ja`
4. **Buat collections**: `admins`, `menuitems`, `settings`
5. **Import documents** dengan copy-paste JSON di atas

---

## 🌐 **Metode 4: MongoDB Atlas (Cloud)**

Jika menggunakan MongoDB Atlas:

1. **Login ke MongoDB Atlas**
2. **Pilih cluster Anda**
3. **Klik "Browse Collections"**
4. **Create Database**: `kedai-ja`
5. **Import data** menggunakan JSON files atau MongoDB Compass

---

## ✅ **Verifikasi Import Berhasil**

Setelah import, jalankan aplikasi:

```bash
npm run dev
```

Kemudian test:
1. **Public site**: http://localhost:3000 (harus menampilkan menu)
2. **Admin login**: http://localhost:3000/admin/login
3. **Login dengan**: admin@kedai-ja.com / admin123
4. **Dashboard**: Harus menampilkan statistik menu

---

## 🚨 **Troubleshooting**

### Error: "MongoServerError: Authentication failed"
```bash
# Pastikan MongoDB tidak menggunakan auth, atau set credentials di connection string
MONGODB_URI=mongodb://username:password@localhost:27017/kedai-ja
```

### Error: "Database connection failed"
```bash
# Pastikan MongoDB service running
sudo systemctl start mongod  # Linux
brew services start mongodb  # macOS
```

### Error: "Collection not found"
```bash
# Jalankan seed script lagi
npm run seed
```

---

## 📝 **Catatan Penting**

- ⚠️ **Password admin sudah di-hash** dengan bcrypt
- 🖼️ **Gambar menggunakan Pexels URLs** (gratis dan legal)
- 🔄 **Seed script akan menghapus data lama** sebelum insert baru
- 💾 **Backup data lama** sebelum menjalankan seed jika diperlukan

---

## 🎯 **Rekomendasi**

**Gunakan Metode 1 (Seed Script)** karena:
- ✅ Otomatis dan mudah
- ✅ Password ter-hash dengan benar
- ✅ Data konsisten dan valid
- ✅ Timestamps otomatis
- ✅ Bisa dijalankan berulang kali