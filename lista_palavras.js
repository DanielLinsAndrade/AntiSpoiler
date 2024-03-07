document.addEventListener("DOMContentLoaded", function() {
  const listaPalavras = document.getElementById("listaPalavras");
  const deletarSelecionadosBtn = document.getElementById("deletarSelecionados");
  
  // Função para selecionar todas as checkboxes
  function selecionarTodas() {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
  }
  
  // Adiciona um evento de clique ao botão "Selecionar Todos"
  document.getElementById('selecionarTodos').addEventListener('click', selecionarTodas);
  
  // Função para adicionar uma palavra à lista
  function adicionarPalavra(palavra) {
    const li = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    
    const span = document.createElement('span');
    span.textContent = palavra;
    
    const button = document.createElement('button');
    button.className = 'delete-button';
    button.textContent = 'Remover';
    button.addEventListener('click', function() {
      li.remove(); // Remove o item da lista quando o botão "Remover" é clicado
      atualizarPalavrasCensuradas(); // Atualiza as palavras censuradas armazenadas localmente
    });
    
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(button);
    
    listaPalavras.appendChild(li);
  }
  
  // Função para atualizar as palavras censuradas armazenadas localmente
  function atualizarPalavrasCensuradas() {
    const palavrasCensuradas = [];
    const itensLista = document.querySelectorAll('#listaPalavras li');
    itensLista.forEach(item => {
      const span = item.querySelector('span');
      palavrasCensuradas.push(span.textContent);
    });
    chrome.storage.sync.set({ "palavrasCensuradas": palavrasCensuradas });
  }
  
  // Carrega as palavras censuradas ao carregar a página
  chrome.storage.sync.get({ palavrasCensuradas: [] }, function(data) {
    const palavrasCensuradas = data.palavrasCensuradas;
    palavrasCensuradas.forEach(function(palavra) {
      adicionarPalavra(palavra);
    });
  });
  
  // Adiciona uma palavra quando o botão "Salvar" é clicado
  document.getElementById('salvarBotao').addEventListener('click', function() {
    const novaPalavra = document.getElementById('inputPalavra').value.trim();
    if (novaPalavra !== "") {
      adicionarPalavra(novaPalavra);
      document.getElementById('inputPalavra').value = ""; // Limpa o campo de entrada
      atualizarPalavrasCensuradas(); // Atualiza as palavras censuradas armazenadas localmente
    }
  });
  
  // Remove os itens selecionados quando o botão "Deletar Selecionados" é clicado
  deletarSelecionadosBtn.addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checkbox.parentNode.remove();
      }
    });
    atualizarPalavrasCensuradas(); // Atualiza as palavras censuradas armazenadas localmente
  });
});
