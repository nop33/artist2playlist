import React, { useEffect, useRef, useState } from "react";

import { isValidHttpUrl } from "../../utils";
import spotify from "../../apis/spotify";

const SearchArtist = ({ onNewArtistDataFetched }) => {
  const [spotifyArtistUrl, setSpotifyArtistUrl] = useState("");
  // TODO: When calling onNewArtistDataFetched, it triggers a re-render of this component, since the state of the parent
  // component has changed. This triggers another fetch of the artist data, since the useEffect of this component runs
  // again. I am use references to avoid this, but there might be a better way (remove the state from the parent and put
  // it into a centralized place - Redux?).
  const previousSpotifyArtistUrlRef = useRef("");
  let previousSpotifyArtistUrl = "";

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

    previousSpotifyArtistUrlRef.current = spotifyArtistUrl;
    if (previousSpotifyArtistUrl !== spotifyArtistUrl) {
      fetchArtistInfo(spotifyArtistUrl);
    }
  }, [onNewArtistDataFetched, previousSpotifyArtistUrl, spotifyArtistUrl]);

  previousSpotifyArtistUrl = previousSpotifyArtistUrlRef.current;

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
