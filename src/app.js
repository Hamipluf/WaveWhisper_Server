// Server
import express from "express";
import cors from "cors";
// ENV
import dotenv from "dotenv";
dotenv.config();
const secret_cookie = process.env.SECRET_COOKIE;
// Rutas
import main from "./routes/main.route.js";
import explore from "./routes/explore.route.js";
import users from "./routes/users.route.js";
// Passport
import passport from "passport";
import "./passport/spotifyStrategy.js";

const app = express();
const port = process.env.PORT || 3000;

// Configuracion Server
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.options("*", cors());

app.use(express.urlencoded({ extended: true }));

//inicializar passport
app.use(passport.initialize());

//Rutas
app.use("/", main);
app.use("/api/explore", explore);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
