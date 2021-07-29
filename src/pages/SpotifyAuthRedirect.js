import React, { useState, useEffect } from "react";

import { authenticate } from "../auth";

const SpotifyAuthRedirect = () => {
  const [authSuccessful, setAuthSuccessful] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const doAuthenticate = async () => {
      const result = await authenticate();
      setAuthSuccessful(result);
      setHasError(!result);
    };

    doAuthenticate();
  }, []);

  if (authSuccessful) {
    window.close();
  }

  return (
    <div>
      {!authSuccessful && !hasError && <h3>Authenticating...</h3>}
      {authSuccessful && <div>Authentication successful!</div>}
      {hasError && <div>Authentication failed!</div>}
    </div>
  );
};

export default SpotifyAuthRedirect;
