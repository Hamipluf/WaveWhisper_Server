import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool, Client } = pkg;

const url_connect = process.env.URL_POSTGRESQL;
const pass_connect = process.env.PASSWORD_POSTGRESQL;
const user_connect = process.env.USER_POSTGRESQL;
const DB_connect = process.env.DATABASE_POSTGRESQL;
const pool = new Pool({
  user: user_connect,
  host: url_connect,
  database: DB_connect,
  password: pass_connect,
  port: 5432, // Puerto predeterminado de PostgreSQL
  ssl: true, // Habilitar SSL/TLS
});
export function query(text, params) {
  return pool.query(text, params);
}
