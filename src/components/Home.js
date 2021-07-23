import React from "react";
import { Redirect } from "react-router-dom";

import { isLoggedIn } from "../auth";

const Home = () => {
  if (!isLoggedIn()) {
    return <Redirect to="/login" />;
  }
  return <div>Home</div>;
};

export default Home;
