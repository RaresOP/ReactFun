import React from "react";
import App from "./App";
import SignIn from "./SignIn.js";
import {
  Redirect,
  Route,
  withRouter,
  BrowserRouter as Router
} from "react-router-dom";

function isLoggedIn() {
  console.log(localStorage.getItem("LoggedIn"));
  return localStorage.getItem("LoggedIn") != null;
}

const requireAuth = onUserLoggedIn =>
  isLoggedIn() ? onUserLoggedIn : <Redirect to="/signin" />;

const calendarRouterRenderer = () => requireAuth(<App />);

const RouterComponent = () => {
  return (
    <Router>
      <Route exact path="/calendar" render={calendarRouterRenderer} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/" component={calendarRouterRenderer} />
    </Router>
  );
};

export default withRouter(RouterComponent);
