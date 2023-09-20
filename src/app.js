// Server
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// ENV
import dotenv from "dotenv";
dotenv.config();
const secret_cookie = process.env.SECRET_COOKIE;
// Rutas
import main from "./routes/main.route.js";
import explore from "./routes/explore.route.js";
import users from "./routes/users.route.js"

const app = express();
const port = process.env.PORT || 3000;

// Configuracion Server
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secret_cookie));

//Rutas
app.use("/", main);
app.use("/api/explore", explore);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
