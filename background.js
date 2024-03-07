// Carrega as palavras censuradas armazenadas localmente
let palavrasCensuradas = [];
let isActive = true; // Define o estado inicial da extensão como ativado

chrome.storage.local.get("palavrasCensuradas", function(data) {
  palavrasCensuradas = data.palavrasCensuradas || [];
  console.log("Palavras censuradas carregadas:", palavrasCensuradas);
});

// Atualiza as palavras censuradas armazenadas localmente
function atualizarPalavrasCensuradas(palavras) {
  palavrasCensuradas = palavras;
  console.log("Palavras censuradas atualizadas:", palavrasCensuradas);
  chrome.storage.local.set({ "palavrasCensuradas": palavras });
}

// Manipula a mensagem enviada pelo popup para atualizar as palavras censuradas e o estado da extensão
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.palavrasCensuradas) {
    atualizarPalavrasCensuradas(request.palavrasCensuradas);
    console.log("Palavras censuradas atualizadas:", palavrasCensuradas);
    sendResponse("Palavras censuradas atualizadas com sucesso."); // Responde ao popup
  } else if (request.checkStatus) {
    // Retorna o estado atual da extensão
    sendResponse({ isActive: isActive });
  } else if (request.command === "toggleExtension") {
    // Atualiza o estado da extensão com base no botão de slide
    isActive = request.enabled;
    if (isActive) {
      chrome.browserAction.setIcon({ path: "active_icon.png" });
      chrome.browserAction.setBadgeText({ text: "" }); // Limpa qualquer texto de distintivo
    } else {
      chrome.browserAction.setIcon({ path: "inactive_icon.png" });
      chrome.browserAction.setBadgeText({ text: "OFF" }); // Define um texto de distintivo para indicar que a extensão está desativada
    }
    // Salva o estado atual da extensão
    chrome.storage.local.set({ "extensionEnabled": isActive });
    sendResponse({ message: `Extensão ${isActive ? 'ativada' : 'desativada'}.` });
  }
  // Envia uma mensagem para o content script sobre o estado da extensão
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: "updateExtensionState", enabled: isActive });
  });
  return true;
});
