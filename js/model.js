const ChatModel = (() => {
  let knowledgeBase = [];
  let fuse;

  /**
   * Carga las fuentes de conocimiento desde archivos JSON
   */
  async function loadKnowledge() {
    // Lista de rutas a tus archivos de conocimiento
    const sources = [
      'data/knowledge.json',
      'data/auto_knowledge.json'
    ];

    // Carga todos los archivos en paralelo
    const datasets = await Promise.all(
      sources.map(src => fetch(src).then(res => res.json()))
    );

    // Une todos los registros en un solo array
    knowledgeBase = datasets.flat();

    // Inicializa Fuse.js para búsqueda difusa
    fuse = new Fuse(knowledgeBase, {
      keys: ['pregunta', 'tags'],
      threshold: 0.3
    });
  }

  /**
   * Obtiene la respuesta más relevante para un mensaje dado
   * @param {string} message - Mensaje de usuario
   * @returns {string} Respuesta del chatbot
   */
  function getResponse(message) {
    if (!fuse) {
      console.warn('La base de conocimiento no está cargada aún.');
      return "Lo siento, mi base de conocimiento aún no está lista.";
    }

    const results = fuse.search(message);
    if (results.length > 0) {
      return results[0].item.respuesta;
    }

    return "Lo siento, no encontré una respuesta para eso.";
  }

  return {
    loadKnowledge,
    getResponse
  };
})();

// Exporta el módulo si usas módulos ES
// export default ChatModel;