const ChatController = ((model, view) => {
  async function handleSend() {
    const userMessage = view.getInput().trim();
    if (!userMessage) return;

    view.appendMessage(userMessage, "user");
    const botReply = model.getResponse(userMessage);
    view.appendMessage(botReply, "bot");
    view.clearInput();
  }

  async function init() {
    await model.loadKnowledge();
    view.bindSend(handleSend);
  }

  return {
    init
  };
})(ChatModel, ChatView);

ChatController.init();

