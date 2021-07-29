import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SpotifyLogin from "../pages/SpotifyLogin";
import SpotifyAuthRedirect from "../pages/SpotifyAuthRedirect";
import Home from "../pages/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <SpotifyLogin />
        </Route>
        <Route path="/auth">
          <SpotifyAuthRedirect />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
