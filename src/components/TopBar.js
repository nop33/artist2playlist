import React from "react";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";

// TODO: don't pass user related data as props to TopBar component
const TopBar = ({ userImageUrl, userName }) => (
  <div className="flex justify-between mb-4">
    <UserInfo imageUrl={userImageUrl} name={userName} />
    <LogoutButton />
  </div>
);

export default TopBar;
