# Panduan Integrasi Media (Gambar & Video) untuk Card Layanan

## Overview
Card-card layanan sekarang mendukung tampilan gambar dan video untuk memberikan visualisasi yang lebih menarik kepada pengunjung website.

## Fitur yang Tersedia

### 1. Dukungan Gambar
- Format: JPG, PNG, WebP, SVG
- Responsive design dengan aspect ratio 16:9
- Hover effects dengan scale animation
- Fallback placeholder jika gambar tidak ditemukan

### 2. Dukungan Video
- Format: MP4, WebM
- Auto-play dengan muted (untuk UX yang lebih baik)
- Loop playback
- Fallback ke gambar jika video tidak tersedia

### 3. Fallback System
- Jika media tidak ditemukan, akan menampilkan placeholder yang menarik
- Gradient background dengan icon yang sesuai
- Pesan informatif untuk user

## Cara Menggunakan

### Untuk Card RESTO
```tsx
{/* Opsi 1: Menggunakan Gambar */}
<img 
  src="/path/to/your/resto-image.jpg" 
  alt="Resto Menu Preview" 
  className="w-full h-full object-cover rounded-xl"
/>

{/* Opsi 2: Menggunakan Video */}
<video 
  className="w-full h-full object-cover rounded-xl"
  autoPlay 
  muted 
  loop 
  playsInline
>
  <source src="/path/to/your/resto-video.mp4" type="video/mp4" />
  <source src="/path/to/your/resto-video.webm" type="video/webm" />
</video>
```

### Untuk Card CATERING/VENUE
```tsx
{/* Opsi 1: Menggunakan Gambar */}
<img 
  src="/path/to/your/venue-image.jpg" 
  alt="Venue Reservation Preview" 
  className="w-full h-full object-cover rounded-xl"
/>

{/* Opsi 2: Menggunakan Video */}
<video 
  className="w-full h-full object-cover rounded-xl"
  autoPlay 
  muted 
  loop 
  playsInline
>
  <source src="/path/to/your/venue-video.mp4" type="video/mp4" />
  <source src="/path/to/your/venue-video.webm" type="video/webm" />
</video>
```

## Rekomendasi Media

### Untuk Card RESTO
- **Gambar**: Foto makanan, interior resto, atau suasana makan
- **Video**: Video singkat proses memasak, suasana resto, atau testimonial customer
- **Ukuran**: Minimal 1280x720px untuk kualitas optimal

### Untuk Card CATERING/VENUE
- **Gambar**: Foto venue, suasana acara, atau layout tempat
- **Video**: Video tour venue, suasana acara, atau testimonial
- **Ukuran**: Minimal 1280x720px untuk kualitas optimal

## Optimasi Performa

### 1. Kompresi Gambar
```bash
# Menggunakan tools online seperti TinyPNG atau ImageOptim
# Format yang direkomendasikan: WebP dengan fallback JPG
```

### 2. Kompresi Video
```bash
# Menggunakan FFmpeg untuk kompresi video
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### 3. Lazy Loading
Gambar sudah menggunakan lazy loading secara otomatis. Untuk video, bisa ditambahkan:
```tsx
<video 
  loading="lazy"
  preload="metadata"
  // ... other props
>
```

## Customization

### 1. Mengubah Aspect Ratio
```tsx
// Ubah dari aspect-video (16:9) ke aspect-square (1:1)
<div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200">
```

### 2. Mengubah Overlay Text
```tsx
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-xl">
  <p className="text-white text-sm font-medium">Custom text here</p>
</div>
```

### 3. Mengubah Hover Effects
```tsx
// Tambahkan efek blur pada hover
<div className="group-hover:scale-105 group-hover:blur-sm transition-all duration-500">
```

## Troubleshooting

### 1. Gambar Tidak Muncul
- Periksa path file di folder `public/`
- Pastikan nama file sesuai dengan yang direferensikan
- Periksa console browser untuk error

### 2. Video Tidak Play
- Pastikan format video didukung (MP4/WebM)
- Periksa autoplay policy browser
- Pastikan video tidak terlalu besar (max 10MB)

### 3. Fallback Tidak Muncul
- Periksa struktur HTML untuk memastikan fallback div berada di posisi yang benar
- Pastikan class `hidden` dan `flex` bekerja dengan baik

## Best Practices

1. **Ukuran File**: Jaga ukuran gambar < 500KB, video < 5MB
2. **Format**: Gunakan WebP untuk gambar, MP4 untuk video
3. **Alt Text**: Selalu berikan alt text yang deskriptif
4. **Loading**: Gunakan lazy loading untuk performa
5. **Fallback**: Selalu sediakan fallback yang menarik

## Contoh Implementasi Lengkap

```tsx
{/* Media Section dengan Multiple Fallbacks */}
<div className="mb-8 relative overflow-hidden rounded-xl">
  <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
    
    {/* Primary: WebP Image */}
    <img 
      src="/resto-preview.webp" 
      alt="Resto Menu Preview" 
      className="w-full h-full object-cover rounded-xl"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.nextElementSibling) {
          (target.nextElementSibling as HTMLElement).style.display = 'block';
        }
        target.style.display = 'none';
      }}
    />
    
    {/* Fallback 1: JPG Image */}
    <img 
      src="/resto-preview.jpg" 
      alt="Resto Menu Preview" 
      className="w-full h-full object-cover rounded-xl hidden"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (target.nextElementSibling) {
          (target.nextElementSibling as HTMLElement).style.display = 'flex';
        }
        target.style.display = 'none';
      }}
    />
    
    {/* Fallback 2: Placeholder */}
    <div className="hidden absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-lg font-semibold">Resto Preview</p>
        <p className="text-sm opacity-80">Gambar akan ditampilkan di sini</p>
      </div>
    </div>
  </div>
  
  {/* Overlay */}
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-xl">
    <p className="text-white text-sm font-medium">Nikmati hidangan lezat kami</p>
  </div>
</div>
```

## File Structure yang Direkomendasikan

```
public/
├── images/
│   ├── resto/
│   │   ├── menu-preview.webp
│   │   ├── menu-preview.jpg
│   │   └── interior.webp
│   └── venue/
│       ├── venue-preview.webp
│       ├── venue-preview.jpg
│       └── event-space.webp
├── videos/
│   ├── resto-preview.mp4
│   ├── venue-tour.mp4
│   └── cooking-process.mp4
└── fallbacks/
    ├── resto-placeholder.svg
    └── venue-placeholder.svg
```

Dengan panduan ini, Anda dapat dengan mudah mengintegrasikan media yang menarik ke dalam card-card layanan untuk meningkatkan user experience website Anda.
