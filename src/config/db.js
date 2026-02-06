// ===== Importar Pool de PostgreSQL =====
const { Pool } = require("pg");

// ===== Crear pool de conexiones =====
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ===== Exportar pool =====
module.exports = pool;