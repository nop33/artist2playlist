import { useEffect, useState } from "react";

const LoadingText = ({ text }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(
        dots === "" ? "." : dots === "." ? ".." : dots === ".." ? "..." : ""
      );
    }, 250);

    return () => {
      clearInterval(dotsInterval);
    };
  }, [dots]);

  return `${text || "Loading"}${dots}`;
};

export default LoadingText;
