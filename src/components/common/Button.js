import React from "react";

const Button = ({ children, className, onClick }) => (
  <button
    className={`bg-green-700 text-white py-2 px-4 font-semibold rounded-full hover:bg-green-800 hover:text-gray-100 shadow ${
      className || ""
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
