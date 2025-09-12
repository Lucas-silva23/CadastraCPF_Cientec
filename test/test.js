const http = require('http');
const assert = require('assert');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../src/db/data.db');

//Função auxiliar para fazer requisições HTTP POST
function post(path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

//Limpa a tabela antes de rodar os testes
db.run('DELETE FROM cidadao', (err) => {
  if (err) console.error('Erro ao limpar DB:', err);
  else {
    console.log('Banco de dados limpo para testes.');
    runTests();
  }
});

//Função que contém todos os testes
async function runTests() {
  console.log('Iniciando testes...');
  try {
    let res = await post('/api/register', { name: 'João Silva', cpf: '165.520.497-14' });
    assert.strictEqual(res.message, 'Cadastro efetuado!');
    console.log('Cadastro de novo Cidadão: OK');

    res = await post('/api/register', { name: 'João Silva', cpf: '165.520.497-14' });
    assert.strictEqual(res.message, 'CPF já cadastrado!');
    console.log('Cadastro CPF duplicado: OK');

    res = await post('/api/register', { name: 'João Moura', cpf: '000.000.000-00' });
    assert.strictEqual(res.message, 'CPF inválido!');
    console.log('Cadastro CPF Inválido: OK');

    res = await post('/api/search', { query: '165.520.497-14' });
    assert.strictEqual(res.name, 'João Silva');
    console.log('Pesquisa CPF existente: OK');

    res = await post('/api/search', { query: '999.999.999-99' });
    assert.strictEqual(res.message, 'Cidadão não encontrado');
    console.log('Pesquisa CPF não existente: OK');

    res = await post('/api/search', { query: 'LLLLLLLLLLL' });
    assert.strictEqual(res.message, 'Cidadão não encontrado');
    console.log('Pesquisa Nome não existente: OK');

  } catch (err) {
    console.error('Teste falhou:', err);
  }
}
