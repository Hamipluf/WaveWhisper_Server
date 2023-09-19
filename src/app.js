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
app.use("/explore", explore);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
