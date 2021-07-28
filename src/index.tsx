import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import App from "./App";

ReactDOM.render(
  // Load BrowserRouter as soon as possible so that we can use reactrouter
  // hooks in App
  <HashRouter>
    <App />
  </HashRouter>,
  document.querySelector(".container")
);
