# Setup Galeri Wedding - Card Reservasi Tempat

## ✅ **Yang Telah Diimplementasikan**

### **1. Gambar Wedding yang Digunakan**
- `wedding1.jpg` - Acara Wedding 1
- `wedding2.jpg` - Acara Wedding 2  
- `wedding3.jpg` - Acara Wedding 3
- `wedding4.jpg` - Acara Wedding 4

### **2. Konfigurasi Carousel**
```tsx
const venueMedia = [
  {
    type: 'image' as const,
    src: '/wedding1.jpg',
    alt: 'Acara Wedding 1',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'image' as const,
    src: '/wedding2.jpg',
    alt: 'Acara Wedding 2',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'image' as const,
    src: '/wedding3.jpg',
    alt: 'Acara Wedding 3',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'image' as const,
    src: '/wedding4.jpg',
    alt: 'Acara Wedding 4',
    fallbackSrc: '/hero-bg(3).jpg'
  }
];
```

### **3. MediaCarousel Configuration**
```tsx
<MediaCarousel
  items={venueMedia}
  autoPlay={true}
  interval={4000}        // 4 detik per slide
  showControls={true}    // Tombol prev/next
  showIndicators={true}  // Indikator slide
  aspectRatio="video"    // 16:9 aspect ratio
  overlayText="Galeri Acara Wedding & Event"
/>
```

## 🎯 **Fitur yang Tersedia**

### **✅ Auto-play Carousel**
- Pergantian otomatis setiap 4 detik
- Pause saat user hover
- Kontrol manual dengan tombol prev/next

### **✅ Navigation Controls**
- Tombol prev/next (muncul saat hover)
- Indikator posisi slide (1/4, 2/4, dst)
- Counter di pojok kanan atas

### **✅ Responsive Design**
- Menyesuaikan dengan berbagai ukuran layar
- Touch/swipe support untuk mobile
- Aspect ratio 16:9 yang optimal

### **✅ Fallback System**
- Jika gambar wedding gagal dimuat, akan menampilkan `hero-bg(3).jpg`
- Placeholder yang menarik jika semua gambar gagal

## 📁 **Struktur File**

```
public/
├── wedding1.jpg     # Acara Wedding 1
├── wedding2.jpg     # Acara Wedding 2
├── wedding3.jpg     # Acara Wedding 3
├── wedding4.jpg     # Acara Wedding 4
└── hero-bg(3).jpg   # Fallback image
```

## 🎨 **Customization Options**

### **1. Mengubah Interval Auto-play**
```tsx
<MediaCarousel
  items={venueMedia}
  interval={3000}    // 3 detik (lebih cepat)
  // atau
  interval={6000}    // 6 detik (lebih lambat)
/>
```

### **2. Menonaktifkan Auto-play**
```tsx
<MediaCarousel
  items={venueMedia}
  autoPlay={false}   // Tidak auto-play
  showControls={true}
  showIndicators={true}
/>
```

### **3. Mengubah Overlay Text**
```tsx
<MediaCarousel
  items={venueMedia}
  overlayText="Galeri Acara Spesial Kami"
  // atau
  overlayText="Wedding & Event Gallery"
/>
```

### **4. Square Aspect Ratio**
```tsx
<MediaCarousel
  items={venueMedia}
  aspectRatio="square"  // 1:1 aspect ratio
/>
```

## 🔧 **Menambahkan Gambar Baru**

### **Langkah 1: Upload File**
```bash
# Letakkan file gambar baru di folder public/
public/
├── wedding1.jpg
├── wedding2.jpg
├── wedding3.jpg
├── wedding4.jpg
└── wedding5.jpg    # Gambar baru
```

### **Langkah 2: Update Data Media**
```tsx
const venueMedia = [
  // ... existing images
  {
    type: 'image' as const,
    src: '/wedding5.jpg',
    alt: 'Acara Wedding 5',
    fallbackSrc: '/hero-bg(3).jpg'
  }
];
```

## 🎯 **Menambahkan Video**

### **Contoh: Menambahkan Video Wedding**
```tsx
const venueMedia = [
  // ... existing wedding images
  {
    type: 'video' as const,
    src: '/wedding-video.mp4',
    alt: 'Video Acara Wedding'
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
  items={venueMedia}
  className="custom-wedding-carousel"
/>
```

### **Custom Styling**
```css
.custom-wedding-carousel {
  /* Custom styles */
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.custom-wedding-carousel .overlay {
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
  console.log(`Wedding slide changed to: ${index + 1}`);
  
  // Google Analytics
  gtag('event', 'wedding_gallery_view', {
    'slide_number': index + 1,
    'slide_title': venueMedia[index].alt
  });
};
```

## 🎉 **Hasil Akhir**

Setelah implementasi ini, card "RESERVASI SEWA TEMPAT" akan menampilkan:

1. **4 Gambar Wedding** yang berganti otomatis setiap 4 detik
2. **Kontrol Navigasi** yang muncul saat hover
3. **Indikator Slide** di bagian bawah
4. **Overlay Text** "Galeri Acara Wedding & Event"
5. **Responsive Design** untuk semua device
6. **Fallback System** jika gambar gagal dimuat

Galeri ini akan memberikan visualisasi yang menarik tentang acara-acara wedding yang telah diselenggarakan di venue Anda! 🎊
