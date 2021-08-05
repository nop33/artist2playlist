import axios from "axios";

import {
  generateId,
  generateRandomInt,
  sha256,
  base64UrlEncode,
  getUrlParams,
} from "./utils";

const initiateSpotifyLogin = async () => {
  const codeVerifier = generateId(generateRandomInt(43, 128));
  const hash = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hash);
  const state = generateId(12);

  localStorage.setItem("spotify-code-verifier", codeVerifier);
  localStorage.setItem("spotify-state", state);

  const authURL =
    `https://accounts.spotify.com/authorize` +
    `?response_type=code` +
    `&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}` +
    `&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}` +
    `&scope=playlist-read-private,playlist-modify-private` +
    `&state=${state}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  window.open(authURL);
};

const getAndStoreAccessToken = async (postParams) => {
  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: postParams,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;",
        },
      }
    );
    localStorage.setItem("spotify-access-token", data.access_token);
    localStorage.setItem("spotify-expires-in", data.expires_in);
    localStorage.setItem("spotify-refresh-token", data.refresh_token);
    localStorage.setItem("spotify-token-type", data.token_type);
    localStorage.setItem("spotify-token-issued-at", new Date().toISOString());

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const authenticate = async () => {
  const { code, state } = getUrlParams(window.location.href);

  if (state !== localStorage.getItem("spotify-state")) {
    console.log("Spotify state not found in local storage");
    return false;
  }

  const postParams = new URLSearchParams();
  postParams.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
  postParams.append("grant_type", "authorization_code");
  postParams.append("code", code);
  postParams.append("redirect_uri", process.env.REACT_APP_SPOTIFY_REDIRECT_URI);
  postParams.append(
    "code_verifier",
    localStorage.getItem("spotify-code-verifier")
  );

  return await getAndStoreAccessToken(postParams);
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("spotify-refresh-token");

  if (!refreshToken) {
    console.log("Spotify refresh token not found in local storage");
    return false;
  }

  const postParams = new URLSearchParams();
  postParams.append("client_id", process.env.REACT_APP_SPOTIFY_CLIENT_ID);
  postParams.append("grant_type", "refresh_token");
  postParams.append("refresh_token", refreshToken);

  return await getAndStoreAccessToken(postParams);
};

const isTokenStillValid = () => {
  const tokenIssuedAt = localStorage.getItem("spotify-token-issued-at");
  const tokenExpiresIn = localStorage.getItem("spotify-expires-in");

  if (!tokenIssuedAt || !tokenExpiresIn) {
    return false;
  }

  const tokenExpiresAt = new Date(tokenIssuedAt);
  tokenExpiresAt.setSeconds(
    tokenExpiresAt.getSeconds() + parseInt(tokenExpiresIn)
  );
  const now = new Date();

  return now < tokenExpiresAt;
};

const isLoggedIn = async () => {
  return isTokenStillValid() || (await refreshToken());
};

const logout = () => {
  localStorage.removeItem("spotify-access-token");
  localStorage.removeItem("spotify-expires-in");
  localStorage.removeItem("spotify-refresh-token");
  localStorage.removeItem("spotify-token-type");
  localStorage.removeItem("spotify-token-issued-at");
  localStorage.removeItem("spotify-code-verifier");
  localStorage.removeItem("spotify-state");
};

export {
  authenticate,
  isLoggedIn,
  initiateSpotifyLogin,
  refreshToken,
  isTokenStillValid,
  logout,
};
