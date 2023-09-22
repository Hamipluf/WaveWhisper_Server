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
}
const usersServices = new UsersService();

export default usersServices;
