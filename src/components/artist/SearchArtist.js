import React, { useState } from "react";

import { isValidHttpUrl } from "../../utils";
import spotify from "../../apis/spotify";

const SearchArtist = ({ onArtistInfoFetched }) => {
  const [spotifyArtistUrl, setSpotifyArtistUrl] = useState("");

  const fetchArtistInfo = async (spotifyArtistUrl) => {
    const { data } = await spotify.get(
      `/artists/${getArtistIdFromUrl(spotifyArtistUrl)}`
    );
    onArtistInfoFetched(data);
  };

  const onSpotifyArtistUrlChange = (event) => {
    const newUrl = event.target.value;
    if (spotifyArtistUrl !== newUrl && isValidSpotifyArtistUrl(newUrl)) {
      fetchArtistInfo(newUrl);
    }
    setSpotifyArtistUrl(newUrl);
  };

  return (
    <input
      type="text"
      value={spotifyArtistUrl}
      onChange={onSpotifyArtistUrlChange}
      className="w-full rounded outline-none border-white border-2 h-16 text-sm md:text-lg px-4 shadow"
      placeholder="Paste Spotify artist link"
    />
  );
};

const isValidSpotifyArtistUrl = (spotifyArtistUrl) => {
  if (spotifyArtistUrl.length === 0) {
    return;
  }
  const url = isValidHttpUrl(spotifyArtistUrl) ? new URL(spotifyArtistUrl) : {};
  return (
    url.hostname === "open.spotify.com" && url.pathname.includes("/artist/")
  );
};

const getArtistIdFromUrl = (spotifyArtistUrl) => {
  return new URL(spotifyArtistUrl).pathname.replace("/artist/", "");
};

export default SearchArtist;
