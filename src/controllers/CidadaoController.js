const Cidadao = require('../models/Cidadao');

//Função para cadastrar um cidadao
async function registerCidadao(req, res) {
  const { name, cpf } = req.body;

  if (!name || !cpf) {
    return res.status(400).json({ error: 'Nome e CPF são obrigatórios' });
  }

  const cidadao = new Cidadao(name, cpf);
  const result = await cidadao.save();

  if (result.success) return res.json({ message: result.message });
  return res.status(400).json({ message: result.message });
}

//Função para pesquisar um cidadao por CPF ou nome
async function searchCidadao(req, res) {
  const { query } = req.body;

  if (!query) return res.status(400).json({ error: 'Informe CPF ou nome' });

  const result = await Cidadao.search(query);
  return res.json(result);
}

module.exports = {
  registerCidadao,
  searchCidadao,
};
