import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { authenticate } from "../../auth";
import PageLayout from "../layout/PageLayout";

const SpotifyAuthRedirect = () => {
  const [authSuccessful, setAuthSuccessful] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    const doAuthenticate = async () => {
      if (isSubscribed) {
        const result = await authenticate();
        setAuthSuccessful(result);
        setHasError(!result);
      }
    };
    doAuthenticate();

    return () => (isSubscribed = false);
  }, []);

  if (authSuccessful) {
    return <Redirect to="/" />;
  }

  return (
    <PageLayout className="text-white">
      {!authSuccessful && !hasError && <div>Authenticating...</div>}
      {authSuccessful && <div>Authentication successful!</div>}
      {hasError && <div>Authentication failed!</div>}
    </PageLayout>
  );
};

export default SpotifyAuthRedirect;
