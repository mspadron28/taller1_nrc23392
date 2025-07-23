const ChatController = ((model, view) => {
  async function handleSend() {
    const userMessage = view.getInput();
    if (!userMessage) return;

    // Mostrar mensaje del usuario
    view.appendMessage(userMessage, "user");
    view.clearInput();
    view.disableSendButton();
    
    // Mostrar indicador de escritura
    view.showTypingIndicator();
    
    try {
      // Simular tiempo de respuesta del bot
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const botReply = model.getResponse(userMessage);
      view.hideTypingIndicator();
      view.appendMessage(botReply, "bot");
    } catch (error) {
      view.hideTypingIndicator();
      view.appendMessage("Lo siento, ocurrió un error. Por favor intenta nuevamente.", "bot");
    }
  }

  function handleClearChat() {
    view.clearChat();
  }

  async function init() {
    try {
      await model.loadKnowledge();
      view.init();
      view.bindSend(handleSend);
      view.bindClearChat(handleClearChat);
      console.log("ChatBot inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar el chatbot:", error);
    }
  }

  return {
    init
  };
})(ChatModel, ChatView);

// Inicializar el controlador cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ChatController.init);
} else {
  ChatController.init();
}

