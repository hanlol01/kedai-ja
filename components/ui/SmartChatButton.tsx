'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ChevronDown } from 'lucide-react';

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export default function SmartChatButton() {
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Quick Reply Options
  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Lihat Menu Makanan', action: 'menu_makanan' },
    { id: '2', text: 'Lihat Menu Minuman', action: 'menu_minuman' },
    { id: '3', text: 'Jam Buka Restoran', action: 'jam_buka' },
    { id: '4', text: 'Lokasi Restoran', action: 'lokasi' },
    { id: '5', text: 'Cara Pemesanan', action: 'cara_pesan' },
    { id: '6', text: 'Hubungi Admin', action: 'hubungi_admin' }
  ];

  // Close quick replies when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowQuickReplies(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickReply = (quickReply: QuickReply) => {
    // Open Flowise chat and send message
    setIsChatOpen(true);
    setShowQuickReplies(false);
    
    // Wait for chat to open then send message
    setTimeout(() => {
      const inputField = document.querySelector('input[placeholder*="question"], input[placeholder*="pesan"], textarea') as HTMLInputElement;
      const sendButton = document.querySelector('button[type="submit"], button[aria-label*="send"], button[title*="send"]') as HTMLButtonElement;
      
      if (inputField && sendButton) {
        inputField.value = quickReply.text;
        const inputEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(inputEvent);
        
        setTimeout(() => {
          sendButton.click();
        }, 100);
      }
    }, 1000);
  };

  const openChat = () => {
    setIsChatOpen(true);
    setShowQuickReplies(false);
  };

  return (
    <div ref={buttonRef} className="fixed bottom-6 right-6 z-40">
      {/* Quick Reply Panel */}
      {showQuickReplies && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-xs mb-2 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-800">
              Pilihan Cepat:
            </div>
            <button
              onClick={() => setShowQuickReplies(false)}
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
      )}

      {/* Main Chat Button */}
      <div className="flex flex-col items-end space-y-2">
        {/* Quick Reply Toggle Button */}
        <button
          onClick={() => setShowQuickReplies(!showQuickReplies)}
          className="w-12 h-12 bg-orange-400 hover:bg-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Pilihan Cepat"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Main Chat Button */}
        <button
          onClick={openChat}
          className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          title="Chat dengan Kedai J.A"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75"></div>
        </button>
      </div>

      {/* Flowise Chat (Hidden until needed) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsChatOpen(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Kedai J.A Assistant</h2>
                  <p className="text-sm opacity-90">Online - Siap membantu Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-full">
              <iframe
                src="https://cloud.flowiseai.com/embed/8ddd31a1-3d18-432d-bf8e-ac2576c85b73"
                className="w-full h-full border-0"
                title="Kedai J.A Assistant"
                allow="microphone"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 