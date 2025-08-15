import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Script from 'next/script';
import '@/lib/init'; // Initialize cron jobs and system





const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

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
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white`}>
        {children}
        
        {/* Chatbot JS */}
        <Script src="/chatbot.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}