'use client';

import { BubbleChat } from 'flowise-embed-react';
import { useState, useEffect } from 'react';

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export default function EnhancedBubbleChat() {
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Quick Reply Options
  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Lihat Menu Makanan', action: 'menu_makanan' },
    { id: '2', text: 'Lihat Menu Minuman', action: 'menu_minuman' },
    { id: '3', text: 'Jam Buka Restoran', action: 'jam_buka' },
    { id: '4', text: 'Lokasi Restoran', action: 'lokasi' },
    { id: '5', text: 'Cara Pemesanan', action: 'cara_pesan' },
    { id: '6', text: 'Hubungi Admin', action: 'hubungi_admin' }
  ];

  // Listen for chat state changes
  useEffect(() => {
    const handleChatToggle = () => {
      setIsChatOpen(!isChatOpen);
      setShowQuickReplies(true);
    };

    // Add event listener for chat toggle
    window.addEventListener('flowise-chat-toggle', handleChatToggle);
    
    return () => {
      window.removeEventListener('flowise-chat-toggle', handleChatToggle);
    };
  }, [isChatOpen]);

  const handleQuickReply = (quickReply: QuickReply) => {
    // Send quick reply to Flowise chatbot
    const event = new CustomEvent('flowise-quick-reply', {
      detail: { message: quickReply.text }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="relative">
      {/* Flowise BubbleChat */}
      <BubbleChat
        chatflowid="8ddd31a1-3d18-432d-bf8e-ac2576c85b73"
        apiHost="https://cloud.flowiseai.com"
        theme={{
          button: {
            backgroundColor: '#f97316',
            right: 20,
            bottom: 20,
            size: 'large'
          },
          chatWindow: {
            backgroundColor: '#ffffff',
            title: 'Kedai J.A Assistant',
            welcomeMessage: 'Halo! Selamat datang di Kedai J.A. Ada yang bisa saya bantu hari ini?'
          }
        }}
      />

      {/* Custom Quick Replies Overlay */}
      {isChatOpen && showQuickReplies && (
        <div className="fixed bottom-32 right-6 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-xs">
          <div className="text-sm font-semibold text-gray-800 mb-3">
            Pilihan Cepat:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleQuickReply(reply)}
                className="text-left bg-gray-50 hover:bg-orange-500 hover:text-white text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors border border-gray-200 hover:border-orange-500"
              >
                {reply.text}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowQuickReplies(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
} 