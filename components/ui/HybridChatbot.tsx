'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export default function HybridChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick Reply Options
  const quickReplies: QuickReply[] = [
    { id: '1', text: 'Lihat Menu Makanan', action: 'menu_makanan' },
    { id: '2', text: 'Lihat Menu Minuman', action: 'menu_minuman' },
    { id: '3', text: 'Jam Buka Restoran', action: 'jam_buka' },
    { id: '4', text: 'Lokasi Restoran', action: 'lokasi' },
    { id: '5', text: 'Cara Pemesanan', action: 'cara_pesan' },
    { id: '6', text: 'Hubungi Admin', action: 'hubungi_admin' }
  ];

  // Handle quick reply click
  const handleQuickReply = (quickReply: QuickReply) => {
    setInputMessage(quickReply.text);
    setShowQuickReplies(false);
    
    // Focus input and trigger send
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        handleSubmit(new Event('submit') as any);
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    setIsTyping(true);
    setShowQuickReplies(false);

    // Send message to iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SEND_MESSAGE',
        message: inputMessage
      }, 'https://cloud.flowiseai.com');
    }

    setInputMessage('');
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      setShowQuickReplies(true);
    }, 2000);
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://cloud.flowiseai.com') {
        if (event.data.type === 'BOT_RESPONSE') {
          setIsTyping(false);
          setShowQuickReplies(true);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center group"
        title="Chat dengan Kedai J.A"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-75"></div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] overflow-hidden">
            {/* Header */}
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
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Flowise Chatbot Iframe */}
              <div className="flex-1 relative">
                <iframe
                  ref={iframeRef}
                  src="https://cloud.flowiseai.com/embed/8ddd31a1-3d18-432d-bf8e-ac2576c85b73"
                  className="w-full h-full border-0"
                  title="Kedai J.A Assistant"
                  allow="microphone"
                  frameBorder="0"
                  scrolling="no"
                />
              </div>

              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        onClick={() => handleQuickReply(reply)}
                        className="bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Input Area */}
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
          </div>
        </div>
      )}
    </>
  );
} 