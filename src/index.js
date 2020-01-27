import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import RouterComponent from "./RouterComponent";
import { BrowserRouter as Router } from "react-router-dom";

//import { createBrowserHistory } from 'history'

ReactDOM.render(
  <Router>
    <RouterComponent />
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
