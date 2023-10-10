import customResponses from "../utils/customResponse.js";
import UserManager from "../persistencia/DAOS/users.posgres.js";
import { hashPassword } from "../utils/config.js";
import authManager from "../utils/authManager.js";
const user = new UserManager();
const url_production = process.env.URL_PRODUCCION;
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
export const register = (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json(customResponses.badResponse(405, "Método no permitido"));
  }
  const user = req.user;
  if ("error" in user) {
    return res
      .status(400)
      .send(
        customResponses.badResponse(400, user?.message || user?.data, undefined)
      );
  }
  const token = authManager.generateToken(user);
  res
    .cookie("jwt", token, {
      signed: true,
    })
    .json(customResponses.responseOk(200, "User registrado con exito", user));
};
// logear a un user
export const login = (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json(customResponses.badResponse(405, "Método no permitido"));
  }
  const user = req.user;
  if (user.error) {
    console.log("Error controller loguinUser");
    return res
      .status(404)
      .send(
        customResponses.badResponse(404, user?.message || user?.data, undefined)
      );
  }
  const token = authManager.generateToken(user);
  res
    .cookie("jwt", token, {
      signed: true,
    })
    .json(customResponses.responseOk(200, "Bienvenido", user));
};
// Autentica y recupera el user loggeado
export const authUser = (req, res) => {
  const currentUser = req.user;
  if (!currentUser) {
    return res
      .status(400)
      .json(customResponses.badResponse(400, "No hay usuario logueado"));
  }
  const insensitiveUser = {
    id: currentUser.id,
    name: currentUser.name,
    lastname: currentUser.lastname,
    email: currentUser.email,
    username: currentUser.username,
    photos: currentUser.photos,
    sid: currentUser.sid,
    s_followers: currentUser.s_followers,
  };
  res
    .status(200)
    .json(customResponses.responseOk(200, "Curren user", insensitiveUser));
};
// Recuperacion de datos con spotify
export const callbackSpotify = (req, res) => {
  const { user } = req;
  if (!user) {
    return res.redirect(`${url_production}/login`);
  }
  const token = authManager.generateToken(user);
  res.cookie("jwt", JSON.stringify(token), {
    signed: true,
  });
  res.redirect(`${url_production}`);
};
