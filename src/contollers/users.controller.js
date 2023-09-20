import { query } from "../persistencia/postgreSQL/config.js";
import customResponses from "../utils/custonResponse.js";
export const getAll = async (req, res) => {
  if (req.method !== "GET") {
    res
      .status(405)
      .json(customResponses.badResponse(405, "Metodo no permitido"));
  }
  try {
    const data = await query("SELECT * FROM users");
    console.log(data);
    const users = data.rows;
    if (users.length !== 0) {
      return res
        .status(404)
        .json(customResponses.badResponse(404, "No hay users para devolver"));
    }
    res
      .status(200)
      .json(customResponses.responseOk(200, "Users encontrados", users));
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
export const getOneById = async (req, res) => {
  const { id } = req.params;
  try {
  } catch (error) {
    
  }
};
