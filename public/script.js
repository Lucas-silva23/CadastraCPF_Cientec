//Elementos do DOM
const registerBtn = document.getElementById('registerBtn');
const searchBtn = document.getElementById('searchBtn');
const registerMsg = document.getElementById('registerMsg');
const searchMsg = document.getElementById('searchMsg');
const cpfInput = document.getElementById('cpf');
const nameInput = document.getElementById('name');
const searchBox = document.getElementById('searchBox');
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');

//FUNÇÕES DE UTILITÁRIOS

//Retira tudo que não for letra
function apenasLetras(str) {
  let resultado = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char < '0' || char > '9') resultado += char;
  }
  return resultado;
}

//Retira tudo que não for número
function apenasNumeros(str) {
  let numeros = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char >= '0' && char <= '9') numeros += char;
  }
  return numeros;
}

//Verifica se todos os dígitos são iguais
function todosDigitosIguais(cpf) {
  const primeiro = cpf[0];
  for (let i = 1; i < cpf.length; i++) {
    if (cpf[i] !== primeiro) return false;
  }
  return true;
}

//Valida CPF
function validarCpf(cpf) {
  if (!cpf) return false;

  cpf = apenasNumeros(cpf);
  if (cpf.length !== 11) return false;
  if (todosDigitosIguais(cpf)) return false;

  const calcularDigito = (cpfArray, fator) => {
    let total = 0;
    for (let i = 0; i < cpfArray.length; i++) {
      total += cpfArray[i] * fator--;
    }
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const cpfArray = cpf.split('').map(Number);
  const digito1 = calcularDigito(cpfArray.slice(0, 9), 10);
  const digito2 = calcularDigito(cpfArray.slice(0, 10), 11);

  return digito1 === cpfArray[9] && digito2 === cpfArray[10];
}

//Formata CPF com máscara XXX.XXX.XXX-XX
function formatCPF(value) {
  value = apenasNumeros(value);
  if (value.length > 3) value = value.slice(0, 3) + '.' + value.slice(3);
  if (value.length > 7) value = value.slice(0, 7) + '.' + value.slice(7);
  if (value.length > 11) value = value.slice(0, 11) + '-' + value.slice(11, 13);
  return value;
}

//Mostra mensagem de sucesso/erro
function showMessage(msgElement, text, type) {
  msgElement.textContent = text;
  msgElement.className = 'message';
  msgElement.classList.add(type);
}


//EVENTOS DE INPUT

//Aplica máscara no campo CPF
cpfInput.addEventListener('input', () => {
  cpfInput.value = formatCPF(cpfInput.value);
});

//Limita apenas letras no campo nome
nameInput.addEventListener('input', () => {
  nameInput.value = apenasLetras(nameInput.value);
});

//Aplica máscara ou bloqueia números no campo de pesquisa
searchBox.addEventListener('input', () => {
  const searchType = document.querySelector('input[name="searchType"]:checked').value;

  if (searchType === 'cpf') searchBox.value = formatCPF(searchBox.value);
  else searchBox.value = apenasLetras(searchBox.value);
});

//Limpa campo de pesquisa ao mudar o tipo
searchTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => searchBox.value = '');
});


//EVENTOS DE CLICK

//Cadastro de cidadão
registerBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  const cpf = cpfInput.value.trim();

  if (!name || !cpf) {
    showMessage(registerMsg, 'Informe nome e CPF', 'error-msg');
    return;
  }

  if (!validarCpf(cpf)) {
    showMessage(registerMsg, 'CPF inválido!', 'error-msg');
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

//Pesquisa de cidadão
searchBtn.addEventListener('click', async () => {
  const query = searchBox.value.trim();
  const searchType = document.querySelector('input[name="searchType"]:checked').value;

  if (!query) {
    showMessage(searchMsg, `Informe ${searchType === 'cpf' ? 'CPF' : 'Nome'}`, 'error-msg');
    return;
  }

  if (searchType === 'cpf' && !validarCpf(query)) {
    showMessage(searchMsg, 'CPF inválido!', 'error-msg');
    return;
  }

  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();

    if (data.message === 'Cidadão não encontrado') {
      showMessage(searchMsg, data.message, 'error-msg');
    } else if (data.results) {
      let msg = 'Cidadãos encontrados:\n\n';
      data.results.forEach(c => {
        msg += `Nome: ${c.name}\nCPF: ${c.cpf}\n\n`;
      });
      showMessage(searchMsg, msg.trim(), 'success-msg');
    } else {
      showMessage(searchMsg, `Cidadão Encontrado!\nNome: ${data.name}\nCPF: ${data.cpf}`, 'success-msg');
    }
  } catch (err) {
    showMessage(searchMsg, 'Erro no servidor', 'error-msg');
  }
});
