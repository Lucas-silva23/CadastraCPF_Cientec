const db = require('../db/db');
const { apenasNumeros, validarCpf } = require('../utils/utils');

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
    const row = await db.get('SELECT name, cpf FROM cidadao WHERE cpf = ? OR name = ? LIMIT 1', [cpf, query]);
    if (!row) return { message: 'Cidadão não encontrado' };
    return row;
  }
}

module.exports = Cidadao;
