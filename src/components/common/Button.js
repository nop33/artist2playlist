import React from "react";

const Button = ({ children, className, ...rest }) => (
  <button
    className={`bg-green-700 text-white py-2 px-4 font-semibold rounded-full hover:bg-green-800 hover:text-gray-100 shadow ${
      className || ""
    }`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
