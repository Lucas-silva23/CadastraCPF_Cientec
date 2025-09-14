const db = require('../db/db');
const { apenasNumeros, validarCpf } = require('../utils/utils');

//Classe Cidadão para manipulação dos dados
class Cidadao {
  constructor(name, cpf) {
    this.name = name;
    this.cpf = cpf ? apenasNumeros(cpf) : '';
  }

  async save() {
    if (!validarCpf(this.cpf)) {
      return { success: false, message: 'CPF inválido!' };
    }

    try {
      await db.run('INSERT INTO cidadao(name, cpf) VALUES (?, ?)', [this.name, this.cpf]);
      return { success: true, message: 'Cadastro efetuado!' };
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') return { success: false, message: 'CPF já cadastrado!' };
      return { success: false, message: 'Erro ao cadastrar' };
    }
  }

  static async search(query) {
    const cpf = apenasNumeros(query);

    if (cpf.length === 11) {
      const row = await db.get('SELECT name, cpf FROM cidadao WHERE cpf = ?', [cpf]);
      if (!row) return { message: 'Cidadão não encontrado' };
      return row;
    }

    //senão busca por nome, pode ter vários
    const rows = await db.all('SELECT name, cpf FROM cidadao WHERE name = ?', [query]);
    if (!rows || rows.length === 0) return { message: 'Cidadão não encontrado' };
    return { results: rows };
  }
}

module.exports = Cidadao;
