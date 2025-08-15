# Contoh Praktis - Menambahkan Video & Multiple Foto

## 🎯 Contoh 1: Menambahkan Video ke Carousel

### **Langkah 1: Siapkan File Video**
```bash
# Letakkan file video di folder public/videos/
public/
└── videos/
    ├── resto-cooking.mp4      # Video proses memasak
    ├── venue-tour.mp4         # Video tour venue
    └── customer-testimonial.mp4 # Video testimonial
```

### **Langkah 2: Update Data Media**
```tsx
// Di file app/page.tsx, update restoMedia array
const restoMedia = [
  {
    type: 'image' as const,
    src: '/hero-bg.jpg',
    alt: 'Resto Menu Preview',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'image' as const,
    src: '/hero-bg(3).jpg',
    alt: 'Resto Interior',
    fallbackSrc: '/hero-bg.jpg'
  },
  // Tambahkan video di sini
  {
    type: 'video' as const,
    src: '/videos/resto-cooking.mp4',
    alt: 'Video Proses Memasak'
  }
];

const venueMedia = [
  {
    type: 'image' as const,
    src: '/hero-bg(3).jpg',
    alt: 'Venue Reservation Preview',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/hero-bg.jpg',
    alt: 'Venue Interior',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  // Tambahkan video di sini
  {
    type: 'video' as const,
    src: '/videos/venue-tour.mp4',
    alt: 'Video Tour Venue'
  }
];
```

## 🎯 Contoh 2: Multiple Foto Menu Resto

### **Langkah 1: Siapkan Foto Menu**
```bash
# Buat folder untuk foto menu
public/
└── images/
    └── menu/
        ├── nasi-goreng.jpg
        ├── ayam-bakar.jpg
        ├── sate-ayam.jpg
        ├── mie-goreng.jpg
        └── es-kelapa.jpg
```

### **Langkah 2: Update Data Media**
```tsx
const restoMenuMedia = [
  {
    type: 'image' as const,
    src: '/images/menu/nasi-goreng.jpg',
    alt: 'Nasi Goreng Spesial',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/menu/ayam-bakar.jpg',
    alt: 'Ayam Bakar Taliwang',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/menu/sate-ayam.jpg',
    alt: 'Sate Ayam Madura',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/menu/mie-goreng.jpg',
    alt: 'Mie Goreng Seafood',
    fallbackSrc: '/hero-bg.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/menu/es-kelapa.jpg',
    alt: 'Es Kelapa Muda',
    fallbackSrc: '/hero-bg.jpg'
  }
];

// Update komponen MediaCarousel
<MediaCarousel
  items={restoMenuMedia}
  autoPlay={true}
  interval={3000}  // Lebih cepat untuk menu
  showControls={true}
  showIndicators={true}
  aspectRatio="video"
  overlayText="Menu Favorit Kami"
/>
```

## 🎯 Contoh 3: Venue dengan Video Tour

### **Langkah 1: Siapkan Media Venue**
```bash
public/
├── images/
│   └── venue/
│       ├── main-hall.jpg
│       ├── outdoor-area.jpg
│       ├── kitchen.jpg
│       └── parking.jpg
└── videos/
    └── venue/
        ├── venue-tour.mp4
        └── venue-360.mp4
```

### **Langkah 2: Update Data Media**
```tsx
const venueTourMedia = [
  {
    type: 'image' as const,
    src: '/images/venue/main-hall.jpg',
    alt: 'Ruang Utama Venue',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'video' as const,
    src: '/videos/venue/venue-tour.mp4',
    alt: 'Video Tour Venue'
  },
  {
    type: 'image' as const,
    src: '/images/venue/outdoor-area.jpg',
    alt: 'Area Outdoor',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'image' as const,
    src: '/images/venue/kitchen.jpg',
    alt: 'Dapur Catering',
    fallbackSrc: '/hero-bg(3).jpg'
  },
  {
    type: 'video' as const,
    src: '/videos/venue/venue-360.mp4',
    alt: 'Video 360° Venue'
  }
];

// Update komponen MediaCarousel
<MediaCarousel
  items={venueTourMedia}
  autoPlay={true}
  interval={5000}  // Lebih lambat untuk venue
  showControls={true}
  showIndicators={true}
  aspectRatio="video"
  overlayText="Jelajahi Venue Kami"
/>
```

## 🎯 Contoh 4: Kombinasi Foto & Video dengan Fallback

### **Langkah 1: Siapkan Multiple Format**
```bash
public/
├── images/
│   └── resto/
│       ├── food-1.webp      # Primary format
│       ├── food-1.jpg       # Fallback format
│       ├── food-2.webp
│       ├── food-2.jpg
│       └── food-3.webp
│       └── food-3.jpg
└── videos/
    └── resto/
        ├── cooking.mp4      # Primary format
        └── cooking.webm     # Fallback format
```

### **Langkah 2: Update Data Media dengan Fallback**
```tsx
const robustRestoMedia = [
  {
    type: 'image' as const,
    src: '/images/resto/food-1.webp',
    alt: 'Nasi Goreng Special',
    fallbackSrc: '/images/resto/food-1.jpg'
  },
  {
    type: 'image' as const,
    src: '/images/resto/food-2.webp',
    alt: 'Ayam Bakar Taliwang',
    fallbackSrc: '/images/resto/food-2.jpg'
  },
  {
    type: 'video' as const,
    src: '/videos/resto/cooking.mp4',
    alt: 'Video Proses Memasak'
  },
  {
    type: 'image' as const,
    src: '/images/resto/food-3.webp',
    alt: 'Sate Ayam Madura',
    fallbackSrc: '/images/resto/food-3.jpg'
  }
];
```

## 🎯 Contoh 5: Custom Configuration

### **Contoh A: Auto-play Disabled**
```tsx
<MediaCarousel
  items={mediaItems}
  autoPlay={false}           // Tidak auto-play
  showControls={true}        // Tampilkan kontrol manual
  showIndicators={true}      // Tampilkan indikator
  aspectRatio="video"
  overlayText="Klik untuk melihat lebih banyak"
/>
```

### **Contoh B: Square Aspect Ratio**
```tsx
<MediaCarousel
  items={mediaItems}
  autoPlay={true}
  interval={4000}
  showControls={true}
  showIndicators={true}
  aspectRatio="square"       // 1:1 aspect ratio
  overlayText="Galeri Foto"
/>
```

### **Contoh C: Fast Auto-play untuk Menu**
```tsx
<MediaCarousel
  items={menuItems}
  autoPlay={true}
  interval={2000}            // 2 detik per slide
  showControls={true}
  showIndicators={true}
  aspectRatio="video"
  overlayText="Menu Hari Ini"
/>
```

## 🎯 Contoh 6: Responsive Media

### **Langkah 1: Siapkan Multiple Sizes**
```bash
public/
└── images/
    └── menu/
        ├── nasi-goreng-desktop.jpg    # 1280x720
        ├── nasi-goreng-tablet.jpg     # 640x360
        ├── nasi-goreng-mobile.jpg     # 320x180
        └── nasi-goreng-thumb.jpg      # 150x84
```

### **Langkah 2: Conditional Loading**
```tsx
const responsiveMedia = [
  {
    type: 'image' as const,
    src: typeof window !== 'undefined' && window.innerWidth > 768 
      ? '/images/menu/nasi-goreng-desktop.jpg'
      : '/images/menu/nasi-goreng-mobile.jpg',
    alt: 'Nasi Goreng Special',
    fallbackSrc: '/images/menu/nasi-goreng-thumb.jpg'
  }
];
```

## 🎯 Contoh 7: Event-based Media

### **Contoh: Media Berdasarkan Event**
```tsx
const eventBasedMedia = [
  {
    type: 'image' as const,
    src: '/images/events/wedding-1.jpg',
    alt: 'Acara Pernikahan'
  },
  {
    type: 'video' as const,
    src: '/videos/events/wedding-ceremony.mp4',
    alt: 'Video Upacara Pernikahan'
  },
  {
    type: 'image' as const,
    src: '/images/events/birthday-1.jpg',
    alt: 'Acara Ulang Tahun'
  },
  {
    type: 'video' as const,
    src: '/videos/events/birthday-party.mp4',
    alt: 'Video Pesta Ulang Tahun'
  }
];

<MediaCarousel
  items={eventBasedMedia}
  autoPlay={true}
  interval={4000}
  showControls={true}
  showIndicators={true}
  aspectRatio="video"
  overlayText="Acara Spesial Kami"
/>
```

## 🎯 Tips Praktis

### **1. Optimasi Video**
```bash
# Kompres video untuk web
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -vf "scale=1280:720" \
  output.mp4
```

### **2. Optimasi Gambar**
```bash
# Kompres gambar dengan WebP
cwebp -q 80 input.jpg -o output.webp

# Atau gunakan tools online seperti TinyPNG
```

### **3. Naming Convention**
```tsx
// Gunakan nama yang deskriptif
const mediaItems = [
  {
    type: 'image' as const,
    src: '/images/resto/menu/nasi-goreng-special-with-egg.jpg',
    alt: 'Nasi Goreng Special dengan Telur dan Ayam'
  }
];
```

### **4. Fallback Strategy**
```tsx
// Selalu sediakan fallback
const mediaWithFallback = [
  {
    type: 'image' as const,
    src: '/images/food.webp',        // Primary: WebP
    alt: 'Food Image',
    fallbackSrc: '/images/food.jpg'  // Fallback: JPG
  }
];
```

Dengan contoh-contoh ini, Anda dapat dengan mudah menambahkan multiple foto dan video ke dalam card-card layanan dengan pengalaman yang menarik dan interaktif!
