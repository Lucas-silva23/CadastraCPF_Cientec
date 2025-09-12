const express = require('express');
const path = require('path');
const CidadaoController = require('./src/controllers/CidadaoController');
const db = require('./src/db/db');
const initDB = require('./src/db/init');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Inicializa o banco e cria a tabela se não existir
(async () => {
  try {
    await initDB(); 
  } catch (err) {
    console.error('Erro ao inicializar o banco:', err);
  }
})();

// Rotas da API
app.post('/api/register', CidadaoController.registerCidadao);
app.post('/api/search', CidadaoController.searchCidadao);

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
