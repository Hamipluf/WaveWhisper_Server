import axios from "axios";
// Responses
import customResponses from "../utils/customResponse.js";
export const getMyPlayList = async (req, res) => {
  const miCookieValue = JSON.parse(req.signedCookies.spotifyUser);
  if (!miCookieValue) {
    return res
      .status(401)
      .json(
        customResponses.badResponse(
          401,
          "La cookie no está presente o no es válida.",
          undefined
        )
      );
  }
  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/users/${miCookieValue.user.sid}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${miCookieValue.accessToken}`,
        },
      }
    );
    data
      ? res
          .status(200)
          .json(
            customResponses.responseOk(
              200,
              `Playlist ${miCookieValue.user.username}`,
              data
            )
          )
      : res
          .status(400)
          .json(
            customResponses.badResponse(
              400,
              `Playlist de ${miCookieValue.user.username} no fueron encontradas`,
              undefined
            )
          );
  } catch (err) {
    console.error("Error en getMyPlayList Controller", err);
    return res
      .status(500)
      .json(
        customResponses.badResponse(500, "Error en obtener las playlist"),
        err
      );
  }
};

export const getTopTen = async (req, res) => {
  const miCookieValue = JSON.parse(req.signedCookies.spotifyUser);
  if (!miCookieValue) {
    return res
      .status(401)
      .json(
        customResponses.badResponse(
          401,
          "La cookie no está presente o no es válida.",
          undefined
        )
      );
  }
  try {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks",
      {
        headers: {
          Authorization: `Bearer ${miCookieValue.accessToken}`,
        },
      }
    );
    const topTracks = data.items;
    const tracksWithPreview = topTracks.filter(
      (track) => track.track.preview_url
    );
    const dataResponse = tracksWithPreview.slice(0, 10).map((track, index) => {
      return {
        position: index + 1,
        t_id: track.track.id,
        name: track.track.name,
        artist: track.track.artists[0].name,
        preview_url: track.track.preview_url,
      };
    });
    dataResponse.length > 0
      ? res
          .status(200)
          .json(customResponses.responseOk(200, "Top 10", dataResponse))
      : res
          .status(400)
          .json(customResponses.badResponse(400, "No hay top 10", undefined));
  } catch (err) {
    console.log("Error en getTopTen controller", err);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", err));
  }
};

export const getSongById = async (req, res) => {
  const { tid } = req.params;
  const miCookieValue = JSON.parse(req.signedCookies.spotifyUser);
  if (!miCookieValue) {
    return res
      .status(401)
      .json(
        customResponses.badResponse(
          401,
          "La cookie no está presente o no es válida.",
          undefined
        )
      );
  }
  try {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/tracks/${tid}`,
      {
        headers: {
          Authorization: `Bearer ${miCookieValue.accessToken}`,
        },
      }
    );
    const dataResponse = {
      album: {
        id: data.album.id,
        name: data.album.name,
        spotify_url: data.album.external_urls?.spotify,
        images: data.album.images,
      },
      artista: {
        id: data.artists[0].id,
        name: data.artists[0].name,
        spotify_url: data.artists[0].external_urls.spotify,
      },
      song:{
        id: data.id,
        name: data.name,
        explicit: data.explicit,
        popularity: data.popularity,
        n_cancion: data.track_number,
        spotify_url: data.external_urls?.spotify,
        preview_url: data.preview_url,
      }
    };

    dataResponse
      ? res
          .status(200)
          .json(
            customResponses.responseOk(200, "Cacion encontrada", dataResponse)
          )
      : res
          .status(400)
          .json(
            customResponses.badResponse(
              400,
              "Cancion no encontrada",
              data.error
            )
          );
  } catch (err) {
    console.log("Error en getSong controller", err);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", err));
  }
};
export const getSongByName = async (req, res) => {
  const { songName } = req.params;
  const miCookieValue = JSON.parse(req.signedCookies.spotifyUser);
  if (!miCookieValue) {
    return res
      .status(401)
      .json(
        customResponses.badResponse(
          401,
          "La cookie no está presente o no es válida.",
          undefined
        )
      );
  }
  try {
    // Realiza una solicitud a la API de Spotify para buscar la canción por nombre
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${songName}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${miCookieValue.accessToken}`,
        },
      }
    );

    const track = response.data.tracks.items[0];
    const songData = {
      artist: {
        id: track.artists[0].id,
        name: track.artists[0].name,
        spotify_url: track.artists[0].external_urls,
      },
      album: {
        id: track.album.id,
        images: track.album.images,
        name: track.album.name,
        total_tracks: track.album.total_tracks,
      },
      song: {
        id: track.id,
        name: track.name,
        popularity: track.popularity,
        n_song: track.track_number,
        explicit: track.explicit,
        spotify_url: track.external_urls?.spotify,
        preview_url: track.preview_url,
      },
    };

    songData
      ? res
          .status(200)
          .json(customResponses.responseOk(200, "Cancion encontrada", songData))
      : res
          .status(400)
          .json(
            customResponses.badResponse(
              400,
              `No se encontro la cancion ${songName}`,
              data.error
            )
          );
  } catch (error) {
    console.error("Error en getSongByName", error);
    return res
      .status(500)
      .json(customResponses.badResponse(500, "Error en el servidor", error));
  }
};
