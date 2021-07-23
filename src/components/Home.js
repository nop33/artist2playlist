import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/solid";

import { isLoggedIn } from "../auth";
import { isValidHttpUrl } from "../utils";
import spotify from "../apis/spotify";

const Home = () => {
  const [spotifyArtistUrl, setSpotifyArtistUrl] = useState("");
  const [artist, setArtist] = useState(null);

  const fetchArtistData = async (artistId) => {
    const { data } = await spotify.get(`/artists/${artistId}`);
    console.log(data);
    setArtist(data);
  };

  useEffect(() => {
    if (spotifyArtistUrl) {
      const url =
        spotifyArtistUrl && isValidHttpUrl(spotifyArtistUrl)
          ? new URL(spotifyArtistUrl)
          : {};
      if (isValidSpotifyArtistUrl(url.hostname, url.pathname)) {
        const artistId = url.pathname.replace("/artist/", "");
        fetchArtistData(artistId);
      }
    }
  }, [spotifyArtistUrl]);

  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="container mx-auto p-10 flex justify-center">
        <div className="w-full lg:w-1/2">
          <input
            type="text"
            value={spotifyArtistUrl}
            onChange={(e) => setSpotifyArtistUrl(e.target.value)}
            className="w-full rounded outline-none border-white border-2 h-16 text-lg px-4 shadow"
            placeholder="Paste Spotify artist link"
          />
          {artist && (
            <>
              <div className="w-full mx-auto bg-gray-100 flex gap-6 rounded shadow mt-4 p-8">
                <img
                  className="rounded-full border-4 border-grey-200 h-24 w-24"
                  src={artist.images[0].url}
                  alt={artist.name}
                />
                <div>
                  <h2 className="font-medium text-lg text-gray-800">
                    {artist.name}
                  </h2>
                  <div className="text-gray-500">
                    <div className="text-sm italic flex gap-2 items-center mt-1">
                      <FingerPrintIcon className="h-4 w-4" />
                      <div>
                        {artist.genres
                          .map((genre) => <span key={genre}>{genre}</span>)
                          .reduce((prev, curr) => [prev, ", ", curr])}
                      </div>
                    </div>
                    <div className="text-sm italic flex gap-2 items-center mt-1">
                      <UsersIcon className="h-4 w-4" />
                      <div>{artist.followers.total}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button className="bg-green-700 text-white py-2 px-4 font-semibold rounded-full hover:bg-green-800 shadow">
                  Fetch discography
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function isValidSpotifyArtistUrl(hostname, pathname) {
  return hostname === "open.spotify.com" && pathname.includes("/artist/");
}

export default Home;
