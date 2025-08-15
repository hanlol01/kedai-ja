'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt: string;
  fallbackSrc?: string;
}

interface MediaCarouselProps {
  items: MediaItem[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  aspectRatio?: 'video' | 'square' | 'custom';
  className?: string;
  overlayText?: string;
}

export default function MediaCarousel({
  items,
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  aspectRatio = 'video',
  className = '',
  overlayText
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [videoPlaying, setVideoPlaying] = useState<{ [key: number]: boolean }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && isPlaying && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isPlaying, interval, items.length]);

  // Pause auto-play when video is playing
  useEffect(() => {
    const hasVideoPlaying = Object.values(videoPlaying).some(Boolean);
    if (hasVideoPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(autoPlay);
    }
  }, [videoPlaying, autoPlay]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleVideoPlay = (index: number) => {
    setVideoPlaying(prev => ({ ...prev, [index]: true }));
  };

  const handleVideoPause = (index: number) => {
    setVideoPlaying(prev => ({ ...prev, [index]: false }));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentItem = items[currentIndex];

  if (!currentItem) {
    return (
      <div className={`aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-400/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-semibold">No Media Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl group ${className}`}>
      {/* Main Media Container */}
      <div className={`${aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'square' ? 'aspect-square' : ''} bg-gradient-to-br from-gray-100 to-gray-200`}>
        {currentItem.type === 'image' ? (
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            className="w-full h-full object-cover transition-opacity duration-500"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (currentItem.fallbackSrc) {
                target.src = currentItem.fallbackSrc;
              } else {
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }
            }}
          />
        ) : (
          <video
            ref={(el) => {
              videoRefs.current[currentIndex] = el;
            }}
            src={currentItem.src}
            className="w-full h-full object-cover"
            autoPlay={videoPlaying[currentIndex]}
            muted
            loop
            playsInline
            onPlay={() => handleVideoPlay(currentIndex)}
            onPause={() => handleVideoPause(currentIndex)}
            onError={(e) => {
              const target = e.currentTarget as HTMLVideoElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        )}

        {/* Fallback for failed media */}
        <div className="hidden absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-lg font-semibold">Media Preview</p>
            <p className="text-sm opacity-80">Media akan ditampilkan di sini</p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && items.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous media"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next media"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Play/Pause Button for Auto-play */}
          {autoPlay && (
            <button
              onClick={togglePlayPause}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media Type Indicator */}
      <div className="absolute top-4 left-4">
        <div className="px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center space-x-1">
          {currentItem.type === 'video' ? (
            <>
              <Play className="w-3 h-3" />
              <span>Video</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span>Image</span>
            </>
          )}
        </div>
      </div>

      {/* Counter */}
      {items.length > 1 && (
        <div className="absolute top-4 right-4">
          <div className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      )}

      {/* Overlay Text */}
      {overlayText && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-xl">
          <p className="text-white text-sm font-medium">{overlayText}</p>
        </div>
      )}
    </div>
  );
}
