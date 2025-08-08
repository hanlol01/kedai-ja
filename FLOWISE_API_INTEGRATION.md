# 🔗 Integrasi API dengan Flowise AI

## **📋 Overview**

Dokumentasi ini menjelaskan cara menggunakan API endpoints Kedai J.A untuk integrasi dengan Flowise AI, menggantikan Google Drive Document Loader.

## **🔄 Perbandingan: Google Drive vs API Loader**

### **Google Drive Document Loader:**
- ✅ Membaca file dari Google Drive (Spreadsheet, Docs, PDF)
- ✅ Structured data dari spreadsheet
- ✅ Text content dari dokumen
- ✅ Real-time sync dengan perubahan file

### **API Loader (Kedai J.A):**
- ✅ Membaca data langsung dari database MongoDB
- ✅ Structured data dalam format JSON
- ✅ Real-time data dari database
- ✅ Customizable response format
- ✅ Tidak memerlukan Google Drive setup

## **📡 API Endpoints yang Tersedia**

### **1. Settings Collection**
```
GET /api/flowise/settings
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "restaurantName": "Kedai J.A",
      "address": "...",
      "phone": "...",
      "email": "...",
      "openingHours": "...",
      "description": "..."
    }
  ],
  "total": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **2. Testimonials Collection**
```
GET /api/flowise/testimonials
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "rating": 5,
      "comment": "Makanan enak sekali!",
      "image": "...",
      "isActive": true
    }
  ],
  "total": 10,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **3. Menu Items Collection**
```
GET /api/flowise/menuitems
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Nasi Goreng",
      "description": "Nasi goreng spesial",
      "price": 25000,
      "category": "Makanan Utama",
      "image": "...",
      "available": true,
      "isBestSeller": false
    }
  ],
  "total": 25,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **4. FAQs Collection**
```
GET /api/flowise/faqs
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "category": "Umum",
      "question": "Apa jam operasional Kedai J.A?",
      "answer": "Kedai J.A buka setiap hari dari pukul 08.00 - 22.00 WIB."
    }
  ],
  "total": 15,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **5. Admins Collection**
```
GET /api/flowise/admins
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "username": "admin",
      "email": "admin@kedaija.com",
      "role": "admin",
      "isActive": true
    }
  ],
  "total": 2,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **6. Chat History Collection**
```
GET /api/flowise/chat-history
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "sessionId": "...",
      "message": "Halo, apa menu yang tersedia?",
      "response": "Berikut menu yang tersedia...",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **7. All Data (Semua Collections)**
```
GET /api/flowise/all-data
```
**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "data": [...],
      "total": 1
    },
    "testimonials": {
      "data": [...],
      "total": 10
    },
    "menuItems": {
      "data": [...],
      "total": 25
    },
    "faqs": {
      "data": [...],
      "total": 15
    },
    "admins": {
      "data": [...],
      "total": 2
    },
    "chatHistory": {
      "data": [...],
      "total": 100
    }
  },
  "summary": {
    "totalCollections": 6,
    "totalRecords": 153,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## **🤖 Konfigurasi Flowise AI**

### **Langkah 1: Setup API Loader Node**

1. **Buka Flowise** dan buat flow baru
2. **Tambahkan node "API Loader"**
3. **Konfigurasi node:**

#### **Untuk Data Spesifik:**
```
Method: GET
URL: https://your-domain.com/api/flowise/menuitems
```

#### **Untuk Semua Data:**
```
Method: GET
URL: https://your-domain.com/api/flowise/all-data
```

### **Langkah 2: Konfigurasi Response Processing**

#### **Untuk Data Spesifik:**
```javascript
// Access data
const menuItems = $json.data;
const totalItems = $json.total;

// Process each item
menuItems.forEach(item => {
  console.log(`Menu: ${item.name} - Rp${item.price}`);
});
```

#### **Untuk Semua Data:**
```javascript
// Access specific collections
const menuItems = $json.data.menuItems.data;
const faqs = $json.data.faqs.data;
const settings = $json.data.settings.data;

// Get summary
const totalRecords = $json.summary.totalRecords;
```

### **Langkah 3: Integrasi dengan Chat Flow**

```javascript
// Example: Answer menu questions
const menuItems = $json.data.menuItems.data;
const availableItems = menuItems.filter(item => item.available);

let response = "Berikut menu yang tersedia:\n\n";
availableItems.forEach(item => {
  response += `🍽️ ${item.name}\n`;
  response += `   💰 Rp${item.price.toLocaleString()}\n`;
  response += `   📝 ${item.description}\n\n`;
});

return response;
```

## **🔧 Contoh Use Cases**

### **1. Menu Information**
```javascript
// URL: /api/flowise/menuitems
const menuItems = $json.data;
const userQuery = $input.toLowerCase();

if (userQuery.includes('menu') || userQuery.includes('makanan')) {
  const availableItems = menuItems.filter(item => item.available);
  return `Kami memiliki ${availableItems.length} menu yang tersedia. Silakan tanyakan menu spesifik yang Anda inginkan.`;
}
```

### **2. FAQ Assistant**
```javascript
// URL: /api/flowise/faqs
const faqs = $json.data;
const userQuery = $input.toLowerCase();

const relevantFAQ = faqs.find(faq => 
  faq.question.toLowerCase().includes(userQuery) ||
  faq.answer.toLowerCase().includes(userQuery)
);

if (relevantFAQ) {
  return `Q: ${relevantFAQ.question}\nA: ${relevantFAQ.answer}`;
} else {
  return "Maaf, saya tidak menemukan jawaban untuk pertanyaan Anda. Silakan hubungi kami langsung.";
}
```

### **3. Restaurant Information**
```javascript
// URL: /api/flowise/settings
const settings = $json.data[0];
const userQuery = $input.toLowerCase();

if (userQuery.includes('jam') || userQuery.includes('buka')) {
  return `Jam operasional Kedai J.A: ${settings.openingHours}`;
} else if (userQuery.includes('alamat') || userQuery.includes('lokasi')) {
  return `Alamat Kedai J.A: ${settings.address}`;
} else if (userQuery.includes('telepon') || userQuery.includes('kontak')) {
  return `Kontak Kedai J.A:\n📞 ${settings.phone}\n📧 ${settings.email}`;
}
```

## **🚀 Keuntungan API Loader vs Google Drive**

### **✅ Keuntungan API Loader:**
1. **Real-time Data**: Data selalu up-to-date dari database
2. **Structured JSON**: Format yang mudah diproses
3. **No Google Setup**: Tidak perlu setup Google Drive API
4. **Customizable**: Bisa menyesuaikan response format
5. **Secure**: Bisa ditambahkan authentication jika diperlukan
6. **Fast**: Query langsung ke database

### **❌ Kekurangan Google Drive:**
1. **Setup Complex**: Perlu setup Google Drive API
2. **File-based**: Data dari file, bukan database
3. **Sync Issues**: Mungkin ada delay sync
4. **Format Limited**: Terbatas pada format file
5. **Access Control**: Bergantung pada Google Drive permissions

## **🔒 Security Considerations**

### **Current Implementation:**
- ✅ **Public endpoints** untuk Flowise AI
- ✅ **No sensitive data** (password admin di-exclude)
- ✅ **Rate limiting** bisa ditambahkan jika diperlukan

### **Future Enhancements:**
- 🔒 **API Key authentication**
- 🔒 **Rate limiting**
- 🔒 **CORS configuration**
- 🔒 **Request logging**

## **📊 Monitoring & Analytics**

### **Response Format:**
Setiap response memiliki:
- ✅ **success**: boolean status
- ✅ **data**: actual data
- ✅ **total**: jumlah records
- ✅ **timestamp**: waktu response

### **Error Handling:**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## **🎯 Kesimpulan**

**API Loader** di Flowise AI akan memberikan **fungsi yang sama** dengan Google Drive Document Loader, namun dengan **keuntungan tambahan**:

1. **Data lebih akurat** (real-time dari database)
2. **Setup lebih mudah** (tidak perlu Google Drive)
3. **Format lebih fleksibel** (JSON structured)
4. **Performance lebih baik** (query langsung ke database)

**Sekarang Anda bisa menggunakan semua data Kedai J.A di Flowise AI dengan mudah!** 🎉
