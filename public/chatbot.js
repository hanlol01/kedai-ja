// Enhanced Flowise AI Chatbot Integration with WhatsApp Button
(function() {
    // Konfigurasi WhatsApp Admin
    const WHATSAPP_CONFIG = {
      phoneNumber: '6285797954113', // Ganti dengan nomor WhatsApp admin (format: 62xxx)
      defaultMessage: 'Halo, saya ingin bertanya tentang pemesanan di Kedai J.A'
    };
  
    // Keywords yang akan memicu munculnya tombol WhatsApp
    const ORDER_KEYWORDS = [
      'pesan', 'order', 'pemesanan', 'cara pesan', 'bagaimana pesan', 
      'mau pesan', 'ingin pesan', 'booking', 'reservasi', 'delivery',
      'takeaway', 'bungkus', 'antar', 'kirim', 'hubungi admin'
    ];
  
    // Fungsi untuk format waktu
    function formatTime() {
      const now = new Date();
      return now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  
    // Quick reply options
    const quickReplies = [
      "Lihat menu makanan",
      "Lihat menu minuman", 
      "Jam buka restoran",
      "Lokasi restoran",
      "Cara pemesanan",
      "Hubungi admin"
    ];
  
    // Fungsi untuk mengecek apakah pesan mengandung keyword pemesanan
    function containsOrderKeywords(message) {
      const lowerMessage = message.toLowerCase();
      return ORDER_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
    }
  
    // Fungsi untuk membuat tombol WhatsApp
    function createWhatsAppButton() {
      const buttonContainer = document.createElement('div');
      buttonContainer.style.marginTop = '12px';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'flex-start';
  
      const whatsappBtn = document.createElement('a');
      whatsappBtn.href = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage)}`;
      whatsappBtn.target = '_blank';
      whatsappBtn.style.display = 'inline-flex';
      whatsappBtn.style.alignItems = 'center';
      whatsappBtn.style.gap = '8px';
      whatsappBtn.style.background = '#25D366';
      whatsappBtn.style.color = 'white';
      whatsappBtn.style.padding = '10px 16px';
      whatsappBtn.style.borderRadius = '20px';
      whatsappBtn.style.textDecoration = 'none';
      whatsappBtn.style.fontSize = '13px';
      whatsappBtn.style.fontWeight = '600';
      whatsappBtn.style.transition = 'all 0.2s ease';
      whatsappBtn.style.boxShadow = '0 2px 4px rgba(37, 211, 102, 0.2)';
  
      // WhatsApp Icon SVG
      whatsappBtn.innerHTML = `
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        Hubungi Admin WhatsApp
      `;
  
      whatsappBtn.onmouseover = function() {
        whatsappBtn.style.background = '#128C7E';
        whatsappBtn.style.transform = 'translateY(-1px)';
        whatsappBtn.style.boxShadow = '0 4px 8px rgba(37, 211, 102, 0.3)';
      };
  
      whatsappBtn.onmouseout = function() {
        whatsappBtn.style.background = '#25D366';
        whatsappBtn.style.transform = 'translateY(0)';
        whatsappBtn.style.boxShadow = '0 2px 4px rgba(37, 211, 102, 0.2)';
      };
  
      buttonContainer.appendChild(whatsappBtn);
      return buttonContainer;
    }
  
    // Tombol Chatbot
    const button = document.createElement('div');
    button.id = 'kedaija-chatbot-button';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '60px';
    button.style.height = '60px';
    button.style.backgroundColor = '#F97316';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    button.style.zIndex = '9999';
    button.style.transition = 'all 0.3s ease';
    
    // Badge notifikasi
    const badge = document.createElement('div');
    badge.style.position = 'absolute';
    badge.style.top = '-5px';
    badge.style.right = '-5px';
    badge.style.width = '20px';
    badge.style.height = '20px';
    badge.style.backgroundColor = '#EF4444';
    badge.style.borderRadius = '50%';
    badge.style.display = 'none';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.fontSize = '12px';
    badge.style.color = 'white';
    badge.style.fontWeight = 'bold';
    badge.textContent = '1';
    
    button.innerHTML = `
      <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    `;
    
    button.appendChild(badge);
    button.onmouseover = function() { button.style.transform = 'scale(1.1)'; };
    button.onmouseout = function() { button.style.transform = 'scale(1)'; };
  
    // Window Chatbot
    const chatWindow = document.createElement('div');
    chatWindow.id = 'kedaija-chatbot-window';
    chatWindow.style.position = 'fixed';
    chatWindow.style.bottom = '90px';
    chatWindow.style.right = '20px';
    chatWindow.style.width = '380px';
    chatWindow.style.height = '550px';
    chatWindow.style.background = '#fff';
    chatWindow.style.borderRadius = '16px';
    chatWindow.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
    chatWindow.style.zIndex = '1001';
    chatWindow.style.display = 'none';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
    // Header chatbot
    const header = document.createElement('div');
    header.style.background = 'linear-gradient(135deg, #F97316, #EA580C)';
    header.style.color = 'white';
    header.style.padding = '16px 20px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
          <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21Z"/>
          </svg>
        </div>
        <div>
          <div style="font-weight: 600; font-size: 16px;">Kedai J.A Assistant</div>
          <div style="font-size: 12px; opacity: 0.9;">Online - Siap membantu Anda</div>
        </div>
      </div>
    `;
  
    // Tombol Tutup
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = `
      <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    `;
    closeBtn.style.background = 'rgba(255,255,255,0.2)';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '8px';
    closeBtn.style.width = '32px';
    closeBtn.style.height = '32px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.style.transition = 'background 0.2s';
    closeBtn.onmouseover = function() { closeBtn.style.background = 'rgba(255,255,255,0.3)'; };
    closeBtn.onmouseout = function() { closeBtn.style.background = 'rgba(255,255,255,0.2)'; };
    closeBtn.onclick = function() { 
      chatWindow.style.display = 'none';
      badge.style.display = 'none';
    };
    
    header.appendChild(closeBtn);
  
    // Area chat
    const chatArea = document.createElement('div');
    chatArea.style.flex = '1';
    chatArea.style.padding = '16px';
    chatArea.style.overflowY = 'auto';
    chatArea.style.background = '#F8FAFC';
    chatArea.style.display = 'flex';
    chatArea.style.flexDirection = 'column';
    chatArea.style.gap = '12px';
  
    // Pesan selamat datang
    const welcomeMsg = createBotMessage("Halo! Selamat datang di Kedai J.A 👋\n\nSaya siap membantu Anda dengan informasi menu, jam buka, lokasi, dan pemesanan. Silakan pilih topik di bawah atau ketik pertanyaan Anda!");
    chatArea.appendChild(welcomeMsg);
  
    // Quick replies container
    const quickRepliesContainer = document.createElement('div');
    quickRepliesContainer.style.padding = '0 0 12px 0';
    quickRepliesContainer.style.background = '#F8FAFC';
    quickRepliesContainer.style.overflowX = 'auto';
    quickRepliesContainer.style.overflowY = 'hidden';
    
    // Scrollable container untuk buttons
    const scrollContainer = document.createElement('div');
    scrollContainer.style.display = 'flex';
    scrollContainer.style.gap = '8px';
    scrollContainer.style.padding = '0 16px';
    scrollContainer.style.minWidth = 'max-content';
    scrollContainer.style.scrollBehavior = 'smooth';
  
    // Buat quick reply buttons
    quickReplies.forEach(reply => {
      const btn = document.createElement('button');
      btn.textContent = reply;
      btn.style.background = 'white';
      btn.style.border = '1px solid #E2E8F0';
      btn.style.borderRadius = '20px';
      btn.style.padding = '8px 16px';
      btn.style.fontSize = '13px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.2s';
      btn.style.color = '#475569';
      btn.style.fontWeight = '500';
      btn.style.whiteSpace = 'nowrap';
      btn.style.flexShrink = '0';
      
      btn.onmouseover = function() {
        btn.style.background = '#F97316';
        btn.style.color = 'white';
        btn.style.borderColor = '#F97316';
      };
      btn.onmouseout = function() {
        btn.style.background = 'white';
        btn.style.color = '#475569';
        btn.style.borderColor = '#E2E8F0';
      };
      
      btn.onclick = function() {
        sendMessage(reply);
      };
      
      scrollContainer.appendChild(btn);
    });
    
    quickRepliesContainer.appendChild(scrollContainer);
  
    // Form input
    const inputContainer = document.createElement('div');
    inputContainer.style.padding = '16px';
    inputContainer.style.background = 'white';
    inputContainer.style.borderTop = '1px solid #E2E8F0';
  
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.gap = '8px';
    form.style.alignItems = 'center';
  
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ketik pesan Anda...';
    input.style.flex = '1';
    input.style.padding = '12px 16px';
    input.style.border = '1px solid #E2E8F0';
    input.style.borderRadius = '24px';
    input.style.fontSize = '14px';
    input.style.outline = 'none';
    input.style.transition = 'border-color 0.2s';
    
    input.onfocus = function() { input.style.borderColor = '#F97316'; };
    input.onblur = function() { input.style.borderColor = '#E2E8F0'; };
  
    const sendBtn = document.createElement('button');
    sendBtn.type = 'submit';
    sendBtn.style.background = '#F97316';
    sendBtn.style.border = 'none';
    sendBtn.style.borderRadius = '50%';
    sendBtn.style.width = '44px';
    sendBtn.style.height = '44px';
    sendBtn.style.cursor = 'pointer';
    sendBtn.style.display = 'flex';
    sendBtn.style.alignItems = 'center';
    sendBtn.style.justifyContent = 'center';
    sendBtn.style.transition = 'background 0.2s';
    sendBtn.innerHTML = `
      <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    `;
    
    sendBtn.onmouseover = function() { sendBtn.style.background = '#EA580C'; };
    sendBtn.onmouseout = function() { sendBtn.style.background = '#F97316'; };
  
    form.appendChild(input);
    form.appendChild(sendBtn);
    inputContainer.appendChild(form);
  
    // Fungsi untuk membuat pesan bot
    function createBotMessage(text, showWhatsAppButton = false) {
      const msgContainer = document.createElement('div');
      msgContainer.style.display = 'flex';
      msgContainer.style.alignItems = 'flex-start';
      msgContainer.style.gap = '8px';
      msgContainer.style.marginBottom = '4px';
  
      const avatar = document.createElement('div');
      avatar.style.width = '32px';
      avatar.style.height = '32px';
      avatar.style.background = '#F97316';
      avatar.style.borderRadius = '50%';
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.flexShrink = '0';
      avatar.innerHTML = `
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
        </svg>
      `;
  
      const msgContent = document.createElement('div');
      msgContent.style.flex = '1';
  
      const msgBubble = document.createElement('div');
      msgBubble.style.background = 'white';
      msgBubble.style.padding = '12px 16px';
      msgBubble.style.borderRadius = '18px 18px 18px 4px';
      msgBubble.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      msgBubble.style.fontSize = '14px';
      msgBubble.style.lineHeight = '1.4';
      msgBubble.style.color = '#374151';
      msgBubble.style.whiteSpace = 'pre-wrap';
      msgBubble.textContent = text;
  
      const timeStamp = document.createElement('div');
      timeStamp.style.fontSize = '11px';
      timeStamp.style.color = '#9CA3AF';
      timeStamp.style.marginTop = '4px';
      timeStamp.style.marginLeft = '4px';
      timeStamp.textContent = formatTime();
  
      msgContent.appendChild(msgBubble);
      msgContent.appendChild(timeStamp);
  
      // Tambahkan tombol WhatsApp jika diperlukan
      if (showWhatsAppButton) {
        const whatsappButton = createWhatsAppButton();
        msgContent.appendChild(whatsappButton);
      }
  
      msgContainer.appendChild(avatar);
      msgContainer.appendChild(msgContent);
  
      return msgContainer;
    }
  
    // Fungsi untuk membuat pesan user
    function createUserMessage(text) {
      const msgContainer = document.createElement('div');
      msgContainer.style.display = 'flex';
      msgContainer.style.alignItems = 'flex-start';
      msgContainer.style.gap = '8px';
      msgContainer.style.marginBottom = '4px';
      msgContainer.style.flexDirection = 'row-reverse';
  
      const avatar = document.createElement('div');
      avatar.style.width = '32px';
      avatar.style.height = '32px';
      avatar.style.background = '#6B7280';
      avatar.style.borderRadius = '50%';
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.flexShrink = '0';
      avatar.innerHTML = `
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      `;
  
      const msgContent = document.createElement('div');
      msgContent.style.flex = '1';
      msgContent.style.textAlign = 'right';
  
      const msgBubble = document.createElement('div');
      msgBubble.style.background = '#F97316';
      msgBubble.style.color = 'white';
      msgBubble.style.padding = '12px 16px';
      msgBubble.style.borderRadius = '18px 18px 4px 18px';
      msgBubble.style.fontSize = '14px';
      msgBubble.style.lineHeight = '1.4';
      msgBubble.style.display = 'inline-block';
      msgBubble.style.maxWidth = '80%';
      msgBubble.textContent = text;
  
      const timeStamp = document.createElement('div');
      timeStamp.style.fontSize = '11px';
      timeStamp.style.color = '#9CA3AF';
      timeStamp.style.marginTop = '4px';
      timeStamp.style.marginRight = '4px';
      timeStamp.textContent = formatTime();
  
      msgContent.appendChild(msgBubble);
      msgContent.appendChild(timeStamp);
      msgContainer.appendChild(avatar);
      msgContainer.appendChild(msgContent);
  
      return msgContainer;
    }
  
    // Fungsi untuk mengirim pesan
    function sendMessage(message) {
      if (!message.trim()) return;
  
      // Tampilkan pesan user
      const userMsg = createUserMessage(message);
      chatArea.appendChild(userMsg);
      chatArea.scrollTop = chatArea.scrollHeight;
      
      // Clear input
      input.value = '';
  
      // Cek apakah pesan mengandung keyword pemesanan
      const shouldShowWhatsApp = containsOrderKeywords(message);
  
      // Tampilkan typing indicator
      const typingIndicator = createTypingIndicator();
      chatArea.appendChild(typingIndicator);
      chatArea.scrollTop = chatArea.scrollHeight;
  
      // Fetch ke API Flowise
      fetch('https://cloud.flowiseai.com/api/v1/prediction/d9109871-f497-4f26-b155-e4d24d3f675a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      })
      .then(res => res.json())
      .then(data => {
        // Hapus typing indicator
        chatArea.removeChild(typingIndicator);
        
        // Tampilkan balasan bot dengan atau tanpa tombol WhatsApp
        const botMsg = createBotMessage(
          data.text || 'Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi.',
          shouldShowWhatsApp
        );
        chatArea.appendChild(botMsg);
        chatArea.scrollTop = chatArea.scrollHeight;
      })
      .catch(() => {
        // Hapus typing indicator
        chatArea.removeChild(typingIndicator);
        
        const botMsg = createBotMessage('Maaf, terjadi kesalahan koneksi. Silakan coba lagi dalam beberapa saat.');
        chatArea.appendChild(botMsg);
        chatArea.scrollTop = chatArea.scrollHeight;
      });
    }
  
    // Fungsi untuk membuat typing indicator
    function createTypingIndicator() {
      const msgContainer = document.createElement('div');
      msgContainer.style.display = 'flex';
      msgContainer.style.alignItems = 'flex-start';
      msgContainer.style.gap = '8px';
      msgContainer.style.marginBottom = '4px';
  
      const avatar = document.createElement('div');
      avatar.style.width = '32px';
      avatar.style.height = '32px';
      avatar.style.background = '#F97316';
      avatar.style.borderRadius = '50%';
      avatar.style.display = 'flex';
      avatar.style.alignItems = 'center';
      avatar.style.justifyContent = 'center';
      avatar.style.flexShrink = '0';
      avatar.innerHTML = `
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
        </svg>
      `;
  
      const msgBubble = document.createElement('div');
      msgBubble.style.background = 'white';
      msgBubble.style.padding = '12px 16px';
      msgBubble.style.borderRadius = '18px 18px 18px 4px';
      msgBubble.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
      msgBubble.innerHTML = `
        <div style="display: flex; gap: 4px; align-items: center;">
          <div style="width: 8px; height: 8px; background: #9CA3AF; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
          <div style="width: 8px; height: 8px; background: #9CA3AF; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
          <div style="width: 8px; height: 8px; background: #9CA3AF; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
        </div>
      `;
  
      msgContainer.appendChild(avatar);
      msgContainer.appendChild(msgBubble);
  
      return msgContainer;
    }
  
    // Event handler untuk form
    form.onsubmit = function(e) {
      e.preventDefault();
      sendMessage(input.value);
    };
  
    // Event handler untuk tombol chatbot
    button.onclick = function() {
      const isVisible = chatWindow.style.display === 'flex';
      chatWindow.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        badge.style.display = 'none';
        input.focus();
      }
    };
  
    // Susun komponen
    chatWindow.appendChild(header);
    chatWindow.appendChild(chatArea);
    chatWindow.appendChild(quickRepliesContainer);
    chatWindow.appendChild(inputContainer);
  
    // Tambahkan CSS untuk animasi typing
    const style = document.createElement('style');
    style.textContent = `
      @keyframes typing {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        30% {
          transform: translateY(-10px);
          opacity: 1;
        }
      }
      
      /* Custom scrollbar untuk quick replies */
      #kedaija-chatbot-window div::-webkit-scrollbar {
        height: 4px;
      }
      
      #kedaija-chatbot-window div::-webkit-scrollbar-track {
        background: #F1F5F9;
        border-radius: 2px;
      }
      
      #kedaija-chatbot-window div::-webkit-scrollbar-thumb {
        background: #CBD5E1;
        border-radius: 2px;
      }
      
      #kedaija-chatbot-window div::-webkit-scrollbar-thumb:hover {
        background: #94A3B8;
      }
    `;
    document.head.appendChild(style);
  
    // Tambahkan ke DOM
    document.body.appendChild(button);
    document.body.appendChild(chatWindow);
  
    // Tampilkan badge notifikasi setelah 3 detik
    setTimeout(() => {
      if (chatWindow.style.display !== 'flex') {
        badge.style.display = 'flex';
      }
    }, 3000);
  })();