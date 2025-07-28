'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  showQuickReplies?: boolean;
}

interface QuickReply {
  id: string;
  text: string;
  action: string;
}

export default function CustomChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Generate session ID
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [sessionId]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Halo! Selamat datang di Kedai J.A 👋\n\nSaya siap membantu Anda dengan informasi menu, jam buka, lokasi, dan pemesanan. Silakan pilih topik di bawah atau ketik pertanyaan Anda!",
        isBot: true,
        timestamp: new Date(),
        showQuickReplies: true
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call Flowise API with session management
      const response = await fetch('https://cloud.flowiseai.com/api/v1/prediction/8ddd31a1-3d18-432d-bf8e-ac2576c85b73', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionId // Pass session ID
        },
        body: JSON.stringify({ 
          question: message,
          sessionId: sessionId, // Include session ID in body
          overrideConfig: {
            sessionId: sessionId
          }
        })
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi.',
        isBot: true,
        timestamp: new Date(),
        showQuickReplies: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
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

  const handleQuickReply = (quickReply: QuickReply) => {
    sendMessage(quickReply.text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

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
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs ${message.isBot ? '' : 'order-2'}`}>
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
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
                    
                    {message.showQuickReplies && (
                      <div className="mt-3 space-y-2">
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
                    
                    <div className={`text-xs text-gray-500 mt-1 ${message.isBot ? '' : 'text-right'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
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
        </div>
      )}
    </>
  );
} 