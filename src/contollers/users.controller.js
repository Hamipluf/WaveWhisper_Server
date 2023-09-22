import customResponses from "../utils/customResponse.js";
import UserManager from "../persistencia/DAOS/users.posgres.js";
import { hashPassword } from "../utils/config.js";
import authManager from "../utils/authManager.js";

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
// User por ID sin info sensible
export const getOneById = async (req, res) => {
  const { id } = req.params;
  if (req.method !== "GET") {
    res
      .status(405)
      .json(customResponses.badResponse(405, "Metodo no permitido"));
  }
  try {
    const userDB = await user.getUserById(id);
    if ("error" in userDB) {
      return res
        .status(400)
        .json(customResponses.badResponse(400, userDB.message));
    }
    for (const key in userDB) {
      if (typeof userDB[key] === "string") {
        userDB[key] = userDB[key].trim();
      }
    }
    const userResponse = {
      name: userDB.name,
      lastname: userDB.lastname,
      email: userDB.email,
      role: userDB.role,
    };
    res
      .status(200)
      .json(customResponses.responseOk(200, "User encontrado", userResponse));
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
// Registrar user
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
  try {
    const hashPass = await hashPassword(password);
    const newUser = {
      name,
      lastname,
      email,
      password: hashPass,
    };
    const userCreated = await user.registerUser(newUser);
    const userRow = userCreated?.rows[0];
    if ("error" in userCreated) {
      return res
        .status(400)
        .json(customResponses.badResponse(400, userCreated.message));
    }
    const token = authManager.generateToken(userRow);
    const userResponse = { user: userRow, token };
    res
      .status(200)
      .json(
        customResponses.responseOk(
          200,
          `User con el email: ${email} creado correctamente`,
          userResponse
        )
      );
  } catch (error) {
    console.error("Error al crear el registros:", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
// logear a un user
export const login = async (req, res) => {
  if (req.method !== "POST") {
    res
      .status(405)
      .json(customResponses.badResponse(405, "Metodo no permitido"));
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(customResponses.badResponse(400, "Faltan campos a completar"));
  }
  try {
    const data = { email, password };
    const userDB = await user.loginUser(data);
    if ("error" in userDB) {
      return res
        .status(400)
        .json(customResponses.badResponse(400, userDB.message));
    }
    const token = authManager.generateToken(userDB);
    const insensitiveUser = {
      name: userDB.name,
      lastname: userDB.lastname,
      email: userDB.email,
      role: userDB.role,
    };
    const userResponse = { user: insensitiveUser, token };
    res
      .status(200)
      .json(
        customResponses.responseOk(
          200,
          `Bienvenido ${userDB.name}`,
          userResponse
        )
      );
  } catch (error) {
    console.error("Error al leer el registro:", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
