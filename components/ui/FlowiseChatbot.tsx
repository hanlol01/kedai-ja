'use client';

import { BubbleChat } from 'flowise-embed-react';

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