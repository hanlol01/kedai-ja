'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FlowiseChatbot from '@/components/ui/FlowiseChatbot';

export default function ChatbotPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
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
        </div>
      </header>

      {/* Chatbot Content */}
      <div className="flex-1">
        <FlowiseChatbot className="h-full" />
      </div>
    </div>
  );
} 