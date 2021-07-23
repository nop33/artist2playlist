import React from "react";

const Card = ({ imageUrl, title, children, buttons }) => {
  return (
    <div className="w-full mx-auto bg-gray-100 flex flex-col rounded shadow mt-4">
      <div className="flex gap-6 p-8">
        <img
          className="rounded-full border-4 border-grey-200 h-24 w-24"
          src={imageUrl}
          alt={title}
        />
        <div>
          <h2 className="font-medium text-lg text-gray-800">{title}</h2>
          <div className="text-gray-500">{children}</div>
        </div>
      </div>
      {buttons && (
        <div className="flex justify-end border-t border-grey-500 p-4">
          {buttons}
        </div>
      )}
    </div>
  );
};

export default Card;
