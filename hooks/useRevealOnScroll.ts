import { useEffect, useRef, useState } from 'react';

export function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // animasi hanya sekali, hapus baris ini jika ingin animasi setiap muncul
        }
      },
      { threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
