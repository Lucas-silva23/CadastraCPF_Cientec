const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Modelo Pessoa
class Pessoa {
  constructor(name, cpf) {
    this.name = name;
    this.cpf = this.normalizeCpf(cpf);
  }

  normalizeCpf(cpf) {
    return cpf ? cpf.replace(/\D/g, '') : '';
  }

  async save() {
    try {
      await db.run('INSERT INTO pessoas(name, cpf) VALUES (?, ?)', [this.name, this.cpf]);
      return { success: true, message: 'Cadastro efetuado!' };
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') return { success: false, message: 'CPF já cadastrado!' };
      return { success: false, message: 'Erro ao cadastrar' };
    }
  }

  static async search(query) {
    const cpf = query.replace(/\D/g, '');
    const row = await db.get('SELECT name, cpf FROM pessoas WHERE cpf = ? OR name = ? LIMIT 1', [cpf, query]);
    if (!row) return { message: 'Cidadão não encontrado' };
    return row;
  }
}

//Inicializa a tabela "pessoas" se não existir
(async () => {
  await db.run(`CREATE TABLE IF NOT EXISTS pessoas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL
  )`);
})();

//Chamadas de API
app.post('/api/register', async (req, res) => {
  const { name, cpf } = req.body;
  if (!name || !cpf) return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });

  const pessoa = new Pessoa(name, cpf);
  const result = await pessoa.save();
  if (result.success) res.json({ message: result.message });
  else res.status(400).json({ message: result.message });
});

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Informe CPF ou nome' });

  const result = await Pessoa.search(query);
  res.json(result);
});

//Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
