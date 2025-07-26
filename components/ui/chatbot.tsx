"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import BubbleChat
const BubbleChat = dynamic(
  () => import("flowise-embed-react").then(mod => mod.BubbleChat),
  { ssr: false }
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Bubble Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-amber-600 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 transition"
          aria-label="Buka Chatbot"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <div className="relative">
            {/* Tombol Tutup */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-4 -right-4 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100"
              aria-label="Tutup Chatbot"
            >
              ×
            </button>
            {/* BubbleChat dari Flowise */}
            <BubbleChat
              chatflowid="8ddd31a1-3d18-432d-bf8e-ac2576c85b73"
              apiHost="https://cloud.flowiseai.com"
              welcomeMessage="Halo! Saya asisten virtual Kedai J.A. Ada yang bisa saya bantu hari ini?"
            />
          </div>
        </div>
      )}
    </>
  );
}
