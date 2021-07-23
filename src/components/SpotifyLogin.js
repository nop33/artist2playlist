import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { isLoggedIn, initiateSpotifyLogin } from "../auth";

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
    <button onClick={onLoginButtonClicked}>Log in with Spotify</button>
  );
};

export default SpotifyLogin;
