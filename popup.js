document.addEventListener("DOMContentLoaded", function() {
  const toggleExtensionCheckbox = document.getElementById("toggleExtension");
  const extensionStateText = document.getElementById("extensionState");
  const openListButton = document.getElementById("abrirListaBotao");

  // Função para atualizar o estado do slider e ativar/desativar a extensão
  function updateSliderState(enabled) {
    toggleExtensionCheckbox.checked = enabled;
    extensionStateText.textContent = enabled ? "Extensão Ativa" : "Extensão Desativada";
    // Envia uma mensagem para o script de fundo para ativar ou desativar a extensão
    chrome.runtime.sendMessage({ command: "toggleExtension", enabled: enabled });
    // Recarrega a página atual quando o estado do botão slide é alterado
    chrome.tabs.reload();
  }

  // Adiciona um evento de mudança ao checkbox para alternar a extensão
  toggleExtensionCheckbox.addEventListener("change", function() {
    const extensionEnabled = toggleExtensionCheckbox.checked;
    chrome.storage.local.set({ "extensionEnabled": extensionEnabled });
    // Envia uma mensagem para o background script para ativar ou desativar a extensão
    chrome.runtime.sendMessage({ command: "toggleExtension", enabled: extensionEnabled });
    // Recarrega a página atual quando o estado do botão slide é alterado
    chrome.tabs.reload();
  });

  // Restaura o estado da extensão ao carregar a página
  chrome.storage.local.get("extensionEnabled", function(data) {
    const extensionEnabled = data.extensionEnabled ?? true; // Se não houver valor, assume verdadeiro
    toggleExtensionCheckbox.checked = extensionEnabled;
  });

  // Adiciona um evento de clique ao botão "Abrir Lista"
  openListButton.addEventListener("click", function() {
    // Abre uma nova guia com a página lista_palavras.html
    chrome.tabs.create({ url: chrome.extension.getURL("lista_palavras.html") });
  });
});
