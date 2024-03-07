// Função para verificar o estado da extensão antes de ocultar os tweets
function verificarEstadoDaExtensao() {
  // Verifica o estado da extensão antes de ocultar os tweets
  chrome.runtime.sendMessage({ checkStatus: true }, function(response) {
    const extensionIsActive = response.isActive;
    console.log("Estado da extensão:", extensionIsActive);

    if (extensionIsActive) {
      // Carrega as palavras censuradas somente se a extensão estiver ativa
      chrome.storage.sync.get({ palavrasCensuradas: [] }, function(data) {
        const palavrasCensuradas = data.palavrasCensuradas.map(palavra => palavra.toLowerCase().trim());
        console.log("Palavras censuradas carregadas:", palavrasCensuradas);

        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
              const tweets = document.querySelectorAll("[data-testid='tweet']");
              tweets.forEach(function(tweet) {
                const textoTweet = tweet.innerText.toLowerCase().trim();
                if (palavrasCensuradas.some(palavra => textoTweet.includes(palavra))) {
                  console.log("Tweet censurado:", textoTweet);
                  tweet.style.display = "none"; // Oculta o tweet
                }
              });
            }
          });
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  });
}

verificarEstadoDaExtensao();
