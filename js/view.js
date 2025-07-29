const ChatView = (() => {
  const chatWindow = document.getElementById("chat-window");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const typingIndicator = document.getElementById("typing-indicator");
  const clearChatBtn = document.getElementById("clear-chat");

  function removeWelcomeMessage() {
    const welcomeMessage = chatWindow.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }
  }

  function appendMessage(message, sender = "user") {
    removeWelcomeMessage();
    
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = sender === "user" ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = message;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function showTypingIndicator() {
    typingIndicator.style.display = "flex";
  }

  function hideTypingIndicator() {
    typingIndicator.style.display = "none";
  }

  function getInput() {
    return userInput.value.trim();
  }

  function clearInput() {
    userInput.value = "";
  }

  function clearChat() {
    chatWindow.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-icon">
          <i class="fas fa-comments"></i>
        </div>
        <h4>¡HOLAAAAAA! 👋</h4>
        <p>Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?</p>
      </div>
    `;
  }

  function disableSendButton() {
    sendBtn.disabled = true;
  }

  function enableSendButton() {
    sendBtn.disabled = false;
  }

  function bindSend(handler) {
    sendBtn.addEventListener("click", () => {
      if (getInput()) {
        handler();
      }
    });
    
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && getInput()) {
        handler();
      }
    });

    userInput.addEventListener("input", () => {
      if (getInput()) {
        enableSendButton();
      } else {
        disableSendButton();
      }
    });
  }

  function bindClearChat(handler) {
    if (clearChatBtn) {
      clearChatBtn.addEventListener("click", handler);
    }
  }

  // Inicializar estado
  function init() {
    disableSendButton();
  }

  return {
    appendMessage,
    getInput,
    clearInput,
    clearChat,
    showTypingIndicator,
    hideTypingIndicator,
    disableSendButton,
    enableSendButton,
    bindSend,
    bindClearChat,
    init
  };
})();
