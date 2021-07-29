import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { isLoggedIn, initiateSpotifyLogin } from "../auth";
import Button from "../components/Button";

const SpotifyLogin = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [loginButtonClicked, setLoginButtonClicked] = useState(false);

  useEffect(() => {
    let authInterval = "";
    if (loginButtonClicked) {
      authInterval = setInterval(() => {
        if (isLoggedIn()) {
          setLoggedIn(true);
        }
      }, 1000);
    }

    return () => {
      clearInterval(authInterval);
    };
  }, [loginButtonClicked]);

  const onLoginButtonClicked = () => {
    setLoginButtonClicked(true);
    initiateSpotifyLogin();
  };

  return loggedIn ? (
    <Redirect to="/" />
  ) : (
    <div className="container mx-auto p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold">artist2playlist</h1>
      <p className="text-gray-400 mt-4">
        Create playlists with artists' whole discographies.
      </p>
      <Button className="mx-auto flex my-10" onClick={onLoginButtonClicked}>
        Log in with Spotify
      </Button>
    </div>
  );
};

export default SpotifyLogin;
