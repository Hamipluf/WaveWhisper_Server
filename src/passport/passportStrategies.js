import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import { Strategy as LocalStrategy } from "passport-local";
import UserManager from "../persistencia/DAOS/users.posgres.js";
const userManager = new UserManager();
const client_id = process.env.CLIENT_ID_SPOTIFY;
const client_id_secret = process.env.SECRET_KEY_SPOTIFY;
const cookie_secret = process.env.SECRET_COOKIE;
const url_production = process.env.URL_PRODUCCION;
// Local Login
passport.use(
  "Login",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const userData = {
          email,
          password,
        };
        const userDb = await userManager.loginUser(userData);
        if (!userDb) {
          const message = `No existe una cuenta con el email ${email}`;
          return done(message, false); // No existe en la database hay que registrarse
        }
        return done(null, userDb);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Register Local Strategy
passport.use(
  "Register",
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const userData = {
          email,
          password,
        };
        const userDB = await userManager.loginUser(userData);
        if (!userDB.error) {
          const response = {
            error: true,
            message: `Ya existe un usuario con el email ${email}`,
          };
          return done(false, response);
        }
        const newUserDB = await userManager.registerUser(req.body);
        done(null, newUserDB);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Login Spotify
passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_id_secret,
      callbackURL: `${url_production}/users/spotify/callback`, // Asegúrate de ajustar la URL de redireccionamiento
      authorizationURL: "https://accounts.spotify.com/authorize",
      scope: ["user-read-email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      const emailSpotify = profile._json.email;
      const username = profile._json.display_name;
      const photos = profile.photos;
      const sid = profile.id;
      const s_followers = profile.followers;
      try {
        const user = await userManager.getUserByEmail(emailSpotify);
        if (user.error) {
          const newUserData = {
            name: "",
            lastname: "",
            email: emailSpotify,
            password: "",
            role: "user",
            username,
            photos,
            sid,
            s_followers,
          };
          const newUser = await userManager.registerUser(newUserData);
          return done(null, { newUser, accessToken });
        }
        if (!user.username) {
          const userModified = await userManager.modifyUserSpotify(
            username,
            photos,
            sid,
            s_followers,
            user.id
          );
          return done(null, { userModified, accessToken });
        }
        return done(null, { user, accessToken });
      } catch (error) {
        const message = "Error en la autenticacion con spotify";
        return done(message, false);
      }
    }
  )
);
