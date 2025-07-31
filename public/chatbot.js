(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        FLOWISE_API: 'https://cloud.flowiseai.com/api/v1/prediction/8ddd31a1-3d18-432d-bf8e-ac2576c85b73',
        WHATSAPP_NUMBER: '62857979541136',
        WHATSAPP_MESSAGE: 'Halo, saya ingin bertanya tentang pemesanan di Kedai J.A',
        WELCOME_MESSAGE: `Halo! Selamat datang di Kedai J.A 👋

Saya siap membantu Anda dengan informasi menu, jam operasional, lokasi, dan pemesanan. Silakan pilih topik di bawah atau ketik pertanyaan Anda!`,
        QUICK_REPLIES: [
            'Lihat menu Kedai J.A',
            'Jam operasional kami',
            'Lokasi kami',
            'Cara pemesanan',
            'Hubungi admin'
        ]
    };

    // Global variables
    let isOpen = false;
    let messageId = 0;

    // Function to convert **text** to bold HTML
    const formatBoldText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    // Inject CSS styles
    const injectStyles = () => {
        const css = `
            /* Chatbot Styles */
            .chatbot-container * {
                box-sizing: border-box;
                font-family: system-ui, -apple-system, sans-serif;
            }

            .chatbot-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #F97316, #EA580C);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .chatbot-button:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 25px rgba(249, 115, 22, 0.5);
            }

            .chatbot-button svg {
                width: 24px;
                height: 24px;
                fill: white;
            }

            .chatbot-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 20px;
                height: 20px;
                background: #EF4444;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                color: white;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            .chatbot-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 380px;
                height: 550px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
                z-index: 1001;
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .chatbot-header {
                background: linear-gradient(135deg, #F97316, #EA580C);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .chatbot-header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .chatbot-header-buttons {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .chatbot-reset {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 6px;
                border-radius: 6px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chatbot-reset:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.1);
            }

            .chatbot-avatar {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            .chatbot-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }

            .chatbot-avatar svg {
                width: 20px;
                height: 20px;
                fill: white;
            }

            .chatbot-title {
                font-size: 16px;
                font-weight: 600;
                margin: 0;
            }

            .chatbot-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }

            .chatbot-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .chatbot-close svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }

            .chatbot-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #F8FAFC;
                scrollbar-width: thin;
                scrollbar-color: #CBD5E1 transparent;
            }

            .chatbot-messages::-webkit-scrollbar {
                width: 6px;
            }

            .chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }

            .chatbot-messages::-webkit-scrollbar-thumb {
                background: #CBD5E1;
                border-radius: 3px;
            }

            .chatbot-message {
                margin-bottom: 16px;
                display: flex;
                align-items: flex-start;
                gap: 8px;
            }

            .chatbot-message.user {
                flex-direction: row-reverse;
            }

            .chatbot-message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .chatbot-message.bot .chatbot-message-avatar {
                background: #F97316;
                overflow: hidden;
            }

            .chatbot-message.bot .chatbot-message-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            }

            .chatbot-message.user .chatbot-message-avatar {
                background: #64748B;
            }

            .chatbot-message-avatar svg {
                width: 16px;
                height: 16px;
                fill: white;
            }

            .chatbot-message-content {
                max-width: 75%;
                padding: 12px 16px;
                border-radius: 16px;
                font-size: 14px;
                line-height: 1.4;
                position: relative;
            }

            .chatbot-message.bot .chatbot-message-content {
                background: white;
                border-bottom-left-radius: 4px;
                color: #1F2937;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .chatbot-message.user .chatbot-message-content {
                background: #F97316;
                border-bottom-right-radius: 4px;
                color: white;
            }

            .chatbot-message-time {
                font-size: 11px;
                opacity: 0.7;
                margin-top: 4px;
            }

            .chatbot-typing {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }

            .chatbot-typing-dots {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
                background: white;
                border-radius: 16px;
                border-bottom-left-radius: 4px;
            }

            .chatbot-typing-dot {
                width: 6px;
                height: 6px;
                background: #94A3B8;
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out;
            }

            .chatbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .chatbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }

            @keyframes typing {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .chatbot-quick-replies {
                padding: 12px;
                border-top: 1px solid #E2E8F0;
                position: relative;
            }

            .chatbot-input-container {
                padding: 12px;
                border-top: 1px solid #E2E8F0;
                display: flex;
                gap: 8px;
                background: white;
                align-items: flex-end;
            }

            .chatbot-input {
                flex: 1;
                border: 1px solid #E2E8F0;
                border-radius: 18px;
                padding: 8px 14px;
                font-size: 13px;
                outline: none;
                transition: border-color 0.2s ease;
                color: #1F2937;
                background: white;
                resize: none;
                min-height: 36px;
                max-height: 120px;
                overflow-y: auto;
                line-height: 1.4;
                word-wrap: break-word;
                white-space: pre-wrap;
            }

            .chatbot-input:focus {
                border-color: #F97316;
            }

            .chatbot-input::placeholder {
                color: #9CA3AF;
                opacity: 1;
            }

            .chatbot-send {
                width: 36px;
                height: 36px;
                background: #F97316;
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .chatbot-send:hover {
                background: #EA580C;
                transform: scale(1.05);
            }

            .chatbot-send:disabled {
                background: #CBD5E1;
                cursor: not-allowed;
                transform: none;
            }

            .chatbot-send svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            .chatbot-whatsapp-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: #25D366;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 8px;
                transition: all 0.2s ease;
                text-decoration: none;
            }

            .chatbot-whatsapp-btn:hover {
                background: #128C7E;
                transform: scale(1.05);
            }

            .chatbot-whatsapp-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            .chatbot-menu-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background:rgb(124, 165, 0);
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 8px;
                transition: all 0.2s ease;
                text-decoration: none;
            }

            .chatbot-menu-btn:hover {
                background:rgb(124, 165, 0);
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
            }

            .chatbot-menu-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            .chatbot-location-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: #4285F4;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 13px;
                cursor: pointer;
                margin-top: 8px;
                transition: all 0.2s ease;
                text-decoration: none;
                font-weight: 500;
            }

            .chatbot-location-btn:hover {
                background: #3367D6;
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
            }

            .chatbot-location-btn svg {
                width: 16px;
                height: 16px;
                margin-right: 6px;
            }

            .chatbot-gofood-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: #00AA13;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 13px;
                cursor: pointer;
                margin-top: 8px;
                transition: all 0.2s ease;
                text-decoration: none;
                font-weight: 500;
            }
            .chatbot-gofood-btn:hover {
                background: #008F10;
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(0, 170, 19, 0.2);
            }

            .chatbot-reservation-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: #008F10;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 13px;
                cursor: pointer;
                margin-top: 8px;
                transition: all 0.2s ease;
                text-decoration: none;
                font-weight: 500;
            }

            .chatbot-reservation-btn:hover {
                background: #7C3AED;
                transform: scale(1.05);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
            }

            .chatbot-reservation-btn svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }

            @media (max-width: 480px) {
                .chatbot-window {
                    width: calc(100vw - 40px);
                    right: 20px;
                    left: 20px;
                }
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // Icons and Images Configuration
    const icons = {
        chat: `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
        close: `<svg viewBox="0 0 24 24"><path d="M18.3 5.71L12 12.01l-6.3-6.3-1.42 1.42L10.59 13.42l-6.3 6.3 1.42 1.42L12 14.84l6.3 6.3 1.42-1.42L13.41 13.42l6.3-6.3z"/></svg>`,
        bot: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
        user: `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        send: `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.25 7.24c-.22-.63-1.26-1.16-1.26-1.16s-.93-.39-1.08-.44c-.16-.05-.27-.05-.38.05-.11.11-.44.55-.54.66-.09.11-.18.12-.33.06-.16-.06-.67-.25-1.28-.79-.47-.42-.79-.94-.88-1.1-.09-.16-.01-.25.07-.33.07-.07.16-.18.24-.27.08-.09.11-.16.16-.27.05-.11.03-.21-.02-.29-.05-.09-.38-.93-.52-1.27-.14-.33-.28-.28-.38-.29-.1-.01-.21-.01-.32-.01s-.29.04-.44.21c-.16.17-.6.59-.6 1.44s.61 1.67.7 1.78c.08.11 1.18 1.8 2.87 2.53.4.17.72.28 1.96.28 1.24-.01 2.13-.42 2.48-.7.35-.28.57-.67.57-1.24 0-.57-.04-.98-.26-1.61z"/></svg>`,
        calendar: `<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>`
    };

    // Logo configuration - you can change this to your logo path
    const LOGO_CONFIG = {
        // Use your logo from public folder
        botAvatar: '/logo-hitam.jpg', // Change this to your logo path
        // Alternative: use logo-bg.png or hero-bg.jpg
        // botAvatar: '/logo-bg.png',
        // botAvatar: '/hero-bg.jpg',
        fallbackIcon: icons.bot // Fallback if image fails to load
    };

    // Create chatbot elements
    const createChatbot = () => {
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <button class="chatbot-button" id="chatbot-toggle">
                ${icons.chat}
                <span class="chatbot-badge" id="chatbot-badge" style="display: none;">!</span>
            </button>

            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">
                            <img src="${LOGO_CONFIG.botAvatar}" alt="Kedai J.A" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div style="display: none;">${LOGO_CONFIG.fallbackIcon}</div>
                        </div>
                        <h3 class="chatbot-title">Kedai J.A Assistant</h3>
                    </div>
                    <div class="chatbot-header-buttons">
                        <button class="chatbot-reset" id="chatbot-reset" title="Reset Chat">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                            </svg>
                        </button>
                    <button class="chatbot-close" id="chatbot-close">
                        ${icons.close}
                    </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatbot-messages"></div>

                <div class="chatbot-quick-replies" id="chatbot-quick-replies">
                    <!-- Quick replies will be created dynamically -->
                </div>

                <div class="chatbot-input-container">
                    <textarea class="chatbot-input" id="chatbot-input" placeholder="Ketik pesan Anda... (Shift+Enter untuk baris baru)" maxlength="500" rows="1"></textarea>
                    <button class="chatbot-send" id="chatbot-send">
                        ${icons.send}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Create quick replies after container is added to DOM
        createQuickReplies();

        return container;
    };

    // Create quick replies with scroll functionality
    const createQuickReplies = () => {
        const quickRepliesContainer = document.getElementById('chatbot-quick-replies');
        if (!quickRepliesContainer) return;

        // Quick replies container
        const container = document.createElement('div');
        container.style.padding = '8px 0';
        container.style.background = '#F8FAFC';
        container.style.overflowX = 'auto';
        container.style.overflowY = 'hidden';

        // Scrollable container untuk buttons
        const scrollContainer = document.createElement('div');
        scrollContainer.style.display = 'flex';
        scrollContainer.style.gap = '6px';
        scrollContainer.style.padding = '0 12px';
        scrollContainer.style.minWidth = 'max-content';
        scrollContainer.style.scrollBehavior = 'smooth';

        // Buat quick reply buttons
        CONFIG.QUICK_REPLIES.forEach(reply => {
          const btn = document.createElement('button');
          btn.textContent = reply;
          btn.style.background = 'white';
          btn.style.border = '1px solid #E2E8F0';
          btn.style.borderRadius = '16px';
          btn.style.padding = '6px 12px';
          btn.style.fontSize = '12px';
          btn.style.cursor = 'pointer';
          btn.style.transition = 'all 0.2s';
          btn.style.color = '#475569';
          btn.style.fontWeight = '500';
          btn.style.whiteSpace = 'nowrap';
          btn.style.flexShrink = '0';
          btn.style.minWidth = '100px';
          btn.style.maxWidth = '140px';
          btn.style.textAlign = 'center';

          btn.onmouseover = function() {
            btn.style.background = '#F97316';
            btn.style.color = 'white';
            btn.style.borderColor = '#F97316';
            btn.style.transform = 'translateY(-1px)';
            btn.style.boxShadow = '0 2px 8px rgba(149, 125, 150, 0.3)';
          };
          btn.onmouseout = function() {
            btn.style.background = 'white';
            btn.style.color = '#475569';
            btn.style.borderColor = '#E2E8F0';
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
          };

          btn.onclick = function() {
            handleQuickReply(reply);
          };

          scrollContainer.appendChild(btn);
        });

        container.appendChild(scrollContainer);
        quickRepliesContainer.appendChild(container);
    };

    // Format time in Indonesian
    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Add message to chat
    const addMessage = (contentInput, type = 'bot', showWhatsApp = false) => {
        let content = formatBoldText(contentInput); // Apply bold formatting
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;

        const avatarContent = type === 'bot'
            ? `<img src="${LOGO_CONFIG.botAvatar}" alt="Kedai J.A" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="display: none;">${LOGO_CONFIG.fallbackIcon}</div>`
            : icons.user;

        // Deteksi ringkasan pesanan dan ubah baris total jika ada
        const isOrderSummary = (
    content.toLowerCase().includes('berikut konfirmasi pesanan') ||
    content.toLowerCase().includes('berikut adalah konfirmasi pesanan') ||
    content.toLowerCase().includes('konfirmasi pesanan kak') ||
    content.toLowerCase().includes('konfirmasi pesanan anda') ||
    (
        content.toLowerCase().includes('pesanan atas nama') &&
        content.toLowerCase().includes('dengan tipe pengiriman') &&
        content.toLowerCase().includes('metode pembayaran')
    ) ||
    (
        content.toLowerCase().includes('nama pemesan') &&
        content.toLowerCase().includes('pesanan:') &&
        content.toLowerCase().includes('total pembayaran') &&
        content.toLowerCase().includes('metode pembayaran')
    ) ||
    (
        content.toLowerCase().includes('nama pemesan:') &&
        (content.toLowerCase().includes('pesanan:') || content.toLowerCase().includes('pesanan :')) &&
        (content.toLowerCase().includes('total pembayaran') || content.toLowerCase().includes('total:')) &&
        content.toLowerCase().includes('metode pembayaran')
    ) ||
    (
        content.toLowerCase().includes('konfirmasi pesanan') &&
        content.toLowerCase().includes('metode pembayaran') &&
        (content.toLowerCase().includes('jenis pesanan') || 
         content.toLowerCase().includes('tipe pengiriman') ||
         content.toLowerCase().includes('dibawa pulang') ||
         content.toLowerCase().includes('delivery'))
    ) ||
    // Tambahan deteksi untuk format yang lebih umum
    (
        content.toLowerCase().includes('nama pemesan:') &&
        /\d+\.\s+.+\s+x\s+\d+/.test(content.toLowerCase()) && // Deteksi format "1. Item x 1"
        content.toLowerCase().includes('rp') &&
        (content.toLowerCase().includes('metode pembayaran') || content.toLowerCase().includes('pembayaran:'))
    )
)
&& !content.toLowerCase().includes('ingin ditambahkan')
&& !content.toLowerCase().includes('ingin diubah')
&& !content.toLowerCase().includes('ingin dihapus')
&& !content.toLowerCase().includes('apakah ingin menambah')
&& !content.toLowerCase().includes('apakah ingin mengubah')
&& !content.toLowerCase().includes('apakah ingin menghapus');

        // Debug logging untuk order summary - dengan lebih detail
        console.log('Content (for debugging):', content);
        console.log('Content length:', content.length);
        console.log('Contains "berikut adalah konfirmasi pesanan":', content.toLowerCase().includes('berikut adalah konfirmasi pesanan'));
        console.log('Contains "nama pemesan:":', content.toLowerCase().includes('nama pemesan:'));
        console.log('Contains "pesanan:":', content.toLowerCase().includes('pesanan:'));
        console.log('Contains "total pembayaran":', content.toLowerCase().includes('total pembayaran'));
        console.log('Contains "metode pembayaran":', content.toLowerCase().includes('metode pembayaran'));
        console.log('Is Order Summary:', isOrderSummary);

        // Deteksi konfirmasi reservasi
        const isReservationSummary = (
            (
                content.toLowerCase().includes('baik, saya sudah mencatat detail reservasi') ||
                content.toLowerCase().includes('saya sudah mencatat detail reservasi') ||
                content.toLowerCase().includes('kami sudah mencatat detail reservasi') ||
                content.toLowerCase().includes('sudah kami catat detail reservasi') ||
                content.toLowerCase().includes('data reservasi untuk acara') ||
                content.toLowerCase().includes('data reservasi sudah kami catat') ||
                (
                    content.toLowerCase().includes('detail reservasi') &&
                    content.toLowerCase().includes('nama lengkap') &&
                    content.toLowerCase().includes('jenis acara') &&
                    content.toLowerCase().includes('tanggal acara')
                ) ||
                (
                    content.toLowerCase().includes('reservasi') &&
                    content.toLowerCase().includes('acara') &&
                    (content.includes('*') || content.includes('•') || content.includes('<strong>')) &&
                    (content.toLowerCase().includes('nama lengkap') || content.toLowerCase().includes('jenis acara'))
                ) ||
                // Deteksi untuk format "Terima kasih banyak, [nama]! Data reservasi untuk acara [jenis] sudah kami catat:"
                (
                    content.toLowerCase().includes('terima kasih') &&
                    content.toLowerCase().includes('data reservasi') &&
                    content.toLowerCase().includes('sudah kami catat') &&
                    (content.includes('*') || content.includes('•') || content.includes('<strong>'))
                ) ||
                // Deteksi untuk format kedua "Baik, [nama]! Kami sudah mencatat detail reservasi untuk acara"
                (
                    content.toLowerCase().includes('baik,') &&
                    content.toLowerCase().includes('kami sudah mencatat') &&
                    content.toLowerCase().includes('reservasi untuk acara') &&
                    (content.toLowerCase().includes('tanggal') || content.toLowerCase().includes('jam') || content.toLowerCase().includes('orang'))
                )
            )
            // KONDISI EKSKLUSI: Jangan tampilkan tombol jika ini adalah dialog yang meminta pengisian form
            && !(
                content.toLowerCase().includes('untuk melakukan reservasi') ||
                content.toLowerCase().includes('kakak dapat mengisi formulir') ||
                content.toLowerCase().includes('apakah kakak ingin saya bantu untuk mencatat') ||
                content.toLowerCase().includes('silakan berikan informasi') ||
                content.toLowerCase().includes('mohon berikan detail') ||
                content.toLowerCase().includes('dapat anda isi') ||
                content.toLowerCase().includes('silakan isi formulir') ||
                content.toLowerCase().includes('data berikut:') ||
                (
                    content.toLowerCase().includes('formulir reservasi') &&
                    content.toLowerCase().includes('data berikut')
                ) ||
                (
                    content.toLowerCase().includes('reservasi') &&
                    content.toLowerCase().includes('formulir') &&
                    (content.toLowerCase().includes('isi') || content.toLowerCase().includes('lengkapi'))
                )
            )
        );

        // Debug logging untuk reservation summary - dengan lebih detail
        console.log('Reservation Debug - Content:', content);
        console.log('Contains "data reservasi untuk acara":', content.toLowerCase().includes('data reservasi untuk acara'));
        console.log('Contains "sudah kami catat":', content.toLowerCase().includes('sudah kami catat'));
        console.log('Contains "kami sudah mencatat detail reservasi":', content.toLowerCase().includes('kami sudah mencatat detail reservasi'));
        console.log('Contains bullet points:', content.includes('*') || content.includes('•') || content.includes('<strong>'));
        
        // Debug logging untuk kondisi eksklusi
        console.log('EXCLUSION CHECKS:');
        console.log('Contains "untuk melakukan reservasi":', content.toLowerCase().includes('untuk melakukan reservasi'));
        console.log('Contains "kakak dapat mengisi formulir":', content.toLowerCase().includes('kakak dapat mengisi formulir'));
        console.log('Contains "apakah kakak ingin saya bantu untuk mencatat":', content.toLowerCase().includes('apakah kakak ingin saya bantu untuk mencatat'));
        console.log('Contains "data berikut:":', content.toLowerCase().includes('data berikut:'));
        
        console.log('Is Reservation Summary:', isReservationSummary);

        let whatsappButtonHtml = '';
        let reservationButtonHtml = '';

        if (isOrderSummary) {
            // Parse konten untuk mendapatkan informasi pesanan
            const lines = contentInput.replace(/<br>/g, '\n').split('\n');

            // Ambil baris pesanan (yang dimulai dengan angka dan titik)
            const orderLines = [];
            let totalAmount = '';
            let paymentMethod = '';
            let customerName = '';
            let serviceType = '';

            for (const line of lines) {
                const trimmedLine = line.trim();

                // Deteksi baris pesanan (format: 1. Item x qty = Rp harga)
                if (/^\d+\.\s/.test(trimmedLine)) {
                    orderLines.push(trimmedLine);
                }

                // Deteksi total dengan berbagai format - perbaikan regex
                const totalMatch = trimmedLine.match(/Total(?:\s+(?:pesanan|semua\s+pesanan|pembayaran))?(?:\s+Anda)?(?:\s+adalah)?(?:\s*:)?\s*(Rp[\d.,]+)/i);
                if (totalMatch) {
                    totalAmount = totalMatch[1];
                }

                // Deteksi metode pembayaran - perbaikan regex
                const paymentMatch = trimmedLine.match(/metode\s+pembayaran\s*:?\s*(.+)/i);
                if (paymentMatch) {
                    paymentMethod = paymentMatch[1].trim();
                }

                // Deteksi nama customer dengan berbagai format - perbaikan regex
                const nameMatch = trimmedLine.match(/(?:atas\s+nama|nama\s+pemesan)\s*:?\s*(.+)/i);
                if (nameMatch) {
                    customerName = nameMatch[1].trim();
                }

                // Deteksi tipe layanan dengan berbagai format - perbaikan regex untuk menangkap lebih banyak variasi
                const serviceMatches = [
                    trimmedLine.match(/(?:tipe\s+(?:pengiriman|layanan|pesanan)|jenis\s+pesanan)\s*:?\s*(.+?)(?:\s+dengan|$)/i),
                    trimmedLine.match(/(?:dine-?in\/takeaway|takeaway\/dine-?in)\s*:?\s*(.+?)(?:\s+dengan|$)/i),
                    trimmedLine.match(/(?:makan\s+(?:di\s+tempat|dibawa\s+pulang))\s*:?\s*(.+?)(?:\s+dengan|$)/i),
                    trimmedLine.match(/(?:untuk\s+(?:makan\s+di\s+tempat|dibawa\s+pulang))/i),
                    trimmedLine.match(/(?:pesanan|layanan)\s+untuk\s*:?\s*(.+?)(?:\s+dengan|$)/i)
                ];
                
                for (const match of serviceMatches) {
                    if (match && match[1]) {
                        serviceType = match[1].trim();
                        break;
                    } else if (match && match[0]) {
                        // Untuk kasus khusus seperti "untuk makan di tempat"
                        if (match[0].toLowerCase().includes('makan di tempat')) {
                            serviceType = 'Makan di tempat';
                            break;
                        } else if (match[0].toLowerCase().includes('dibawa pulang')) {
                            serviceType = 'Dibawa pulang';
                            break;
                        }
                    }
                }

                // Deteksi tambahan untuk format dialog yang spesifik
                // Contoh: "Baik Kak Hansen, pesanan Nasi Goreng Seafood, Tempe Mendoan, dan Es Teh Manis akan disiapkan untuk makan di tempat."
                if (!serviceType) {
                    const contextMatches = [
                        contentInput.toLowerCase().match(/akan\s+disiapkan\s+untuk\s+(makan\s+di\s+tempat|dibawa\s+pulang|takeaway|dine-?in)/i),
                        contentInput.toLowerCase().match(/pesanan\s+.+\s+untuk\s+(makan\s+di\s+tempat|dibawa\s+pulang|takeaway|dine-?in)/i)
                    ];
                    
                    for (const match of contextMatches) {
                        if (match && match[1]) {
                            serviceType = match[1].trim();
                            if (serviceType.toLowerCase() === 'dine-in') serviceType = 'Makan di tempat';
                            if (serviceType.toLowerCase() === 'takeaway') serviceType = 'Dibawa pulang';
                            break;
                        }
                    }
                }
            }

            // Debug logging untuk parsing
            console.log('Parsed Order Data:', {
                orderLines,
                totalAmount,
                paymentMethod,
                customerName,
                serviceType
            });

            // Format pesan WhatsApp sesuai template yang diminta dengan penomoran
            let waText = 'Halo admin! Saya ingin melakukan pemesanan ini dan berikut ini pesanan saya:';

            // Tambahkan item pesanan dengan penomoran
            if (orderLines.length > 0) {
                waText += '\n' + orderLines.join('\n');
            }

            // Tambahkan total dengan penomoran
            if (totalAmount) {
                waText += `\nTotal semua pesanan: ${totalAmount}`;
            }

            // Tambahkan metode pembayaran dengan penomoran
            if (paymentMethod) {
                waText += `\nMetode Pembayaran: ${paymentMethod}`;
            }

            // Tambahkan nama customer dengan penomoran
            if (customerName) {
                waText += `\nAtas Nama: ${customerName}`;
            }

            // Tambahkan tipe layanan dengan penomoran
            if (serviceType) {
                waText += `\nTipe Layanan: ${serviceType}`;
            }

            // Tambahkan pesan konfirmasi
            waText += '\n\nTolong konfirmasi pesanan saya, saya ingin melanjutkan pembayaran.';

            const waUrl = `https://wa.me/62857979541136?text=${encodeURIComponent(waText)}`;
            whatsappButtonHtml = `
                <a href="${waUrl}" target="_blank" class="chatbot-whatsapp-btn">
                    ${icons.whatsapp}
                    Konfirmasi Pesanan ke Admin
                </a>
            `;
        } else if (isReservationSummary) {
            // Parse informasi reservasi dari konten dengan improved parsing
            const lines = content.replace(/<br>/g, '\n').replace(/<\/?strong>/g, '').replace(/<[^>]*>/g, '').split('\n');

            let namaLengkap = '';
            let jenisAcara = '';
            let tanggalAcara = '';
            let jamAcara = '';
            let jumlahTamu = '';
            let permintaanKhusus = '';

            // Parse setiap baris untuk mendapatkan informasi reservasi
            lines.forEach(line => {
                const originalLine = line.trim();
                
                // Skip empty lines dan lines yang terlalu pendek
                if (!originalLine || originalLine.length < 3) return;
                
                // Only remove bullet points and leading numbers, but keep the data intact
                const cleanLine = originalLine.replace(/^[*•]\s*/, '').replace(/^\d+\.\s*/, '').trim();

                // Debug logging
                console.log('Original line:', originalLine);
                console.log('Clean line:', cleanLine);

                // Skip lines yang mengandung teks template/contoh
                const isTemplateText = (
                    cleanLine.toLowerCase().includes('(contoh:') ||
                    cleanLine.toLowerCase().includes('(opsional,') ||
                    cleanLine.toLowerCase().includes('seperti dekorasi') ||
                    cleanLine.toLowerCase().includes('dsb.)') ||
                    cleanLine.toLowerCase().includes('atau kebutuhan lainnya') ||
                    cleanLine.toLowerCase().includes('data berikut:') ||
                    cleanLine.toLowerCase().includes('formulir reservasi') ||
                    cleanLine === 'Nama Lengkap' ||
                    cleanLine === 'Jenis Acara' ||
                    cleanLine === 'Tanggal Acara' ||
                    cleanLine === 'Jam Pelaksanaan Acara' ||
                    cleanLine === 'Jumlah Tamu yang Direncanakan' ||
                    cleanLine === 'Permintaan Khusus'
                );
                
                if (isTemplateText) {
                    console.log('Skipping template text:', cleanLine);
                    return;
                }

                // Improved regex patterns untuk parsing yang lebih akurat - hanya ambil data yang valid
                if (/nama lengkap\s*:\s*.+/i.test(cleanLine) && !cleanLine.toLowerCase().includes('(contoh')) {
                    const match = cleanLine.match(/nama lengkap\s*:\s*(.+)/i);
                    if (match && match[1].trim().length > 0 && !match[1].includes('(')) {
                        namaLengkap = match[1].trim();
                        console.log('Parsed Nama Lengkap:', namaLengkap);
                    }
                }

                if (/jenis acara\s*:\s*.+/i.test(cleanLine) && !cleanLine.toLowerCase().includes('(contoh')) {
                    const match = cleanLine.match(/jenis acara\s*:\s*(.+)/i);
                    if (match && match[1].trim().length > 0 && !match[1].includes('(')) {
                        jenisAcara = match[1].trim();
                        console.log('Parsed Jenis Acara:', jenisAcara);
                    }
                }

                if (/tanggal acara\s*:\s*.+/i.test(cleanLine) && !cleanLine.toLowerCase().includes('(contoh')) {
                    const match = cleanLine.match(/tanggal acara\s*:\s*(.+)/i);
                    if (match && match[1].trim().length > 0 && !match[1].includes('(')) {
                        tanggalAcara = match[1].trim();
                        console.log('Parsed Tanggal Acara:', tanggalAcara);
                    }
                }

                if (/jam (?:pelaksanaan )?acara\s*:\s*.+/i.test(cleanLine) && !cleanLine.toLowerCase().includes('(contoh')) {
                    const match = cleanLine.match(/jam (?:pelaksanaan )?acara\s*:\s*(.+)/i);
                    if (match && match[1].trim().length > 0 && !match[1].includes('(')) {
                        jamAcara = match[1].trim();
                        console.log('Parsed Jam Acara:', jamAcara);
                    }
                }

                if (/jumlah tamu\s*(?:yang\s+direncanakan)?\s*:\s*.+/i.test(cleanLine) && !cleanLine.toLowerCase().includes('(contoh')) {
                    const match = cleanLine.match(/jumlah tamu\s*(?:yang\s+direncanakan)?\s*:\s*(.+)/i);
                    if (match && match[1].trim().length > 0 && !match[1].includes('(')) {
                        jumlahTamu = match[1].trim();
                        console.log('Parsed Jumlah Tamu:', jumlahTamu);
                    }
                }

                if (/permintaan khusus\s*:\s*.+/i.test(cleanLine) && !cleanLine.toLowerCase().includes('(opsional')) {
                    const match = cleanLine.match(/permintaan khusus\s*:\s*(.+)/i);
                    if (match && match[1].trim().length > 0 && !match[1].includes('(')) {
                        permintaanKhusus = match[1].trim();
                        console.log('Parsed Permintaan Khusus:', permintaanKhusus);
                    }
                }
            });

            // Parsing alternatif untuk format naratif (seperti "Baik, Kak Hans! Kami sudah mencatat detail reservasi untuk acara pernikahan Kakak pada tanggal 1 Juli sekitar jam 8 pagi untuk 50 orang")
            const fullContent = content.toLowerCase();
            
            // Ekstrak nama dari "Kak [nama]!" atau "[nama], "
            if (!namaLengkap) {
                const nameMatches = [
                    fullContent.match(/kak\s+([^!,\s]+)/i),
                    fullContent.match(/([^,\s]+),?\s+kami\s+sudah/i),
                    fullContent.match(/terima\s+kasih\s+banyak,?\s+kak\s+([^!,\s]+)/i)
                ];
                for (const match of nameMatches) {
                    if (match && match[1]) {
                        namaLengkap = match[1].trim();
                        console.log('Parsed Nama from narrative:', namaLengkap);
                        break;
                    }
                }
            }

            // Ekstrak jenis acara dari kalimat
            if (!jenisAcara) {
                const eventMatches = [
                    fullContent.match(/acara\s+([^,\s]+)/i),
                    fullContent.match(/untuk\s+acara\s+([^,\s]+)/i),
                    fullContent.match(/reservasi\s+untuk\s+acara\s+([^,\s]+)/i)
                ];
                for (const match of eventMatches) {
                    if (match && match[1]) {
                        jenisAcara = match[1].trim();
                        console.log('Parsed Jenis Acara from narrative:', jenisAcara);
                        break;
                    }
                }
            }

            // Ekstrak tanggal dari kalimat
            if (!tanggalAcara) {
                const dateMatches = [
                    fullContent.match(/tanggal\s+([^,\s]+(?:\s+[^,\s]+)?)/i),
                    fullContent.match(/pada\s+tanggal\s+([^,\s]+(?:\s+[^,\s]+)?)/i),
                    fullContent.match(/\d+\s+\w+/i) // Format "1 Juli"
                ];
                for (const match of dateMatches) {
                    if (match && match[1]) {
                        tanggalAcara = match[1].trim();
                        console.log('Parsed Tanggal from narrative:', tanggalAcara);
                        break;
                    } else if (match && match[0] && /\d+\s+\w+/.test(match[0])) {
                        tanggalAcara = match[0].trim();
                        console.log('Parsed Tanggal from narrative (pattern):', tanggalAcara);
                        break;
                    }
                }
            }

            // Ekstrak jam dari kalimat
            if (!jamAcara) {
                const timeMatches = [
                    fullContent.match(/jam\s+([^,]+)/i),
                    fullContent.match(/sekitar\s+jam\s+([^,]+)/i),
                    fullContent.match(/(\d+\s+(?:pagi|siang|sore|malam))/i)
                ];
                for (const match of timeMatches) {
                    if (match && match[1]) {
                        jamAcara = match[1].trim();
                        console.log('Parsed Jam from narrative:', jamAcara);
                        break;
                    }
                }
            }

            // Ekstrak jumlah tamu dari kalimat
            if (!jumlahTamu) {
                const guestMatches = [
                    fullContent.match(/untuk\s+(\d+\s+orang)/i),
                    fullContent.match(/(\d+\s+tamu)/i),
                    fullContent.match(/(\d+)\s+orang/i)
                ];
                for (const match of guestMatches) {
                    if (match && match[1]) {
                        jumlahTamu = match[1].trim();
                        console.log('Parsed Jumlah Tamu from narrative:', jumlahTamu);
                        break;
                    }
                }
            }

            // Ekstrak permintaan khusus dari kalimat
            if (!permintaanKhusus) {
                const specialMatches = [
                    fullContent.match(/permintaan\s+khusus\s+([^.]+)/i),
                    fullContent.match(/dengan\s+permintaan\s+khusus\s+([^.]+)/i),
                    fullContent.match(/tempat\s+yang\s+([^.]+)/i)
                ];
                for (const match of specialMatches) {
                    if (match && match[1]) {
                        permintaanKhusus = match[1].trim();
                        console.log('Parsed Permintaan Khusus from narrative:', permintaanKhusus);
                        break;
                    }
                }
            }

            // Debug final parsed data  
            console.log('Final parsed data:', {
                namaLengkap, jenisAcara, tanggalAcara, jamAcara, jumlahTamu, permintaanKhusus
            });

            // VALIDASI: Hanya buat tombol WhatsApp jika minimal ada 3 field yang terisi dengan data valid
            const validFields = [namaLengkap, jenisAcara, tanggalAcara, jamAcara, jumlahTamu].filter(field => 
                field && 
                field.length > 0 && 
                !field.toLowerCase().includes('(contoh') &&
                !field.toLowerCase().includes('opsional') &&
                !field.toLowerCase().includes('dsb.') &&
                field !== 'bisa' &&
                field.length > 2
            );

            console.log('Valid fields count:', validFields.length);
            console.log('Valid fields:', validFields);

            // Hanya buat pesan WhatsApp jika ada minimal 3 field valid
            if (validFields.length >= 3) {
                // Buat pesan WhatsApp untuk reservasi dengan penomoran
                let reservationText = 'Halo admin! Saya ingin melakukan reservasi tempat di Kedai J.A dengan detail sebagai berikut:';

                if (namaLengkap && namaLengkap.length > 2 && namaLengkap !== 'bisa') {
                    reservationText += `\n1. Nama Lengkap: ${namaLengkap}`;
                }
                if (jenisAcara && jenisAcara.length > 2 && !jenisAcara.includes('(contoh')) {
                    reservationText += `\n2. Jenis Acara: ${jenisAcara}`;
                }
                if (tanggalAcara && tanggalAcara.length > 2 && !tanggalAcara.includes('(contoh')) {
                    reservationText += `\n3. Tanggal Acara: ${tanggalAcara}`;
                }
                if (jamAcara && jamAcara.length > 2 && !jamAcara.includes('(contoh')) {
                    reservationText += `\n4. Jam Pelaksanaan Acara: ${jamAcara}`;
                }
                if (jumlahTamu && jumlahTamu.length > 0 && !jumlahTamu.includes('(contoh')) {
                    reservationText += `\n5. Jumlah Tamu yang Direncanakan: ${jumlahTamu}`;
                }
                if (permintaanKhusus && permintaanKhusus.length > 2 && !permintaanKhusus.includes('opsional')) {
                    reservationText += `\n6. Permintaan Khusus: ${permintaanKhusus}`;
                }

                reservationText += '\n\nMohon konfirmasi ketersediaan tanggal dan informasi lebih lanjut mengenai paket reservasi. Terima kasih!';

                const reservationUrl = `https://wa.me/62857979541136?text=${encodeURIComponent(reservationText)}`;
                reservationButtonHtml = `
                    <a href="${reservationUrl}" target="_blank" class="chatbot-reservation-btn">
                        ${icons.calendar}
                        Konfirmasi Reservasi ke Admin
                    </a>
                `;
            } else {
                console.log('Not enough valid data for WhatsApp button. Valid fields:', validFields.length);
                reservationButtonHtml = ''; // Jangan tampilkan tombol jika data tidak lengkap
            }

            // Format tampilan di chatbot (tetap sama seperti aslinya)
            const totalRegex = /Total(?:\s+pesanan)?(?:\s+Anda)?(?:\s+adalah)?\s*:?\s*(Rp[\d.,]+)/i;
            const totalMatch = content.match(totalRegex);
            if (totalMatch) {
                const totalOnly = `Total semua pesanan : ${totalMatch[1]}`;
                content = content.replace(totalRegex, totalOnly);
            }
        } else if (showWhatsApp) {
            // Tombol WhatsApp default
            whatsappButtonHtml = `
                <a href="https://wa.me/62857979541136" target="_blank" class="chatbot-whatsapp-btn">
                    ${icons.whatsapp}
                    Hubungi WhatsApp Admin
                </a>
            `;
        }

        // Deteksi konteks GoFood/Gojek/pesan online
        const gofoodKeywords = [
            'gojek', 'gofood', 'pesan online', 'pesan via gojek', 'pesan via gofood', 'order gojek', 'order gofood'
        ];
        const isGofoodContext = gofoodKeywords.some(keyword =>
            content.toLowerCase().includes(keyword)
        );

        let gofoodButtonHtml = '';
        if (isGofoodContext) {
            const gofoodUrl = 'https://gofood.link/a/EjanqQy'; // Ganti dengan link GoFood Anda
            gofoodButtonHtml = `
                <a href="${gofoodUrl}" target="_blank" class="chatbot-gofood-btn">
                    <img src="/logo-gojek.png" alt="GoFood" style="width:18px;height:18px;margin-right:6px;vertical-align:middle;" />
                    Pesan melalui GoFood
                </a>
            `;
        }

        messageElement.innerHTML = `
            <div class="chatbot-message-avatar">
                ${avatarContent}
            </div>
            <div class="chatbot-message-content">
                ${content}
                <div class="chatbot-message-time">${formatTime()}</div>
                ${whatsappButtonHtml}
                ${reservationButtonHtml}
                ${gofoodButtonHtml}
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageElement;
    };

    // Simple scroll functionality for quick replies
    // The scroll behavior is now handled by CSS with overflow-x: auto and scroll-behavior: smooth

    // Show typing indicator
    const showTyping = () => {
        const messagesContainer = document.getElementById('chatbot-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'chatbot-typing';
        typingElement.id = 'chatbot-typing';
        typingElement.innerHTML = `
            <div class="chatbot-message-avatar" style="background: #F97316;">
                <img src="${LOGO_CONFIG.botAvatar}" alt="Kedai J.A" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none;">${LOGO_CONFIG.fallbackIcon}</div>
            </div>
            <div class="chatbot-typing-dots">
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
            </div>
        `;

        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Hide typing indicator
    const hideTyping = () => {
        const typingElement = document.getElementById('chatbot-typing');
        if (typingElement) {
            typingElement.remove();
        }
    };

// Global session management
let sessionId = null;

// Initialize session
const initializeSession = () => {
    sessionId = localStorage.getItem('chatbot-session-id');
        if (!sessionId) {
            sessionId = crypto.randomUUID();
            localStorage.setItem('chatbot-session-id', sessionId);
        console.log('New session created:', sessionId);
    } else {
        console.log('Existing session restored:', sessionId);
    }
    return sessionId;
};

// Reset session (for testing or user request)
const resetSession = () => {
    localStorage.removeItem('chatbot-session-id');
    sessionId = null;
    initializeSession();
    console.log('Session reset completed');
};

// Send message to Flowise API with enhanced session management
const sendToFlowise = async (message) => {
    try {
        // Ensure session is initialized
        if (!sessionId) {
            initializeSession();
        }

        console.log('Sending message with sessionId:', sessionId);

        const response = await fetch(CONFIG.FLOWISE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}`, // Optional: pass sessionId in header
            },
            body: JSON.stringify({
                question: message,
                sessionId: sessionId,
                overrideConfig: {
                sessionId: sessionId
                },
                // Additional metadata for better session tracking
                metadata: {
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    sessionId: sessionId
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Log successful response
        console.log('Flowise response received for session:', sessionId);

        return data.text || data.message || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.';
    } catch (error) {
        console.error('Flowise API Error for session', sessionId, ':', error);

        // If session seems invalid, try to reset it
        if (error.message.includes('401') || error.message.includes('403')) {
            console.log('Session may be invalid, attempting reset...');
            resetSession();
        }

        return 'Maaf, terjadi gangguan koneksi. Silakan coba lagi atau hubungi admin untuk bantuan lebih lanjut.';
    }
};

    // Auto-resize textarea function
    const autoResizeTextarea = (textarea) => {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 120; // max-height in CSS
        
        if (scrollHeight <= maxHeight) {
            textarea.style.height = scrollHeight + 'px';
        } else {
            textarea.style.height = maxHeight + 'px';
        }
    };

    // Handle message sending
    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        // Check for special commands
        if (message.toLowerCase() === '/reset' || message.toLowerCase() === 'reset session') {
            resetSession();
            addMessage('Session telah direset. Silakan mulai chat baru!', 'bot');
            return;
        }

        if (message.toLowerCase() === '/session' || message.toLowerCase() === 'session info') {
            addMessage(`🔧 Session ID: ${sessionId?.substring(0, 8)}...\n📅 Created: ${new Date().toLocaleString('id-ID')}`, 'bot');
            return;
        }

        // Add user message
        addMessage(message, 'user');

        // Clear input and reset height
        const input = document.getElementById('chatbot-input');
        input.value = '';
        input.style.height = 'auto';

        // Show typing
        showTyping();

        // Send to AI
        const aiResponse = await sendToFlowise(message);

        // Hide typing
        hideTyping();

        // Determine if should show WhatsApp button
        const showWhatsApp = message.toLowerCase().includes('admin') ||
                            message.toLowerCase().includes('hubungi') ||
                            aiResponse.toLowerCase().includes('admin');

        // Add AI response
        addMessage(aiResponse.replace(/\n/g, '<br>'), 'bot', showWhatsApp);
    };

    // Handle quick replies - send to Flowise API
    const handleQuickReply = async (reply) => {
        // Special handling for menu button
        if (reply === 'Lihat menu Kedai J.A') {
            addMessage(reply, 'user');

            setTimeout(() => {
                showTyping();
                setTimeout(() => {
                    hideTyping();

                    // Create menu response with button
                    const menuResponse = `Anda dapat menekan tombol di bawah untuk melihat menu secara lengkap. Silahkan tanyakan bila ada pertanyaan menu pilihan anda!`;

                    // Add message with custom button
                    addMessageWithMenuButton(menuResponse, 'bot');
                }, 1000);
            }, 300);

            return;
        }

        // Special handling for location button
        if (reply === 'Lokasi kami') {
            addMessage(reply, 'user');

            setTimeout(() => {
                showTyping();
                setTimeout(async () => {
                    try {
                        // Get AI response from Flowise
                        const aiResponse = await sendToFlowise(reply);
                        hideTyping();

                        // Add message with location button using AI response
                        addMessageWithLocationButton(aiResponse, 'bot');
                    } catch (error) {
                        hideTyping();
                        console.error('Error getting location response:', error);
                        addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', 'bot');
                    }
                }, 1000);
            }, 300);

            return;
        }

        // Special handling for admin contact button
        if (reply === 'Hubungi admin') {
        addMessage(reply, 'user');

        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                hideTyping();

                    // Use hardcoded response for admin contact
                    const adminResponse = `Anda dapat menghubungi admin kami melalui WhatsApp di nomor 0857-9795-41136 untuk bantuan lebih lanjut. Apakah ada yang ingin Anda tanyakan atau butuh bantuan lain?`;

                    // Add message with WhatsApp button
                    addMessage(adminResponse, 'bot', true);
                }, 1000);
            }, 300);

            return;
        }

        // Regular quick reply handling for other buttons
        addMessage(reply, 'user');

        // Show typing indicator
        setTimeout(() => {
            showTyping();
        }, 300);

        try {
            // Send quick reply to Flowise API
            const aiResponse = await sendToFlowise(reply);

            // Hide typing indicator
            hideTyping();

            // Determine if should show WhatsApp button based on response content
            const showWhatsApp = reply.toLowerCase().includes('admin') ||
                                reply.toLowerCase().includes('hubungi') ||
                                reply.toLowerCase().includes('pesan') ||
                                reply.toLowerCase().includes('order') ||
                                reply.toLowerCase().includes('pemesanan') ||
                                aiResponse.toLowerCase().includes('admin') ||
                                aiResponse.toLowerCase().includes('whatsapp') ||
                                aiResponse.toLowerCase().includes('wa') ||
                                aiResponse.toLowerCase().includes('acara') ||
                                aiResponse.toLowerCase().includes('tolong') ||
                                aiResponse.toLowerCase().includes('hubungi');

            // Add AI response from Flowise
            addMessage(aiResponse.replace(/\n/g, '<br>'), 'bot', showWhatsApp);


        } catch (error) {
            // Hide typing indicator
            hideTyping();

            // Show error message
            addMessage('Maaf, terjadi gangguan koneksi. Silakan coba lagi atau hubungi admin untuk bantuan lebih lanjut.', 'bot');

            console.error('Quick reply error:', error);
        }
    };

    // Function to add message with menu button
    const addMessageWithMenuButton = (content, type = 'bot') => {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;

        const avatarContent = type === 'bot'
            ? `<img src="${LOGO_CONFIG.botAvatar}" alt="Kedai J.A" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="display: none;">${LOGO_CONFIG.fallbackIcon}</div>`
            : icons.user;

        messageElement.innerHTML = `
            <div class="chatbot-message-avatar">
                ${avatarContent}
            </div>
            <div class="chatbot-message-content">
                ${formatBoldText(content)}
                <div class="chatbot-message-time">${formatTime()}</div>
                <a href="#" target="_blank" class="chatbot-menu-btn" id="menu-btn">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    Lihat Menu Lengkap
                </a>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add click event to menu button
        setTimeout(() => {
            const menuBtn = document.getElementById('menu-btn');
            if (menuBtn) {
                                menuBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Use Next.js SPA navigation to preserve chatbot session
                    const menuUrl = '/menu';
                    
                    // Check if we're in browser environment
                    if (typeof window === 'undefined') return;
                    
                    // Check if Next.js router is available
                    if (window.next && window.next.router) {
                        // Use Next.js router for SPA navigation
                        window.next.router.push(menuUrl);
                    } else if (window.__NEXT_DATA__) {
                        // Alternative: Use Next.js router if available globally
                        try {
                            // Try to access Next.js router from global scope
                            const router = window.__NEXT_ROUTER_BASEPATH__ ? 
                                window.__NEXT_ROUTER_BASEPATH__ : 
                                window.location.pathname;
                            
                            // Navigate using history API for SPA-like behavior
                            window.history.pushState({}, '', menuUrl);
                            
                            // Trigger route change event for Next.js
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        } catch (error) {
                            console.log('Next.js router not available, using fallback navigation');
                            // Fallback to regular navigation
                            window.location.href = menuUrl;
                        }
                    } else {
                        // Fallback: Use history API for SPA-like navigation
                        try {
                            window.history.pushState({}, '', menuUrl);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                        } catch (error) {
                            console.log('History API not available, using regular navigation');
                            window.location.href = menuUrl;
                        }
                    }
                });
            }
        }, 100);

        return messageElement;
    };

    // Function to add message with location button
    const addMessageWithLocationButton = (content, type = 'bot') => {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${type}`;

        const avatarContent = type === 'bot'
            ? `<img src="${LOGO_CONFIG.botAvatar}" alt="Kedai J.A" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="display: none;">${LOGO_CONFIG.fallbackIcon}</div>`
            : icons.user;

        messageElement.innerHTML = `
            <div class="chatbot-message-avatar">
                ${avatarContent}
            </div>
            <div class="chatbot-message-content">
                ${formatBoldText(content)}
                <div class="chatbot-message-time">${formatTime()}</div>
                <a href="#" target="_blank" class="chatbot-location-btn" id="location-btn">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Petunjuk Arah
                </a>
            </div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add click event to location button
        setTimeout(() => {
            const locationBtn = document.getElementById('location-btn');
            if (locationBtn) {
                locationBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Check if we're in browser environment
                    if (typeof window === 'undefined') return;
                    
                    // Open location in new tab - URL can be customized later
                    const locationUrl = 'https://maps.app.goo.gl/sQDcw6HocYNhSFvw8'; // TODO: Ganti dengan URL yang sesuai
                    window.open(locationUrl, '_blank');
                });
            }
        }, 100);

        return messageElement;
    };

    // Show welcome message
    const showWelcomeMessage = () => {
        setTimeout(() => {
            addMessage(CONFIG.WELCOME_MESSAGE, 'bot');
        }, 500);
    };

        // Toggle chat window
    const toggleChat = () => {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return;
        
        const chatWindow = document.getElementById('chatbot-window');
        const badge = document.getElementById('chatbot-badge');
        const input = document.getElementById('chatbot-input');
        
        if (isOpen) {
            chatWindow.style.display = 'none';
            isOpen = false;
        } else {
            chatWindow.style.display = 'flex';
            badge.style.display = 'none';
            isOpen = true;
            
            // Auto-focus input
            setTimeout(() => {
                input.focus();
            }, 100);
            
            // Show welcome message if no messages
            const messages = document.getElementById('chatbot-messages');
            if (messages.children.length === 0) {
                showWelcomeMessage();
            }
        }
    };

    // Initialize chatbot
    const init = () => {
        // Initialize session management
        initializeSession();

        // Inject styles
        injectStyles();

        // Create chatbot
        const chatbot = createChatbot();

        // Show badge after 3 seconds
        setTimeout(() => {
            const badge = document.getElementById('chatbot-badge');
            if (!isOpen) {
                badge.style.display = 'flex';
            }
        }, 3000);

        // Event listeners
        document.getElementById('chatbot-toggle').addEventListener('click', toggleChat);
        document.getElementById('chatbot-close').addEventListener('click', toggleChat);
        document.getElementById('chatbot-reset').addEventListener('click', () => {
            // Reset session and clear messages
            resetSession();
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.innerHTML = '';

            // Show welcome message
            showWelcomeMessage();

            // Optional: Show confirmation
            console.log('Chat session has been reset');
        });

        // Quick replies are now created dynamically in createQuickReplies()
        // No need for additional event listeners here

        // Input handling with textarea and Shift+Enter support
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');

        const handleSend = () => {
            const message = input.value.trim();
            if (message) {
                handleSendMessage(message);
            }
        };

        sendBtn.addEventListener('click', handleSend);
        
        // Enhanced keypress handling for Shift+Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.shiftKey) {
                    // Shift+Enter: allow new line (default behavior)
                    return;
                } else {
                    // Enter only: send message
                    e.preventDefault();
                    handleSend();
                }
            }
        });

        // Auto-resize textarea on input
        input.addEventListener('input', (e) => {
            autoResizeTextarea(e.target);
            sendBtn.disabled = !input.value.trim();
        });

        // Also handle paste events for auto-resize
        input.addEventListener('paste', (e) => {
            setTimeout(() => {
                autoResizeTextarea(e.target);
            }, 0);
        });

        sendBtn.disabled = true;
    };

    // Initialize when DOM is ready (only in browser)
    if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

})();