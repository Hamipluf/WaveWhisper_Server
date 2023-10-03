import { query } from "../persistencia/postgreSQL/config.js";
class UsersService {
  constructor(model) {
    this.model = model;
  }
  // Obtiene todos los usuarios sin la informacion sensible
  getAllUsers = async () => {
    try {
      const newUser = await query(
        "SELECT name, lastname, email, role FROM users"
      );
      return newUser;
    } catch (err) {
      return { error: true, data: err };
    }
  };
  // Obtiene un user dependiendo del user ID
  getUserById = async (uid) => {
    try {
      const data = await query("SELECT * FROM users WHERE id = $1", [uid]);
      const user = data.rows[0];
      return user;
    } catch (err) {
      return { error: true, data: err };
    }
  };
  // Obtiene un user dependiendo del user Email
  getUserByEmail = async (email) => {
    try {
      const data = await query("SELECT * FROM users WHERE email = $1", [email]);
      const user = data.rows[0];
      return user;
    } catch (err) {
      return { error: true, data: err };
    }
  };
  // Crea un usuario
  createAnUser = async (user) => {
    const {
      name,
      lastname,
      email,
      password,
      role,
      username,
      photos,
      sid,
      s_followers,
    } = user;
    try {
      const userCreated = await query(
        "INSERT INTO users (name, lastname, email, password, role, username, photos, sid, s_followers) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [
          name,
          lastname,
          email,
          password,
          role,
          username,
          photos,
          sid,
          s_followers,
        ]
      );
      return userCreated;
    } catch (err) {
      return { error: true, data: err };
    }
  };
  // Modifica una columnta
  modifyUserSpotify = async (username, photos, sid, s_followers, id) => {
    try {
      const userModified = await query(
        "UPDATE users SET username = $1, photos = $2, sid = $3, s_followers = $4 WHERE id = $5",
        [username, photos, sid, s_followers, id]
      );
      return userModified;
    } catch (err) {
      return { error: true, data: err };
    }
  };
}
const usersServices = new UsersService();

export default usersServices;
