'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function ChatbotScript() {
  const pathname = usePathname();
  
  // Jangan load chatbot di halaman admin
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <Script src="/chatbot.js" strategy="afterInteractive" />
  );
}






