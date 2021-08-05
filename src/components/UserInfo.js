import React from "react";

const UserInfo = ({ imageUrl, name }) => (
  <div className="flex items-center gap-2">
    <img
      className="rounded-full h-5 w-5 object-cover"
      src={imageUrl}
      alt={name}
    />
    <span className="text-white">{name}</span>
  </div>
);

export default UserInfo;
