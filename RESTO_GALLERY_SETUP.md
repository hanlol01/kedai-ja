# Setup Galeri Resto - Card RESTO

## ✅ **Yang Telah Diimplementasikan**

### **1. Gambar Resto yang Digunakan**
- `resto1.JPG` - Resto Interior 1
- `resto2.JPG` - Resto Interior 2
- `resto3.JPG` - Resto Interior 3
- `resto4.jpg` - Resto Interior 4
- `resto5.jpg` - Resto Interior 5

### **2. Konfigurasi Carousel**
```tsx
const restoMedia = [
  {
    type: 'image' as const,
    src: '/resto1.JPG',
    alt: 'Resto Interior 1',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/resto2.JPG',
    alt: 'Resto Interior 2',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/resto3.JPG',
    alt: 'Resto Interior 3',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/resto4.jpg',
    alt: 'Resto Interior 4',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/resto5.jpg',
    alt: 'Resto Interior 5',
    fallbackSrc: '/hero-bg.jpg'
  }
];
```

### **3. MediaCarousel Configuration**
```tsx
<MediaCarousel
  items={restoMedia}
  autoPlay={true}
  interval={4000}        // 4 detik per slide
  showControls={true}    // Tombol prev/next
  showIndicators={true}  // Indikator slide
  aspectRatio="video"    // 16:9 aspect ratio
  overlayText="Galeri Interior Resto Kami"
/>
```

## 🎯 **Fitur yang Tersedia**

### **✅ Auto-play Carousel**
- Pergantian otomatis setiap 4 detik
- Pause saat user hover
- Kontrol manual dengan tombol prev/next

### **✅ Navigation Controls**
- Tombol prev/next (muncul saat hover)
- Indikator posisi slide (1/5, 2/5, dst)
- Counter di pojok kanan atas

### **✅ Responsive Design**
- Menyesuaikan dengan berbagai ukuran layar
- Touch/swipe support untuk mobile
- Aspect ratio 16:9 yang optimal

### **✅ Fallback System**
- Jika gambar resto gagal dimuat, akan menampilkan `hero-bg.jpg`
- Placeholder yang menarik jika semua gambar gagal

## 📁 **Struktur File**

```
public/
├── resto1.JPG      # Resto Interior 1
├── resto2.JPG      # Resto Interior 2
├── resto3.JPG      # Resto Interior 3
├── resto4.jpg      # Resto Interior 4
├── resto5.jpg      # Resto Interior 5
└── hero-bg.jpg     # Fallback image
```

## 🎨 **Customization Options**

### **1. Mengubah Interval Auto-play**
```tsx
<MediaCarousel
  items={restoMedia}
  interval={3000}    // 3 detik (lebih cepat)
  // atau
  interval={6000}    // 6 detik (lebih lambat)
/>
```

### **2. Menonaktifkan Auto-play**
```tsx
<MediaCarousel
  items={restoMedia}
  autoPlay={false}   // Tidak auto-play
  showControls={true}
  showIndicators={true}
/>
```

### **3. Mengubah Overlay Text**
```tsx
<MediaCarousel
  items={restoMedia}
  overlayText="Galeri Resto Kami"
  // atau
  overlayText="Restaurant Interior Gallery"
/>
```

### **4. Square Aspect Ratio**
```tsx
<MediaCarousel
  items={restoMedia}
  aspectRatio="square"  // 1:1 aspect ratio
/>
```

## 🔧 **Menambahkan Gambar Baru**

### **Langkah 1: Upload File**
```bash
# Letakkan file gambar baru di folder public/
public/
├── resto1.JPG
├── resto2.JPG
├── resto3.JPG
├── resto4.jpg
├── resto5.jpg
└── resto6.jpg    # Gambar baru
```

### **Langkah 2: Update Data Media**
```tsx
const restoMedia = [
  // ... existing images
  {
    type: 'image' as const,
    src: '/resto6.jpg',
    alt: 'Resto Interior 6',
    fallbackSrc: '/hero-bg.jpg'
  }
];
```

## 🎯 **Menambahkan Video**

### **Contoh: Menambahkan Video Resto**
```tsx
const restoMedia = [
  // ... existing resto images
  {
    type: 'video' as const,
    src: '/resto-video.mp4',
    alt: 'Video Tour Resto'
  }
];
```

## 📱 **Mobile Optimization**

### **Touch Gestures**
- Swipe left/right untuk navigasi
- Tap untuk pause/play auto-play
- Double tap untuk fullscreen (jika didukung)

### **Performance**
- Lazy loading untuk gambar
- Optimized image sizes
- Fallback untuk slow connections

## 🎨 **Styling Customization**

### **Custom CSS Classes**
```tsx
<MediaCarousel
  items={restoMedia}
  className="custom-resto-carousel"
/>
```

### **Custom Styling**
```css
.custom-resto-carousel {
  /* Custom styles */
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.custom-resto-carousel .overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}
```

## 🔍 **Troubleshooting**

### **1. Gambar Tidak Muncul**
- Periksa path file di folder `public/`
- Pastikan nama file sesuai (case sensitive)
- Periksa console browser untuk error

### **2. Auto-play Tidak Berfungsi**
- Pastikan `autoPlay={true}`
- Periksa browser autoplay policy
- Pastikan interval > 1000ms

### **3. Mobile Issues**
- Test di berbagai device
- Periksa touch events
- Pastikan responsive design

## 📊 **Analytics & Tracking**

### **Event Tracking (Optional)**
```tsx
const handleSlideChange = (index: number) => {
  // Track slide changes
  console.log(`Resto slide changed to: ${index + 1}`);
  
  // Google Analytics
  gtag('event', 'resto_gallery_view', {
    'slide_number': index + 1,
    'slide_title': restoMedia[index].alt
  });
};
```

## 🍽️ **Tips untuk Resto Gallery**

### **1. Optimasi Gambar**
```bash
# Kompres gambar untuk web
# resto1.JPG, resto2.JPG, resto3.JPG cukup besar (2MB+)
# Sebaiknya dikompres untuk performa yang lebih baik

# Menggunakan ImageOptim atau TinyPNG
# Target size: < 500KB per gambar
```

### **2. Urutan Gambar yang Efektif**
```tsx
// Urutan yang disarankan:
// 1. Exterior/Facade resto
// 2. Main dining area
// 3. Kitchen/Chef area
// 4. Special seating area
// 5. Bar/Drinks area
```

### **3. Alt Text yang Deskriptif**
```tsx
const restoMedia = [
  {
    type: 'image' as const,
    src: '/resto1.JPG',
    alt: 'Interior Resto - Area Makan Utama',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/resto2.JPG',
    alt: 'Interior Resto - Dapur Terbuka',
    fallbackSrc: '/hero-bg.jpg'
  }
];
```

## 🎉 **Hasil Akhir**

Setelah implementasi ini, card "RESTO" akan menampilkan:

1. **5 Gambar Interior Resto** yang berganti otomatis setiap 4 detik
2. **Kontrol Navigasi** yang muncul saat hover
3. **Indikator Slide** di bagian bawah (1/5, 2/5, dst)
4. **Overlay Text** "Galeri Interior Resto Kami"
5. **Responsive Design** untuk semua device
6. **Fallback System** jika gambar gagal dimuat

Galeri ini akan memberikan visualisasi yang menarik tentang interior dan suasana resto Anda! 🍽️✨
