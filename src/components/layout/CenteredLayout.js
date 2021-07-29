import React from "react";

const CenteredLayout = ({ children, className }) => (
  <div
    className={`container mx-auto p-10 flex flex-col items-center ${
      className || ""
    }`}
  >
    {children}
  </div>
);

export default CenteredLayout;
