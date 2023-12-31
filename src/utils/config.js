import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    return "Error en hashar la contraseña", err;
  }
}
export async function comparePassword(password, passwordDB) {
  try {
    const comparedPassword = await bcrypt.compare(password, passwordDB);
    return comparedPassword;
  } catch (error) {
    return { status: false, error };
  }
}
