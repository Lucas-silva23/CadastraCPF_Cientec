//Extrai apenas números de uma string
function apenasNumeros(str) {
  let resultado = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char >= '0' && char <= '9') resultado += char;
  }
  return resultado;
}

//Valida CPF (formato e dígitos)
function validarCpf(cpf) {
  cpf = apenasNumeros(cpf);

  if (cpf.length !== 11) return false;

  //Checa se todos os números são iguais
  let todosIguais = true;
  for (let i = 1; i < 11; i++) {
    if (cpf[i] !== cpf[0]) {
      todosIguais = false;
      break;
    }
  }
  if (todosIguais) return false;

  //Calcula os dígitos verificadores
  const calcularDigito = (cpfArray, factor) => {
    let total = 0;
    for (let i = 0; i < cpfArray.length; i++) {
      total += cpfArray[i] * factor--;
    }
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const cpfArray = cpf.split('').map(Number);
  const digito1 = calcularDigito(cpfArray.slice(0, 9), 10);
  const digito2 = calcularDigito(cpfArray.slice(0, 10), 11);

  return digito1 === cpfArray[9] && digito2 === cpfArray[10];
}

module.exports = { apenasNumeros, validarCpf };
