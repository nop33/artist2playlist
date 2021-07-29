import React from "react";

const SearchArtist = ({ spotifyArtistUrl, setSpotifyArtistUrl }) => (
  <input
    type="text"
    value={spotifyArtistUrl}
    onChange={(e) => setSpotifyArtistUrl(e.target.value)}
    className="w-full rounded outline-none border-white border-2 h-16 text-sm md:text-lg px-4 shadow"
    placeholder="Paste Spotify artist link"
  />
);

export default SearchArtist;
