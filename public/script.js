//Elementos do DOM
const registerBtn = document.getElementById('registerBtn');
const searchBtn = document.getElementById('searchBtn');

const registerMsg = document.getElementById('registerMsg');
const searchMsg = document.getElementById('searchMsg');

const cpfInput = document.getElementById('cpf');
const nameInput = document.getElementById('name');
const searchBox = document.getElementById('searchBox');

const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');

//Formata o CPF enquanto o usuário digita
function formatCPF(value) {
  value = value.replace(/\D/g, ''); //remove tudo que não for número
  if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
  if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
  if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11, 13);
  return value;
}

//Aplica máscara no cadastro
cpfInput.addEventListener('input', () => {
  cpfInput.value = formatCPF(cpfInput.value);
});

searchTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    //Limpa o campo de pesquisa quando o tipo muda
    searchBox.value = '';
  });
});

//Impede números no campo nome
nameInput.addEventListener('input', () => {
  nameInput.value = nameInput.value.replace(/[0-9]/g, '');
});

//Aplica máscara no campo de pesquisa se tipo for CPF
searchBox.addEventListener('input', () => {
  const searchType = document.querySelector('input[name="searchType"]:checked').value;

  if (searchType === 'cpf') {
    searchBox.value = formatCPF(searchBox.value);
  } else {
    searchBox.value = searchBox.value.replace(/[0-9]/g, '');
  }
});

//Mostra mensagens de sucesso/erro
function showMessage(msgElement, text, type) {
  msgElement.textContent = text;
  msgElement.className = 'message';
  msgElement.classList.add(type);
}

//Cadastro
registerBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  const cpf = cpfInput.value.trim();

  if (!name || !cpf) {
    showMessage(registerMsg, 'Informe nome e CPF', 'error-msg');
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, cpf })
    });

    const data = await res.json();
    if (res.ok) showMessage(registerMsg, data.message, 'success-msg');
    else showMessage(registerMsg, data.message || data.error, 'error-msg');
  } catch (err) {
    showMessage(registerMsg, 'Erro no servidor', 'error-msg');
  }
});

//Pesquisa
searchBtn.addEventListener('click', async () => {
  const query = searchBox.value.trim();
  const searchType = document.querySelector('input[name="searchType"]:checked').value;

  if (!query) {
    showMessage(searchMsg, `Informe ${searchType === 'cpf' ? 'CPF' : 'Nome'}`, 'error-msg');
    return;
  }

  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await res.json();
    if (data.message && data.message === 'Cidadão não encontrado') {
      showMessage(searchMsg, data.message, 'error-msg');
    } else {
      showMessage(searchMsg, `Cidadão Encontrado!\n Nome: ${data.name}\nCPF: ${data.cpf}`, 'success-msg');
    }
  } catch (err) {
    showMessage(searchMsg, 'Erro no servidor', 'error-msg');
  }
});

