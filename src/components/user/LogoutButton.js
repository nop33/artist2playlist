import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { LogoutIcon } from "@heroicons/react/solid";

import { logout } from "../../auth";

const LogoutButton = () => {
  const [logoutClicked, setLogoutClicked] = useState(false);

  useEffect(() => {
    if (logoutClicked) {
      logout();
    }
  }, [logoutClicked]);

  if (logoutClicked) {
    return <Redirect to="/login" />;
  }

  return (
    <button
      onClick={() => setLogoutClicked(true)}
      className="text-white hover:text-gray-200 flex items-center"
    >
      Logout
      <LogoutIcon className="h-4 w-4 ml-2" />
    </button>
  );
};

export default LogoutButton;
