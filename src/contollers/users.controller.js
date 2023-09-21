import { query } from "../persistencia/postgreSQL/config.js";
import customResponses from "../utils/custonResponse.js";
import UserManager from "../persistencia/DAOS/users.posgres.js";
import { hashPassword } from "../utils/config.js";

const user = new UserManager();
// Todos los users
export const getAll = async (req, res) => {
  if (req.method !== "GET") {
    res
      .status(405)
      .json(customResponses.badResponse(405, "Metodo no permitido"));
  }
  try {
    const users = await user.getAllUsers();
    if (users.length === 0) {
      return res
        .status(404)
        .json(customResponses.badResponse(404, "No hay users para devolver"));
    }

    if ("error" in users) {
      return res
        .status(400)
        .json(
          customResponses.badResponse(
            400,
            "Error en obtener datos",
            users.message
          )
        );
    }
    // Eliminar espacios en blanco sobrantes de las propiedades de cada usuario
    const formatUser = users.map((user) => {
      for (const key in user) {
        if (typeof user[key] === "string") {
          user[key] = user[key].trim();
        }
      }
      return user;
    });
    res
      .status(200)
      .json(customResponses.responseOk(200, "Users encontrados", formatUser));
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
// Registrado
export const register = async (req, res) => {
  if (req.method !== "POST") {
    res
      .status(405)
      .json(customResponses.badResponse(405, "Metodo no permitido"));
  }
  const { name, lastname, email, password } = req.body;
  if (!name || !lastname || !email || !password) {
    return res
      .status(400)
      .json(customResponses.badResponse(400, "Faltan campos a completar"));
  }
  console.log(name, lastname, email, password);
  //   const user = await query(
  //     `
  //   INSERT INTO users (name, lastname, email, password)
  //   VALUES ($1, $2, $3, $4)
  //   RETURNING *;
  // `,
  //     [name, lastname, email, password]
  //   );
  //   console.log(user);
  res.send("Hello");
};
// User por ID
export const getOneById = async (req, res) => {
  const { id } = req.params;
  if (req.method !== "GET") {
    res
      .status(405)
      .json(customResponses.badResponse(405, "Metodo no permitido"));
  }
  try {
    const userDB = await user.getUserById(id)
    if ("error" in user) {
      return res
        .status(400)
        .json(
          customResponses.badResponse(
            400,
            "Error en obtener datos",
            user.message
          )
        );
    }
    for (const key in user) {
      if (typeof user[key] === "string") {
        user[key] = user[key].trim();
      }
    }
    res
      .status(200)
      .json(customResponses.responseOk(200, "User encontrado", user));
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
