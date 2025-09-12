//==========================================================================//
//Cria a conexão com o banco de dados SQLite e inicializa a tabela "pessoas"
//==========================================================================//

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'data.db'), (err) => {
      if (err) console.error('Erro ao conectar ao DB', err);
      else console.log('Banco de dados conectado!');
    });
  }

  run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = new Database();

