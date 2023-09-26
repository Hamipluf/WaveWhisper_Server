import usersServices from "../../services/user.services.js";
import { comparePassword } from "../../utils/config.js";
export default class UserManager {
  // Obtiene todos los usuarios
  async getAllUsers() {
    try {
      const data = await usersServices.getAllUsers();
      const users = data.rows;
      return users ? users : { error: true, message: "No hay users" };
    } catch (err) {
      console.log("ERROR getAllUsers users.posgres", err);
      return { error: true, data: err };
    }
  }
  async getUserById(uid) {
    if (!uid) {
      return { error: true, message: "Faltan campos a completar" };
    }
    try {
      const user = await usersServices.getUserById(uid);
      return user
        ? user
        : { error: true, message: `No hay un user con el id ${uid}` };
    } catch (err) {
      console.log("ERROR getUserById users.posgres", err);
      return { error: true, data: err };
    }
  }
  async registerUser(user) {
    if (!user) {
      return { error: true, message: "Faltan campos a completar" };
    }
    try {
      const newUser = usersServices.createAnUser(user);
      return newUser
        ? newUser
        : {
            error: true,
            message: `No se pudo crear el user con el email ${email}`,
          };
    } catch (error) {
      console.log("ERROR registerUser users.posgres", error);
      return { error: true, data: err };
    }
  }
  async getUserByEmail(email) {
    if (!email) {
      return { error: true, message: "Faltan campos a completar" };
    }
    try {
      const user = await usersServices.getUserByEmail(email);
      return user ? user : { error: true, message: `Email incorrecto` };
    } catch (err) {
      console.log("ERROR getUserByEmail users.posgres", err);
      return { error: true, data: err };
    }
  }
  async loginUser(user) {
    const { email, password } = user;
    try {
      const user = await this.getUserByEmail(email);
      if (user) {
        const isPassword = await comparePassword(password, user.password);
        return isPassword
          ? user
          : { error: true, message: "Contraseña incorrecta" };
      }
    } catch (error) {
      console.log("Error loginUser user.posgres", error);
      return { error: true, message: "error en user.posgres login" };
    }
  }
}
