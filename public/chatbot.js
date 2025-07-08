// Flowise AI Chatbot Integration
(function() {
  // Configuration
  const flowiseConfig = {
    apiUrl: 'https://cloud.flowiseai.com/api/v1/prediction/a3deee75-b301-44a0-b089-00ac5c248af1',
    welcomeMessage: 'Halo! Saya asisten virtual Kedai J.A. Ada yang bisa saya bantu hari ini?',
    botName: 'Kedai J.A Assistant',
    buttonColor: '#F97316'
  };

  // Buat tombol chatbot
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
        background-color: ${flowiseConfig.buttonColor};
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
    button.onclick = openChatWindow;
    document.body.appendChild(button);
  }

  // Buat window chat
  function openChatWindow() {
    if (document.getElementById('kedaija-chatbot-window')) return;

    const chatWindow = document.createElement('div');
    chatWindow.id = 'kedaija-chatbot-window';
    chatWindow.style = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 1001;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: sans-serif;
    `;

    chatWindow.innerHTML = `
      <div style="background:${flowiseConfig.buttonColor};color:#fff;padding:16px;font-weight:bold;display:flex;align-items:center;justify-content:space-between;">
        <span>${flowiseConfig.botName}</span>
        <button id="kedaija-chatbot-close" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">×</button>
      </div>
      <div id="kedaija-chatbot-messages" style="flex:1;padding:16px;overflow-y:auto;background:#f7f8ff;">
        <div style="margin-bottom:12px;"><b>${flowiseConfig.botName}:</b> ${flowiseConfig.welcomeMessage}</div>
      </div>
      <form id="kedaija-chatbot-form" style="display:flex;border-top:1px solid #eee;">
        <input id="kedaija-chatbot-input" type="text" placeholder="Ketik pesan Anda..." style="flex:1;padding:12px;border:none;outline:none;font-size:15px;" autocomplete="off" />
        <button type="submit" style="background:${flowiseConfig.buttonColor};color:#fff;border:none;padding:0 18px;font-size:15px;cursor:pointer;">Kirim</button>
      </form>
    `;

    document.body.appendChild(chatWindow);

    document.getElementById('kedaija-chatbot-close').onclick = function () {
      chatWindow.remove();
    };

    const form = document.getElementById('kedaija-chatbot-form');
    const input = document.getElementById('kedaija-chatbot-input');
    const messages = document.getElementById('kedaija-chatbot-messages');

    form.onsubmit = async function (e) {
      e.preventDefault();
      const userMsg = input.value.trim();
      if (!userMsg) return;
      appendMessage('Anda', userMsg, true);
      input.value = '';
      appendMessage(flowiseConfig.botName, '...', false, true);

      // Kirim ke API Flowise
      try {
        const res = await fetch(flowiseConfig.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userMsg })
        });
        const data = await res.json();
        // Hapus loading
        const loading = messages.querySelector('.kedaija-loading');
        if (loading) loading.remove();
        appendMessage(flowiseConfig.botName, data.text || '[Tidak ada jawaban]', false);
      } catch (err) {
        const loading = messages.querySelector('.kedaija-loading');
        if (loading) loading.remove();
        appendMessage(flowiseConfig.botName, '[Gagal menghubungi server]', false);
      }
      messages.scrollTop = messages.scrollHeight;
    };

    function appendMessage(sender, text, isUser, isLoading) {
      const msg = document.createElement('div');
      msg.style.marginBottom = '12px';
      msg.innerHTML = `<b>${sender}:</b> <span${isLoading ? ' class="kedaija-loading"' : ''}>${text}</span>`;
      if (isUser) msg.style.textAlign = 'right';
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }
  }

  // Inisialisasi tombol chatbot saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbotButton);
  } else {
    createChatbotButton();
  }
})();