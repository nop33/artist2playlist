import React, { useState, useEffect } from "react";

import { authenticate } from "../auth";
import PageLayout from "../components/layout/PageLayout";

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
    <PageLayout className="text-white">
      {!authSuccessful && !hasError && <div>Authenticating...</div>}
      {authSuccessful && <div>Authentication successful!</div>}
      {hasError && <div>Authentication failed!</div>}
    </PageLayout>
  );
};

export default SpotifyAuthRedirect;
