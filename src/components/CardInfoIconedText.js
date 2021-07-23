import React from "react";

const CardInfoIconedText = ({ IconComponent, children, title }) => {
  return (
    <div className="text-sm italic flex gap-2 items-center mt-1" title={title}>
      <IconComponent className="h-4 w-4" />
      <div>{children}</div>
    </div>
  );
};

export default CardInfoIconedText;
