'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export default function QuickReplyOverlay() {
  const [isVisible, setIsVisible] = useState(false);
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

  // Detect when Flowise chat is open
  useEffect(() => {
    const checkChatOpen = () => {
      const chatWindow = document.querySelector('[data-testid="chat-window"]') || 
                        document.querySelector('.flowise-chat-window') ||
                        document.querySelector('iframe[src*="flowiseai.com"]');
      
      if (chatWindow) {
        const isVisible = chatWindow.getBoundingClientRect().width > 0;
        setIsChatOpen(isVisible);
        setIsVisible(isVisible);
      }
    };

    // Check initially
    checkChatOpen();

    // Check periodically
    const interval = setInterval(checkChatOpen, 1000);

    // Listen for DOM changes
    const observer = new MutationObserver(checkChatOpen);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const handleQuickReply = (quickReply: QuickReply) => {
    // Find Flowise input field and send message
    const inputField = document.querySelector('input[placeholder*="question"], input[placeholder*="pesan"], textarea') as HTMLInputElement;
    const sendButton = document.querySelector('button[type="submit"], button[aria-label*="send"], button[title*="send"]') as HTMLButtonElement;
    
    if (inputField && sendButton) {
      // Set the message
      inputField.value = quickReply.text;
      
      // Trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      inputField.dispatchEvent(inputEvent);
      
      // Send the message
      setTimeout(() => {
        sendButton.click();
      }, 100);
    }

    // Hide quick reply after sending
    setIsVisible(false);
  };

  if (!isChatOpen || !isVisible) return null;

  return (
    <div className="fixed bottom-32 right-6 z-[9999] bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-xs animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-800">
          Pilihan Cepat:
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          <X className="w-4 h-4" />
        </button>
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
    </div>
  );
} 