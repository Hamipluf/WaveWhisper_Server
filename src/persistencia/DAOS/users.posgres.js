import usersServices from "../../services/user.services.js";
import authManager from "../../utils/authManager.js";
import { comparePassword, hashPassword } from "../../utils/config.js";
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
    const { name, lastname, email, password, role, username } = user;
    console.log(user)
    if (!name || !lastname || !email || !password || !role || !username) {
      return { error: true, message: "Faltan campos a completar" };
    }
    try {
      const passwordHashed = await hashPassword(password);
      const userData = {
        name,
        lastname,
        email,
        password: passwordHashed,
        role,
        username,
      };
      const newUser = await usersServices.createAnUser(userData);
      let response;
      newUser.error
        ? (response = { error: true, message: newUser.data })
        : (response = newUser.rows[0]);
      return response;
    } catch (err) {
      console.log("ERROR registerUser users.posgres", err);
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
  async modifyUserSpotify(username, photos, sid, s_followers, id) {
    try {
      const data = await usersServices.modifyUserSpotify(
        username,
        photos,
        sid,
        s_followers,
        id
      );
      const userModified = data.rows;
      return userModified;
    } catch (error) {
      console.log("Error modifyUser user.posgres", error);
      return { error: true, message: "error en user.posgres modifyUser" };
    }
  }
}
