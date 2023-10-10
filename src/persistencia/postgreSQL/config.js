import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const production = process.env.PRODUCTION;
let url;

production
  ? (url = process.env.URL_POSTGRESQL)
  : (url = process.env.URL_POSTGRESQL_PRODUC);

const pool = new Pool({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false, // Desactiva la verificación de certificados
  },
});
pool
  .connect()
  .then(() => {
    console.log("Conexión a PostgreSQL establecida correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar a PostgreSQL:", error);
  });

export function query(text, params) {
  return pool.query(text, params);
}
