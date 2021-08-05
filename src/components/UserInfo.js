import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

import { logout } from "../auth";
import { LogoutIcon } from "@heroicons/react/solid";

const UserInfo = ({ imageUrl, name }) => {
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
    <div className="flex justify-between mb-4">
      <div className="flex items-center gap-2">
        <img
          className="rounded-full h-5 w-5 object-cover"
          src={imageUrl}
          alt={name}
        />
        <span className="text-white">{name}</span>
      </div>
      <button
        onClick={() => setLogoutClicked(true)}
        className="text-white hover:text-gray-200 flex items-center"
      >
        Logout
        <LogoutIcon className="h-4 w-4 ml-2" />
      </button>
    </div>
  );
};

export default UserInfo;
