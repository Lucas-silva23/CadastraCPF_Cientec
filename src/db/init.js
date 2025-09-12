const db = require('./db');

async function initDB() {
  await db.run(`
    CREATE TABLE IF NOT EXISTS cidadao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cpf TEXT UNIQUE NOT NULL
    )
  `);
  console.log('Tabela cidadao inicializada!');
}

module.exports = initDB;
