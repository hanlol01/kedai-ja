import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Chatbot from '@/components/chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kedai J.A - Authentic Indonesian Cuisine',
  description: 'Kedai J.A menyajikan makanan Indonesia autentik dengan cita rasa tradisional yang telah diturunkan dari generasi ke generasi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
        
        {/* Flowise AI Chatbot */}
        <Script
          src="/chatbot.js"
          strategy="afterInteractive"
        />
        <Chatbot  />
      </body>
    </html>
  );
}