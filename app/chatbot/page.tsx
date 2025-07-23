'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatbotPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
    showWhatsAppButton?: boolean;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WhatsApp configuration
  const WHATSAPP_CONFIG = {
    phoneNumber: '6285797954113',
    defaultMessage: 'Halo, saya ingin bertanya tentang pemesanan di Kedai J.A'
  };

  // Keywords yang akan memicu munculnya tombol WhatsApp
  const ORDER_KEYWORDS = [
    'pesan', 'order', 'pemesanan', 'cara pesan', 'bagaimana pesan', 
    'mau pesan', 'ingin pesan', 'booking', 'reservasi', 'delivery',
    'takeaway', 'bungkus', 'antar', 'kirim', 'hubungi admin'
  ];

  // Quick reply options
  const quickReplies = [
    "Lihat menu makanan",
    "Lihat menu minuman", 
    "Jam buka restoran",
    "Lokasi restoran",
    "Cara pemesanan",
    "Hubungi admin"
  ];

  useEffect(() => {
    // Add welcome message
    const welcomeMessage = {
      id: Date.now().toString(),
      text: "Halo! Selamat datang di Kedai J.A 👋\n\nSaya siap membantu Anda dengan informasi menu, jam buka, lokasi, dan pemesanan. Silakan pilih topik di bawah atau ketik pertanyaan Anda!",
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Focus input after component mounts
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fungsi untuk mengecek apakah pesan mengandung keyword pemesanan
  const containsOrderKeywords = (message: string) => {
    const lowerMessage = message.toLowerCase();
    return ORDER_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Check if message contains order keywords
    const shouldShowWhatsApp = containsOrderKeywords(message);

    try {
      const response = await fetch('https://cloud.flowiseai.com/api/v1/prediction/8ddd31a1-3d18-432d-bf8e-ac2576c85b73', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      });

      const data = await response.json();

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.text || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi.',
        isBot: true,
        timestamp: new Date(),
        showWhatsAppButton: shouldShowWhatsApp
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, terjadi kesalahan koneksi. Silakan coba lagi dalam beberapa saat.',
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const createWhatsAppButton = () => {
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage)}`;
    
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        Hubungi Admin WhatsApp
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Kedai J.A Assistant</h1>
              <p className="text-sm opacity-90">Online - Siap membantu Anda</p>
            </div>
          </div>
          <button
            onClick={() => window.close()}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            title="Tutup"
          >
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${message.isBot ? '' : 'order-2'}`}>
              {message.isBot && (
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Kedai J.A</span>
                </div>
              )}
              
              <div
                className={`p-3 rounded-2xl shadow-sm ${
                  message.isBot
                    ? 'bg-white text-gray-800 rounded-tl-lg'
                    : 'bg-orange-500 text-white rounded-tr-lg ml-8'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              </div>
              
              {message.showWhatsAppButton && (
                <div className="mt-3">
                  {createWhatsAppButton()}
                </div>
              )}
              
              <div className={`text-xs text-gray-500 mt-1 ${message.isBot ? '' : 'text-right'}`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">Kedai J.A</span>
              </div>
              
              <div className="bg-white p-3 rounded-2xl rounded-tl-lg shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies - Always visible */}
      <div className="px-4 pb-2">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => handleQuickReply(reply)}
              className="flex-shrink-0 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-1 p-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 rounded-full flex items-center justify-center text-white transition-colors shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}