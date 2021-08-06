import React from "react";
import UserInfo from "../user/UserInfo";
import LogoutButton from "../user/LogoutButton";

const TopBar = () => (
  <div className="flex justify-between mb-4">
    <UserInfo />
    <LogoutButton />
  </div>
);

export default TopBar;
