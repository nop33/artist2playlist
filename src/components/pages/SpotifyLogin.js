import React, { useState, useEffect } from "react";

import { constructSpotifyLoginUrl } from "../../auth";
import PageLayout from "../layout/PageLayout";

const SpotifyLogin = () => {
  const [spotifyLoginUrl, setSpotifyLoginUrl] = useState(null);

  useEffect(() => {
    const constructUrl = async () => {
      setSpotifyLoginUrl(await constructSpotifyLoginUrl());
    };
    constructUrl();
  }, []);

  return (
    <PageLayout>
      <h1 className="text-4xl font-bold text-gray-100">artist2playlist</h1>
      <p className="text-gray-400 mt-4">
        Create playlists with artists' whole discographies.
      </p>
      {spotifyLoginUrl && (
        <a
          href={spotifyLoginUrl}
          className="bg-green-700 text-white py-2 px-4 font-semibold rounded-full hover:bg-green-800 hover:text-gray-100 shadow mx-auto flex my-10"
          rel="noreferrer"
        >
          Log in with Spotify
        </a>
      )}
    </PageLayout>
  );
};

export default SpotifyLogin;
