import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;

const url_dev = process.env.URL_POSTGRESQL;
// const url_prod = process.env.URL_POSTGRESQL_PRODUC;
const pool = new Pool({
  connectionString: url_dev,
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

pool.on("error", (err) => {
  console.error("Error en la conexión a PostgreSQL:", err);
});

export function query(text, params) {
  return pool.query(text, params);
}
