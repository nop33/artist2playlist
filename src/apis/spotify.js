import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {
    Authorization: constructAuthorizationString(),
  },
});

function constructAuthorizationString() {
  return `${localStorage.getItem("spotify-token-type")} ${localStorage.getItem(
    "spotify-access-token"
  )}`;
}

axiosInstance.interceptors.request.use(function (config) {
  config.headers.Authorization = constructAuthorizationString();
  return config;
});

export default axiosInstance;
