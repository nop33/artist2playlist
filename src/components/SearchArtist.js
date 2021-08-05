import React, { useEffect, useState } from "react";

import { isValidHttpUrl } from "../utils";
import spotify from "../apis/spotify";

const SearchArtist = ({ onNewArtistDataFetched }) => {
  const [spotifyArtistUrl, setSpotifyArtistUrl] = useState("");

  useEffect(() => {
    const fetchArtistInfo = async (spotifyArtistUrl) => {
      if (spotifyArtistUrl.length === 0) {
        return;
      }
      const url =
        spotifyArtistUrl && isValidHttpUrl(spotifyArtistUrl)
          ? new URL(spotifyArtistUrl)
          : {};
      if (!isValidSpotifyArtistUrl(url.hostname, url.pathname)) {
        return;
      }

      const artistId = url.pathname.replace("/artist/", "");
      const { data } = await spotify.get(`/artists/${artistId}`);
      onNewArtistDataFetched(data);
    };

    fetchArtistInfo(spotifyArtistUrl);
  }, [onNewArtistDataFetched, spotifyArtistUrl]);

  return (
    <input
      type="text"
      value={spotifyArtistUrl}
      onChange={(e) => setSpotifyArtistUrl(e.target.value)}
      className="w-full rounded outline-none border-white border-2 h-16 text-sm md:text-lg px-4 shadow"
      placeholder="Paste Spotify artist link"
    />
  );
};

function isValidSpotifyArtistUrl(hostname, pathname) {
  return hostname === "open.spotify.com" && pathname.includes("/artist/");
}

export default SearchArtist;
