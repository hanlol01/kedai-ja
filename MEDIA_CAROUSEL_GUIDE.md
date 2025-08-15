# Panduan Media Carousel - Multiple Foto & Video

## Overview
MediaCarousel adalah komponen canggih yang memungkinkan Anda menampilkan multiple foto dan video dalam satu card dengan fitur carousel yang interaktif.

## Fitur Utama

### ✅ **Multiple Media Support**
- Dukungan untuk multiple gambar dan video
- Auto-play dengan interval yang dapat disesuaikan
- Navigasi manual dengan tombol prev/next
- Indikator posisi slide

### ✅ **Video Integration**
- Auto-play video saat slide aktif
- Pause auto-play carousel saat video sedang diputar
- Loop video secara otomatis
- Fallback ke gambar jika video gagal dimuat

### ✅ **Responsive & Interactive**
- Hover effects untuk kontrol navigasi
- Touch/swipe support untuk mobile
- Aspect ratio yang dapat disesuaikan
- Overlay text yang informatif

## Cara Menggunakan

### 1. **Setup Data Media**

```tsx
// Definisikan array media untuk setiap card
const restoMedia = [
  {
    type: 'image' as const,
    src: '/images/resto/food-1.jpg',
    alt: 'Menu Makanan 1',
    fallbackSrc: '/images/resto/food-1-fallback.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/resto/food-2.jpg',
    alt: 'Menu Makanan 2',
    fallbackSrc: '/images/resto/food-2-fallback.jpg'
  },
  {
    type: 'video' as const,
    src: '/videos/resto-cooking.mp4',
    alt: 'Video Proses Memasak'
  },
  {
    type: 'image' as const,
    src: '/images/resto/interior.jpg',
    alt: 'Interior Resto'
  }
];

const venueMedia = [
  {
    type: 'image' as const,
    src: '/images/venue/venue-1.jpg',
    alt: 'Venue Acara 1'
  },
  {
    type: 'video' as const,
    src: '/videos/venue-tour.mp4',
    alt: 'Video Tour Venue'
  },
  {
    type: 'image' as const,
    src: '/images/venue/venue-2.jpg',
    alt: 'Venue Acara 2'
  }
];
```

### 2. **Implementasi dalam Card**

```tsx
{/* Card RESTO */}
<div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
  <div className="text-center mb-8">
    <h3 className="text-3xl font-bold text-gray-800 mb-4">
      RESTO
    </h3>
  </div>
  
  {/* Media Carousel */}
  <div className="mb-8">
    <MediaCarousel
      items={restoMedia}
      autoPlay={true}
      interval={4000}
      showControls={true}
      showIndicators={true}
      aspectRatio="video"
      overlayText="Nikmati hidangan lezat kami"
    />
  </div>
  
  {/* Content lainnya */}
</div>
```

## Konfigurasi Props

### **items** (required)
Array dari media items dengan struktur:
```tsx
interface MediaItem {
  type: 'image' | 'video';
  src: string;           // URL media
  alt: string;           // Alt text untuk accessibility
  fallbackSrc?: string;  // Fallback image jika primary gagal
}
```

### **autoPlay** (optional)
- **Default**: `true`
- **Type**: `boolean`
- **Description**: Mengaktifkan auto-play carousel

### **interval** (optional)
- **Default**: `5000` (5 detik)
- **Type**: `number`
- **Description**: Interval dalam milidetik untuk auto-play

### **showControls** (optional)
- **Default**: `true`
- **Type**: `boolean`
- **Description**: Menampilkan tombol prev/next

### **showIndicators** (optional)
- **Default**: `true`
- **Type**: `boolean`
- **Description**: Menampilkan indikator slide

### **aspectRatio** (optional)
- **Default**: `'video'`
- **Options**: `'video'` | `'square'` | `'custom'`
- **Description**: Aspect ratio container

### **overlayText** (optional)
- **Type**: `string`
- **Description**: Teks overlay di bagian bawah media

## Contoh Implementasi Lengkap

### **Contoh 1: Resto dengan Multiple Menu Photos**

```tsx
const restoMenuMedia = [
  {
    type: 'image' as const,
    src: '/images/menu/nasi-goreng.jpg',
    alt: 'Nasi Goreng Spesial',
    fallbackSrc: '/images/menu/nasi-goreng-fallback.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/menu/ayam-bakar.jpg',
    alt: 'Ayam Bakar Taliwang',
    fallbackSrc: '/images/menu/ayam-bakar-fallback.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/menu/sate-ayam.jpg',
    alt: 'Sate Ayam Madura',
    fallbackSrc: '/images/menu/sate-ayam-fallback.jpg'
  },
  {
    type: 'video' as const,
    src: '/videos/cooking-process.mp4',
    alt: 'Video Proses Memasak'
  }
];

<MediaCarousel
  items={restoMenuMedia}
  autoPlay={true}
  interval={3000}
  showControls={true}
  showIndicators={true}
  aspectRatio="video"
  overlayText="Menu Favorit Kami"
/>
```

### **Contoh 2: Venue dengan Video Tour**

```tsx
const venueTourMedia = [
  {
    type: 'image' as const,
    src: '/images/venue/main-hall.jpg',
    alt: 'Ruang Utama Venue'
  },
  {
    type: 'video' as const,
    src: '/videos/venue-360-tour.mp4',
    alt: 'Video 360° Tour Venue'
  },
  {
    type: 'image' as const,
    src: '/images/venue/outdoor-area.jpg',
    alt: 'Area Outdoor'
  },
  {
    type: 'image' as const,
    src: '/images/venue/kitchen.jpg',
    alt: 'Dapur Catering'
  }
];

<MediaCarousel
  items={venueTourMedia}
  autoPlay={true}
  interval={5000}
  showControls={true}
  showIndicators={true}
  aspectRatio="video"
  overlayText="Jelajahi Venue Kami"
/>
```

### **Contoh 3: Square Aspect Ratio untuk Thumbnail**

```tsx
const thumbnailMedia = [
  {
    type: 'image' as const,
    src: '/images/thumbnails/thumb-1.jpg',
    alt: 'Thumbnail 1'
  },
  {
    type: 'image' as const,
    src: '/images/thumbnails/thumb-2.jpg',
    alt: 'Thumbnail 2'
  }
];

<MediaCarousel
  items={thumbnailMedia}
  autoPlay={false}
  showControls={true}
  showIndicators={true}
  aspectRatio="square"
  overlayText="Galeri Foto"
/>
```

## Optimasi Performa

### **1. Image Optimization**
```bash
# Kompres gambar menggunakan WebP
cwebp -q 80 input.jpg -o output.webp

# Buat multiple sizes untuk responsive
# 1280x720 untuk desktop
# 640x360 untuk tablet
# 320x180 untuk mobile
```

### **2. Video Optimization**
```bash
# Kompres video dengan FFmpeg
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -vf "scale=1280:720" \
  output.mp4

# Buat WebM version untuk browser modern
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  output.webm
```

### **3. Lazy Loading**
```tsx
// Tambahkan lazy loading untuk performa
const lazyMedia = [
  {
    type: 'image' as const,
    src: '/images/lazy/food-1.jpg',
    alt: 'Food 1',
    loading: 'lazy' as const
  }
];
```

## Best Practices

### **1. File Organization**
```
public/
├── images/
│   ├── resto/
│   │   ├── menu/
│   │   │   ├── food-1.webp
│   │   │   ├── food-1.jpg
│   │   │   └── food-1-fallback.jpg
│   │   └── interior/
│   │       ├── interior-1.webp
│   │       └── interior-1.jpg
│   └── venue/
│       ├── venue-1.webp
│       └── venue-1.jpg
├── videos/
│   ├── resto/
│   │   ├── cooking-process.mp4
│   │   └── cooking-process.webm
│   └── venue/
│       ├── venue-tour.mp4
│       └── venue-tour.webm
└── fallbacks/
    ├── resto-placeholder.svg
    └── venue-placeholder.svg
```

### **2. Naming Convention**
```tsx
// Gunakan nama yang deskriptif
const mediaItems = [
  {
    type: 'image' as const,
    src: '/images/resto/menu/nasi-goreng-special.jpg',
    alt: 'Nasi Goreng Special dengan Telur dan Ayam'
  }
];
```

### **3. Fallback Strategy**
```tsx
// Selalu sediakan fallback
const robustMedia = [
  {
    type: 'image' as const,
    src: '/images/food.webp',        // Primary: WebP
    alt: 'Food Image',
    fallbackSrc: '/images/food.jpg'  // Fallback: JPG
  }
];
```

## Troubleshooting

### **1. Video Tidak Play**
```tsx
// Pastikan video memiliki atribut yang benar
{
  type: 'video' as const,
  src: '/videos/sample.mp4',
  alt: 'Sample Video'
}

// Video akan otomatis memiliki:
// - autoPlay (saat slide aktif)
// - muted (untuk autoplay policy)
// - loop
// - playsInline (untuk mobile)
```

### **2. Gambar Tidak Muncul**
```tsx
// Periksa path dan fallback
const debugMedia = [
  {
    type: 'image' as const,
    src: '/correct/path/image.jpg',
    alt: 'Debug Image',
    fallbackSrc: '/fallback/image.jpg'  // Pastikan fallback ada
  }
];
```

### **3. Auto-play Tidak Berfungsi**
```tsx
// Periksa konfigurasi
<MediaCarousel
  items={mediaItems}
  autoPlay={true}        // Pastikan true
  interval={4000}        // Interval yang masuk akal
  showControls={true}    // Kontrol untuk manual navigation
/>
```

## Customization

### **1. Custom Styling**
```tsx
<MediaCarousel
  items={mediaItems}
  className="custom-carousel-class"
  overlayText="Custom Overlay"
/>
```

### **2. Different Aspect Ratios**
```tsx
// Video aspect (16:9)
<MediaCarousel aspectRatio="video" />

// Square aspect (1:1)
<MediaCarousel aspectRatio="square" />

// Custom aspect (gunakan CSS)
<div className="aspect-[4/3]">
  <MediaCarousel aspectRatio="custom" />
</div>
```

### **3. Disable Auto-play**
```tsx
<MediaCarousel
  items={mediaItems}
  autoPlay={false}
  showControls={true}
  showIndicators={true}
/>
```

Dengan MediaCarousel ini, Anda dapat dengan mudah menampilkan multiple foto dan video dalam card-card layanan dengan pengalaman yang menarik dan interaktif!
