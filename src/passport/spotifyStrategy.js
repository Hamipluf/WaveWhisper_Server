import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import UserManager from "../persistencia/DAOS/users.posgres.js";
const userManager = new UserManager();
const client_id = process.env.CLIENT_ID_SPOTIFY;
const client_id_secret = process.env.SECRET_KEY_SPOTIFY;

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_id_secret,
      callbackURL: "http://localhost:3000/api/users/spotify/callback", // Asegúrate de ajustar la URL de redireccionamiento
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
