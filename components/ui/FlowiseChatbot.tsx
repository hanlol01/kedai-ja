'use client';

import dynamic from 'next/dynamic';

// Dynamic import dengan noSSR untuk mencegah error window is not defined
const BubbleChat = dynamic(
  () => import('flowise-embed-react').then((mod) => mod.BubbleChat),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chatbot...</div>
      </div>
    )
  }
);

interface FlowiseChatbotProps {
  className?: string;
}

export default function FlowiseChatbot({ className = '' }: FlowiseChatbotProps) {
  return (
    <div className={`w-full h-full ${className}`}>
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
    </div>
  );
} 