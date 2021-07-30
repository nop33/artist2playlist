import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { isTokenStillValid, initiateSpotifyLogin } from "../auth";
import Button from "../components/Button";
import PageLayout from "../components/layout/PageLayout";

const SpotifyLogin = () => {
  const [loggedIn, setLoggedIn] = useState(isTokenStillValid());
  const [loginButtonClicked, setLoginButtonClicked] = useState(false);

  useEffect(() => {
    let authInterval = "";
    if (loginButtonClicked) {
      authInterval = setInterval(() => {
        if (isTokenStillValid()) {
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
    <PageLayout>
      <h1 className="text-4xl font-bold text-gray-100">artist2playlist</h1>
      <p className="text-gray-400 mt-4">
        Create playlists with artists' whole discographies.
      </p>
      <Button className="mx-auto flex my-10" onClick={onLoginButtonClicked}>
        Log in with Spotify
      </Button>
    </PageLayout>
  );
};

export default SpotifyLogin;
