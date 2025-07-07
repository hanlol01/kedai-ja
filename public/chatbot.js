// Flowise AI Chatbot Integration
(function() {
  // Configuration
  const flowiseConfig = {
    chatflowid: 'your-chatflow-id-here',
    apiHost: 'https://your-flowise-instance.com',
    theme: {
      button: {
        backgroundColor: '#F97316',
        right: 20,
        bottom: 20,
        size: 48,
        dragAndDrop: true,
        iconColor: 'white',
        customIconSrc: '',
      },
      chatWindow: {
        showTitle: true,
        title: 'Kedai J.A Assistant',
        titleAvatarSrc: '',
        showAgentMessages: true,
        welcomeMessage: 'Halo! Saya asisten virtual Kedai J.A. Ada yang bisa saya bantu hari ini?',
        backgroundColor: '#ffffff',
        height: 700,
        width: 400,
        fontSize: 16,
        poweredByTextColor: '#303235',
        botMessage: {
          backgroundColor: '#f7f8ff',
          textColor: '#303235',
          showAvatar: true,
          avatarSrc: '',
        },
        userMessage: {
          backgroundColor: '#F97316',
          textColor: '#ffffff',
          showAvatar: true,
          avatarSrc: '',
        },
        textInput: {
          placeholder: 'Ketik pesan Anda...',
          backgroundColor: '#ffffff',
          textColor: '#303235',
          sendButtonColor: '#F97316',
        }
      }
    }
  };

  // Simple chatbot placeholder (replace with actual Flowise integration)
  function createChatbotButton() {
    const button = document.createElement('div');
    button.id = 'kedaija-chatbot-button';
    button.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-color: #F97316;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transition: all 0.3s ease;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </div>
    `;
    
    button.onclick = function() {
      alert('Chatbot akan segera aktif! Untuk saat ini, silakan hubungi kami melalui kontak yang tersedia.');
    };
    
    document.body.appendChild(button);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbotButton);
  } else {
    createChatbotButton();
  }
})();